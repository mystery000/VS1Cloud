import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import {UtilityService} from "../../utility-service";

import './ratepop.html';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.ratepop.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.ratepop.onRendered(function() {

    let templateObject = Template.instance();
    const dataTableList = [
        {
            id:1,
            rateName:"Normal",
        },
        {
            id:2,
            rateName:"Time & Half",
        },
        {
            id:3,
            rateName:"Double Time",
        },
        {
            id:4,
            rateName:"Weekend",
        },
    ];
    const tableHeaderList = [];

    function MakeNegative() {
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    }

    templateObject.getRateList = function() {
        setRateList();
    }
    function setRateList() {
        templateObject.datatablerecords.set(dataTableList);
        if (templateObject.datatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function() {
            $('#tblRatePopList').DataTable({
                columnDefs: [{
                    "orderable": false,
                    "targets": -1
                }],
                select: true,
                destroy: true,
                colReorder: true,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [{
                    extend: 'csvHtml5',
                    text: '',
                    download: 'open',
                    className: "btntabletocsv hiddenColumn",
                    filename: "tblRatePopList_" + moment().format(),
                    orientation: 'portrait',
                    exportOptions: {
                        columns: ':visible'
                    }
                }, {
                    extend: 'print',
                    download: 'open',
                    className: "btntabletopdf hiddenColumn",
                    text: '',
                    title: 'Term List',
                    filename: "tblRatePopList_" + moment().format(),
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "tblRatePopList_" + moment().format(),
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }
                ],
                paging: false,
                info: true,
                responsive: true,
                "order": [
                    [0, "asc"]
                ],
                action: function() {
                    $('#tblRatePopList').DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "",searchPlaceholder: "Search List..." },
                "fnInitComplete": function () {
                    console.log('finInitComplete.............')
                    $("<button class='btn btn-primary btnAddNewRate' data-dismiss='modal' data-toggle='modal' data-target='#newratePopModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblRatePopList_filter");
                    $("<button class='btn btn-primary btnRefreshRate' type='button' id='btnRefreshRate' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblRatePopList_filter");
                },

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
                let draftRecord = templateObject.datatablerecords.get();
                templateObject.datatablerecords.set(draftRecord);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $('.fullScreenSpin').css('display', 'none');
        }, 10);
        const columns = $('#tblRatePopList th');
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
                columVisible = false;
            }
            sWidth = v.style.width.replace('px', "");
            let datatablerecordObj = {
                sTitle: v.innerText || '',
                sWidth: sWidth || '',
                sIndex: v.cellIndex || '',
                sVisible: columVisible || false,
                sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
        $('div.dataTables_filter input').addClass('form-control form-control-sm');
    }
    templateObject.getRateList();
});

Template.ratepop.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.rateName == 'NA') {
                return 1;
            } else if (b.rateName == 'NA') {
                return -1;
            }
            return (a.rateName.toUpperCase() > b.rateName.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
