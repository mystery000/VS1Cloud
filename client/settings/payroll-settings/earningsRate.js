import {TaxRateService} from "../settings-service";
import {ReactiveVar} from 'meteor/reactive-var';
import {CountryService} from '../../js/country-service';
import {SideBarService} from '../../js/sidebar-service';
import { UtilityService } from "../../utility-service";
import { AccountService } from "../../accounts/account-service";
import { RateTypeService } from '../../js/ratetype_service';
import { Earning, EarningFields } from '../../js/Api/Model/Earning'
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
        let dataObject = await getVS1Data('TEarnings')
        if (dataObject.length == 0) {
            let data = sideBarService.getEarnings(initialBaseDataLoad, 0)
            addVS1Data('TEarnings', JSON.stringify(data));
            console.log('data', data)
            let lineItems = [];
            let lineItemObj = {};
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
                    data.tearnings[i].fields.EarningsReportableW1onActivityStatement || '',                
                ];
                dataTableList.push(dataList);
                templateObject.datatablerecords.set(dataTableList);
            }
            if (templateObject.datatablerecords.get()) {

                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblEarnings', function (error, result) {
                    if (error) {}
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

                setTimeout(function () {
                    MakeNegative();
                }, 100);
            }
            $('.fullScreenSpin').css('display', 'none');
            setTimeout(function () {
                $('#tblEarnings').DataTable({
                    columnDefs: [{
                            type: 'date',
                            targets: 0
                        }
                    ],
                    "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
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
                        $('#tblEarnings').DataTable().ajax.reload();
                    },
                    "fnDrawCallback": function (oSettings) {
                        let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                        $('.paginate_button.page-item').removeClass('disabled');
                        $('#tblEarnings_ellipsis').addClass('disabled');

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
                            if(checkurlIgnoreDate == 'true'){
                            sideBarService.getEarnings( initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                getVS1Data('TEarnings').then(function (dataObjectold) {
                                if(dataObjectold.length == 0){

                                }else{
                                    let dataOld = JSON.parse(dataObjectold[0].data);

                                    var thirdaryData = $.merge($.merge([], dataObjectnew.tinvoicelist), dataOld.tinvoicelist);
                                    let objCombineData = {
                                        Params: dataOld.Params,
                                        tinvoicelist:thirdaryData
                                    }

                                    addVS1Data('TEarnings',JSON.stringify(objCombineData)).then(function (datareturn) {
                                        templateObject.resetData(objCombineData);
                                    $('.fullScreenSpin').css('display','none');
                                    }).catch(function (err) {
                                    $('.fullScreenSpin').css('display','none');
                                    });

                                }
                                }).catch(function (err) {

                                });

                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display','none');
                            });
                            }else{
                            sideBarService.getEarnings(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                            getVS1Data('TEarnings').then(function (dataObjectold) {
                                if(dataObjectold.length == 0){

                                }else{
                                let dataOld = JSON.parse(dataObjectold[0].data);

                                var thirdaryData = $.merge($.merge([], dataObjectnew.tinvoicelist), dataOld.tinvoicelist);
                                let objCombineData = {
                                    Params: dataOld.Params,
                                    tinvoicelist:thirdaryData
                                }

                                addVS1Data('TEarnings',JSON.stringify(objCombineData)).then(function (datareturn) {
                                templateObject.resetData(objCombineData);
                                    $('.fullScreenSpin').css('display','none');
                                }).catch(function (err) {
                                    $('.fullScreenSpin').css('display','none');
                                });

                                }
                            }).catch(function (err) {

                            });

                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display','none');
                            });
                        }
                        });

                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    },
                    "fnInitComplete": function () {
                        let urlParametersPage = FlowRouter.current().queryParams.page;
                        if (urlParametersPage || FlowRouter.current().queryParams.ignoredate) {
                            this.fnPageChange('last');
                        }
                        $("<button class='btn btn-primary btnRefreshEarningsList' type='button' id='btnRefreshEarningsList' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblEarnings_filter");
                        $('.myvarFilterForm').appendTo(".colDateFilter");
                    },
                    "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                        let countTableData = data.Params.Count || 0; //get count from API data

                        return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
                    }

                }).on('page', function () {
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                    let draftRecord = templateObject.datatablerecords.get();
                    templateObject.datatablerecords.set(draftRecord);
                }).on('column-reorder', function () {}).on('length.dt', function (e, settings, len) {
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                });
                $('.fullScreenSpin').css('display', 'none');

            }, 0);
        }else{
            console.log('dataObject', dataObject)
        }
    } catch (error) {
        console.log( error );
    }
    return false
    getVS1Data('TEarningRates').then(function(dataObject) {
    if (dataObject.length == 0) {
         sideBarService.getOrdinarytimeEarning(initialBaseDataLoad, 0).then(function (data) {
          addVS1Data('TOrdinaryTimeEarnings', JSON.stringify(data));
          let lineItems = [];
          let lineItemObj = {};
          for (let i = 0; i < data.tordinarytimeearnings.length; i++) {
            
            var dataListAllowance = [
                data.tordinarytimeearnings[i].fields.ID || '',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsName || '',
                'Ordinary Time Earning',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsDisplayName || '',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsRateType||'',
                '100',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptPaygWithholding || '',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptSuperannuationGuaranteeCont || '',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsReportableW1onActivityStatement || '',
             
               '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
               ];

              splashArrayEarningList.push(dataListAllowance);
          }

    


          setTimeout(function () {
              MakeNegative();
          }, 100);
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
                        className: "colEarningsratetype",
                        "targets": [4]
                      },  
                     {
                      className: "colEarningsAmount",
                      "targets": [5]
                     },  
                     {
                      className: "colEarningsAccounts",
                      "targets": [6]
                     },  
                     {
                      className: "colEarningsAccountsID hiddenColumn",
                      "targets": [7]
                     },   
                     {
                      className: "colEarningsPAYG hiddenColumn"  ,
                      "targets": [8]
                     },  
                     {
                      className: "colEarningsSuperannuation hiddenColumn",
                      "targets": [9]
                     },  
                     {
                      className: "colEarningsReportableasW1 hiddenColumn",
                      "targets": [10]
                     },                   
                     {
                        className: "colDeleteEarnings",
                        "orderable": false,
                        "targets": -1
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

                              sideBarService.getOrdinarytimeEarning(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {

                                for (let i = 0; i < data.tordinarytimeearnings.length; i++) {
            
                                    var dataListAllowance = [
                                        data.tordinarytimeearnings[i].fields.ID || '',
                                        data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsName || '',
                                        'Ordinary Time Earning',
                                        data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsDisplayName || '',
                                        data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsRateType||'',
                                        '100',
                                        data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
                                        data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptPaygWithholding || '',
                                        data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
                                        data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptSuperannuationGuaranteeCont || '',
                                        data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsReportableW1onActivityStatement || '',
                                     
                                       '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                    ];
                                    splashArrayEarningList.push(dataListAllowance);
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
                splashArrayReisument = [];
                if (dataLenght == -1) {
                  $('.fullScreenSpin').css('display', 'none');

                } else {
                    if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                        $('.fullScreenSpin').css('display', 'none');
                    } else {
                        sideBarService.getOrdinarytimeEarning(dataLenght, 0).then(function (dataNonBo) {

                            addVS1Data('TOrdinaryTimeEarnings', JSON.stringify(dataNonBo)).then(function (datareturn) {
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

          $('div.dataTables_filter input').addClass('form-control form-control-sm');

          $('.fullScreenSpin').css('display', 'none');
         }).catch(function (err) {
         $('.fullScreenSpin').css('display', 'none');
         });
    }else{

      let data = JSON.parse(dataObject[0].data);

      let useData = data;
      let lineItems = [];
      let lineItemObj = {};
      for (let i = 0; i < data.Tordinarytimeearnings.length; i++) {
           
        var dataListAllowance = [
            data.tordinarytimeearnings[i].fields.ID || '',
            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsName || '',
            'Ordinary Time Earning',
            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsDisplayName || '',
            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsRateType||'',
            '100',
            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptPaygWithholding || '',
            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptSuperannuationGuaranteeCont || '',
            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsReportableW1onActivityStatement || '',
         
           '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
        ];

        splashArrayEarningList.push(dataListAllowance);
    }



      setTimeout(function () {
          MakeNegative();
      }, 100);
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
                    className: "colEarningsratetype",
                    "targets": [4]
                  },  
                 {
                  className: "colEarningsAmount",
                  "targets": [5]
                 },  
                 {
                  className: "colEarningsAccounts",
                  "targets": [6]
                 },  
                 {
                  className: "colEarningsAccountsID hiddenColumn",
                  "targets": [7]
                 },   
                 {
                  className: "colEarningsPAYG hiddenColumn"  ,
                  "targets": [8]
                 },  
                 {
                  className: "colEarningsSuperannuation hiddenColumn",
                  "targets": [9]
                 },  
                 {
                  className: "colEarningsReportableasW1 hiddenColumn",
                  "targets": [10]
                 },                   
                 {
                    className: "colDeleteEarnings",
                    "orderable": false,
                    "targets": -1
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

                          sideBarService.getOrdinarytimeEarning(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {

                            for (let i = 0; i < data.tordinarytimeearnings.length; i++) {
            
                                var dataListAllowance = [
                                    data.tordinarytimeearnings[i].fields.ID || '',
                                    data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsName || '',
                                    'Ordinary Time Earning',
                                    data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsDisplayName || '',
                                    data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsRateType||'',
                                    '100',
                                    data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
                                    data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptPaygWithholding || '',
                                    data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
                                    data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptSuperannuationGuaranteeCont || '',
                                    data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsReportableW1onActivityStatement || '',
                                 
                                   '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                ];
              
                                splashArrayEarningList.push(dataListAllowance);
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
                    sideBarService.getOrdinarytimeEarning(dataLenght, 0).then(function (dataNonBo) {

                        addVS1Data('TOrdinaryTimeEarnings', JSON.stringify(dataNonBo)).then(function (datareturn) {
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

      $('div.dataTables_filter input').addClass('form-control form-control-sm');
      $('.fullScreenSpin').css('display', 'none');

    }
    }).catch(function(err) {

     
       sideBarService.getOrdinarytimeEarning(initialBaseDataLoad, 0).then(function (data) {
         addVS1Data('TOrdinaryTimeEarnings', JSON.stringify(data));
           let lineItems = [];
           let lineItemObj = {};
          
          for (let i = 0; i < data.tordinarytimeearnings.length; i++) {
                 
            var dataListAllowance = [
                data.tordinarytimeearnings[i].fields.ID || '',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsName || '',
                'Ordinary Time Earning',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsDisplayName || '',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsRateType||'',
                '100',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptPaygWithholding || '',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptSuperannuationGuaranteeCont || '',
                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsReportableW1onActivityStatement || '',
             
               '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
            ];
                 
             
                  splashArrayEarningList.push(dataListAllowance);
               }

        
  
          

            setTimeout(function () {
                MakeNegative();
            }, 100);
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
                            className: "colEarningsratetype",
                            "targets": [4]
                          },  
                         {
                          className: "colEarningsAmount",
                          "targets": [5]
                         },  
                         {
                          className: "colEarningsAccounts",
                          "targets": [6]
                         },  
                         {
                          className: "colEarningsAccountsID hiddenColumn",
                          "targets": [7]
                         },   
                         {
                          className: "colEarningsPAYG hiddenColumn"  ,
                          "targets": [8]
                         },  
                         {
                          className: "colEarningsSuperannuation hiddenColumn",
                          "targets": [9]
                         },  
                         {
                          className: "colEarningsReportableasW1 hiddenColumn",
                          "targets": [10]
                         },                   
                         {
                            className: "colDeleteEarnings",
                            "orderable": false,
                            "targets": -1
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
                                var splashArrayReisumentDupp = new Array();
                                let dataLenght = oSettings._iDisplayLength;
                                let customerSearch = $('#tblEarnings_filter input').val();
    
                                sideBarService.getOrdinarytimeEarning(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                    for (let i = 0; i < data.tordinarytimeearnings.length; i++) {
                    
                                        var dataListAllowance = [
                                            data.tordinarytimeearnings[i].fields.ID || '',
                                            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsName || '',
                                            'Ordinary Time Earning',
                                            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsDisplayName || '',
                                            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsRateType||'',
                                            '100',
                                            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
                                            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptPaygWithholding || '',
                                            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || '',
                                            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptSuperannuationGuaranteeCont || '',
                                            data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsReportableW1onActivityStatement || '',
                                         
                                           '<td contenteditable="false" class="colDeleteEarnings"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                        ];
                    
                                        splashArrayEarningList.push(dataListAllowance);
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
                            sideBarService.getOrdinarytimeEarning(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TOrdinaryTimeEarnings', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
    
            $('div.dataTables_filter input').addClass('form-control form-control-sm');
    
            $('.fullScreenSpin').css('display', 'none');
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
            });
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
            console.log('step 2')
            $('#earningRateSettingsModal').modal('show');
        }
    });
});


Template.earningRateSettings.events({
    'click .saveEarningRates': function (event) {
        let EarningsName = $('#edtEarningsName').val();
        let EarningsType = $('#edtEarningsType').val();
        let EarningsDisplayName = $('#edtDisplayName').val();
        let EarningsRateType = $('#edtRateType').val();
        let ExpenseAccount = $('#edtExpenseAccount').val();
        let ExemptPAYG = ( $('#formCheck-ExemptPAYG').is(':checked') )? true: false;
        let ExemptSuperannuation = ( $('#formCheck-ExemptSuperannuation').is(':checked') )? true: false;
        let ExemptReportable = ( $('#formCheck-ExemptReportable').is(':checked') )? true: false;


        let dataObject = await getVS1Data('TEarnings')
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let useData = [];
        let earningSettings = await getVS1Data('TEarnings');
        if( earningSettings.length ){
            TearningSettings = JSON.parse(earningSettings[0].data);
            useData = EmployeePaySettings.fromList(
                TearningSettings.tearnings
            ).filter((item) => {
                if ( item.fields.Employeeid !== parseInt(employeeID) ) {
                    return item;
                }
            });
        }

        let TaxFileNumber = $("#edtTaxFileNumber").val();
        let TFNExemption = $("#edtTfnExemption").val();
        let EmploymentBasis = $("#edtEmploymentBasis").val();
        let ResidencyStatus = $("#edtResidencyStatus").val();
        let TaxFreeThreshold = $("#taxesTaxFreeThresholdClaimed").is(':checked') ? true : false;
        let StudyTrainingSupportLoan = $("#taxesStudyTrainingSupportLoans").is(':checked') ? true : false;
        let EligibleToReceiveLeaveLoading = $("#taxesEligibleReceiveLeaveLoading").is(':checked') ? true : false;
        let OtherTaxOffsetClaimed = $("#taxesOtherTaxOffsetClaimed").is(':checked') ? true : false;
        let UpwardvariationRequested = $("#taxesUpwardVariationRequested").is(':checked') ? true : false;
        let SeniorandPensionersTaxOffsetClaimed = $("#taxesSeniorPensionersTaxOffsetClaimed").is(':checked') ? true : false;
        let HasApprovedWithholdingVariation = $("#taxesHasApprovedWithholdingVariation").is(':checked') ? true : false;

        employeePaySettings.fields.Employee.fields.TFN = TaxFileNumber;
        employeePaySettings.fields.Employee.fields.TaxFreeThreshold = TaxFreeThreshold;
        employeePaySettings.fields.Employee.fields.TFNExemption = TFNExemption;
        employeePaySettings.fields.Employee.fields.EmploymentBasis = EmploymentBasis;
        employeePaySettings.fields.Employee.fields.ResidencyStatus = ResidencyStatus;
        employeePaySettings.fields.Employee.fields.StudyTrainingSupportLoan = StudyTrainingSupportLoan;
        employeePaySettings.fields.Employee.fields.EligibleToReceiveLeaveLoading = EligibleToReceiveLeaveLoading;
        employeePaySettings.fields.Employee.fields.OtherTaxOffsetClaimed = OtherTaxOffsetClaimed;
        employeePaySettings.fields.Employee.fields.UpwardvariationRequested = UpwardvariationRequested;
        employeePaySettings.fields.Employee.fields.SeniorandPensionersTaxOffsetClaimed = SeniorandPensionersTaxOffsetClaimed;
        employeePaySettings.fields.Employee.fields.HasApprovedWithholdingVariation = HasApprovedWithholdingVariation;

        useData.push(employeePaySettings);

        /**
         * Saving employeePaySettings Object in localDB
        */

        listEmployeePaySettings.temployeepaysettings = useData;
        await addVS1Data('TEmployeepaysettings', JSON.stringify(listEmployeePaySettings));

        earnings.push(
            new Earning({
                type: 'TEarnings',
                fields: new EarningFields({
                    ID: 0,
                    EarningsName: EarningsName,
                    EarningsType: EarningsType,
                    EarningsDisplayName: EarningsDisplayName,
                    EarningsRateType: EarningsRateType,
                    ExpenseAccount: ExpenseAccount,
                    ExemptPAYG: ExemptPAYG,
                    ExemptSuperannuation: ExemptSuperannuation,
                    ExemptReportable: ExemptReportable,
                })
            })
        )
    },
});

Template.earningRateSettings.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get();
    }
});

// 