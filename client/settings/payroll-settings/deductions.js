import '../../lib/global/indexdbstorage.js';
import {SideBarService} from '../../js/sidebar-service';
import { UtilityService } from "../../utility-service";
import EmployeePayrollApi from '../../js/Api/EmployeePayrollApi'
import ApiService from "../../js/Api/Module/ApiService";

let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.deductionSettings.onCreated(function() {
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

Template.deductionSettings.onRendered(function() {

    const templateObject = Template.instance();
    var splashArrayDeductionList = new Array();

    templateObject.saveDataLocalDB = async function(){
        const employeePayrolApis = new EmployeePayrollApi();
        // now we have to make the post request to save the data in database
        const employeePayrolEndpoint = employeePayrolApis.collection.findByName(
            employeePayrolApis.collectionNames.TDeduction
        );

        employeePayrolEndpoint.url.searchParams.append(
            "ListType",
            "'Detail'"
        );                
        
        const employeePayrolEndpointResponse = await employeePayrolEndpoint.fetch(); // here i should get from database all charts to be displayed

        if (employeePayrolEndpointResponse.ok == true) {
            employeePayrolEndpointJsonResponse = await employeePayrolEndpointResponse.json();
            await addVS1Data('TDeduction', JSON.stringify(employeePayrolEndpointJsonResponse))
            return employeePayrolEndpointJsonResponse
        }  
        return '';
    };

    templateObject.getDeductions = async function(){
        try {
            let data = {};
            let splashArrayDeductionList = new Array();
            let dataObject = await getVS1Data('TDeduction')  
            if ( dataObject.length == 0) {
                data = await templateObject.saveDataLocalDB();
            }else{
                data = JSON.parse(dataObject[0].data);
            }
            let deductionTypeVal = 'None';
            for (let i = 0; i < data.tdeduction.length; i++) {
                let deductionAmount = utilityService.modifynegativeCurrencyFormat(data.tdeduction[i].fields.Amount) || 0.00;
                if(data.tdeduction[i].fields.Taxexempt == true){
                    deductionTypeVal = 'None';
                }else{
                    if(data.tdeduction[i].fields.IsWorkPlacegiving == true){
                        deductionTypeVal = 'Workplace Giving';
                    }
                    if(data.tdeduction[i].fields.Unionfees == true){
                        deductionTypeVal = 'Union / Association Fees';
                    }
                }
                var dataListDeduction = [
                    data.tdeduction[i].fields.ID || 0,
                    data.tdeduction[i].fields.Description || '-',
                    deductionTypeVal || 'None',
                    data.tdeduction[i].fields.Displayin || '',
                    deductionAmount || 0.00,
                    data.tdeduction[i].fields.Accountname || '',
                    data.tdeduction[i].fields.Accountid || 0,
                    data.tdeduction[i].fields.Payrolltaxexempt || false,
                    data.tdeduction[i].fields.Superinc || false,
                    data.tdeduction[i].fields.Workcoverexempt || false,
                ];

                splashArrayDeductionList.push(dataListDeduction);
            }

              function MakeNegative() {
                  $('td').each(function () {
                      if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
                  });
              };


              setTimeout(function () {
                  MakeNegative();
              }, 100);
            templateObject.datatablerecords.set(splashArrayDeductionList);
            $('.fullScreenSpin').css('display', 'none');
            setTimeout(function () {
                $('#tblDeductions').DataTable({  
                    data: splashArrayDeductionList,
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    columnDefs: [
                        {
                            className: "colDeductionsID hiddenColumn",
                            "targets": [0]
                        },
                        {
                            className: "colDeductionsNames",
                            "targets": [1]
                        },  {
                            className: "colDeductionsType",
                            "targets": [2]
                        }, {
                            className: "colDeductionsDisplayName",
                            "targets": [3]
                        }, {
                            className: "colDeductionsAmount  text-right",
                            "targets": [4]
                        }, {
                            className: "colDeductionsAccounts",
                            "targets": [5]
                        }, {
                            className: "colDeductionsAccountsID hiddenColumn",
                            "targets": [6]
                        }, {
                            className: "colDeductionsPAYG hiddenColumn",
                            "targets": [7]
                        }, {
                            className: "colDeductionsSuperannuation hiddenColumn",
                            "targets": [8]
                        }, {
                            className: "colDeductionsReportableasW1 hiddenColumn",
                            "targets": [9]
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
                        $('#tblDeductions').DataTable().ajax.reload();
                    },
                    "fnDrawCallback": function (oSettings) {
                        $('.paginate_button.page-item').removeClass('disabled');
                        $('#tblDeductions_ellipsis').addClass('disabled');
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
                                var splashArrayDeductionListDupp = new Array();
                                let dataLenght = oSettings._iDisplayLength;
                                let customerSearch = $('#tblDeductions_filter input').val();
    
                                sideBarService.getDeduction(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                    for (let j = 0; j < dataObjectnew.tdeduction.length; j++) {

                                        let allowanceAmount = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tdeduction[j].fields.Amount) || 0.00;

                                        var dataListCustomerDupp = [
                                          dataObjectnewdataObjectnew.tdeduction[i].fields.ID || 0,
                                          dataObjectnew.tdeduction[i].fields.Description || '-',
                                          dataObjectnew.tdeduction[i].fields.DeductionType || '',
                                          dataObjectnew.tdeduction[i].fields.DisplayIn || '',
                                          allowanceAmount || 0.00,
                                          dataObjectnew.tdeduction[i].fields.Accountname || '',
                                          dataObjectnew.tdeduction[i].fields.Accountid || 0,
                                          dataObjectnew.tdeduction[i].fields.Payrolltaxexempt || false,
                                          dataObjectnewdataObjectnew.tdeduction[i].fields.Superinc || false,
                                          dataObjectnew.tdeduction[i].fields.Workcoverexempt || false,
                                        ];

                                        splashArrayDeductionList.push(dataListCustomerDupp);
                                    }

                                    let uniqueChars = [...new Set(splashArrayDeductionList)];
                                    var datatable = $('#tblDeductions').DataTable();
                                    datatable.clear();
                                    datatable.rows.add(uniqueChars);
                                    datatable.draw(false);
                                    setTimeout(function () {
                                        $("#tblDeductions").dataTable().fnPageChange('last');
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
                        $("<button class='btn btn-primary btnAddordinaryTimeDeductions' data-dismiss='modal' data-toggle='modal' data-target='#ordinaryTimeDeductionsModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblDeductions_filter");
                        $("<button class='btn btn-primary btnRefreshDeductions' type='button' id='btnRefreshDeductions' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblDeductions_filter");
                    }
    
                }).on('page', function () {
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
    
                }).on('column-reorder', function () {
    
                }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArrayDeductionList = [];
                    if (dataLenght == -1) {
                    $('.fullScreenSpin').css('display', 'none');
    
                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getDeduction(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TDeduction', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
    
    
    templateObject.getDeductions();

    $('.deductionLineDropDown').editableSelect();
    $('.deductionLineDropDown').editableSelect()
        .on('click.editable-select', async function (e, li) {
            let $search = $(this);
            let offset = $search.offset();
            let dropDownID = $search.attr('id')
            templateObject.currentDrpDownID.set(dropDownID);
            let searchName = e.target.value || '';
            if (e.pageX > offset.left + $search.width() - 8) { // X button 16px wide?
                $('#deductionSettingsModal').modal('show');
            } else {
                if (searchName.replace(/\s/g, '') == '') {               
                    $('#deductionSettingsModal').modal('show');
                    return false
                }
                let dataObject = await getVS1Data('TEarnings');   
                if ( dataObject.length == 0) {
                    data = await templateObject.saveDataLocalDB();
                }else{
                    data = JSON.parse(dataObject[0].data);
                }
                if( data.tdeduction.length > 0 ){
                    let tDeduction = data.tdeduction.filter((item) => {
                        if( item.fields.Description == searchName ){
                            return item;
                        }
                    });
                    $('#deductionRateForm')[0].reset();
                    $('#deductionSettingsModal').modal('hide');  
                    if( tDeduction.length > 0 ){
                        let deductionType = 'None';
                        if(tDeduction[0].fields.Taxexempt == true){
                            deductionType = 'None';
                        }else{
                            if(tDeduction[0].fields.IsWorkPlacegiving == true){
                                deductionType = 'Workplace Giving';
                            }
                            if(tDeduction[0].fields.Unionfees == true){
                                deductionType = 'Union / Association Fees';
                            }
                        }
                        $('#edtDeductionID').val(tDeduction[0].fields.ID)
                        $('#edtDeductionName').val(tDeduction[0].fields.Description)
                        $('#edtDeductionType').val(deductionType)
                        $('#edtDeductionAccount').val(tDeduction[0].fields.Accountname)
                        $('#edtDeductionAccountID').val(tDeduction[0].fields.Accountid)
                        $('#formCheck-ReducesPAYGDeduction').prop('checked', tDeduction[0].fields.Payrolltaxexempt || false)
                        $('#formCheck-ReducesSuperannuationDeduction').prop('checked', tDeduction[0].fields.Superinc || false)
                        $('#formCheck-ExcludedDeduction').prop('checked', tDeduction[0].fields.Workcoverexempt || false)
                    }
                    $('#deductionSettingsModal').modal('hide');
                    $('#noneModal').modal('show');
                }
            }
        });
    
    //On Click Deduction List
    $(document).on("click", "#tblDeductions tbody tr", function (e) {
        var table = $(this);
        let deductionName = table.find(".colDeductionsNames").text()||'';
        let deductionID = table.find(".colDeductionsID").text()||'';
        let account = table.find(".colDeductionsAccounts").text()||'';
        let searchFilterID = templateObject.currentDrpDownID.get()
        $('#' + searchFilterID).val(deductionName);
        $('#' + searchFilterID + 'ID').val(deductionID);
        if( searchFilterID == 'deductionTypeSelect'){
            $('#controlAccountDeduction').val(account)
        }
        $('#deductionSettingsModal').modal('toggle');
    });

})

Template.deductionSettings.events({
    'keyup #tblDeductions_filter input': function (event) {
        if($(event.target).val() != ''){
          $(".btnRefreshDeductions").addClass('btnSearchAlert');
        }else{
          $(".btnRefreshDeductions").removeClass('btnSearchAlert');
        }
        if (event.keyCode == 13) {
           $(".btnRefreshDeductions").trigger("click");
        }
    },
    'click .btnAddordinaryTimeDeductions':function(event){
        $('#deductionRateForm')[0].reset();
        $('#noneModal').modal('hide');
    },
    'click .btnSearchAlert':function(event){      
        let templateObject = Template.instance();
        var splashArrayDeductionList = new Array();
        const lineExtaSellItems = [];
        $('.fullScreenSpin').css('display', 'inline-block');
        let dataSearchName = $('#tblDeductions_filter input').val();
        if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getDeduction(dataSearchName).then(function (data) {
                $(".btnRefreshDeductions").removeClass('btnSearchAlert');
                let lineItems = [];
                if (data.tdeduction.length > 0) {
                    for (let j = 0; j < dataObjectnew.tdeduction.length; j++) {

                        let allowanceAmount = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tdeduction[j].fields.Amount) || 0.00;

                        var dataListCustomerDupp = [
                          dataObjectnewdataObjectnew.tdeduction[i].fields.ID || 0,
                          dataObjectnew.tdeduction[i].fields.Description || '-',
                          dataObjectnew.tdeduction[i].fields.DeductionType || '',
                          dataObjectnew.tdeduction[i].fields.DisplayIn || '',
                          allowanceAmount || 0.00,
                          dataObjectnew.tdeduction[i].fields.Accountname || '',
                          dataObjectnew.tdeduction[i].fields.Accountid || 0,
                          dataObjectnew.tdeduction[i].fields.Payrolltaxexempt || false,
                          dataObjectnewdataObjectnew.tdeduction[i].fields.Superinc || false,
                          dataObjectnew.tdeduction[i].fields.Workcoverexempt || false,
                        ];

                        splashArrayDeductionList.push(dataListCustomerDupp);
                    }
                    let uniqueChars = [...new Set(splashArrayDeductionList)];
                    var datatable = $('#tblDeductions').DataTable();
                    datatable.clear();
                    datatable.rows.add(uniqueChars);
                    datatable.draw(false);
                    setTimeout(function () {
                        $("#tblDeductions").dataTable().fnPageChange('last');
                    }, 400);

                    $('.fullScreenSpin').css('display', 'none');
    
                } else {
                    $('.fullScreenSpin').css('display', 'none');
    
                    swal({
                        title: 'Question',
                        text: "Deduction Rate does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            $('#deductionRateForm')[0].reset();
                            $('#edtDeductionName').val(dataSearchName)
                            $('#deductionSettingsModal').modal('hide');
                            $('#noneModal').modal('show');
                        }
                    });
                }
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
    
          $(".btnRefresh").trigger("click");
        }

    },
    'click .btnSaveDeduction': async function (event) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        
        const employeePayrolApis = new EmployeePayrollApi();
        // now we have to make the post request to save the data in database
        const apiEndpoint = employeePayrolApis.collection.findByName(
            employeePayrolApis.collectionNames.TDeduction
        );

        let isTaxexempt = false;
        let isIsWorkPlacegiving = false;
        let isUnionfees = false;
        let deductionType = $('#edtDeductionType').val();
        if(deductionType == 'None'){
          isTaxexempt = true;
        }else if(deductionType == 'WorkplaceGiving'){
          isIsWorkPlacegiving = true;
        }else if(deductionType == 'UnionAssociationFees'){
          isUnionfees = true;
        }
        let deductionID = $('#edtDeductionID').val();
        let deductionAccount = $('#edtDeductionAccount').val();
        let deductionAccountID = $('#edtDeductionAccountID').val();
        let ExemptPAYG = ( $('#formCheck-ReducesPAYGDeduction').is(':checked') )? true: false;
        let ExemptSuperannuation = ( $('#formCheck-ReducesSuperannuationDeduction').is(':checked') )? true: false;
        let ExemptReportable = ( $('#formCheck-ExcludedDeduction').is(':checked') )? true: false;
        /**
         * Saving Earning Object in localDB
        */
        
        let deductionRateSettings = {
            type: "TDeduction",
            fields: {
                ID: parseInt(deductionID),
                Active: true,
                Accountid: deductionAccountID,
                Accountname: deductionAccount,
                IsWorkPlacegiving:isIsWorkPlacegiving,
                Taxexempt:isTaxexempt,
                Unionfees:isUnionfees,
                Description: deductionName,
                DisplayIn: displayName,
                // Superinc: ExemptSuperannuation,
                // Workcoverexempt: ExemptReportable,
                // Payrolltaxexempt: ExemptPAYG
            }
        };

        const ApiResponse = await apiEndpoint.fetch(null, {
            method: "POST",
            headers: ApiService.getPostHeaders(),
            body: JSON.stringify(deductionRateSettings),
        });
    
        if (ApiResponse.ok == true) {
            const jsonResponse = await ApiResponse.json();
            $('#deductionRateForm')[0].reset();
            await templateObject.saveDataLocalDB();
            await templateObject.getDeductions();
            $('#noneModal').modal('hide');
            $('.fullScreenSpin').css('display', 'none');
        }else{
            $('.fullScreenSpin').css('display', 'none');
        }
        
        
    },
});

Template.deductionSettings.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get();
    }
});

