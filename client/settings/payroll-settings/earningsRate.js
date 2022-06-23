import {TaxRateService} from "../settings-service";
import {ReactiveVar} from 'meteor/reactive-var';
import {CountryService} from '../../js/country-service';
import {SideBarService} from '../../js/sidebar-service';
import { UtilityService } from "../../utility-service";
import { AccountService } from "../../accounts/account-service";
import { RateTypeService } from '../../js/ratetype_service';
import Earning from '../../js/Api/Model/Earning'
import EarningFields from '../../js/Api/Model/EarningFields'
import '../../lib/global/indexdbstorage.js';
import 'jquery-editable-select';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.earningRateSettings.onCreated(function() {
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

Template.earningRateSettings.onRendered(function() {

  const templateObject = Template.instance();
  const dataTableList = [];
  var splashArrayEarningList = new Array();

  function MakeNegative() {
    $('td').each(function() {
        if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
    });
  };

templateObject.getEarnings = async function(){
    try {
        let data = {};
        let dataObject = await getVS1Data('TEarnings')   
        if ( dataObject.length == 0) {
            data = sideBarService.getEarnings(initialBaseDataLoad, 0)
            addVS1Data('TEarnings', JSON.stringify(data));
        }else{
            data = JSON.parse(dataObject[0].data);
        }
        if( data.tearnings.length > 0 ){
            for (let i = 0; i < data.tearnings.length; i++) {            
                let dataList = [
                    data.tearnings[i].fields.ID || '',
                    data.tearnings[i].fields.EarningsName || '',
                    data.tearnings[i].fields.EarningType || '',
                    data.tearnings[i].fields.EarningsDisplayName || '',
                    data.tearnings[i].fields.EarningsRateType||'',
                    data.tearnings[i].fields.ExpenseAccount || '',
                    data.tearnings[i].fields.EarningsExemptPaygWithholding || '',
                    data.tearnings[i].fields.EarningsExemptSuperannuationGuaranteeCont || '',
                    data.tearnings[i].fields.EarningsReportableW1onActivityStatement || ''
                ];    
                splashArrayEarningList.push(dataList);
            }
            templateObject.datatablerecords.set(splashArrayEarningList);
            $('.fullScreenSpin').css('display', 'none');
            setTimeout(function () {
                $('#tblEarnings').DataTable({  
                    data: splashArrayEarningList,
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    columnDefs: [                              
                      
                      {
                         className: "colEarningsID hiddenColumn",
                         "targets": [0]
                       },
                       {
                          className: "colEarningsNames",
                          "targets": [1]
                       },  
                       {
                          className: "colEarningsType",
                          "targets": [2]
                       },      
                       {
                        className: "colEarningsDisplayName",
                        "targets": [3]
                       }, 
                       {
                        className: "colEarningsAccounts",
                        "targets": [4]
                       },   
                       {
                        className: "colEarningsRateType",
                        "targets": [5]
                       },
                       {
                        className: "colEarningsPAYG hiddenColumn"  ,
                        "targets": [6]
                       },  
                       {
                        className: "colEarningsSuperannuation hiddenColumn",
                        "targets": [7]
                       },  
                       {
                        className: "colEarningsReportableasW1 hiddenColumn",
                        "targets": [8]
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
                        $('#tblEarnings').DataTable().ajax.reload();
                    },
                    "fnDrawCallback": function (oSettings) {
                        $('.paginate_button.page-item').removeClass('disabled');
                        $('#tblEarnings_ellipsis').addClass('disabled');
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
                                var splashArrayEarningListDupp = new Array();
                                let dataLenght = oSettings._iDisplayLength;
                                let customerSearch = $('#tblEarnings_filter input').val();
  
                                sideBarService.getEarnings(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
  
                                    for (let i = 0; i < data.tearnings.length; i++) {              
                                      var dataList = [
                                        data.tearnings[i].fields.ID || '',
                                        data.tearnings[i].fields.EarningsName || '',
                                        data.tearnings[i].fields.EarningType || '',
                                        data.tearnings[i].fields.EarningsDisplayName || '',
                                        data.tearnings[i].fields.EarningsRateType||'',
                                        data.tearnings[i].fields.ExpenseAccount || '',
                                        data.tearnings[i].fields.EarningsExemptPaygWithholding || '',
                                        data.tearnings[i].fields.EarningsExemptSuperannuationGuaranteeCont || '',
                                        data.tearnings[i].fields.EarningsReportableW1onActivityStatement || ''
                                      ];
                                      splashArrayEarningList.push(dataList);
                                    }
                                    let uniqueChars = [...new Set(splashArrayEarningList)];
                                    var datatable = $('#tblEarnings').DataTable();
                                    datatable.clear();
                                    datatable.rows.add(uniqueChars);
                                    datatable.draw(false);
                                    setTimeout(function () {
                                        $("#tblEarnings").dataTable().fnPageChange('last');
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
                        $("<button class='btn btn-primary btnAddordinaryTimeEarnings' data-dismiss='modal' data-toggle='modal' data-target='#ordinaryTimeEarningsModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblEarnings_filter");
                        $("<button class='btn btn-primary btnRefreshEarnings' type='button' id='btnRefreshEarnings' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblEarnings_filter");
  
                    }
  
                }).on('page', function () {
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
  
                }).on('column-reorder', function () {
  
                }).on('length.dt', function (e, settings, len) {
                  //$('.fullScreenSpin').css('display', 'inline-block');
                  let dataLenght = settings._iDisplayLength;
                  splashArrayEarningList = [];
                  if (dataLenght == -1) {
                    $('.fullScreenSpin').css('display', 'none');
  
                  } else {
                      if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                          $('.fullScreenSpin').css('display', 'none');
                      } else {
                          sideBarService.getEarnings(dataLenght, 0).then(function (dataNonBo) {
  
                              addVS1Data('TEarnings', JSON.stringify(dataNonBo)).then(function (datareturn) {
                                  templateObject.resetData(dataNonBo);
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
        }else{
            $('.fullScreenSpin').css('display', 'none');
        }
    } catch (error) {
        $('.fullScreenSpin').css('display', 'none');
    }
};
templateObject.getEarnings();

    // Standard drop down
    $('.earningLineDropDown').editableSelect();
    $('.earningLineDropDown').editableSelect().on('click.editable-select', function (e, li) {
        let $search = $(this);
        let offset = $search.offset();
        let dropDownID = $search.attr('id')
        templateObject.currentDrpDownID.set(dropDownID);
        let currencyDataName = e.target.value || '';
        if (e.pageX > offset.left + $search.width() - 8) { // X button 16px wide?
            $('#earningRateSettingsModal').modal('show');
            console.log('step 1')
        } else {
            // if (currencyDataName.replace(/\s/g, '') != '') {
            //     console.log('step 2')
            // }
            // console.log('step 2')
            $('#earningRateSettingsModal').modal('show');
        }
    });

    $(document).on("click", "#tblEarnings tbody tr", function (e) {
        var table = $(this);
        let earningRateID = templateObject.currentDrpDownID.get();
        let earningRate = table.find(".colEarningsNames").text()||'';
        $('#' + earningRateID).val(earningRate);
        $('#earningRateSettingsModal').modal('toggle');

    });

});


Template.earningRateSettings.events({
    'keyup #tblEarnings_filter input': function (event) {
        if($(event.target).val() != ''){
          $(".btnRefreshEarnings").addClass('btnSearchAlert');
        }else{
          $(".btnRefreshEarnings").removeClass('btnSearchAlert');
        }
        if (event.keyCode == 13) {
           $(".btnRefreshEarnings").trigger("click");
        }
    },
    'click .btnRefreshEarnings':function(event){      
        let templateObject = Template.instance();
        var splashArrayEarningList = new Array();
        const lineExtaSellItems = [];
        $('.fullScreenSpin').css('display', 'inline-block');
        let dataSearchName = $('#tblEarnings_filter input').val();
        if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getEarnings(dataSearchName).then(function (data) {
                $(".btnRefreshEarnings").removeClass('btnSearchAlert');
                let lineItems = [];
                if (data.tearnings.length > 0) {
                    for (let i = 0; i < data.tearnings.length; i++) {              
                        let dataList = [
                          data.tearnings[i].fields.ID || '',
                          data.tearnings[i].fields.EarningsName || '',
                          data.tearnings[i].fields.EarningType || '',
                          data.tearnings[i].fields.EarningsDisplayName || '',
                          data.tearnings[i].fields.EarningsRateType||'',
                          data.tearnings[i].fields.ExpenseAccount || '',
                          data.tearnings[i].fields.EarningsExemptPaygWithholding || '',
                          data.tearnings[i].fields.EarningsExemptSuperannuationGuaranteeCont || '',
                          data.tearnings[i].fields.EarningsReportableW1onActivityStatement || ''
                        ];
                        splashArrayEarningList.push(dataList);
                    }
                    let uniqueChars = [...new Set(splashArrayEarningList)];
                    var datatable = $('#tblEarnings').DataTable();
                    datatable.clear();
                    datatable.rows.add(uniqueChars);
                    datatable.draw(false);
                    setTimeout(function () {
                        $("#tblEarnings").dataTable().fnPageChange('last');
                    }, 400);

                    $('.fullScreenSpin').css('display', 'none');
    
                } else {
                    $('.fullScreenSpin').css('display', 'none');
    
                    swal({
                        title: 'Question',
                        text: "Earning Rate does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            // FlowRouter.go('/payrollrules');
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
    'click .saveEarningRates': async function (event) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        let useData = [];
        let earningSettings = await getVS1Data('TEarnings');
        if( earningSettings.length ){
            let TearningSettings = JSON.parse(earningSettings[0].data);
            useData = Earning.fromList(
                TearningSettings.tearnings
            )
        }

        let EarningsName = $('#edtEarningsName').val();
        let EarningsType = $('#edtEarningsType').val();
        let EarningsDisplayName = $('#edtDisplayName').val();
        let EarningsRateType = $('#edtRateType').val();
        let ExpenseAccount = $('#edtExpenseAccount').val();
        let ExemptPAYG = ( $('#formCheck-ExemptPAYG').is(':checked') )? true: false;
        let ExemptSuperannuation = ( $('#formCheck-ExemptSuperannuation').is(':checked') )? true: false;
        let ExemptReportable = ( $('#formCheck-ExemptReportable').is(':checked') )? true: false;
        /**
         * Saving Earning Object in localDB
        */
        useData.push(
            new Earning({
                type: 'TEarnings',
                fields: new EarningFields({
                    ID: 0,
                    EarningsName: EarningsName,
                    EarningType: EarningsType,
                    EarningsDisplayName: EarningsDisplayName,
                    EarningsRateType: EarningsRateType,
                    ExpenseAccount: ExpenseAccount,
                    EarningsExemptPaygWithholding: ExemptPAYG,
                    EarningsExemptSuperannuationGuaranteeCont: ExemptSuperannuation,
                    EarningsReportableW1onActivityStatement: ExemptReportable,
                    Active: true
                })
            })
        )
        let earningRateSettings = {
            tearnings: useData
        }
        await addVS1Data('TEarnings', JSON.stringify(earningRateSettings));
        templateObject.getEarnings()
        $('#ordinaryTimeEarningsModal').modal('hide');
        $('.fullScreenSpin').css('display', 'none');
    },
});

Template.earningRateSettings.helpers({
    datatablerecords: () => {
        console.log('i am testing')
        return Template.instance().datatablerecords.get();
    }
});

//
