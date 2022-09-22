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


Template.processlistpopup.onCreated(function(e){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
})

Template.processlistpopup.onRendered(function(e){
    const templateObject = Template.instance();
    let splashArrayProcessList = [];
    templateObject.getProcessList = function(e) {
        let tempArray = localStorage.getItem('TProcesses');
        templateObject.datatablerecords.set(tempArray?JSON.parse(tempArray): []);
        if(templateObject.datatablerecords.get()) {
            let temp = templateObject.datatablerecords.get();
            temp.map(process => {
                let dataListProcess = [
                    process.fields.name || '',
                    process.fields.description || '',
                    process.fields.dailyHours || 0,
                    process.fields.totalHourlyCost || 0.00,
                    process.fields.wastage || '',
                ];
                splashArrayProcessList.push(dataListProcess);
            })
        }
        setTimeout(function () {
            $('#tblProcessPopList').DataTable({
                data: splashArrayProcessList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [
                    {
                        className: "colProcessName",
                        "targets": [0]
                    },
                    {
                        className: "colDescription",
                        "targets": [1]
                    }, {
                        className: "colDailyHours",
                        "targets": [2]
                    }, {
                        className: "colTotalHourlyCosts",
                        "targets": [3]
                    }, {
                        className: "colWastage",
                        "targets": [4]
                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                info: true,
                responsive: true,
                "order": [[1, "asc"]],
                action: function () {
                    $('#tblProcessPopList').DataTable().ajax.reload();
                },
                "fnDrawCallback": function (oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#tblProcessPopList_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {
    
                        }
                    } else {
    
                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                },
                "fnInitComplete": function (oSettings) {
                    $("<button class='btn btn-primary btnAddNewProcess' data-dismiss='modal' data-toggle='modal' data-target='#addCustomerModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i>New Process</button>").insertAfter("#tblProcessPopList_filter");
                    $("<button class='btn btn-primary btnRefreshProcess' type='button' id='btnRefreshProcess' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblProcessPopList_filter");
    
                    // let urlParametersPage = FlowRouter.current().queryParams.page;
                    // if (urlParametersPage) {
                    //     this.fnPageChange('last');
                    // }
    
                }
    
            }).on('page', function () {
                setTimeout(function () {
                    MakeNegative();
                }, 100);
                let draftRecord = templateObject.custdatatablerecords.get();
                templateObject.custdatatablerecords.set(draftRecord);
            }).on('column-reorder', function () {
    
            }).on('length.dt', function (e, settings, len) {
              $('.fullScreenSpin').css('display', 'inline-block');
              let dataLenght = settings._iDisplayLength;
              if (dataLenght == -1) {
                $('.fullScreenSpin').css('display', 'none');
              }else{
                if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                    $('.fullScreenSpin').css('display', 'none');
                } else {
    
                    $('.fullScreenSpin').css('display', 'none');
                }
    
              }
    
            });
        }, 1000);
    }
    templateObject.getProcessList();

    
})

Template.processlistpopup.helpers({
    datatablerecords:()=>{
        return Template.instance().datatablerecords.get();
    }
})

Template.processlistpopup.events({
    'click .btnAddNewProcess':function(event) {
        $('#processListModal').modal('toggle');
        $('#BOMSetupModal').modal('toggle');
        setTimeout(()=>{
            FlowRouter.go('/processcard')
        }, 1000)
    }
})
