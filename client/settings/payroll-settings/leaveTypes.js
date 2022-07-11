import '../../lib/global/indexdbstorage.js';
import {SideBarService} from '../../js/sidebar-service';
import { UtilityService } from "../../utility-service";
import EmployeePayrollApi from '../../js/Api/EmployeePayrollApi'
import ApiService from "../../js/Api/Module/ApiService";

let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.leaveTypeSettings.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.datatableallowancerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.countryData = new ReactiveVar();
    templateObject.Ratetypes = new ReactiveVar([]);
    templateObject.imageFileData=new ReactiveVar();
    templateObject.currentDrpDownID = new ReactiveVar(); 
   // templateObject.Accounts = new ReactiveVar([]);   
});

Template.leaveTypeSettings.onRendered(function() {
    const templateObject = Template.instance();
    var splashArrayLeaveList = new Array();

    templateObject.saveDataLocalDB = async function(){
        const employeePayrolApis = new EmployeePayrollApi();
        // now we have to make the post request to save the data in database
        const employeePayrolEndpoint = employeePayrolApis.collection.findByName(
            employeePayrolApis.collectionNames.TLeave
        );

        employeePayrolEndpoint.url.searchParams.append(
            "ListType",
            "'Detail'"
        );                
        
        const employeePayrolEndpointResponse = await employeePayrolEndpoint.fetch(); // here i should get from database all charts to be displayed

        if (employeePayrolEndpointResponse.ok == true) {
            employeePayrolEndpointJsonResponse = await employeePayrolEndpointResponse.json();
            await addVS1Data('TLeave', JSON.stringify(employeePayrolEndpointJsonResponse))
            return employeePayrolEndpointJsonResponse
        }  
        return '';
    };

    templateObject.getLeaves = async function(){
        try {
            let data = {};
            let splashArrayLeaveList = new Array();
            let dataObject = await getVS1Data('TLeave')  
            if ( dataObject.length == 0) {
                data = await templateObject.saveDataLocalDB();
            }else{
                data = JSON.parse(dataObject[0].data);
            }
            for (let i = 0; i < data.tleave.length; i++) {

                var dataListAllowance = [
                    data.tleave[i].fields.ID || '',
                    data.tleave[i].fields.LeaveName || '',
                    data.tleave[i].fields.Unit || '',
                    data.tleave[i].fields.LeaveNormalEntitlement || '',
                    data.tleave[i].fields.LeaveLeaveLoadingRate || '',
                    data.tleave[i].fields.LeaveType || '',
                    data.tleave[i].fields.LeaveShowBalanceOnPayslip == true ? 'show': 'hide',
                ];

                splashArrayLeaveList.push(dataListAllowance);
             }

              function MakeNegative() {
                  $('td').each(function () {
                      if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
                  });
              };


              setTimeout(function () {
                  MakeNegative();
              }, 100);
            templateObject.datatablerecords.set(splashArrayLeaveList);
            $('.fullScreenSpin').css('display', 'none');
            setTimeout(function () {
                $('#tblLeaves').DataTable({  
                    data: splashArrayLeaveList,
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    columnDefs: [
                        {
                            className: "colLeaveID hiddenColumn",
                            "targets": [0]
                        },
                        {
                            className: "colLeaveName",
                            "targets": [1]
                        },
                        {
                            className: "colLeaveUnits",
                            "targets": [2]
                        },
                        {
                            className: "colLeaveNormalEntitlement",
                            "targets": [3]
                        },
                        {
                            className: "colLeaveLeaveLoadingRate",
                            "targets": [4]
                        },
                        {
                            className: "colLeaveType",
                            "targets": [5]
                        },
                        {
                            className: "colLeaveShownOnPayslip",
                            "targets": [6]
                        }
                    ],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    pageLength: initialDatatableLoad,
                    lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                    info: true,
                    responsive: true,
                    "order": [[0, "asc"]],
                    action: function () {
                        $('#tblLeaves').DataTable().ajax.reload();
                    },
                    "fnDrawCallback": function (oSettings) {
                        $('.paginate_button.page-item').removeClass('disabled');
                        $('#tblLeaves_ellipsis').addClass('disabled');
                        if (oSettings._iDisplayLength == -1) {
                            if (oSettings.fnRecordsDisplay() > 150) {
    
                            }
                        } else {
    
                        }
                        if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                            $('.paginate_button.page-item.next').addClass('disabled');
                        }
    
                        $('.paginate_button.next:not(.disabled)', this.api().table().container())
                            .on('click', function () {
                                $('.fullScreenSpin').css('display', 'inline-block');
                                var splashArrayLeaveListDupp = new Array();
                                let dataLenght = oSettings._iDisplayLength;
                                let customerSearch = $('#tblLeaves_filter input').val();
    
                                sideBarService.getLeave(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                    for (let i = 0; i < data.tleave.length; i++) {
                                        var dataListAllowance = [
                                            data.tleave[i].fields.ID || '',
                                            data.tleave[i].fields.LeaveName || '',
                                            data.tleave[i].fields.Unit || '',
                                            data.tleave[i].fields.LeaveNormalEntitlement || '',
                                            data.tleave[i].fields.LeaveLeaveLoadingRate || '',
                                            data.tleave[i].fields.LeaveType || '',
                                            data.tleave[i].fields.LeaveShowBalanceOnPayslip == true ? 'show': 'hide',
                                        ];
                        
                                        splashArrayLeaveList.push(dataListAllowance);
                                    }

                                    let uniqueChars = [...new Set(splashArrayLeaveList)];
                                    var datatable = $('#tblLeaves').DataTable();
                                    datatable.clear();
                                    datatable.rows.add(uniqueChars);
                                    datatable.draw(false);
                                    setTimeout(function () {
                                        $("#tblLeaves").dataTable().fnPageChange('last');
                                    }, 400);
    
                                    $('.fullScreenSpin').css('display', 'none');
    
    
                                }).catch(function (err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
    
                            });
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    },
                    "fnInitComplete": function () {
                        $("<button class='btn btn-primary btnAddordinaryTimeLeave' data-dismiss='modal' data-toggle='modal' data-target='#ordinaryTimeLeaveModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblLeaves_filter");
                        $("<button class='btn btn-primary btnRefreshLeave' type='button' id='btnRefreshLeave' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblLeaves_filter");
                    }
    
                }).on('page', function () {
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
    
                }).on('column-reorder', function () {
    
                }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArrayLeaveList = [];
                    if (dataLenght == -1) {
                    $('.fullScreenSpin').css('display', 'none');
    
                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getLeave(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TLeave', JSON.stringify(dataNonBo)).then(function (datareturn) {
                                    // templateObject.resetData(dataNonBo);
                                    $('.fullScreenSpin').css('display', 'none');
                                }).catch(function (err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                    }
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                });
            }, 0);
        } catch (error) {
            $('.fullScreenSpin').css('display', 'none');
        }
    };
    
    
    templateObject.getLeaves();

})