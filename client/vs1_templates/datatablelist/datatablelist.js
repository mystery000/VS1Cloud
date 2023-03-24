import { ContactService } from "../../contacts/contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import { UtilityService } from "../../utility-service";
import { TaxRateService } from "../../settings/settings-service.js";
import XLSX from 'xlsx';
import { SideBarService } from '../../js/sidebar-service';
import { ProductService } from '../../product/product-service';
import { ManufacturingService } from "../../manufacture/manufacturing-service";
import { CRMService } from "../../crm/crm-service";
import { ReportService } from "../../reports/report-service";
import { FixedAssetService } from "../../fixedassets/fixedasset-service";
import { StockTransferService } from '../../inventory/stockadjust-service';
import '../../lib/global/indexdbstorage.js';
import TableHandler from '../../js/Table/TableHandler';
import { Template } from 'meteor/templating';
import './datatablelist.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { cloneDeep, reject } from "lodash";
import 'datatables.net';
import 'datatables.net-buttons';
import 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.print';
import 'jszip';
import '../../lib/global/colResizable.js';
// let _jsZip = jszip;


import '../date_picker/transaction_list_date.html'
let sideBarService = new SideBarService();
let utilityService = new UtilityService();


Template.datatablelist.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.transactiondatatablerecords = new ReactiveVar([]);
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.selectedFile = new ReactiveVar();
    templateObject.displayfields = new ReactiveVar([]);
    templateObject.reset_data = new ReactiveVar([]);
    templateObject.tablename = new ReactiveVar();
    templateObject.currentproductID = new ReactiveVar();
    templateObject.currenttype = new ReactiveVar();
    templateObject.datahandler = new ReactiveVar(templateObject.data.datahandler);
    templateObject.tabledata = new ReactiveVar();
    templateObject.apiParams = new ReactiveVar();
    templateObject.columnDef = new ReactiveVar();

    templateObject.autorun(() => {
        const curdata = Template.currentData();
        let currentProductID = curdata.productID || "";
        templateObject.currentproductID.set(currentProductID);
        let currenttype = curdata.type || "";
        templateObject.currenttype.set(currenttype);
        templateObject.apiParams.set(templateObject.data.apiParams || []);
    });

})

Template.datatablelist.onRendered(async function () {
    let templateObject = Template.instance();
    if (FlowRouter.current().queryParams.success) {
        $('.btnRefresh').addClass('btnRefreshAlert');
    };
    let activeViewDeletedLabel = "View Deleted";
    let hideViewDeletedLabel = "Hide Deleted";

    let isShowSelect = false;
    if(templateObject.data.istransaction == true){
      isShowSelect = false;
      activeViewDeletedLabel = "View Deleted";
      hideViewDeletedLabel = "Hide Deleted";
    }else{
      isShowSelect = true;
      activeViewDeletedLabel = "View In-Active";
      hideViewDeletedLabel = "Hide In-Active";
    };

    if(templateObject.data.viewCompletedButton == true){
      activeViewDeletedLabel = "View Completed";
      hideViewDeletedLabel = "Hide Completed";
    };

    if(templateObject.data.viewShowSoldButton == true){
      activeViewDeletedLabel = "Show Sold";
      hideViewDeletedLabel = "Hide Sold";
    };

    function MakeNegative() {
        $('td').each(function () {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });

        $("td.colStatus").each(function () {
            if ($(this).text() == "In-Active") $(this).addClass("text-deleted");
            if ($(this).text() == "Deleted") $(this).addClass("text-deleted");
            if ($(this).text() == "Full") $(this).addClass("text-fullyPaid");
            if ($(this).text() == "Part") $(this).addClass("text-partialPaid");
            if ($(this).text() == "Rec") $(this).addClass("text-reconciled");
            if ($(this).text() == "Converted") $(this).addClass("text-converted");
            if ($(this).text() == "Completed") $(this).addClass("text-completed");
            if ($(this).text() == "Not Converted") $(this).addClass("text-NotConverted");
            if ($(this).text() == "On-Hold") $(this).addClass("text-Yellow");
            if ($(this).text() == "Processed") $(this).addClass("text-Processed");
            if ($(this).text() == "In-Stock") $(this).addClass("text-instock");
            if ($(this).text() == "Sold") $(this).addClass("text-sold");
        });
        $("td.colFinished").each(function () {
            if ($(this).text() == "In-Active") $(this).addClass("text-deleted");
            if ($(this).text() == "Deleted") $(this).addClass("text-deleted");
            if ($(this).text() == "Full") $(this).addClass("text-fullyPaid");
            if ($(this).text() == "Part") $(this).addClass("text-partialPaid");
            if ($(this).text() == "Rec") $(this).addClass("text-reconciled");
            if ($(this).text() == "Converted") $(this).addClass("text-converted");
            if ($(this).text() == "Completed") $(this).addClass("text-completed");
            if ($(this).text() == "Not Converted") $(this).addClass("text-Yellow");
            if ($(this).text() == "On-Hold") $(this).addClass("text-Yellow");
            if ($(this).text() == "Processed") $(this).addClass("text-Processed");
        });
    };

    let currenttablename = templateObject.data.tablename || "";
    let indexDBName = templateObject.data.indexeddbname || '';
    let indexDBLowercase = templateObject.data.lowercaseDataName || indexDBName.toLowerCase();


    templateObject.initCustomFieldDisplaySettings = function (data, listType) {
        let reset_data = templateObject.reset_data.get();
        let savedHeaderInfo;
        setTimeout(()=>{
            templateObject.showCustomFieldDisplaySettings(reset_data);
            try {

                getVS1Data("VS1_Customize").then(function(dataObject) {
                    if (dataObject.length == 0) {
                        sideBarService.getNewCustomFieldsWithQuery(parseInt(localStorage.getItem('mySessionEmployeeLoggedID')), listType).then(function(data) {
                            savedHeaderInfo = data.ProcessLog.Obj.CustomLayout[0].Columns;
                            templateObject.showCustomFieldDisplaySettings(savedHeaderInfo);
                        }).catch(function(err) {});
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        if (data.ProcessLog.Obj != undefined && data.ProcessLog.Obj.CustomLayout.length > 0) {
                            for (let i = 0; i < data.ProcessLog.Obj.CustomLayout.length; i++) {

                                if (data.ProcessLog.Obj.CustomLayout[i].TableName == listType) {
                                    savedHeaderInfo = data.ProcessLog.Obj.CustomLayout[i].Columns;
                                    templateObject.showCustomFieldDisplaySettings(savedHeaderInfo);
                                }
                            }
                        };
                    }
                });

            } catch (error) {
            }
            return;
        }, 100)
    }

    templateObject.showCustomFieldDisplaySettings = async function (savedHeaderInfo) {
        let custFields = [];
        let customData = {};
        let customFieldCount = savedHeaderInfo.length;
        let reset_data = templateObject.reset_data.get();
        for (let r = 0; r < customFieldCount; r++) {
            customData = {
                active: savedHeaderInfo[r].active,
                id: savedHeaderInfo[r].index,
                custfieldlabel: savedHeaderInfo[r].label,
                class: savedHeaderInfo[r].class,
                display: savedHeaderInfo[r].display,            //display have to set by default value
                width: savedHeaderInfo[r].width ? savedHeaderInfo[r].width : ''
            };
            let currentTable = document.getElementById(currenttablename)
            if (savedHeaderInfo[r].active == true) {
                if (currentTable) {
                    $('#' + currenttablename + ' .' + savedHeaderInfo[r].class).removeClass('hiddenColumn');
                }
            } else if (savedHeaderInfo[r].active == false) {
                if (currentTable && savedHeaderInfo[r].class) {
                    $('#' + currenttablename + ' .' + savedHeaderInfo[r].class).addClass('hiddenColumn');
                }
            };
            custFields.push(customData);
        }
        await templateObject.displayfields.set(custFields);

        let tableData = await templateObject.getTableData();
        await templateObject.displayTableData(tableData);
    }

    templateObject.init_reset_data = function () {
        let records = templateObject.data.tableheaderrecords;
        if(records && records.length > 0) {
            templateObject.reset_data.set(templateObject.data.tableheaderrecords);
            templateObject.initCustomFieldDisplaySettings("", currenttablename)
        } else {
            setTimeout(()=>{
                templateObject.init_reset_data();
            },1000)
        }
    }

    await templateObject.init_reset_data();

    // set initial table rest_data



    // await templateObject.initCustomFieldDisplaySettings("", currenttablename);

    templateObject.resetData = function (dataVal) {
        location.reload();
    };
    //Contact Overview Data
    templateObject.getTableData = async function (deleteFilter = false) {
        var customerpage = 0;
        return new Promise((resolve, reject) => {
            // resolve(templateObject.data.apiName(initialDatatableLoad, 0, false))
            if (templateObject.data.istransaction == false) {
              if (templateObject.data.typefilter) {//Martin Tony
                    let that = templateObject.data.service;
                    let params = [initialDatatableLoad, 0, deleteFilter, templateObject.data.typefilter]
                    templateObject.data.apiName.apply(that, params).then(function (dataReturn) {
                        resolve(dataReturn)
                    })
                    return
                }

                getVS1Data(indexDBName).then(function (dataObject) {
                    if (dataObject.length == 0) {
                        let that = templateObject.data.service;
                        let params = [initialDatatableLoad, 0, deleteFilter]
                        templateObject.data.apiName.apply(that, params).then(function (dataReturn) {
                            addVS1Data(indexDBName, JSON.stringify(dataReturn)).then(function () {
                                resolve(dataReturn)
                            })
                        })
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        resolve(data)
                    }
                }).catch(function (e) {
                    let that = templateObject.data.service;
                    let params = [initialDatatableLoad, 0, deleteFilter];
                    templateObject.data.apiName.apply(that, params).then(function (dataReturn) {
                        addVS1Data(indexDBName, JSON.stringify(dataReturn)).then(function () {
                            resolve(dataReturn)
                        })
                    })
                })
            } else {
                var currentBeginDate = new Date();
                var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
                let fromDateMonth = (currentBeginDate.getMonth() + 1);
                let fromDateDay = currentBeginDate.getDate();
                if ((currentBeginDate.getMonth() + 1) < 10) {
                    fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
                } else {
                    fromDateMonth = (currentBeginDate.getMonth() + 1);
                }

                if (currentBeginDate.getDate() < 10) {
                    fromDateDay = "0" + currentBeginDate.getDate();
                }
                var toDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
                let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");
                let params = cloneDeep(templateObject.apiParams.get());
                let that = templateObject.data.service;
                // for (let i = 0; i < params.length; i++) {
                //     if(params[i] == 'ignoredate') {
                //         params[i] = true;
                //     } else if(params[i] == 'dateFrom') {
                //         params[i] = prevMonth11Date
                //     } else if(params[i] == 'dateTo') {
                //         params[i] = toDate
                //     } else if(params[i] == 'limitFrom') {
                //         params[i] = 0
                //     } else if(params[i] == 'limitCount') {
                //         params[i] = initialReportLoad
                //     } else if(params[i] == 'deleteFilter') {
                //         params[i] = deleteFilter
                //     }
                // }
                getVS1Data(indexDBName).then(function (dataObject) {
                    $('#dateFrom').attr('readonly', false);
                    $('#dateTo').attr('readonly', false);
                    if (dataObject.length == 0) {
                        if (templateObject.data.apiParams == undefined) { $('.fullScreenSpin').css('display', 'none'); resolve([]); }
                        let params = cloneDeep(templateObject.apiParams.get());
                        for (let i = 0; i < params.length; i++) {
                            if (params[i] == 'ignoredate') {
                                params[i] = true;
                            } else if (params[i] == 'dateFrom') {
                                params[i] = prevMonth11Date
                            } else if (params[i] == 'dateTo') {
                                params[i] = toDate
                            } else if (params[i] == 'limitFrom') {
                                params[i] = 0
                            } else if (params[i] == 'limitCount') {
                                params[i] = initialReportLoad
                            } else if (params[i] == 'deleteFilter') {
                                params[i] = deleteFilter
                            }
                        }
                        if(templateObject.data.apiName) {
                            templateObject.data.apiName.apply(that, params).then(function (dataReturn) {
                                addVS1Data(indexDBName, JSON.stringify(dataReturn)).then(function () {
                                    resolve(dataReturn)
                                })
                            }).catch(function (e) {
                                resolve([])
                                $('.fullScreenSpin').css('display', 'none');
                            })
                        } else {
                            resolve([])
                            $('.fullScreenSpin').css('display', 'none');
                        }
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        resolve(data)
                    }
                }).catch(function (error) {
                    let params = cloneDeep(templateObject.apiParams.get());
                    for (let i = 0; i < params.length; i++) {
                        if (params[i] == 'ignoredate') {
                            params[i] = true;
                        } else if (params[i] == 'dateFrom') {
                            params[i] = prevMonth11Date
                        } else if (params[i] == 'dateTo') {
                            params[i] = toDate
                        } else if (params[i] == 'limitFrom') {
                            params[i] = 0
                        } else if (params[i] == 'limitCount') {
                            params[i] = initialReportLoad
                        } else if (params[i] == 'deleteFilter') {
                            params[i] = deleteFilter
                        }
                    }
                    templateObject.data.apiName.apply(that, params).then(function (dataReturn) {
                        addVS1Data(indexDBName, JSON.stringify(dataReturn)).then(function () {
                            resolve(dataReturn)
                        })
                    }).catch(function (error) {
                        $('.fullScreenSpin').css('display', 'none');
                    })
                })
            }
        })

    }

    templateObject.getFilteredData = async function (params) {
        $('.fullScreenSpin').css('display', 'inline-block');
        if (templateObject.data.apiParams == undefined) {
            $('.fullScreenSpin').css('display', 'none');
            return
        }
        let apiParams = cloneDeep(templateObject.apiParams.get());
        for (let i = 0; i < apiParams.length; i++) {
            if (apiParams[i] == 'ignoredate') {
                apiParams[i] = params[2]
            } else if (apiParams[i] == 'dateFrom') {
                apiParams[i] = params[0]
            } else if (apiParams[i] == 'dateTo') {
                apiParams[i] = params[1]
            } else if (apiParams[i] == 'limitCount') {
                apiParams[i] = initialDatatableLoad
            } else if (apiParams[i] == 'limitFrom') {
                apiParams[i] = 0
            } else if (apiParams[i] == 'deleteFilter') {
                if ($('.btnHideDeleted').css('display') != 'none') {
                    apiParams[i] = true
                } else {
                    apiParams[i] = false
                }
            }
        }
        let that = templateObject.data.service;
        templateObject.data.apiName.apply(that, apiParams).then(function (data) {
            addVS1Data(indexDBName, JSON.stringify(data)).then(function () {
                templateObject.displayTableData(data);
            })
        })
    }
    templateObject.displayTableData = async function (data, isEx = false) {
        var splashDataArray = new Array();
        let deleteFilter = false;
        if (data != [] && data.length != 0) {
            if (data.Params) {
                if (data.Params.Search.replace(/\s/g, "") == "") {
                    deleteFilter = false
                } else {
                    deleteFilter = true
                }
            }
            if (isEx == false) {
                for (let i = 0; i < data[indexDBLowercase]?.length; i++) {
                    let dataList = templateObject.data.datahandler(data[indexDBLowercase][i])
                    if(dataList.length != 0) {
                      if(templateObject.data.isMultipleRows){
                          dataList.map((item) => {
                              splashDataArray.push(item);
                          })
                      }else{
                          splashDataArray.push(dataList);
                      }
                    }
                    templateObject.transactiondatatablerecords.set(splashDataArray);
                }
            } else {
                let lowercaseData = templateObject.data.exIndexDBName;
                for (let i = 0; i < data[lowercaseData].length; i++) {
                    let dataList = templateObject.data.exdatahandler(data[lowercaseData][i])
                    if(dataList.length != 0) {
                      if(templateObject.data.isMultipleRows){
                          dataList.map((item) => {
                              splashDataArray.push(item);
                          })
                      }else{
                          splashDataArray.push(dataList);
                      }
                    }
                    templateObject.transactiondatatablerecords.set(splashDataArray);
                }
            }



            if (templateObject.transactiondatatablerecords.get()) {
                setTimeout(function () {
                    MakeNegative();
                }, 100);
            }
        }

        let colDef = [];
        let acolDef = [];
        let items = [];
        let aitems = [];

        const tabledraw = () => {
            $('#' + currenttablename).DataTable({
                dom: 'BRlfrtip',
                data: splashDataArray,
                // "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                // columns: columns,
                // aoColumns:acolDef,
                //columns: acolDef,
                columnDefs: colDef,
                // fixedColumns: true ,
                "ordering": false,
                // deferRender: true,
                buttons: [{
                    extend: 'csvHtml5',
                    text: '',
                    download: 'open',
                    className: "btntabletocsv hiddenColumn",
                    filename: templateObject.data.exportfilename,
                    orientation: 'portrait',
                    exportOptions: {
                        columns: ':visible'
                    }
                }, {
                    extend: 'print',
                    download: 'open',
                    className: "btntabletopdf hiddenColumn",
                    text: '',
                    title: templateObject.data.exportfilename,
                    filename: templateObject.data.exportfilename,
                    exportOptions: {
                        columns: ':visible',
                        stripHtml: false
                    },

                },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: templateObject.data.exportfilename,
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        },
                        // available: function () {
                        //     return window.FileReader !== undefined;
                        // },
                        // action: function(e, dt, node, config ) {
                        //     const supportsFileSystemAccess = 'showSaveFilePicker' in window && (() => {
                        //         try {
                        //             return window.self === window.top;
                        //         } catch {
                        //             return false;
                        //         }
                        //     })();

                        //     if (supportsFileSystemAccess) {
                        //         try {
                        //             const handle = showSaveFilePicker({
                        //                 suggestedName: config.filename,
                        //                 type: [{
                        //                     description: 'XLSX file',
                        //                     accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ['.xlsx', '.xls'] }
                        //                 }]
                        //             });
                        //             const writable = handle.createWritable();
                        //             const Excel = fetch('downloads/Template FIles/' + config.filename).then((res) => res.blob())
                        //             const data = new Blob([Excel], { type: "application/vnd.ms-excel" });
                        //             const apiData = dt.buttons.exportData();
                        //             writable.write(apiData);
                        //             writable.close();
                        //             return;
                        //         } catch (err) {
                        //             if (err.name == 'AbortError') {
                        //                 return;
                        //             }
                        //         }
                        //     }
                        // }

                    }
                ],

                "autoWidth": false, // might need this
                // fixedColumns: true,
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                "bLengthChange": isShowSelect,
                lengthMenu: [[initialDatatableLoad, -1],[initialDatatableLoad, "All"]],
                info: true,
                responsive: false,
                "order": templateObject.data.orderby ? eval(templateObject.data.orderby):[[1, "asc"]],
                //"autoWidth": false,
                action: function () {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function (oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function () {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        //var splashArrayCustomerListDupp = new Array();
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $('#' + currenttablename + '_filter input').val();

                        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                        var dateTo = new Date($("#dateTo").datepicker("getDate"));

                        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();


                        let params = cloneDeep(templateObject.apiParams.get());
                        for (let i = 0; i < params.length; i++) {
                            if (params[i] == 'ignoredate') {
                                params[i] = data.Params && data.Params.IgnoreDates;
                            } else if (params[i] == 'dateFrom') {
                                params[i] = formatDateFrom
                            } else if (params[i] == 'dateTo') {
                                params[i] = formatDateTo
                            } else if (params[i] == 'limitFrom') {
                                params[i] = oSettings.fnRecordsDisplay()
                            } else if (params[i] == 'limitCount') {
                                params[i] = initialDatatableLoad
                            } else if (params[i] == 'deleteFilter') {
                                params[i] = deleteFilter
                            }
                        }
                        let that = templateObject.data.service;
                        templateObject.data.apiName.apply(that, params).then(function (dataObjectnew) {
                            for (let j = 0; j < dataObjectnew[indexDBLowercase].length; j++) {
                                var dataList = templateObject.data.datahandler(dataObjectnew[indexDBLowercase][j])
                                splashDataArray.push(dataList);
                            }
                            let uniqueChars = [...new Set(splashDataArray)];
                            templateObject.transactiondatatablerecords.set(uniqueChars);
                            var datatable = $('#' + currenttablename).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function () {
                                $('#' + currenttablename).dataTable().fnPageChange('last');
                            }, 400);

                            $('.fullScreenSpin').css('display', 'none');
                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'none');
                        })
                    });
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function (oSettings) {
                    if (data.Params) {
                      if(templateObject.data.showCameraButton == true){
                        $("<a class='btn btn-primary scanProdServiceBarcodePOP' href='' id='scanProdServiceBarcodePOP' role='button' style='margin-left: 8px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>").insertAfter('#' + currenttablename + '_filter');
                      };

                      if(templateObject.data.viewConvertedButton == true){
                         $("<button class='btn btn-primary btnViewConverted' type='button' id='btnViewConverted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;background-color: #1cc88a !important;border-color: #1cc88a!important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Converted</button>").insertAfter('#' + currenttablename + '_filter');
                      };
                      if(templateObject.data.hideConvertedButton == true){
                        $("<button class='btn btn-danger btnHideConverted' type='button' id='btnHideConverted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;background-color: #f6c23e !important;border-color: #f6c23e!important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide Converted</button>").insertAfter('#' + currenttablename + '_filter');
                      };

                      if(templateObject.data.showPlusButtonCRM == true){
                        $(`<div class="btn-group btnNav btnAddLineGroup" style="height:35px">
                            <button type="button" class="btn btn-primary btnAddLine" id="btnAddLine" style="margin-right: 0px;"><i class='fas fa-plus'></i></button>
                            <button class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="false" type="button"></button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item btnAddLineTask pointer" id="btnAddLineTask">+ Task</a>
                            </div>
                        </div>`).insertAfter('#' + currenttablename + '_filter');
                      }
                      if(templateObject.data.showPlusButton == true){
                        $("<button class='btn btn-primary "+templateObject.data.showPlusButtonClass+"' id='"+templateObject.data.showPlusButtonClass+"' name='"+templateObject.data.showPlusButtonClass+"' data-dismiss='modal' data-toggle='modal' data-target='.edtCustomer_modal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                      };


                        if (data.Params.Search.replace(/\s/g, "") == "") {
                            $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>"+hideViewDeletedLabel+"</button>").insertAfter('#' + currenttablename + '_filter');
                        } else {
                          if (data.Params.Search == "IsBill = true and IsCheque != true") {
                            $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>"+hideViewDeletedLabel+"</button>").insertAfter('#' + currenttablename + '_filter');
                          }else{
                            $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>"+activeViewDeletedLabel+"</button>").insertAfter('#' + currenttablename + '_filter');
                          }
                        }
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>"+activeViewDeletedLabel+"</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshTable' type='button' id='btnRefreshTable' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                    if(typeof templateObject.data.callBack == 'function'){//Alexei
                      templateObject.data.callBackFunc();
                    }
                },
                "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = 0;
                    if (data.Params) {
                        countTableData = data.Params.Count || 0; //get count from API data
                    } else {
                        countTableData = splashDataArray.length
                    }

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                },

            }).on('page', function () {
                setTimeout(function () {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function () {
            }).on('length.dt', function (e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function () {
                    MakeNegative();
                }, 100);
            })

            $(".fullScreenSpin").css("display", "none");

            setTimeout(async function () {
              await $('div.dataTables_filter input').addClass('form-control form-control-sm');
              $('#' + currenttablename+'_filter .form-control-sm').focus();
              $('#' + currenttablename+'_filter .form-control-sm').trigger("input");
            }, 0);
            // setTimeout(function () {
            //   for (let c = 0; c < acolDef.length; c ++) {
            //       let activeHeaderClass = acolDef[c].class;
            //       let activeHeaderWitdh = acolDef[c].sWidth;
            //       $('.'+activeHeaderClass).css('width',activeHeaderWitdh);
            //   }
            //
            //   $('.colComment').css('width','262px');
            // }, 1000);
        }

        function getColDef() {
            let items = templateObject.data.tableheaderrecords;
            for (let i = 0; i < $(".displaySettings").length; i ++) {
                var $tblrow = $($(".displaySettings")[i]);
                var fieldID = $tblrow.attr("custid") || 0;
                var colTitle = $tblrow.find(".divcolumn").text() || "";
                var colWidth = $tblrow.find(".custom-range").val() || 100;
                var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || "";
                var colHidden = false;
                if ($tblrow.find(".custom-control-input").is(":checked")) {
                    colHidden = true;
                } else {
                    colHidden = false;
                }
                let lineItemObj = {
                    index: parseInt(fieldID),
                    label: colTitle,
                    active: colHidden,
                    width: parseFloat(colWidth),
                    class:colthClass,
                    display: true
                };

                for (let i = 0; i < items.length; i ++) {
                    let tLabel = items[i]?.label?.indexOf('#') >= 0 ? items[i].label.substr(1) : items[i].label;
                    let rLabel = lineItemObj?.label?.indexOf('#') >= 0 ? lineItemObj.label.substr(1) : lineItemObj.label;
                    if (tLabel == rLabel) {
                        items[i].width = lineItemObj.width;
                        if (lineItemObj.active) {
                            if (items[i].label.indexOf('#') >= 0) {
                                items[i].label = items[i].label.substr(1);
                            }


                        } else {
                            if (items[i].label.indexOf('#') < 0) {
                                items[i].label = '#' + items[i].label;
                            }
                        }
                    }
                }
            }

            if (items.length > 0) {
                for (let i = 0; i < items.length; i++) {
                    let item = {
                        targets:i,
                        className:items[i]?.label?.includes('#') == false ? items[i].class : items[i].class + ' hiddenColumn',
                        // className: items[i].class,
                        title:items[i].label,
                        width:items[i].width
                    };

                    let aitem = {
                        targets:i,
                        width:items[i].width
                    };

                    acolDef.push(aitem);
                    colDef.push(item);

                }
                templateObject.columnDef.set(colDef)
                tabledraw();
                tableResize();
            } else {
                setTimeout(()=>{
                    getColDef();
                }, 1000);
            }

        }
        getColDef();

        // setTimeout(() => {
        //     window.dispatchEvent(new Event('resize'));
        // }, 1000);
    }

    $(".divDisplaySettings").on("hide.bs.modal", function(){
        // setTimeout(() => {
        //     window.dispatchEvent(new Event('resize'));
        // }, 500);
        // your function after closing modal goes here
    })
})

Template.datatablelist.events({
    "click .btnViewDeleted": async function (e) {
        $(".fullScreenSpin").css("display", "inline-block");
        e.stopImmediatePropagation();
        const templateObject = Template.instance();
        // $('.btnViewDeleted').css('display', 'none');
        // $('.btnHideDeleted').css('display', 'inline-block');
        if (templateObject.data.apiParams == undefined) {
            $(".fullScreenSpin").css("display", "none");
            return
        }
        await clearData(templateObject.data.indexeddbname);
        let tableData = await templateObject.getTableData(true);
        templateObject.displayTableData(tableData)
    },

    "click .btnHideDeleted": async function (e) {
        $(".fullScreenSpin").css("display", "inline-block");
        e.stopImmediatePropagation();
        let templateObject = Template.instance();
        if (templateObject.data.apiParams == undefined) {
            $(".fullScreenSpin").css("display", "none");
            return
        }
        await clearData(templateObject.data.indexeddbname);
        let tableData = await templateObject.getTableData(false);
        templateObject.displayTableData(tableData)
    },

    'change .chkDatatable': async function (event) {
        event.preventDefault();
        // event.stopImmediatePropagation();
        event.stopImmediatePropagation();
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").attr('valueupdate');
        if ($(event.target).is(':checked')) {
            $('.' + columnDataValue).addClass('showColumn');
            $('.' + columnDataValue).removeClass('hiddenColumn');
        } else {
            $('.' + columnDataValue).addClass('hiddenColumn');
            $('.' + columnDataValue).removeClass('showColumn');
        }

        const tableHandler = new TableHandler();
        let range = $(event.target).closest("div").next().find(".custom-range").val();
        await $('.' + columnDataValue).css('width', range);
        // $('.dataTable').resizable();

        // setTimeout(() => {
        //     window.dispatchEvent(new Event('resize'));
        // }, 500);
    },
    // "click .exportbtn": async function () {
    //     $(".fullScreenSpin").css("display", "inline-block");
    //     let currenttablename = templateObject.data.tablename || '';
    //     jQuery('#' + currenttablename + '_wrapper .dt-buttons .btntabletocsv').click();
    //     $(".fullScreenSpin").css("display", "none");
    // },
    // "click .printConfirm": async function (event) {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     $(".fullScreenSpin").css("display", "inline-block");
    //     let currenttablename = templateObject.data.tablename || '';
    //     let colDef = templateObject.columnDef.get();
    //     let dataArray = templateObject.transactiondatatablerecords.get();

    //     let printTable = "<table id='print-table_"+currenttablename+"_print" + "'class='table-print-area print-table"+currenttablename+"_print" +"d-none'><thead></thead><tbody><tbody></table>"
    //     $('body').append(printTable);
    //     $('#print-table_' + currenttablename+'_print').Datatable({
    //         bom: 'B',
    //         buttons: ['pdf'],
    //         columnDefs: colDef,
    //         data: dataArray
    //     });







    //     // jQuery('#' + currenttablename + '_wrapper .dt-buttons .btntabletopdf').click();
    //     // $(".fullScreenSpin").css("display", "none");
    // },

    'click #ignoreDate': async function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', true);
        $('#dateTo').attr('readonly', true);
        let currenttablename = templateObject.data.tablename || '';
        let params = ['', '', true]
        templateObject.getFilteredData(params);
    },
    'click .thisweek': function () {
        let templateObject = Template.instance();
        let currenttablename = templateObject.data.tablename || '';
        $('.dateFrom').attr('readonly', false);
        $('.dateTo').attr('readonly', false);
        var currentBeginDate = new Date();
        let utc = Date.UTC(currentBeginDate.getFullYear(), currentBeginDate.getMonth(), currentBeginDate.getDate());
        let thisWeekFirstDay = new Date(utc - currentBeginDate.getDay() * 1000 * 3600 * 24);

        var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();

        if ((currentBeginDate.getMonth() + 1) < 10) {
            fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
        } else {
            fromDateMonth = (currentBeginDate.getMonth() + 1);
        }
        if (currentBeginDate.getDate() < 10) {
            fromDateDay = "0" + currentBeginDate.getDate();
        }

        let thisWeekFromDate = thisWeekFirstDay.getDate();
        let thisWeekFromMonth;

        if ((thisWeekFirstDay.getMonth() + 1) < 10) {
            thisWeekFromMonth = "0" + (thisWeekFirstDay.getMonth() + 1);
        } else {
            thisWeekFromMonth = (thisWeekFirstDay.getMonth() + 1);
        }
        if (thisWeekFirstDay.getDate() < 10) {
            thisWeekFromDate = "0" + thisWeekFirstDay.getDate();
        }

        var toDateERPFrom = thisWeekFirstDay.getFullYear() + "-" + thisWeekFromMonth + "-" + thisWeekFromDate;
        var toDateERPTo = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);

        var toDateDisplayFrom = thisWeekFromDate + "/" + thisWeekFromMonth + "/" + thisWeekFirstDay.getFullYear();
        var toDateDisplayTo = (fromDateDay) + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();

        $("#dateFrom").val(toDateDisplayFrom);
        $("#dateTo").val(toDateDisplayTo);

        let params = [toDateERPFrom, toDateERPTo, false];
        templateObject.getFilteredData(params)

        // if (currenttablename == "tblBankingOverview") {
        //     templateObject.getAllFilterbankingData(toDateDisplayFrom,toDateDisplayTo, false);
        // }
    },
    'click .thisMonth': function () {
        let templateObject = Template.instance();
        let currenttablename = templateObject.data.tablename || '';
        $('.dateFrom').attr('readonly', false);
        $('.dateTo').attr('readonly', false);
        var currentDate = new Date();

        var prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        var prevMonthFirstDate = new Date(currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1), (currentDate.getMonth() - 1 + 12) % 12, 1);

        var formatDateComponent = function (dateComponent) {
            return (dateComponent < 10 ? '0' : '') + dateComponent;
        };

        var formatDate = function (date) {
            return formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
        };

        var formatDateERP = function (date) {
            return date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
        };


        var fromDate = formatDate(prevMonthFirstDate);
        var toDate = formatDate(prevMonthLastDate);

        let getDateFrom = formatDateERP(prevMonthFirstDate);
        let getToDate = formatDateERP(prevMonthLastDate);

        $("#dateFrom").val(fromDate);
        $("#dateTo").val(toDate);

        let params = [getDateFrom, getToDate, false]
        templateObject.getFilteredData(params)
        // if (currenttablename == "tblBankingOverview") {
        //     templateObject.getAllFilterbankingData(fromDate,toDate, false);
        // }
    },
    'click .thisQuarter': function () {
        let templateObject = Template.instance();
        let currenttablename = templateObject.data.tablename || '';
        $('.dateFrom').attr('readonly', false);
        $('.dateTo').attr('readonly', false);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        function getQuarter(d) {
            d = d || new Date();
            var m = Math.floor(d.getMonth() / 3) + 2;
            return m > 4 ? m - 4 : m;
        }

        var quarterAdjustment = (moment().month() % 3) + 1;
        var lastQuarterEndDate = moment().subtract({
            months: quarterAdjustment
        }).endOf('month');
        var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({
            months: 2
        }).startOf('month');

        var lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
        var lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");


        $("#dateFrom").val(lastQuarterStartDateFormat);
        $("#dateTo").val(lastQuarterEndDateFormat);


        let params = [lastQuarterStartDateFormat, lastQuarterEndDateFormat, false]
        templateObject.getFilteredData(params)
        // if (currenttablename == "tblBankingOverview") {
        //     templateObject.getAllFilterbankingData(lastQuarterStartDateFormat,lastQuarterEndDateFormat, false);
        // }
    },
    'click .thisfinancialyear': function () {
        let templateObject = Template.instance();
        let currenttablename = templateObject.data.tablename || '';

        $('.dateFrom').attr('readonly', false);
        $('.dateTo').attr('readonly', false);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
        let fromDateDay = currentDate.getDate();
        if ((currentDate.getMonth() + 1) < 10) {
            fromDateMonth = "0" + (currentDate.getMonth() + 1);
        }
        if (currentDate.getDate() < 10) {
            fromDateDay = "0" + currentDate.getDate();
        }

        var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() - 1);



        $("#dateFrom").val(fromDate);
        $("#dateTo").val(begunDate);

        var formatDateComponent = function(dateComponent) {
            return (dateComponent < 10 ? '0' : '') + dateComponent;
        };

        var formatDate = function(date) {
            return  formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
        };

        var formatDateERP = function(date) {
            return  date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
        };

        let getDateFrom = formatDateERP(fromDate);
        let getToDate = formatDateERP(begunDate);

        let params = [getDateFrom, getToDate, false];
        templateObject.getFilteredData(params);
        // if (currenttablename == "tblBankingOverview") {
        //     templateObject.getAllFilterbankingData(fromDate,begunDate, false);
        // }
    },
    'click .previousweek': function () {
        let templateObject = Template.instance();
        let currenttablename = templateObject.data.tablename || '';
        $('.dateFrom').attr('readonly', false);
        $('.dateTo').attr('readonly', false);
        var currentBeginDate = new Date();
        let utc = Date.UTC(currentBeginDate.getFullYear(), currentBeginDate.getMonth(), currentBeginDate.getDate());
        let previousWeekFirstDay = new Date(utc - (currentBeginDate.getDay() + 7) * 1000 * 3600 * 24);
        let previousWeekLastDay = new Date(utc - (currentBeginDate.getDay() + 1) * 1000 * 3600 * 24);

        var begunDate = moment(previousWeekFirstDay).format("DD/MM/YYYY");
        let previousWeekFromMonth = (previousWeekFirstDay.getMonth() + 1);
        let previousWeekFromDay = previousWeekFirstDay.getDate();

        if ((previousWeekFirstDay.getMonth() + 1) < 10) {
            previousWeekFromMonth = "0" + (previousWeekFirstDay.getMonth() + 1);
        } else {
            previousWeekFromMonth = (previousWeekFirstDay.getMonth() + 1);
        }
        if (previousWeekFirstDay.getDate() < 10) {
            previousWeekFromDay = "0" + previousWeekFirstDay.getDate();
        }

        let previousWeekToDate = previousWeekLastDay.getDate();
        let previousWeekToMonth;

        if ((previousWeekLastDay.getMonth() + 1) < 10) {
            previousWeekToMonth = "0" + (previousWeekLastDay.getMonth() + 1);
        } else {
            previousWeekToMonth = (previousWeekLastDay.getMonth() + 1);
        }
        if (previousWeekToDate < 10) {
            previousWeekToDate = "0" + previousWeekLastDay.getDate();
        }

        var toDateERPFrom = previousWeekFirstDay.getFullYear() + "-" + previousWeekFromMonth + "-" + previousWeekFromDay;
        var toDateERPTo = previousWeekLastDay.getFullYear() + "-" + (previousWeekToMonth) + "-" + (previousWeekToDate);

        var toDateDisplayFrom = previousWeekFromDay + "/" + previousWeekFromMonth + "/" + previousWeekFirstDay.getFullYear();
        var toDateDisplayTo = (previousWeekToDate) + "/" + (previousWeekToMonth) + "/" + previousWeekLastDay.getFullYear();

        $("#dateFrom").val(toDateDisplayFrom);
        $("#dateTo").val(toDateDisplayTo);

        let params = [toDateERPFrom, toDateERPTo, false]
        templateObject.getFilteredData(params)

        // if (currenttablename == "tblBankingOverview") {
        //     templateObject.getAllFilterbankingData(toDateDisplayFrom,toDateDisplayTo, false);
        // }
    },
    'click .previousmonth': function () {
        let templateObject = Template.instance();
        let currenttablename = templateObject.data.tablename || '';
        $('.dateFrom').attr('readonly', false);
        $('.dateTo').attr('readonly', false);
        var currentDate = new Date();

        var prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        var prevMonthFirstDate = new Date(currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1), (currentDate.getMonth() - 1 + 12) % 12, 1);

        var formatDateComponent = function (dateComponent) {
            return (dateComponent < 10 ? '0' : '') + dateComponent;
        };

        var formatDate = function (date) {
            return formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
        };

        var formatDateERP = function (date) {
            return date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
        };


        var fromDate = formatDate(prevMonthFirstDate);
        var toDate = formatDate(prevMonthLastDate);

        let getDateFrom = formatDateERP(prevMonthFirstDate);
        let getToDate = formatDateERP(prevMonthLastDate);

        $("#dateFrom").val(fromDate);
        $("#dateTo").val(toDate);

        let params = [getDateFrom, getToDate, false]
        templateObject.getFilteredData(params);

        // if (currenttablename == "tblBankingOverview") {
        //     templateObject.getAllFilterbankingData(fromDate,toDate, false);
        // }

    },
    'click .previousquarter': function () {
        let templateObject = Template.instance();
        let currenttablename = templateObject.data.tablename || '';
        $('.dateFrom').attr('readonly', false);
        $('.dateTo').attr('readonly', false);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        function getQuarter(d) {
            d = d || new Date();
            var m = Math.floor(d.getMonth() / 3) + 2;
            return m > 4 ? m - 4 : m;
        }

        var quarterAdjustment = (moment().month() % 3) + 1;
        var lastQuarterEndDate = moment().subtract({
            months: quarterAdjustment
        }).endOf('month');
        var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({
            months: 2
        }).startOf('month');

        var lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
        var lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");


        $("#dateFrom").val(lastQuarterStartDateFormat);
        $("#dateTo").val(lastQuarterEndDateFormat);

        var formatDateComponent = function(dateComponent) {
            return (dateComponent < 10 ? '0' : '') + dateComponent;
        };

        var formatDate = function(date) {
            return  formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
        };

        var formatDateERP = function(date) {
            return  date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
        };

        let getDateFrom = formatDateERP(lastQuarterStartDateFormat);
        let getToDate = formatDateERP(lastQuarterEndDateFormat);

        let params = [getDateFrom, getToDate, false];
        templateObject.getFilteredData(params)

        // if (currenttablename == "tblBankingOverview") {
        //     templateObject.getAllFilterbankingData(lastQuarterStartDateFormat,lastQuarterEndDateFormat, false);
        // }
    },
    'click .previousfinancialyear': function () {
        let templateObject = Template.instance();
        let currenttablename = templateObject.data.tablename || '';

        $('.dateFrom').attr('readonly', false);
        $('.dateTo').attr('readonly', false);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
        let fromDateDay = currentDate.getDate();
        if ((currentDate.getMonth() + 1) < 10) {
            fromDateMonth = "0" + (currentDate.getMonth() + 1);
        }
        if (currentDate.getDate() < 10) {
            fromDateDay = "0" + currentDate.getDate();
        }

        var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() - 1);
        $("#dateFrom").val(fromDate);
        $("#dateTo").val(begunDate);

        var formatDateComponent = function(dateComponent) {
            return (dateComponent < 10 ? '0' : '') + dateComponent;
        };

        var formatDate = function(date) {
            return  formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
        };

        var formatDateERP = function(date) {
            return  date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
        };

        let getDateFrom = formatDateERP(fromDate);
        let getToDate = formatDateERP(begunDate);

        let params = [getDateFrom, getToDate, false];
        templateObject.getFilteredData(params)

        // if (currenttablename == "tblBankingOverview") {
        //     templateObject.getAllFilterbankingData(fromDate,begunDate, false);
        // }
    },

    'click #today': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentBeginDate = new Date();
        var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();
        if ((currentBeginDate.getMonth() + 1) < 10) {
            fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
        } else {
            fromDateMonth = (currentBeginDate.getMonth() + 1);
        }

        if (currentBeginDate.getDate() < 10) {
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        var toDateERPFrom = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
        var toDateERPTo = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);

        var toDateDisplayFrom = (fromDateDay) + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();
        var toDateDisplayTo = (fromDateDay) + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();

        $("#dateFrom").val(toDateDisplayFrom);
        $("#dateTo").val(toDateDisplayTo);
        let params = [toDateERPFrom, toDateERPTo, false];
        templateObject.getFilteredData(params)
        // templateObject.getAllFilterSalesOrderData(toDateERPFrom,toDateERPTo, false);
    },
    'change .dateTo': function (event) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        //setTimeout(function () {
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

        //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {

        } else {
            let params = [formatDateFrom, formatDateTo, false];
            templateObject.getFilteredData(params)
            // templateObject.getAllFilterSalesOrderData(formatDateFrom, formatDateTo, false);
        }
        //}, 500);
    },
    'change .dateFrom': function (event) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        //setTimeout(function () {
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

        //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {

        } else {
            let params = [formatDateFrom, formatDateTo, false];
            templateObject.getFilteredData(params);
            // templateObject.getAllFilterSalesOrderData(formatDateFrom, formatDateTo, false);
        }
        //}, 500);
    },

    'change .custom-range': async function (event) {
        const tableHandler = new TableHandler();
        let range = $(event.target).val() || 100;
        let colClassName = $(event.target).attr("valueclass");
        await $('.' + colClassName).css('width', range);
        // $('.dataTable').resizable();
    },

    'keyup .dataTables_filter input': function (event) {
        if ($(event.target).val() != '') {
            $(".btnRefreshTable").addClass('btnSearchAlert');
        } else {
            $(".btnRefreshTable").removeClass('btnSearchAlert');
        }
        if (event.keyCode == 13) {
            $(".btnRefreshTable").trigger("click");
        }
    },
    'click .btnRefreshTable': async function (event) {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        const dataTableList = [];
        $('.fullScreenSpin').css('display', 'inline-block');
        let tablename = templateObject.data.tablename;
        let dataSearchName = $('#' + tablename + '_filter input').val();
        if (dataSearchName.replace(/\s/g, '') != '') {
            let that = templateObject.data.service;
            if (that == undefined) {
                $('.fullScreenSpin').css('display', 'none');
                $('.btnRefreshTable').removeClass('btnSearchAlert');
                return;
            }
            let paramArray = [dataSearchName]
            templateObject.data.searchAPI.apply(that, paramArray).then(function (data) {
                $('.btnRefreshTable').removeClass('btnSearchAlert');
                templateObject.displayTableData(data, true)
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            $(".btnRefresh").trigger("click");
        }
    },

    "blur .divcolumn": function (event) {
        let columData = $(event.target).html();
        let columHeaderUpdate = $(event.target).attr("valueupdate");
        $("th.col" + columHeaderUpdate + "").html(columData);
    },

    // custom field displaysettings
    'click .resetTable': function (event) {
        let templateObject = Template.instance();
        let currenttranstablename = templateObject.data.tablename||"";
        let loggedEmpID = localStorage.getItem('mySessionEmployeeLoggedID')||0;
        //let reset_data = await templateObject.reset_data.get();
        //reset_data = reset_data.filter(redata => redata.display);
        $('.fullScreenSpin').css('display', 'inline-block');
        //Rasheed Add Reset Function (API)
        var erpGet = erpDb();
        let objResetData = {
            Name:"VS1_Customize",
            Params:
                {
                    EmployeeID:parseInt(loggedEmpID)||0,
                    TableName:currenttranstablename,
                    Columns:[
                        {
                            "Width":"0"
                        }
                    ],
                    Reset:true
                }
        }

        var oPost = new XMLHttpRequest();
        oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_Customize"', true);
        oPost.setRequestHeader("database", erpGet.ERPDatabase);
        oPost.setRequestHeader("username", erpGet.ERPUsername);
        oPost.setRequestHeader("password", erpGet.ERPPassword);
        oPost.setRequestHeader("Accept", "application/json");
        oPost.setRequestHeader("Accept", "application/html");
        oPost.setRequestHeader("Content-type", "application/json");
        var myString = JSON.stringify(objResetData);

        oPost.send(myString);

        oPost.onreadystatechange = function() {
            if(oPost.readyState == 4 && oPost.status == 200) {

                var myArrResponse = JSON.parse(oPost.responseText);
                if(myArrResponse.ProcessLog.Error){
                    $('.fullScreenSpin').css('display','none');
                    swal('Oooops...', myArrResponse.ProcessLog.Error, 'error');
                }else{
                    sideBarService.getNewCustomFieldsWithQuery(parseInt(localStorage.getItem('mySessionEmployeeLoggedID')), '').then(async function(dataCustomize) {
                        await addVS1Data('VS1_Customize', JSON.stringify(dataCustomize));
                        templateObject.init_reset_data();
                        templateObject.initCustomFieldDisplaySettings("", currenttranstablename);
                        $('#'+currenttranstablename+'_Modal').modal('hide');
                        $('.modal-backdrop').css('display','none');
                        $('.fullScreenSpin').css('display','none');
                        swal({
                            title: 'SUCCESS',
                            text: "Display settings is updated!",
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'OK'
                        }).then((result) => {
                          location.reload();
                        });
                    }).catch(function (err) {
                        $('.fullScreenSpin').css('display','none');
                    });


                }

            }else if(oPost.readyState == 4 && oPost.status == 403){
                $('.fullScreenSpin').css('display','none');
                swal({
                    title: 'Oooops...',
                    text: oPost.getResponseHeader('errormessage'),
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {

                    } else if (result.dismiss === 'cancel') {

                    }
                });
            }else if(oPost.readyState == 4 && oPost.status == 406){
                $('.fullScreenSpin').css('display','none');
                var ErrorResponse = oPost.getResponseHeader('errormessage');
                var segError = ErrorResponse.split(':');

                if((segError[1]) == ' "Unable to lock object'){

                    swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
                }else{

                    swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
                }

            }else if(oPost.readyState == '') {
                $('.fullScreenSpin').css('display','none');
                swal('Connection Failed', oPost.getResponseHeader('errormessage') +' Please try again!', 'error');
            }
        }
    },

    // custom field displaysettings
    'click .saveTable': async function (event) {
        let lineItems = [];
        let sideBarService = new SideBarService();
        $(".fullScreenSpin").css("display", "inline-block");

        $(".displaySettings").each(function (index) {
            var $tblrow = $(this);
            var fieldID = $tblrow.attr("custid") || 0;
            var colTitle = $tblrow.find(".divcolumn").text() || "";
            var colWidth = $tblrow.find(".custom-range").val() || 100;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || "";
            var colHidden = false;
            if ($tblrow.find(".custom-control-input").is(":checked")) {
                colHidden = true;
            } else {
                colHidden = false;
            }
            let lineItemObj = {
                index: parseInt(fieldID),
                label: colTitle,
                active: colHidden,
                width: parseFloat(colWidth),
                class: colthClass,
                display: true
            };

            lineItems.push(lineItemObj);
        });

        let templateObject = Template.instance();
        let reset_data = templateObject.reset_data.get();
        reset_data = reset_data.filter(redata => redata.display == false);
        lineItems.push(...reset_data);
        lineItems.sort((a, b) => a.index - b.index);

        try {
            let erpGet = erpDb();
            let tableName = templateObject.data.tablename;
            let employeeId = parseInt(localStorage.getItem('mySessionEmployeeLoggedID')) || 0;
            let added = await sideBarService.saveNewCustomFields(erpGet, tableName, employeeId, lineItems);
            if (added) {
                sideBarService.getNewCustomFieldsWithQuery(parseInt(localStorage.getItem('mySessionEmployeeLoggedID')), '').then(async function (dataCustomize) {
                    await addVS1Data('VS1_Customize', JSON.stringify(dataCustomize));
                    $(".fullScreenSpin").css("display", "none");
                    swal({
                        title: 'SUCCESS',
                        text: "Display settings is updated!",
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.value) {
                            $('#myModal2').modal('hide');
                        }
                    });
                });
            } else {
                swal("Something went wrong!", "", "error");
            }
        } catch (error) {
            $(".fullScreenSpin").css("display", "none");
            swal("Something went wrong!", "", "error");
        }
    },

})

Template.datatablelist.helpers({
    displayfields: () => {
        let fields =  Template.instance().displayfields.get();
        return fields;
    },
    istransaction: () => {
        return Template.instance().data.istransaction;
    }
});
