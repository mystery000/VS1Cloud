import {TaxRateService} from "../settings-service";
import {ReactiveVar} from 'meteor/reactive-var';
import {CountryService} from '../../js/country-service';
import {SideBarService} from '../../js/sidebar-service';
import { UtilityService } from "../../utility-service";
import { AccountService } from "../../accounts/account-service";
import { RateTypeService } from '../../js/ratetype_service';
import '../../lib/global/indexdbstorage.js';
import 'jquery-editable-select';
import { Random } from 'meteor/random';
import { Session } from 'meteor/session';
import f from "jspdf";

let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.payrollrules.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.datatableallowancerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.countryData = new ReactiveVar();
    templateObject.Ratetypes = new ReactiveVar([]);
    templateObject.imageFileData=new ReactiveVar();
   // templateObject.Accounts = new ReactiveVar([]);   
});

Template.payrollrules.onRendered(function() {
   
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];
    var splashArrayAllowanceList = new Array();
    var splashArrayDeductionList = new Array();
    var splashArrayLeaveList = new Array();
    var splashArrayUnLeaveList = new Array();
    var splashArrayCalenderList = new Array();
    var splashArrayReisument = new Array();
    var splashArraySuperannuationList = new Array();
    var splashArrayHolidayList = new Array();
    var splashArrayEarningList = new Array();
    var countryService = new CountryService();
    let countries = [];

    $("#date-input,#edtStartDate,#edtFirstPaymentDate,#edtHolidayDate").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/imgCal2.png',
        dateFormat: 'dd/mm/yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
    });

    function MakeNegative() {
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    templateObject.resetData = function (dataVal) {
        location.reload();
    }
     
    templateObject.getAllAllowance = function() {
    getVS1Data('TAllowance').then(function(dataObject) {
        if (dataObject.length == 0) {
          sideBarService.getAllowance(initialBaseDataLoad, 0).then(function (data) {
              addVS1Data('TAllowance', JSON.stringify(data));
              let lineItems = [];
              let lineItemObj = {};
              for (let i = 0; i < data.tallowance.length; i++) {
                  let allowanceAmount = utilityService.modifynegativeCurrencyFormat(data.tallowance[i].fields.Amount) || 0.00;

                  var dataListAllowance = [
                      data.tallowance[i].fields.ID || 0,
                      data.tallowance[i].fields.Description || '-',
                      data.tallowance[i].fields.AllowanceType || '',
                      data.tallowance[i].fields.DisplayIn || '',
                      allowanceAmount || 0.00,
                      data.tallowance[i].fields.Accountname || '',
                      data.tallowance[i].fields.Accountid || 0,
                      data.tallowance[i].fields.Payrolltaxexempt || false,
                      data.tallowance[i].fields.Superinc || false,
                      data.tallowance[i].fields.Workcoverexempt || false,
                      '<td contenteditable="false" class="colDeleteAllowances"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                  ];

                  splashArrayAllowanceList.push(dataListAllowance);
              }

              function MakeNegative() {
                  $('td').each(function () {
                      if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
                  });
              };


              setTimeout(function () {
                  MakeNegative();
              }, 100);
              setTimeout(function () {
                  $('#tblAlowances').DataTable({

                      data: splashArrayAllowanceList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      columnDefs: [
                          {
                              className: "colAlowancesID hiddenColumn",
                              "targets": [0]
                          },
                          {
                              className: "colAllowancesNames",
                              "targets": [1]
                          },  {
                              className: "colAllowancesType",
                              "targets": [2]
                          }, {
                              className: "colAllowancesDisplayName",
                              "targets": [3]
                          }, {
                              className: "colAllowancesAmount  text-right",
                              "targets": [4]
                          }, {
                              className: "colAllowancesAccounts",
                              "targets": [5]
                          }, {
                              className: "colAllowancesAccountsID hiddenColumn",
                              "targets": [6]
                          }, {
                              className: "colAllowancesPAYG hiddenColumn",
                              "targets": [7]
                          }, {
                              className: "colAllowancesSuperannuation hiddenColumn",
                              "targets": [8]
                          }, {
                              className: "colAllowancesReportableasW1 hiddenColumn",
                              "targets": [9]
                          }, {
                              className: "colDeleteAllowances",
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
                          $('#tblAlowances').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblAlowances_ellipsis').addClass('disabled');
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
                                  var splashArrayAllowanceListDupp = new Array();
                                  let dataLenght = oSettings._iDisplayLength;
                                  let customerSearch = $('#tblAlowances_filter input').val();

                                  sideBarService.getAllowance(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                              for (let j = 0; j < dataObjectnew.tallowance.length; j++) {

                                                  let allowanceAmount = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tallowance[j].fields.Amount) || 0.00;

                                                  var dataListCustomerDupp = [
                                                    dataObjectnewdataObjectnew.tallowance[i].fields.ID || 0,
                                                    dataObjectnew.tallowance[i].fields.Description || '-',
                                                    dataObjectnew.tallowance[i].fields.AllowanceType || '',
                                                    dataObjectnew.tallowance[i].fields.DisplayIn || '',
                                                    allowanceAmount || 0.00,
                                                    dataObjectnew.tallowance[i].fields.Accountname || '',
                                                    dataObjectnew.tallowance[i].fields.Accountid || 0,
                                                    dataObjectnew.tallowance[i].fields.Payrolltaxexempt || false,
                                                    dataObjectnewdataObjectnew.tallowance[i].fields.Superinc || false,
                                                    dataObjectnew.tallowance[i].fields.Workcoverexempt || false,
                                                    '<td contenteditable="false" class="colDeleteAllowances"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                                  ];

                                                  splashArrayAllowanceList.push(dataListCustomerDupp);
                                                  //}
                                              }

                                              let uniqueChars = [...new Set(splashArrayAllowanceList)];
                                              var datatable = $('#tblAlowances').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblAlowances").dataTable().fnPageChange('last');
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
                          $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#allowanceModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblAlowances_filter");
                          $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblAlowances_filter");

                      }

                  }).on('page', function () {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);

                  }).on('column-reorder', function () {

                  }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArrayAllowanceList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');

                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getAllowance(dataLenght, 0).then(function (dataNonBo) {

                                addVS1Data('TAllowance', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
          for (let i = 0; i < data.tallowance.length; i++) {
              let allowanceAmount = utilityService.modifynegativeCurrencyFormat(data.tallowance[i].fields.Amount) || 0.00;

              var dataListAllowance = [
                  data.tallowance[i].fields.ID || 0,
                  data.tallowance[i].fields.Description || '-',
                  data.tallowance[i].fields.AllowanceType || '',
                  data.tallowance[i].fields.DisplayIn || '',
                  allowanceAmount || 0.00,
                  data.tallowance[i].fields.Accountname || '',
                  data.tallowance[i].fields.Accountid || 0,
                  data.tallowance[i].fields.Payrolltaxexempt || false,
                  data.tallowance[i].fields.Superinc || false,
                  data.tallowance[i].fields.Workcoverexempt || false,
                  '<td contenteditable="false" class="colDeleteAllowances"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
              ];

              splashArrayAllowanceList.push(dataListAllowance);
          }

          function MakeNegative() {
              $('td').each(function () {
                  if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
              });
          };


          setTimeout(function () {
              MakeNegative();
          }, 100);
          setTimeout(function () {
              $('#tblAlowances').DataTable({

                  data: splashArrayAllowanceList,
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  columnDefs: [
                      {
                          className: "colAlowancesID hiddenColumn",
                          "targets": [0]
                      },
                      {
                          className: "colAllowancesNames",
                          "targets": [1]
                      },  {
                          className: "colAllowancesType",
                          "targets": [2]
                      }, {
                          className: "colAllowancesDisplayName",
                          "targets": [3]
                      }, {
                          className: "colAllowancesAmount  text-right",
                          "targets": [4]
                      }, {
                          className: "colAllowancesAccounts",
                          "targets": [5]
                      }, {
                          className: "colAllowancesAccountsID hiddenColumn",
                          "targets": [6]
                      }, {
                          className: "colAllowancesPAYG hiddenColumn",
                          "targets": [7]
                      }, {
                          className: "colAllowancesSuperannuation hiddenColumn",
                          "targets": [8]
                      }, {
                          className: "colAllowancesReportableasW1 hiddenColumn",
                          "targets": [9]
                      }, {
                          className: "colDeleteAllowances",
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
                      $('#tblAlowances').DataTable().ajax.reload();
                  },
                  "fnDrawCallback": function (oSettings) {
                      $('.paginate_button.page-item').removeClass('disabled');
                      $('#tblAlowances_ellipsis').addClass('disabled');
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
                              var splashArrayAllowanceListDupp = new Array();
                              let dataLenght = oSettings._iDisplayLength;
                              let customerSearch = $('#tblAlowances_filter input').val();

                              sideBarService.getAllowance(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                          for (let j = 0; j < dataObjectnew.tallowance.length; j++) {

                                              let allowanceAmount = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tallowance[j].fields.Amount) || 0.00;

                                              var dataListCustomerDupp = [
                                                dataObjectnewdataObjectnew.tallowance[i].fields.ID || 0,
                                                dataObjectnew.tallowance[i].fields.Description || '-',
                                                dataObjectnew.tallowance[i].fields.AllowanceType || '',
                                                dataObjectnew.tallowance[i].fields.DisplayIn || '',
                                                allowanceAmount || 0.00,
                                                dataObjectnew.tallowance[i].fields.Accountname || '',
                                                dataObjectnew.tallowance[i].fields.Accountid || 0,
                                                dataObjectnew.tallowance[i].fields.Payrolltaxexempt || false,
                                                dataObjectnewdataObjectnew.tallowance[i].fields.Superinc || false,
                                                dataObjectnew.tallowance[i].fields.Workcoverexempt || false,
                                                '<td contenteditable="false" class="colDeleteAllowances"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                              ];

                                              splashArrayAllowanceList.push(dataListCustomerDupp);
                                              //}
                                          }

                                          let uniqueChars = [...new Set(splashArrayAllowanceList)];
                                          var datatable = $('#tblAlowances').DataTable();
                                          datatable.clear();
                                          datatable.rows.add(uniqueChars);
                                          datatable.draw(false);
                                          setTimeout(function () {
                                            $("#tblAlowances").dataTable().fnPageChange('last');
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
                      $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#allowanceModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblAlowances_filter");
                      $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblAlowances_filter");

                  }

              }).on('page', function () {
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);

              }).on('column-reorder', function () {

              }).on('length.dt', function (e, settings, len) {
                //$('.fullScreenSpin').css('display', 'inline-block');
                let dataLenght = settings._iDisplayLength;
                splashArrayAllowanceList = [];
                if (dataLenght == -1) {
                  $('.fullScreenSpin').css('display', 'none');

                } else {
                    if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                        $('.fullScreenSpin').css('display', 'none');
                    } else {
                        sideBarService.getAllowance(dataLenght, 0).then(function (dataNonBo) {

                            addVS1Data('TAllowance', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
      sideBarService.getAllowance(initialBaseDataLoad, 0).then(function (data) {
          addVS1Data('TAllowance', JSON.stringify(data));
          let lineItems = [];
          let lineItemObj = {};
          for (let i = 0; i < data.tallowance.length; i++) {
              let allowanceAmount = utilityService.modifynegativeCurrencyFormat(data.tallowance[i].fields.Amount) || 0.00;

              var dataListAllowance = [
                  data.tallowance[i].fields.ID || 0,
                  data.tallowance[i].fields.Description || '-',
                  data.tallowance[i].fields.AllowanceType || '',
                  data.tallowance[i].fields.DisplayIn || '',
                  allowanceAmount || 0.00,
                  data.tallowance[i].fields.Accountname || '',
                  data.tallowance[i].fields.Accountid || 0,
                  data.tallowance[i].fields.Payrolltaxexempt || false,
                  data.tallowance[i].fields.Superinc || false,
                  data.tallowance[i].fields.Workcoverexempt || false,
                  '<td contenteditable="false" class="colDeleteAllowances"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
              ];

              splashArrayAllowanceList.push(dataListAllowance);
          }

          function MakeNegative() {
              $('td').each(function () {
                  if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
              });
          };


          setTimeout(function () {
              MakeNegative();
          }, 100);
          setTimeout(function () {
              $('#tblAlowances').DataTable({

                  data: splashArrayAllowanceList,
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  columnDefs: [
                      {
                          className: "colAlowancesID hiddenColumn",
                          "targets": [0]
                      },
                      {
                          className: "colAllowancesNames",
                          "targets": [1]
                      },  {
                          className: "colAllowancesType",
                          "targets": [2]
                      }, {
                          className: "colAllowancesDisplayName",
                          "targets": [3]
                      }, {
                          className: "colAllowancesAmount  text-right",
                          "targets": [4]
                      }, {
                          className: "colAllowancesAccounts",
                          "targets": [5]
                      }, {
                          className: "colAllowancesAccountsID hiddenColumn",
                          "targets": [6]
                      }, {
                          className: "colAllowancesPAYG hiddenColumn",
                          "targets": [7]
                      }, {
                          className: "colAllowancesSuperannuation hiddenColumn",
                          "targets": [8]
                      }, {
                          className: "colAllowancesReportableasW1 hiddenColumn",
                          "targets": [9]
                      }, {
                          className: "colDeleteAllowances",
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
                      $('#tblAlowances').DataTable().ajax.reload();
                  },
                  "fnDrawCallback": function (oSettings) {
                      $('.paginate_button.page-item').removeClass('disabled');
                      $('#tblAlowances_ellipsis').addClass('disabled');
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
                              var splashArrayAllowanceListDupp = new Array();
                              let dataLenght = oSettings._iDisplayLength;
                              let customerSearch = $('#tblAlowances_filter input').val();

                              sideBarService.getAllowance(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                          for (let j = 0; j < dataObjectnew.tallowance.length; j++) {

                                              let allowanceAmount = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tallowance[j].fields.Amount) || 0.00;

                                              var dataListCustomerDupp = [
                                                dataObjectnewdataObjectnew.tallowance[i].fields.ID || 0,
                                                dataObjectnew.tallowance[i].fields.Description || '-',
                                                dataObjectnew.tallowance[i].fields.AllowanceType || '',
                                                dataObjectnew.tallowance[i].fields.DisplayIn || '',
                                                allowanceAmount || 0.00,
                                                dataObjectnew.tallowance[i].fields.Accountname || '',
                                                dataObjectnew.tallowance[i].fields.Accountid || 0,
                                                dataObjectnew.tallowance[i].fields.Payrolltaxexempt || false,
                                                dataObjectnewdataObjectnew.tallowance[i].fields.Superinc || false,
                                                dataObjectnew.tallowance[i].fields.Workcoverexempt || false,
                                                '<td contenteditable="false" class="colDeleteAllowances"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                              ];

                                              splashArrayAllowanceList.push(dataListCustomerDupp);
                                              //}
                                          }

                                          let uniqueChars = [...new Set(splashArrayAllowanceList)];
                                          var datatable = $('#tblAlowances').DataTable();
                                          datatable.clear();
                                          datatable.rows.add(uniqueChars);
                                          datatable.draw(false);
                                          setTimeout(function () {
                                            $("#tblAlowances").dataTable().fnPageChange('last');
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
                      $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#allowanceModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblAlowances_filter");
                      $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblAlowances_filter");

                  }

              }).on('page', function () {
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);

              }).on('column-reorder', function () {

              }).on('length.dt', function (e, settings, len) {
                //$('.fullScreenSpin').css('display', 'inline-block');
                let dataLenght = settings._iDisplayLength;
                splashArrayAllowanceList = [];
                if (dataLenght == -1) {
                  $('.fullScreenSpin').css('display', 'none');

                } else {
                    if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                        $('.fullScreenSpin').css('display', 'none');
                    } else {
                        sideBarService.getAllowance(dataLenght, 0).then(function (dataNonBo) {

                            addVS1Data('TAllowance', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
    templateObject.getAllAllowance();

    templateObject.getAllDeductions = function() {
    getVS1Data('TDeduction').then(function(dataObject) {
        if (dataObject.length == 0) {
          sideBarService.getDeduction(initialBaseDataLoad, 0).then(function (data) {
              addVS1Data('TDeduction', JSON.stringify(data));
              let lineItems = [];
              let lineItemObj = {};
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
                      '<td contenteditable="false" class="colDeleteDeductions"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
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
                          }, {
                              className: "colDeleteDeductions",
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

                                  sideBarService.getDeduction(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

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
                                                    '<td contenteditable="false" class="colDeleteDeductions"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                                  ];

                                                  splashArrayDeductionList.push(dataListCustomerDupp);
                                                  //}
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
                          $("<button class='btn btn-primary btnAddNewDeduction' data-dismiss='modal' data-toggle='modal'  type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblDeductions_filter");
                          $("<button class='btn btn-primary btnRefreshDeduction' type='button' id='btnRefreshDeduction' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblDeductions_filter");

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
                  '<td contenteditable="false" class="colDeleteDeductions"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
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
                      }, {
                          className: "colDeleteDeductions",
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

                              sideBarService.getDeduction(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

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
                                                alldata = dataObjectnew.tdeduction[i].fields.Description+','
                                                          +dataObjectnew.tdeduction[i].fields.DeductionType
                                                          +','+dataObjectnew.tdeduction[i].fields.DisplayIn
                                                          +','+allowanceAmount+','
                                                          +dataObjectnew.tdeduction[i].fields.Accountname+','+dataObjectnew.tdeduction[i].fields.Accountid
                                                          +','+dataObjectnew.tdeduction[i].fields.Payrolltaxexempt+
                                                          ','+dataObjectnewdataObjectnew.tdeduction[i].fields.Superinc+','
                                                          +dataObjectnew.tdeduction[i].fields.Workcoverexempt,
                                                '<td contenteditable="false" class="colDeleteDeductions"><span class="alldataget" style="display:none;">'+alldata+'</span><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                              ];

                                              splashArrayDeductionList.push(dataListCustomerDupp);
                                              //}
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
                      $("<button class='btn btn-primary btnAddNewDeduction' data-dismiss='modal' data-toggle='modal'  type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblDeductions_filter");
                      $("<button class='btn btn-primary btnRefreshDeduction' type='button' id='btnRefreshDeduction' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblDeductions_filter");

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
      sideBarService.getDeduction(initialBaseDataLoad, 0).then(function (data) {
          addVS1Data('TDeduction', JSON.stringify(data));
          let lineItems = [];
          let lineItemObj = {};
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
                  '<td contenteditable="false" class="colDeleteDeductions"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
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
                      }, {
                          className: "colDeleteDeductions",
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

                              sideBarService.getDeduction(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

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
                                                '<td contenteditable="false" class="colDeleteDeductions"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                              ];

                                              splashArrayDeductionList.push(dataListCustomerDupp);
                                              //}
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
                      $("<button class='btn btn-primary btnAddNewDeduction' data-dismiss='modal' data-toggle='modal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblDeductions_filter");
                      $("<button class='btn btn-primary btnRefreshDeduction' type='button' id='btnRefreshDeduction' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblDeductions_filter");

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
    templateObject.getAllDeductions();

    templateObject.getCalenders = function(){
        getVS1Data('TPayrollCalendars').then(function(dataObject) {
            if (dataObject.length == 0) {
              sideBarService.getCalender(initialBaseDataLoad, 0).then(function (data) {
                  addVS1Data('TPayrollCalendars', JSON.stringify(data));
                  let lineItems = [];
                  let lineItemObj = {};
                  for (let i = 0; i < data.tpayrollcalendars.length; i++) {
                    
                      var dataListAllowance = [
                          data.tpayrollcalendars[i].fields.ID || '',
                          data.tpayrollcalendars[i].fields.PayrollCalendarName || '',
                          data.tpayrollcalendars[i].fields.PayrollCalendarPayPeriod || '',
                          moment(data.tpayrollcalendars[i].fields.PayrollCalendarStartDate).format('DD/MM/YYYY') || '',
                          moment(data.tpayrollcalendars[i].fields.PayrollCalendarFirstPaymentDate).format('DD/MM/YYYY') || '',       
                          '<td contenteditable="false" class="colDeleteCalenders"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                      ];
    
                      splashArrayCalenderList.push(dataListAllowance);
                  }
    
            
    
    
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);
                  setTimeout(function () {
                      $('#tblPayCalendars').DataTable({
    
                          data: splashArrayCalenderList,
                          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                          columnDefs: [
                              {
                                className: "colCalenderID hiddenColumn",
                                "targets": [0]
                              },
                              {
                                  className: "colPayCalendarName",
                                  "targets": [1]
                              },  
                              {
                                  className: "colPayPeriod",
                                  "targets": [2]
                              }, 
                              {
                                  className: "colNextPayPeriod",
                                  "targets": [3]
                              }, 
                              {
                                  className: "colNextPaymentDate",
                                  "targets": [4]
                              },  
                              {
                                  className: "colDeleteCalenders",
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
                              $('#tblPayCalendars').DataTable().ajax.reload();
                          },
                          "fnDrawCallback": function (oSettings) {
                              $('.paginate_button.page-item').removeClass('disabled');
                              $('#tblPayCalendars_ellipsis').addClass('disabled');
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
                                      var splashArrayAllowanceListDupp = new Array();
                                      let dataLenght = oSettings._iDisplayLength;
                                      let customerSearch = $('#tblPayCalendars_filter input').val();
    
                                      sideBarService.getCalender(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                          for (let i = 0; i < data.tpayrollcalendars.length; i++) {
                    
                                            var dataListAllowance = [
                                                data.tpayrollcalendars[i].fields.ID || '',
                                                data.tpayrollcalendars[i].fields.PayrollCalendarName || '',
                                                data.tpayrollcalendars[i].fields.PayrollCalendarPayPeriod || '',
                                                moment(data.tpayrollcalendars[i].fields.PayrollCalendarStartDate).format('DD/MM/YYYY') || '',
                                                moment(data.tpayrollcalendars[i].fields.PayrollCalendarFirstPaymentDate).format('DD/MM/YYYY') || '',
                                                '<td contenteditable="false" class="colDeleteCalenders"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                            ];
                          
                                            splashArrayCalenderList.push(dataListAllowance);
                                        }
    
                                                  let uniqueChars = [...new Set(splashArrayCalenderList)];
                                                  var datatable = $('#tblPayCalendars').DataTable();
                                                  datatable.clear();
                                                  datatable.rows.add(uniqueChars);
                                                  datatable.draw(false);
                                                  setTimeout(function () {
                                                    $("#tblPayCalendars").dataTable().fnPageChange('last');
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
                              $("<button class='btn btn-primary btnAddNewpaycalender' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblPayCalendars_filter");
                              $("<button class='btn btn-primary btnRefreshCalender' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#ttblPayCalendars_filter");
    
                          }
    
                      }).on('page', function () {
                          setTimeout(function () {
                              MakeNegative();
                          }, 100);
    
                      }).on('column-reorder', function () {
    
                      }).on('length.dt', function (e, settings, len) {
                        //$('.fullScreenSpin').css('display', 'inline-block');
                        let dataLenght = settings._iDisplayLength;
                        splashArrayCalenderList = [];
                        if (dataLenght == -1) {
                          $('.fullScreenSpin').css('display', 'none');
    
                        } else {
                            if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                                $('.fullScreenSpin').css('display', 'none');
                            } else {
                                sideBarService.getCalender(dataLenght, 0).then(function (dataNonBo) {
    
                                    addVS1Data('TPayrollCalendars', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
              for (let i = 0; i < data.tpayrollcalendars.length; i++) {
                    
                var dataListAllowance = [
                    data.tpayrollcalendars[i].fields.ID || '',
                    data.tpayrollcalendars[i].fields.PayrollCalendarName || '',
                    data.tpayrollcalendars[i].fields.PayrollCalendarPayPeriod || '',
                    moment(data.tpayrollcalendars[i].fields.PayrollCalendarStartDate).format('DD/MM/YYYY') || '',
                    moment(data.tpayrollcalendars[i].fields.PayrollCalendarFirstPaymentDate).format('DD/MM/YYYY') || '',    
                    '<td contenteditable="false" class="colDeleteCalenders"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                ];

                splashArrayCalenderList.push(dataListAllowance);
            }
    
        
    
    
              setTimeout(function () {
                  MakeNegative();
              }, 100);
              setTimeout(function () {
                  $('#tblPayCalendars').DataTable({
    
                      data: splashArrayCalenderList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      columnDefs: [
                              
                        {
                            className: "colPayCalendarName",
                            "targets": [0]
                        },  {
                            className: "colPayPeriod",
                            "targets": [1]
                        }, {
                            className: "colNextPayPeriod",
                            "targets": [2]
                        }, {
                            className: "colNextPaymentDate",
                            "targets": [3]
                        },  {
                            className: "colDelete",
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
                          $('#tblPayCalendars').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblPayCalendars_ellipsis').addClass('disabled');
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
                                  var splashArrayCalenderListDupp = new Array();
                                  let dataLenght = oSettings._iDisplayLength;
                                  let customerSearch = $('#tblPayCalendars_filter input').val();
    
                                  sideBarService.getCalender(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                    for (let i = 0; i < data.tpayrollcalendars.length; i++) {
                    
                                        var dataListAllowance = [
                                            data.tpayrollcalendars[i].fields.PayrollCalendarName || '',
                                            data.tpayrollcalendars[i].fields.PayrollCalendarPayPeriod || '',
                                            data.tpayrollcalendars[i].fields.PayrollCalendarStartDate || '',
                                            data.tpayrollcalendars[i].fields.PayrollCalendarFirstPaymentDate || '',       
                                            '<td contenteditable="false" class="colDelete"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                        ];
                        
                                        splashArrayCalenderList.push(dataListAllowance);
                                    }
    
                                              let uniqueChars = [...new Set(splashArrayCalenderList)];
                                              var datatable = $('#tblPayCalendars').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblPayCalendars").dataTable().fnPageChange('last');
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
                          $("<button class='btn btn-primary btnAddNewpaycalender' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblPayCalendars_filter");
                          $("<button class='btn btn-primary btnRefreshcalender' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblPayCalendars_filter");
    
                      }
    
                  }).on('page', function () {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
    
                  }).on('column-reorder', function () {
    
                  }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArrayCalenderList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');
    
                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getCalender(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TPayrollCalendars', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
          sideBarService.getCalender(initialBaseDataLoad, 0).then(function (data) {
              addVS1Data('TPayrollCalendars', JSON.stringify(data));
              let lineItems = [];
              let lineItemObj = {};
              for (let i = 0; i < data.tpayrollcalendars.length; i++) {
                    
                var dataListAllowance = [
                    data.tpayrollcalendars[i].fields.ID || '',
                    data.tpayrollcalendars[i].fields.PayrollCalendarName || '',
                    data.tpayrollcalendars[i].fields.PayrollCalendarPayPeriod || '',
                    moment(data.tpayrollcalendars[i].fields.PayrollCalendarStartDate).format('DD/MM/YYYY') || '',
                    moment(data.tpayrollcalendars[i].fields.PayrollCalendarFirstPaymentDate).format('DD/MM/YYYY') || '',   
                    '<td contenteditable="false" class="colDeleteCalenders"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                ];

                splashArrayCalenderList.push(dataListAllowance);
            }
      
    
              setTimeout(function () {
                  MakeNegative();
              }, 100);
              setTimeout(function () {
                  $('#tblPayCalendars').DataTable({
    
                      data: splashArrayCalenderList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      columnDefs: [
                        {
                          className: "colCalenderID hiddenColumn",
                          "targets": [0]
                        },
                        {
                            className: "colPayCalendarName",
                            "targets": [1]
                        },  
                        {
                            className: "colPayPeriod",
                            "targets": [2]
                        }, 
                        {
                            className: "colNextPayPeriod",
                            "targets": [3]
                        }, 
                        {
                            className: "colNextPaymentDate",
                            "targets": [4]
                        },  
                        {
                            className: "colDeleteCalenders",
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
                          $('#tblPayCalendars').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblPayCalendars_ellipsis').addClass('disabled');
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
                                  var splashArrayCalenderListDupp = new Array();
                                  let dataLenght = oSettings._iDisplayLength;
                                  let customerSearch = $('#tblPayCalendars_filter input').val();
    
                                  sideBarService.getCalender(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                    for (let i = 0; i < data.tpayrollcalendars.length; i++) {
                    
                                        var dataListAllowance = [
                                            data.tpayrollcalendars[i].fields.ID || '',
                                            data.tpayrollcalendars[i].fields.PayrollCalendarName || '',
                                            data.tpayrollcalendars[i].fields.PayrollCalendarPayPeriod || '',
                                            moment(data.tpayrollcalendars[i].fields.PayrollCalendarStartDate).format('DD/MM/YYYY') || '',
                                            moment(data.tpayrollcalendars[i].fields.PayrollCalendarFirstPaymentDate).format('DD/MM/YYYY') || '',       
                                            '<td contenteditable="false" class="colDeleteCalenders"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                        ];
                        
                                        splashArrayCalenderList.push(dataListAllowance);
                                    }
    
                                         let uniqueChars = [...new Set(splashArrayCalenderList)];
                                         var datatable = $('#tblPayCalendars').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblPayCalendars").dataTable().fnPageChange('last');
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
                          $("<button class='btn btn-primary btnAddNewPayCalender' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblPayCalendars_filter");
                          $("<button class='btn btn-primary btnRefreshCalender' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblPayCalendars_filter");
    
                      }
    
                  }).on('page', function () {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
    
                  }).on('column-reorder', function () {
    
                  }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArrayCalenderList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');
    
                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getCalender(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TPayrollCalendars', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
    templateObject.getCalenders();
    
    templateObject.getReimbursement = function(){
 
        getVS1Data('TReimbursement').then(function(dataObject) {
            if (dataObject.length == 0) {
                 sideBarService.getCalender(initialBaseDataLoad, 0).then(function (data) {
                  addVS1Data('TReimbursement', JSON.stringify(data));
                  let lineItems = [];
                  let lineItemObj = {};
                  for (let i = 0; i < data.treimbursement.length; i++) {
                    
                      var dataListAllowance = [
                          data.treimbursement[i].fields.ID || '',
                          data.treimbursement[i].fields.ReimbursementName || 0,
                          data.treimbursement[i].fields.ReimbursementAccount || 0,
                         '<td contenteditable="false" class="colDeleterei"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                      ];
    
                      splashArrayReisument.push(dataListAllowance);
                  }
    
            
    
    
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);
                  setTimeout(function () {
                      $('#tblReimbursements').DataTable({
    
                          data: splashArrayCalenderList,
                          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                          columnDefs: [                              
                            
                            {
                                 className: "colReimbursementID hiddenColumn",
                                 "targets": [0]
                               },
                               {
                                  className: "colReimbursementName",
                                  "targets": [1]
                               },  
                               {
                                  className: "colReimbursementAccount",
                                  "targets": [2]
                               },                        
                               {
                                  className: "colDeleterei",
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
                              $('#tblReimbursements').DataTable().ajax.reload();
                          },
                          "fnDrawCallback": function (oSettings) {
                              $('.paginate_button.page-item').removeClass('disabled');
                              $('#tblReimbursements_ellipsis').addClass('disabled');
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
                                      let customerSearch = $('#tblReimbursements_filter input').val();
    
                                      sideBarService.getReimbursement(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                        for (let i = 0; i < data.treimbursement.length; i++) {
                    
                                            var dataListAllowance = [
                                                data.treimbursement[i].fields.ID || '',
                                                data.treimbursement[i].fields.ReimbursementName || 0,
                                                data.treimbursement[i].fields.ReimbursementAccount || 0,
                                               '<td contenteditable="false" class="colDeleterei"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                            ];
                          
                                            splashArrayReisument.push(dataListAllowance);
                                        }
    
                                                  let uniqueChars = [...new Set(splashArrayReisument)];
                                                  var datatable = $('#tblReimbursements').DataTable();
                                                  datatable.clear();
                                                  datatable.rows.add(uniqueChars);
                                                  datatable.draw(false);
                                                  setTimeout(function () {
                                                    $("#tblReimbursements").dataTable().fnPageChange('last');
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
                              $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblReimbursements_filter");
                              $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblReimbursements_filter");
    
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
                                sideBarService.getReimbursement(dataLenght, 0).then(function (dataNonBo) {
    
                                    addVS1Data('tblReimbursements', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
              for (let i = 0; i < data.treimbursement.length; i++) {
                    
                var dataListAllowance = [
                    data.treimbursement[i].fields.ID || '',
                    data.treimbursement[i].fields.ReimbursementName || 0,
                    data.treimbursement[i].fields.ReimbursementAccount || 0,
                   '<td contenteditable="false" class="colDeleterei"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                ];

                splashArrayReisument.push(dataListAllowance);
            }
        
    
    
              setTimeout(function () {
                  MakeNegative();
              }, 100);
              setTimeout(function () {
                  $('#tblReimbursements').DataTable({
    
                      data: splashArrayReisument,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      columnDefs: [                              
                            
                        {
                             className: "colReimbursementID hiddenColumn",
                             "targets": [0]
                           },
                           {
                              className: "colReimbursementName",
                              "targets": [1]
                           },  
                           {
                              className: "colReimbursementAccount",
                              "targets": [2]
                           },                        
                           {
                              className: "colDeleterei",
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
                          $('#tblReimbursements').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblReimbursements_ellipsis').addClass('disabled');
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
                                  var splashArrayReisumentDuppDupp = new Array();
                                  let dataLenght = oSettings._iDisplayLength;
                                  let customerSearch = $('#tblReimbursements_filter input').val();
    
                                  sideBarService.getReimbursement(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                    for (let i = 0; i < data.treimbursement.length; i++) {
                    
                                        var dataListAllowance = [
                                            data.treimbursement[i].fields.ID || '',
                                            data.treimbursement[i].fields.ReimbursementName || 0,
                                            data.treimbursement[i].fields.ReimbursementAccount || 0,
                                           '<td contenteditable="false" class="colDeleterei"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                        ];
                        
                                        splashArrayReisument.push(dataListAllowance);
                                      }
    
                                              let uniqueChars = [...new Set(splashArrayReisument)];
                                              var datatable = $('#tblReimbursements').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblReimbursements").dataTable().fnPageChange('last');
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
                          $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblReimbursements_filter");
                          $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblReimbursements_filter");
    
                      }
    
                  }).on('page', function () {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
    
                  }).on('column-reorder', function () {
    
                  }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArrayCalenderList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');
    
                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getReimbursement(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TReimbursement', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
          sideBarService.getReimbursement(initialBaseDataLoad, 0).then(function (data) {
              addVS1Data('TReimbursement', JSON.stringify(data));
              let lineItems = [];
              let lineItemObj = {};
              for (let i = 0; i < data.treimbursement.length; i++) {
                    
                var dataListAllowance = [
                    data.treimbursement[i].fields.ID || '',
                    data.treimbursement[i].fields.ReimbursementName || 0,
                    data.treimbursement[i].fields.ReimbursementAccount || 0,
                   '<td contenteditable="false" class="colDeleterei"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                ];

                splashArrayReisument.push(dataListAllowance);
            }
      
    
              setTimeout(function () {
                  MakeNegative();
              }, 100);
              setTimeout(function () {
                  $('#tblReimbursements').DataTable({
    
                      data: splashArrayReisument,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      columnDefs: [                              
                            
                        {
                             className: "colReimbursementID hiddenColumn",
                             "targets": [0]
                           },
                           {
                              className: "colReimbursementName",
                              "targets": [1]
                           },  
                           {
                              className: "colReimbursementAccount",
                              "targets": [2]
                           },                        
                           {
                              className: "colDeleterei",
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
                          $('#tblReimbursements').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblReimbursements_ellipsis').addClass('disabled');
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
                                  let customerSearch = $('#tblReimbursements_filter input').val();
    
                                  sideBarService.getReimbursement(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                    for (let i = 0; i < data.treimbursement.length; i++) {
                    
                                        var dataListAllowance = [
                                            data.treimbursement[i].fields.ID || '',
                                            data.treimbursement[i].fields.ReimbursementName || 0,
                                            data.treimbursement[i].fields.ReimbursementAccount || 0,
                                           '<td contenteditable="false" class="colDeleterei"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                        ];
                        
                                        splashArrayReisument.push(dataListAllowance);
                                    }
    
                                         let uniqueChars = [...new Set(splashArrayReisument)];
                                         var datatable = $('#tblReimbursements').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblReimbursements").dataTable().fnPageChange('last');
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
                          $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblReimbursements_filter");
                          $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblReimbursements_filter");
    
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
                            sideBarService.getReimbursement(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TReimbursement', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
    templateObject.getReimbursement();

    templateObject.getLeaveTypeData = function(){

        getVS1Data('TPaidLeave').then(function(dataObject) {
            if (dataObject.length == 0) {
                 sideBarService.getPaidLeave(initialBaseDataLoad, 0).then(function (data) {
                  addVS1Data('TPaidLeave', JSON.stringify(data));
                  let lineItems = [];
                  let lineItemObj = {};
                  for (let i = 0; i < data.tpaidleave.length; i++) {
                    
                      var dataListAllowance = [
                          data.tpaidleave[i].fields.ID || '',
                          data.tpaidleave[i].fields.LeavePaidName || '',
                          data.tpaidleave[i].fields.LeavePaidUnits || '',
                          data.tpaidleave[i].fields.LeavePaidNormalEntitlement || '',
                          data.tpaidleave[i].fields.LeavePaidLeaveLoadingRate || '',
                          true,
                          data.tpaidleave[i].fields.LeavePaidShowBalanceOnPayslip || false,
                         '<td contenteditable="false" class="colDeletepaidrem"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                      ];
    
                      splashArrayLeaveList.push(dataListAllowance);
                  }
    
            
    
    
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);
                  setTimeout(function () {
                      $('#tblLeave').DataTable({
    
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
                                className: "colLeavePaidLeave",
                                "targets": [5]
                               },  
                               {
                                className: "colLeaveShownOnPayslip",
                                "targets": [6]
                               },                        
                               {
                                  className: "colDeletepaidrem",
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
                              $('#tblLeave').DataTable().ajax.reload();
                          },
                          "fnDrawCallback": function (oSettings) {
                              $('.paginate_button.page-item').removeClass('disabled');
                              $('#tblLeave_ellipsis').addClass('disabled');
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
                                      let customerSearch = $('#tblLeave_filter input').val();
    
                                      sideBarService.getPaidLeave(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                        for (let i = 0; i < data.tpaidleave.length; i++) {
                    
                                            var dataListAllowance = [
                                                data.tpaidleave[i].fields.ID || '',
                                                data.tpaidleave[i].fields.LeavePaidName || '',
                                                data.tpaidleave[i].fields.LeavePaidUnits || '',
                                                data.tpaidleave[i].fields.LeavePaidNormalEntitlement || '',
                                                data.tpaidleave[i].fields.LeavePaidLeaveLoadingRate || '',
                                                true,
                                                data.tpaidleave[i].fields.LeavePaidShowBalanceOnPayslip || false,
                                               '<td contenteditable="false" class="colDeletepaidrem"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                            ];
                          
                                            splashArrayLeaveList.push(dataListAllowance);
                                        }
    
                                                  let uniqueChars = [...new Set(splashArrayLeaveList)];
                                                  var datatable = $('#tblLeave').DataTable();
                                                  datatable.clear();
                                                  datatable.rows.add(uniqueChars);
                                                  datatable.draw(false);
                                                  setTimeout(function () {
                                                    $("#tblLeave").dataTable().fnPageChange('last');
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
                              $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblLeave_filter");
                              $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblLeave_filter");
    
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
                                sideBarService.getPaidLeave(dataLenght, 0).then(function (dataNonBo) {
    
                                    addVS1Data('TPaidLeave', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
              for (let i = 0; i < data.tpaidleave.length; i++) {
                    
                var dataListAllowance = [
                    data.tpaidleave[i].fields.ID || '',
                    data.tpaidleave[i].fields.LeavePaidName || '',
                    data.tpaidleave[i].fields.LeavePaidUnits || '',
                    data.tpaidleave[i].fields.LeavePaidNormalEntitlement || '',
                    data.tpaidleave[i].fields.LeavePaidLeaveLoadingRate || '',
                    true,
                    data.tpaidleave[i].fields.LeavePaidShowBalanceOnPayslip || false,
                   '<td contenteditable="false" class="colDeletepaidrem"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                   ];

                splashArrayLeaveList.push(dataListAllowance);
            }
        
    
    
              setTimeout(function () {
                  MakeNegative();
              }, 100);
              setTimeout(function () {
                  $('#tblLeave').DataTable({
    
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
                            className: "colLeavePaidLeave",
                            "targets": [5]
                           },  
                           {
                            className: "colLeaveShownOnPayslip",
                            "targets": [6]
                           },                        
                           {
                              className: "colDeletepaidrem",
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
                          $('#tblLeave').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblLeave_ellipsis').addClass('disabled');
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
                                  let customerSearch = $('#tblLeave_filter input').val();
    
                                  sideBarService.getPaidLeave(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                    for (let i = 0; i < data.tpaidleave.length; i++) {
                    
                                        var dataListAllowance = [
                                            data.tpaidleave[i].fields.ID || '',
                                            data.tpaidleave[i].fields.LeavePaidName || '',
                                            data.tpaidleave[i].fields.LeavePaidUnits || '',
                                            data.tpaidleave[i].fields.LeavePaidNormalEntitlement || '',
                                            data.tpaidleave[i].fields.LeavePaidLeaveLoadingRate || '',
                                            true,
                                            data.tpaidleave[i].fields.LeavePaidShowBalanceOnPayslip || false,
                                           '<td contenteditable="false" class="colDeletepaidrem"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                           ];
                        
                                        splashArrayLeaveList.push(dataListAllowance);
                                    }
    
                                              let uniqueChars = [...new Set(splashArrayLeaveList)];
                                              var datatable = $('#tblLeave').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblLeave").dataTable().fnPageChange('last');
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
                          $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblLeave_filter");
                          $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblLeave_filter");
    
                      }
    
                  }).on('page', function () {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
    
                  }).on('column-reorder', function () {
    
                  }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArrayCalenderList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');
    
                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getPaidLeave(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TPaidLeave', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
          sideBarService.getPaidLeave(initialBaseDataLoad, 0).then(function (data) {
              addVS1Data('TPaidLeave', JSON.stringify(data));
              let lineItems = [];
              let lineItemObj = {};
              for (let i = 0; i < data.tpaidleave.length; i++) {
                    
                var dataListAllowance = [
                    data.tpaidleave[i].fields.ID || '',
                    data.tpaidleave[i].fields.LeavePaidName || '',
                    data.tpaidleave[i].fields.LeavePaidUnits || '',
                    data.tpaidleave[i].fields.LeavePaidNormalEntitlement || '',
                    data.tpaidleave[i].fields.LeavePaidLeaveLoadingRate || '',
                    true,
                    data.tpaidleave[i].fields.LeavePaidShowBalanceOnPayslip || false,
                   '<td contenteditable="false" class="colDeletepaidrem"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                   ];

                splashArrayLeaveList.push(dataListAllowance);
            }
      
    
              setTimeout(function () {
                  MakeNegative();
              }, 100);
              setTimeout(function () {
                  $('#tblLeave').DataTable({
    
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
                            className: "colLeavePaidLeave",
                            "targets": [5]
                           },  
                           {
                            className: "colLeaveShownOnPayslip",
                            "targets": [6]
                           },                        
                           {
                              className: "colDeletepaidrem",
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
                          $('#tblLeave').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblLeave_ellipsis').addClass('disabled');
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
                                  let customerSearch = $('#tblLeave_filter input').val();
    
                                  sideBarService.getPaidLeave(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                    for (let i = 0; i < data.tpaidleave.length; i++) {
                    
                                        var dataListAllowance = [
                                            data.tpaidleave[i].fields.ID || '',
                                            data.tpaidleave[i].fields.LeavePaidUnits || '',
                                            data.tpaidleave[i].fields.LeavePaidNormalEntitlement || '',
                                            data.tpaidleave[i].fields.LeavePaidLeaveLoadingRate || '',
                                            true,
                                            data.tpaidleave[i].fields.LeavePaidShowBalanceOnPayslip || false,
                                           '<td contenteditable="false" class="colDeletepaidrem"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                        ];
                        
                                        splashArrayLeaveList.push(dataListAllowance);
                                    }
    
                                         let uniqueChars = [...new Set(splashArrayLeaveList)];
                                         var datatable = $('#tblLeave').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblLeave").dataTable().fnPageChange('last');
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
                          $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblLeave_filter");
                          $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblLeave_filter");
    
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
                            sideBarService.getPaidLeave(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TPaidLeave', JSON.stringify(dataNonBo)).then(function (datareturn) {
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

    templateObject.getLeaveTypeData();

    
    templateObject.getUnpaidLeaveTypeData = function(){

        getVS1Data('TUnpaidLeave').then(function(dataObject) {
            if (dataObject.length == 0) {
                 sideBarService.getUnPaidLeave(initialBaseDataLoad, 0).then(function (data) {
                  addVS1Data('TUnpaidLeave', JSON.stringify(data));
                  let lineItems = [];
                  let lineItemObj = {};
                  for (let i = 0; i < data.tunpaidleave.length; i++) {
                    
                      var dataListAllowance = [
                          data.tunpaidleave[i].fields.ID || '',
                          data.tunpaidleave[i].fields.LeaveUnPaidName || '',
                          data.tunpaidleave[i].fields.LeaveUnPaidUnits || '',
                          data.tunpaidleave[i].fields.LeaveUnPaidNormalEntitlement || '',
                          data.tunpaidleave[i].fields.LeaveUnPaidLeaveLoadingRate || '',
                          false,
                          data.tpaidleave[i].fields.LeaveUnPaidShowBalanceOnPayslip || false,
                         '<td contenteditable="false" class="colDeletepaidrem"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                      ];
    
                      splashArrayUnLeaveList.push(dataListAllowance);
                  }
    
            
    
    
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);
                  setTimeout(function () {
                      $('#tblLeave').DataTable({
    
                          data: splashArrayUnLeaveList,
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
                                className: "colLeavePaidLeave",
                                "targets": [5]
                               },  
                               {
                                className: "colLeaveShownOnPayslip",
                                "targets": [6]
                               },                        
                               {
                                  className: "colDeleterei",
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
                              $('#tblLeave').DataTable().ajax.reload();
                          },
                          "fnDrawCallback": function (oSettings) {
                              $('.paginate_button.page-item').removeClass('disabled');
                              $('#tblLeave_ellipsis').addClass('disabled');
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
                                      var splashArrayUnLeaveListDupp = new Array();
                                      let dataLenght = oSettings._iDisplayLength;
                                      let customerSearch = $('#tblLeave_filter input').val();
    
                                      sideBarService.getUnPaidLeave(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                        for (let i = 0; i < data.tunpaidleave.length; i++) {
                    
                                            var dataListAllowance = [
                                                data.tunpaidleave[i].fields.ID || '',
                                                data.tunpaidleave[i].fields.LeaveUnPaidName || '',
                                                data.tunpaidleave[i].fields.LeaveUnPaidUnits || '',
                                                data.tunpaidleave[i].fields.LeaveUnPaidNormalEntitlement || '',
                                                data.tunpaidleave[i].fields.LeaveUnPaidLeaveLoadingRate || '',
                                                false,
                                                data.tpaidleave[i].fields.LeaveUnPaidShowBalanceOnPayslip || false,
                                               '<td contenteditable="false" class="colDeletepaidrem"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                            ];
                          
                                            splashArrayUnLeaveList.push(dataListAllowance);
                                        }
    
                                                  let uniqueChars = [...new Set(splashArrayUnLeaveList)];
                                                  var datatable = $('#tblLeave').DataTable();
                                                  datatable.clear();
                                                  datatable.rows.add(uniqueChars);
                                                  datatable.draw(false);
                                                  setTimeout(function () {
                                                    $("#tblLeave").dataTable().fnPageChange('last');
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
                              $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblLeave_filter");
                              $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblLeave_filter");
    
                          }
    
                      }).on('page', function () {
                          setTimeout(function () {
                              MakeNegative();
                          }, 100);
    
                      }).on('column-reorder', function () {
    
                      }).on('length.dt', function (e, settings, len) {
                        //$('.fullScreenSpin').css('display', 'inline-block');
                        let dataLenght = settings._iDisplayLength;
                        splashArrayUnLeaveList = [];
                        if (dataLenght == -1) {
                          $('.fullScreenSpin').css('display', 'none');
    
                        } else {
                            if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                                $('.fullScreenSpin').css('display', 'none');
                            } else {
                                sideBarService.getUnPaidLeave(dataLenght, 0).then(function (dataNonBo) {
    
                                    addVS1Data('TUnpaidLeave', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
              for (let i = 0; i < data.tunpaidleave.length; i++) {
                    
                var dataListAllowance = [
                    data.tunpaidleave[i].fields.ID || '',
                    data.tunpaidleave[i].fields.LeaveUnPaidName || '',
                    data.tunpaidleave[i].fields.LeaveUnPaidUnits || '',
                    data.tunpaidleave[i].fields.LeaveUnPaidNormalEntitlement || '',
                    data.tunpaidleave[i].fields.LeaveUnPaidLeaveLoadingRate || '',
                    false,
                    data.tpaidleave[i].fields.LeaveUnPaidShowBalanceOnPayslip || false,
                   '<td contenteditable="false" class="colDeletepaidrem"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                ];

                splashArrayUnLeaveList.push(dataListAllowance);
            }
        
    
    
              setTimeout(function () {
                  MakeNegative();
              }, 100);
              setTimeout(function () {
                  $('#tblLeave').DataTable({
    
                      data: splashArrayUnLeaveList,
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
                            className: "colLeavePaidLeave",
                            "targets": [5]
                           },  
                           {
                            className: "colLeaveShownOnPayslip",
                            "targets": [6]
                           },                        
                           {
                              className: "colDeleterei",
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
                          $('#tblLeave').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblLeave_ellipsis').addClass('disabled');
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
                                  let customerSearch = $('#tblLeave_filter input').val();
    
                                  sideBarService.getUnPaidLeave(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                    for (let i = 0; i < data.tunpaidleave.length; i++) {
                    
                                        var dataListAllowance = [
                                            data.tunpaidleave[i].fields.ID || '',
                                            data.tunpaidleave[i].fields.LeaveUnPaidName || '',
                                            data.tunpaidleave[i].fields.LeaveUnPaidUnits || '',
                                            data.tunpaidleave[i].fields.LeaveUnPaidNormalEntitlement || '',
                                            data.tunpaidleave[i].fields.LeaveUnPaidLeaveLoadingRate || '',
                                            false,
                                            data.tpaidleave[i].fields.LeaveUnPaidShowBalanceOnPayslip || false,
                                           '<td contenteditable="false" class="colDeletepaidrem"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                        ];
                      
                                        splashArrayUnLeaveList.push(dataListAllowance);
                                    }
                                              let uniqueChars = [...new Set(splashArrayUnLeaveList)];
                                              var datatable = $('#tblLeave').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblLeave").dataTable().fnPageChange('last');
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
                          $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblLeave_filter");
                          $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblLeave_filter");
    
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
                            sideBarService.getUnPaidLeave(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TUnpaidLeave', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
          sideBarService.getUnPaidLeave(initialBaseDataLoad, 0).then(function (data) {
              addVS1Data('TUnPaidLeave', JSON.stringify(data));
              let lineItems = [];
              let lineItemObj = {};
              for (let i = 0; i < data.tunpaidleave.length; i++) {
                    
                var dataListAllowance = [
                    data.tunpaidleave[i].fields.ID || '',
                    data.tunpaidleave[i].fields.LeaveUnPaidName || '',
                    data.tunpaidleave[i].fields.LeaveUnPaidUnits || '',
                    data.tunpaidleave[i].fields.LeaveUnPaidNormalEntitlement || '',
                    data.tunpaidleave[i].fields.LeaveUnPaidLeaveLoadingRate || '',
                    false,
                    data.tpaidleave[i].fields.LeaveUnPaidShowBalanceOnPayslip || false,
                   '<td contenteditable="false" class="colDeletepaidrem"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                ];

                splashArrayUnLeaveList.push(dataListAllowance);
            }
      
    
              setTimeout(function () {
                  MakeNegative();
              }, 100);
              setTimeout(function () {
                  $('#tblLeave').DataTable({
    
                      data: splashArrayUnLeaveList,
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
                            className: "colLeavePaidLeave",
                            "targets": [5]
                           },  
                           {
                            className: "colLeaveShownOnPayslip",
                            "targets": [6]
                           },                        
                           {
                              className: "colDeleterei",
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
                          $('#tblLeave').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblLeave_ellipsis').addClass('disabled');
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
                                  let customerSearch = $('#tblLeave_filter input').val();
    
                                  sideBarService.getUnPaidLeave(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                    for (let i = 0; i < data.tunpaidleave.length; i++) {
                    
                                        var dataListAllowance = [
                                            data.tunpaidleave[i].fields.ID || '',
                                            data.tunpaidleave[i].fields.LeaveUnPaidUnits || '',
                                            data.tunpaidleave[i].fields.LeaveUnPaidNormalEntitlement || '',
                                            data.tunpaidleave[i].fields.LeaveUnPaidLeaveLoadingRate || '',
                                            true,
                                            data.tunpaidleave[i].fields.LeaveUnPaidShowBalanceOnPayslip || false,
                                           '<td contenteditable="false" class="colDeletepaidrem"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                        ];
                        
                                        splashArrayUnLeaveList.push(dataListAllowance);
                                    }
    
                                         let uniqueChars = [...new Set(splashArrayUnLeaveList)];
                                         var datatable = $('#tblLeave').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblLeave").dataTable().fnPageChange('last');
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
                          $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblLeave_filter");
                          $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblLeave_filter");
    
                      }
    
                  }).on('page', function () {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
    
                  }).on('column-reorder', function () {
    
                  }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArrayUnLeaveList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');
    
                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getUnPaidLeave(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TUnpaidLeave', JSON.stringify(dataNonBo)).then(function (datareturn) {
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

    templateObject.getUnpaidLeaveTypeData();

    templateObject.getSuperannuationData = function(){
       
        getVS1Data('TSuperannuation').then(function(dataObject) {
            if (dataObject.length == 0) {
                 sideBarService.getSuperannuation(initialBaseDataLoad, 0).then(function (data) {
                  addVS1Data('TSuperannuation', JSON.stringify(data));
                  let lineItems = [];
                  let lineItemObj = {};
                
                  for (let i = 0; i < data.tsuperannuation.length; i++) {
                    
                      var dataListAllowance = [
                          data.tsuperannuation[i].fields.ID || '',
                          data.tsuperannuation[i].fields.Superfund || '',
                          data.tsuperannuation[i].fields.Supertypeid || '',
                          data.tsuperannuation[i].fields.Employeeid || '',
                          'Key Missing',
                          'Key Missing',
                          'Key Missing',
                          data.tsuperannuation[i].fields.Accountno || '',
                          'Key Missing',
                          '<td contenteditable="false" class="colDeletesup"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                      ];
    
                      splashArraySuperannuationList.push(dataListAllowance);
                  }
    
            
    
    
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);
                  setTimeout(function () {
                      $('#tblSuperannuation').DataTable({
    
                          data: splashArraySuperannuationList,
                          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                          columnDefs: [                              
                            
                               {
                                 className: "colSuperannuationID hiddenColumn",
                                 "targets": [0]
                               },
                               {
                                  className: "colSuperannuationName",
                                  "targets": [1]
                               },  
                               {
                                  className: "colSuperannuationType",
                                  "targets": [2]
                               },  
                               {
                                className: "colEmployerNum",
                                "targets": [3]
                               },  
                               {
                                className: "colabn",
                                "targets": [4]
                               },  
                               {
                                className: "colservicealias",
                                "targets": [5]
                               },  
                               {
                                className: "colbsb",
                                "targets": [6]
                               },  
                               {
                                className: "colaccountnumber",
                                "targets": [7]
                               },  
                               {
                                className: "colaccountname",
                                "targets": [8]
                               },  
                                                   
                               {
                                  className: "colDeletesup",
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
                              $('#tblSuperannuation').DataTable().ajax.reload();
                          },
                          "fnDrawCallback": function (oSettings) {
                              $('.paginate_button.page-item').removeClass('disabled');
                              $('#tblSuperannuation_ellipsis').addClass('disabled');
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
                                      var splashArraySuperannuationListDupp = new Array();
                                      let dataLenght = oSettings._iDisplayLength;
                                      let customerSearch = $('#tblSuperannuation_filter input').val();
    
                                      sideBarService.getSuperannuation(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
                     
                                        for (let i = 0; i < data.tsuperannuation.length; i++) {
                    
                                            var dataListAllowance = [
                                                data.tsuperannuation[i].fields.ID || '',
                                                data.tsuperannuation[i].fields.Superfund || '',
                                                data.tsuperannuation[i].fields.Supertypeid || '',
                                                data.tsuperannuation[i].fields.Employeeid || '',
                                                'Key Missing',
                                                'Key Missing',
                                                'Key Missing',
                                                data.tsuperannuation[i].fields.Accountno || '',
                                                'Key Missing',
                                                '<td contenteditable="false" class="colDeletesup"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                            ];
                          
                                            splashArraySuperannuationList.push(dataListAllowance);
                                        }
    
                                                  let uniqueChars = [...new Set(splashArraySuperannuationList)];
                                                  var datatable = $('#tblSuperannuation').DataTable();
                                                  datatable.clear();
                                                  datatable.rows.add(uniqueChars);
                                                  datatable.draw(false);
                                                  setTimeout(function () {
                                                    $("#tblSuperannuation").dataTable().fnPageChange('last');
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
                              $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblSuperannuation_filter");
                              $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblSuperannuation_filter");
    
                          }
    
                      }).on('page', function () {
                          setTimeout(function () {
                              MakeNegative();
                          }, 100);
    
                      }).on('column-reorder', function () {
    
                      }).on('length.dt', function (e, settings, len) {
                        //$('.fullScreenSpin').css('display', 'inline-block');
                        let dataLenght = settings._iDisplayLength;
                        splashArraySuperannuationList = [];
                        if (dataLenght == -1) {
                          $('.fullScreenSpin').css('display', 'none');
    
                        } else {
                            if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                                $('.fullScreenSpin').css('display', 'none');
                            } else {
                                sideBarService.getSuperannuation(dataLenght, 0).then(function (dataNonBo) {
    
                                    addVS1Data('TSuperannuation', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
            }
            else
            {
              let data = JSON.parse(dataObject[0].data);    
             
              let useData = data;
              let lineItems = [];
              let lineItemObj = {};
           
              for (let i = 0; i < data.tsuperannuation.length; i++) {
                     
               
                
                var dataListAllowance = [
                    data.tsuperannuation[i].fields.ID || '',
                    data.tsuperannuation[i].fields.Superfund || '',
                    data.tsuperannuation[i].fields.Supertypeid || '',
                    data.tsuperannuation[i].fields.Employeeid || '',
                    'Key Missing',
                    'Key Missing',
                    'Key Missing',
                    data.tsuperannuation[i].fields.Accountno || '',
                    'Key Missing',
                    '<td contenteditable="false" class="colDeletesup"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                ];

                splashArraySuperannuationList.push(dataListAllowance);
            }
        
    
    
              setTimeout(function () {
                  MakeNegative();
              }, 100);
              setTimeout(function () {
                  $('#tblSuperannuation').DataTable({
    
                      data: splashArraySuperannuationList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      columnDefs: [                              
                            
                        {
                          className: "colSuperannuationID hiddenColumn",
                          "targets": [0]
                        },
                        {
                           className: "colSuperannuationName",
                           "targets": [1]
                        },  
                        {
                           className: "colSuperannuationType",
                           "targets": [2]
                        },  
                        {
                         className: "colEmployerNum",
                         "targets": [3]
                        },  
                        {
                         className: "colabn",
                         "targets": [4]
                        },  
                        {
                         className: "colservicealias",
                         "targets": [5]
                        },  
                        {
                         className: "colbsb",
                         "targets": [6]
                        },  
                        {
                         className: "colaccountnumber",
                         "targets": [7]
                        },  
                        {
                         className: "colaccountname",
                         "targets": [8]
                        },  
                                            
                        {
                           className: "colDeletesup",
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
                          $('#tblSuperannuation').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblSuperannuation_ellipsis').addClass('disabled');
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
                                  var splashArraySuperannuationListDupp = new Array();
                                  let dataLenght = oSettings._iDisplayLength;
                                  let customerSearch = $('#splashArraySuperannuationList_filter input').val();
    
                                  sideBarService.getSuperannuation(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                     for (let i = 0; i < data.tsuperannuation.length; i++) {
                    
                                        var dataListAllowance = [
                                            data.tsuperannuation[i].fields.ID || '',
                                            data.tsuperannuation[i].fields.Superfund || '',
                                            data.tsuperannuation[i].fields.Supertypeid || '',
                                            data.tsuperannuation[i].fields.Employeeid || '',
                                            'Key Missing',
                                            'Key Missing',
                                            'Key Missing',
                                            data.tsuperannuation[i].fields.Accountno || '',
                                            'Key Missing',
                                            '<td contenteditable="false" class="colDeletesup"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                        ];
                        
                                        splashArraySuperannuationList.push(dataListAllowance);
                                      }
                                              let uniqueChars = [...new Set(splashArraySuperannuationList)];
                                              var datatable = $('#tblSuperannuation').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblSuperannuation").dataTable().fnPageChange('last');
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
                          $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblSuperannuation_filter");
                          $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblSuperannuation_filter");
    
                      }
    
                  }).on('page', function () {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
    
                  }).on('column-reorder', function () {
    
                  }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArraySuperannuationList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');
    
                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getSuperannuation(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TSuperannuation', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
          sideBarService.getSuperannuation(initialBaseDataLoad, 0).then(function (data) {
              addVS1Data('TSuperannuation', JSON.stringify(data));
              let lineItems = [];
              let lineItemObj = {};
              for (let i = 0; i < data.tsuperannuation.length; i++) {
                    
                var dataListAllowance = [
                    data.tsuperannuation[i].fields.ID || '',
                    data.tsuperannuation[i].fields.Superfund || '',
                    data.tsuperannuation[i].fields.Supertypeid || '',
                    data.tsuperannuation[i].fields.Employeeid || '',
                    'Key Missing',
                    'Key Missing',
                    'Key Missing',
                    data.tsuperannuation[i].fields.Accountno || '',
                    'Key Missing',
                    '<td contenteditable="false" class="colDeletesup"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                ];

                splashArraySuperannuationList.push(dataListAllowance);
              }
      
    
              setTimeout(function () {
                  MakeNegative();
              }, 100);
              setTimeout(function () {
                  $('#tblSuperannuation').DataTable({
    
                      data: splashArraySuperannuationList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      columnDefs: [                              
                            
                        {
                          className: "colSuperannuationID hiddenColumn",
                          "targets": [0]
                        },
                        {
                           className: "colSuperannuationName",
                           "targets": [1]
                        },  
                        {
                           className: "colSuperannuationType",
                           "targets": [2]
                        },  
                        {
                         className: "colEmployerNum",
                         "targets": [3]
                        },  
                        {
                         className: "colabn",
                         "targets": [4]
                        },  
                        {
                         className: "colservicealias",
                         "targets": [5]
                        },  
                        {
                         className: "colbsb",
                         "targets": [6]
                        },  
                        {
                         className: "colaccountnumber",
                         "targets": [7]
                        },  
                        {
                         className: "colaccountname",
                         "targets": [8]
                        },  
                                            
                        {
                           className: "colDeletesup",
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
                          $('#tblSuperannuation').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblSuperannuation_ellipsis').addClass('disabled');
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
                                  var splashArraySuperannuationListDupp = new Array();
                                  let dataLenght = oSettings._iDisplayLength;
                                  let customerSearch = $('#tblLeave_filter input').val();
    
                                  sideBarService.getSuperannuation(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                    for (let i = 0; i < data.tsuperannuation.length; i++) {
                    
                                        var dataListAllowance = [
                                            data.tsuperannuation[i].fields.ID || '',
                                            data.tsuperannuation[i].fields.Superfund || '',
                                            data.tsuperannuation[i].fields.Supertypeid || '',
                                            data.tsuperannuation[i].fields.Employeeid || '',
                                            'Key Missing',
                                            'Key Missing',
                                            'Key Missing',
                                            data.tsuperannuation[i].fields.Accountno || '',
                                            'Key Missing',
                                            '<td contenteditable="false" class="colDeletesup"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                        ];
                        
                                        splashArraySuperannuationList.push(dataListAllowance);
                                      }
    
                                         let uniqueChars = [...new Set(splashArraySuperannuationList)];
                                         var datatable = $('#tblSuperannuation').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblSuperannuation").dataTable().fnPageChange('last');
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
                          $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblSuperannuation_filter");
                          $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblSuperannuation_filter");
    
                      }
    
                  }).on('page', function () {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
    
                  }).on('column-reorder', function () {
    
                  }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArraySuperannuationList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');
    
                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getSuperannuation(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TSuperannuation', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
 
    templateObject.getSuperannuationData();
 
    templateObject.getHolidayData = function() {
        
        getVS1Data('TPayrollHolidays').then(function(dataObject) {
            if (dataObject.length == 0) {
                 sideBarService.getHolidayData(initialBaseDataLoad, 0).then(function (data) {
                  addVS1Data('TPayrollHolidays', JSON.stringify(data));
                  let lineItems = [];
                  let lineItemObj = {};
                
                  for (let i = 0; i < data.Tpayrollholidays.length; i++) {
                    
                      var dataListAllowance = [
                          data.Tpayrollholidays[i].fields.ID || '',
                          data.Tpayrollholidays[i].fields.PayrollHolidaysName || '',
                          data.Tpayrollholidays[i].fields.PayrollHolidaysDate || '',
                          data.Tpayrollholidays[i].fields.PayrollHolidaysGroupName || '',               
                          '<td contenteditable="false" class="colHolidayDelete"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                      ];
    
                      splashArrayHolidayList.push(dataListAllowance);
                  }
    
            
    
    
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);
                  setTimeout(function () {
                      $('#tblHolidays').DataTable({
    
                          data: splashArrayHolidayList,
                          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                          columnDefs: [                              
                            
                               {
                                 className: "colHolidayID hiddenColumn",
                                 "targets": [0]
                                },
                                {
                                  className: "colHolidayName",
                                  "targets": [1]
                                },  
                                {
                                  className: "colHolidayDate",
                                  "targets": [2]
                                },  
                                {
                                   className: "colHolidaygroup hiddenColumn",
                                   "targets": [3]
                                },                                                 
                               {
                                  className: "colHolidayDelete",
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
                              $('#tblHolidays').DataTable().ajax.reload();
                          },
                          "fnDrawCallback": function (oSettings) {
                              $('.paginate_button.page-item').removeClass('disabled');
                              $('#tblHolidays_ellipsis').addClass('disabled');
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
                                      var splashArrayHolidayListDupp = new Array();
                                      let dataLenght = oSettings._iDisplayLength;
                                      let customerSearch = $('#tblHolidays_filter input').val();
    
                                      sideBarService.getHolidayData(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                        for (let i = 0; i < data.Tpayrollholidays.length; i++) {
                    
                                            var dataListAllowance = [
                                                data.Tpayrollholidays[i].fields.ID || '',
                                                data.Tpayrollholidays[i].fields.PayrollHolidaysName || '',
                                                data.Tpayrollholidays[i].fields.PayrollHolidaysDate || '',
                                                data.Tpayrollholidays[i].fields.PayrollHolidaysGroupName || '',               
                                                '<td contenteditable="false" class="colHolidayDelete"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                            ];
                          
                                            splashArrayHolidayList.push(dataListAllowance);
                                        }
    
                                                  let uniqueChars = [...new Set(splashArrayHolidayList)];
                                                  var datatable = $('#tblHolidays').DataTable();
                                                  datatable.clear();
                                                  datatable.rows.add(uniqueChars);
                                                  datatable.draw(false);
                                                  setTimeout(function () {
                                                    $("#tblHolidays").dataTable().fnPageChange('last');
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
                              $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblHolidays_filter");
                              $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblHolidays_filter");
    
                          }
    
                      }).on('page', function () {
                          setTimeout(function () {
                              MakeNegative();
                          }, 100);
    
                      }).on('column-reorder', function () {
    
                      }).on('length.dt', function (e, settings, len) {
                        //$('.fullScreenSpin').css('display', 'inline-block');
                        let dataLenght = settings._iDisplayLength;
                        splashArrayHolidayList = [];
                        if (dataLenght == -1) {
                          $('.fullScreenSpin').css('display', 'none');
    
                        } else {
                            if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                                $('.fullScreenSpin').css('display', 'none');
                            } else {
                                sideBarService.getHolidayData(dataLenght, 0).then(function (dataNonBo) {
    
                                    addVS1Data('TPayrollHolidays', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
              for (let i = 0; i < data.Tpayrollholidays.length; i++) {
                    
                var dataListAllowance = [
                    data.tpayrollholidays[i].fields.ID || '',
                    data.tpayrollholidays[i].fields.PayrollHolidaysName || '',
                    moment(data.tpayrollholidays[i].fields.PayrollHolidaysDate).format('DD/MM/YYYY') || '',
                    data.tpayrollholidays[i].fields.PayrollHolidaysGroupName || '',   
                    '<td contenteditable="false" class="colHolidayDelete"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                ];

                splashArrayHolidayList.push(dataListAllowance);
            }
        
    
    
              setTimeout(function () {
                  MakeNegative();
              }, 100);
              setTimeout(function () {
                  $('#TPayrollHolidays').DataTable({
    
                      data: splashArrayHolidayList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      columnDefs: [                              
                            
                        {
                          className: "colHolidayID hiddenColumn",
                          "targets": [0]
                        },
                        {
                           className: "colHolidayName",
                           "targets": [1]
                        },  
                        {
                           className: "colHolidayDate",
                           "targets": [2]
                        }, 
                        {
                            className: "colHolidaygroup hiddenColumn",
                            "targets": [3]
                        },                                                   
                        {
                           className: "colHolidayDelete",
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
                          $('#tblHolidays').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblHolidays_ellipsis').addClass('disabled');
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
                                  var splashArrayHolidayListDupp = new Array();
                                  let dataLenght = oSettings._iDisplayLength;
                                  let customerSearch = $('#tblHolidays_filter input').val();
    
                                  sideBarService.getHolidayData(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                    for (let i = 0; i < data.Tpayrollholidays.length; i++) {
                    
                                        var dataListAllowance = [
                                            data.tpayrollholidays[i].fields.ID || '',
                                            data.tpayrollholidays[i].fields.PayrollHolidaysName || '',
                                            moment(data.tpayrollholidays[i].fields.PayrollHolidaysDate).format('DD/MM/YYYY') || '',
                                            data.tpayrollholidays[i].fields.PayrollHolidaysGroupName || '',   
                                            '<td contenteditable="false" class="colHolidayDelete"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                        ];
                        
                                        splashArrayHolidayList.push(dataListAllowance);
                                       }
                                              let uniqueChars = [...new Set(splashArrayHolidayList)];
                                              var datatable = $('#tblHolidays').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblHolidays").dataTable().fnPageChange('last');
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
                          $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblHolidays_filter");
                          $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblHolidays_filter");
    
                      }
    
                  }).on('page', function () {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
    
                  }).on('column-reorder', function () {
    
                  }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArrayHolidayList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');
    
                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getHolidayData(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TPayrollHolidays', JSON.stringify(dataNonBo)).then(function (datareturn) {
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

    
          sideBarService.getHolidayData(initialBaseDataLoad, 0).then(function (data) {
              addVS1Data('TPayrollHolidays', JSON.stringify(data));
              let lineItems = [];
              let lineItemObj = {};
             
              for (let i = 0; i < data.tpayrollholidays.length; i++) {
               
                var dataListAllowance = [
                    data.tpayrollholidays[i].fields.ID || '',
                    data.tpayrollholidays[i].fields.PayrollHolidaysName || '',
                    moment(data.tpayrollholidays[i].fields.PayrollHolidaysDate).format('DD/MM/YYYY') || '',
                    data.tpayrollholidays[i].fields.PayrollHolidaysGroupName || '',    
                    '<td contenteditable="false" class="colHolidayDelete"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                ];
                splashArrayHolidayList.push(dataListAllowance);
             }


        
              
              setTimeout(function () {
                  MakeNegative();
              }, 100);
              setTimeout(function () {
                  $('#tblHolidays').DataTable({
    
                      data: splashArrayHolidayList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      columnDefs: [                              
                            
                        {
                          className: "colHolidayID hiddenColumn",
                          "targets": [0]
                        },
                        {
                           className: "colHolidayName",
                           "targets": [1]
                        },  
                        {
                           className: "colHolidayDate",
                           "targets": [2]
                        },  
                        {
                            className: "colHolidaygroup hiddenColumn",
                            "targets": [3]
                        },                                                  
                        {
                           className: "colHolidayDelete",
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
                          $('#tblHolidays').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblHolidays_ellipsis').addClass('disabled');
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
                                  var splashArrayHolidayListDupp = new Array();
                                  let dataLenght = oSettings._iDisplayLength;
                                  let customerSearch = $('#tblHolidays_filter input').val();
    
                                  sideBarService.getHolidayData(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                    for (let i = 0; i < data.Tpayrollholidays.length; i++) {
                                    
                                        var dataListAllowance = [
                                            data.tpayrollholidays[i].fields.ID || '',
                                            data.tpayrollholidays[i].fields.PayrollHolidaysName || '',
                                            moment(data.tpayrollholidays[i].fields.PayrollHolidaysDate).format('DD/MM/YYYY') || '',  
                                            data.tpayrollholidays[i].fields.PayrollHolidaysGroupName || '',    
                                            '<td contenteditable="false" class="colHolidayDelete"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                        ];
                        
                                        splashArrayHolidayList.push(dataListAllowance);
                                    }
    
                                         let uniqueChars = [...new Set(splashArrayHolidayList)];
                                         var datatable = $('#tblHolidays').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblHolidays").dataTable().fnPageChange('last');
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
                          $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblHolidays_filter");
                          $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblHolidays_filter");
    
                      }
    
                  }).on('page', function () {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
    
                  }).on('column-reorder', function () {
    
                  }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArrayHolidayList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');
    
                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getHolidayData(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TPayrollHolidays', JSON.stringify(dataNonBo)).then(function (datareturn) {
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
    templateObject.getHolidayData();

    function getPayrollOrgainzation()
    {
        sideBarService.getPayrollinformation().then((dataListRet) => {
            for (let event in dataListRet) {
                let dataCopy = dataListRet[event];
                for (let data in dataCopy) {
                    let mainData = dataCopy[data];
                    
                     $('#editbankaccount').val(mainData.fields.PayrollBankAccount);
                     $('#editpaygbankaccount').val(mainData.fields.PayrollPaygLiabilityAccount);
                     $('#editwagesexpbankaccount').val(mainData.fields.PayrollWagesExpenseAccount);
                     $('#editwagespaybankaccount').val(mainData.fields.PayrollWagesPayableAccount);
                     $('#editsuperliabbankaccount').val(mainData.fields.PayrollSuperannuationLiabilityAccount);
                     $('#editsuperexpbankaccount').val(mainData.fields.PayrollSuperannuationPayableAccount);
                     $('#employegroup').val(mainData.fields.PayrollEmployeeGroup);
                     $('#timesheetcat').val(mainData.fields.PayrollTimesheetCategories);
                     $('#payrollsettingor').val(mainData.fields.ID);
                     
                     if(mainData.fields.PayrollShowAnnualSalary == true)
                     {
                         $('#swtShowAnnualSalary').attr("checked","checked");
                     }
                     else{
                        $('#swtShowAnnualSalary').removeAttr('checked');
                     }

                     if(mainData.fields.PayrollShowEmploymentBasis == true)
                     {
                         $('#swtShowEmploymentBasis').attr("checked","checked");
                     }
                     else{
                        $('#swtShowEmploymentBasis').removeAttr('checked');
                     }
                
        
                }
            }
            $('.fullScreenSpin').css('display','none');
        }).catch(function (err) {
          $('.fullScreenSpin').css('display','none');
          });

          let imageData= (localStorage.getItem("Image"));
          if(imageData)
          {
              $('#uploadedImage').attr('src', imageData);
              $('#uploadedImage').attr('width','50%');
              $('#removeLogo').show();
              $('#changeLogo').show();
          }
    }

    getPayrollOrgainzation();

    templateObject.getOrderdinaryEarning = function(){
            getVS1Data('TOrdinaryTimeEarnings').then(function(dataObject) {
            if (dataObject.length == 0) {
                 sideBarService.getOrdinarytimeEarning(initialBaseDataLoad, 0).then(function (data) {
                  addVS1Data('TOrdinaryTimeEarnings', JSON.stringify(data));
                  let lineItems = [];
                  let lineItemObj = {};
                  for (let i = 0; i < data.tordinarytimeearnings.length; i++) {
                    
                      var dataListAllowance = [
                          data.tordinarytimeearnings[i].fields.ID || '',
                          data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsName || 0,
                          'Ordinary Time Earning',
                          data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsDisplayName || 0,
                          $100,
                          data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || 0,
                       
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
                              className: "colEarningsAmount",
                              "targets": [4]
                             },  
                             {
                              className: "colEarningsAccounts",
                              "targets": [5]
                             },  
                             {
                              className: "colEarningsAccountsID hiddenColumn",
                              "targets": [6]
                             },   
                             {
                              className: "colEarningsPAYG hiddenColumn"  ,
                              "targets": [7]
                             },  
                             {
                              className: "colEarningsSuperannuation hiddenColumn",
                              "targets": [8]
                             },  
                             {
                              className: "colEarningsReportableasW1 hiddenColumn",
                              "targets": [9]
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
                                                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsName || 0,
                                                'Ordinary Time Earning',
                                                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsDisplayName || 0,
                                                $100,
                                                data.tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || 0,
                                             
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
                            //   $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblPayCalendars_filter");
                            //   $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#ttblPayCalendars_filter");
    
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
                    data.Tordinarytimeearnings[i].fields.ID || '',
                    data.Tordinarytimeearnings[i].fields.OrdinaryTimeEarningsName || 0,
                    'Ordinary Time Earning',
                    data.Tordinarytimeearnings[i].fields.OrdinaryTimeEarningsDisplayName || 0,
                    $100,
                    data.Tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || 0,
                    data.Tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptPaygWithholding || '',
                    data.Tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExpenseAccount || 0,
                    data.Tordinarytimeearnings[i].fields.OrdinaryTimeEarningsExemptSuperannuationGuaranteeCont || 0,
                    data.Tordinarytimeearnings[i].fields.OrdinaryTimeEarningsReportableW1onActivityStatement || 0,
                 
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
                            className: "colEarningsAmount",
                            "targets": [4]
                           },  
                           {
                            className: "colEarningsAccounts",
                            "targets": [5]
                           },  
                           {
                            className: "colEarningsAccountsID hiddenColumn",
                            "targets": [6]
                           },   
                           {
                            className: "colEarningsPAYG hiddenColumn"  ,
                            "targets": [7]
                           },  
                           {
                            className: "colEarningsSuperannuation hiddenColumn",
                            "targets": [8]
                           },  
                           {
                            className: "colEarningsReportableasW1 hiddenColumn",
                            "targets": [9]
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
                                            $100,
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
                          $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblEarnings_filter");
                          $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblEarnings_filter");
    
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
                                className: "colEarningsAmount",
                                "targets": [4]
                                },  
                                {
                                className: "colEarningsAccounts",
                                "targets": [5]
                                },  
                                {
                                className: "colEarningsAccountsID hiddenColumn",
                                "targets": [6]
                                },   
                                {
                                className: "colEarningsPAYG hiddenColumn"  ,
                                "targets": [7]
                                },  
                                {
                                className: "colEarningsSuperannuation hiddenColumn",
                                "targets": [8]
                                },  
                                {
                                className: "colEarningsReportableasW1 hiddenColumn",
                                "targets": [9]
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
                                  $("<button class='btn btn-primary btnAddNewAllowance' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblEarnings_filter");
                                  $("<button class='btn btn-primary btnRefreshAllowance' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblEarnings_filter");
            
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

    templateObject.getOrderdinaryEarning();


//     $('#tblAlowances tbody').on( 'click', 'td:not(.colDeleteAllowances)', function () {
     
//       var listData = $(this).closest('tr').find('.colAlowancesID').text();
//       if(listData){
//       let allowanceType = $(this).closest('tr').find('.colAllowancesType').text()||'';
//       let earningName = $(this).closest('tr').find('.colAllowancesNames').text()||'';
//       let earningDisplayName = $(this).closest('tr').find('.colAllowancesDisplayName').text()||'';
//       let earningAmount = $(this).closest('tr').find('.colAllowancesAmount').text()||'0.00';
//       let earningExpenseAccount = $(this).closest('tr').find('.colAllowancesAccounts').text()||'';
//       let earningExpenseAccountID = $(this).closest('tr').find('.colAllowancesAccountsID').text()||'';
//       let exemptPAYG = $(this).closest('tr').find('.colAllowancesPAYG').text()||'false';
//       let exemptSupernation = $(this).closest('tr').find('.colAllowancesSuperannuation').text()||'false';
//       let exemptActivityStatement = $(this).closest('tr').find('.colAllowancesReportableasW1').text()||'false';

//       $('#edtAllowanceID').val(listData);
//       $('#edtAllowanceType').val(allowanceType);
//       $('#edtEarningsNameAllowance').val(earningName);
//       $('#edtDisplayNameAllowance').val(earningDisplayName);
//       $('#edtAllowanceAmount').val(earningAmount);
//       $('#edtExpenseAccountAllowance').val(earningExpenseAccount);

//       $('#editbankaccount').val(earningExpenseAccount);
//       $('#edtReimbursementAccount').val(earningExpenseAccount);
//       $('#editpaygbankaccount').val(earningExpenseAccount);
//       $('#editwagesexpbankaccount').val(earningExpenseAccount);
//       $('#editwagespaybankaccount').val(earningExpenseAccount);
//       $('#editsuperliabbankaccount').val(earningExpenseAccount);
//       $('#editsuperexpbankaccount').val(earningExpenseAccount); 

//       $('#edtExpenseAccountDirectorsFees').val(earningExpenseAccount);
//       $('#edtExpenseAccountTermnination').val(earningExpenseAccount);
//       $('#edtExpenseAccount').val(earningExpenseAccount);
//       $('#edtExpenseAccountOvertime').val(earningExpenseAccount);
//       $('#edtExpenseAccountLumpSumE').val(earningExpenseAccount);
//       $('#edtExpenseAccountBonusesCommissions').val(earningExpenseAccount);
//       $('#edtExpenseAccountLumpSumW').val(earningExpenseAccount);
//       $('#edtExpenseAccountID').val(earningExpenseAccountID);

//       if(exemptPAYG == 'true'){
//           $('#formCheck-ExemptPAYGAllowance').prop('checked', true);
//       }else{
//         $('#formCheck-ExemptPAYGAllowance').prop('checked', false);
//       }

//       if(exemptSupernation == 'true'){
//           $('#formCheck-ExemptSuperannuationAllowance').prop('checked', true);
//       }else{
//         $('#formCheck-ExemptSuperannuationAllowance').prop('checked', false);
//       }

//       if(exemptActivityStatement == 'true'){
//           $('#formCheck-ExemptReportableAllowance').prop('checked', true);
//       }else{
//         $('#formCheck-ExemptReportableAllowance').prop('checked', false);
//       }

//       $('#allowanceModal').modal('toggle');

//     }
//     });

//     $('#tblDeductions tbody').on( 'click', 'td:not(.colDeleteDeductions)', function () {
//     var listData = $(this).closest('tr').find('.colDeductionsID').text();
//     if(listData){
//       let deductionType = $(this).closest('tr').find('.colDeductionsType').text()||'';
//       let deductionName = $(this).closest('tr').find('.colDeductionsNames').text()||'';
//       let deductionDisplayName = $(this).closest('tr').find('.colDeductionsDisplayName').text()||'';
//       let deductionAmount = $(this).closest('tr').find('.colDeductionsAmount').text()||'0.00';
//       let deductionAccount = $(this).closest('tr').find('.colDeductionsAccounts').text()||'';
//       let deductionAccountID = $(this).closest('tr').find('.colDeductionsAccountsID').text()||'';
//       let deductionexemptPAYG = $(this).closest('tr').find('.colDeductionsPAYG').text()||'false';
//       let deductionexemptSupernation = $(this).closest('tr').find('.colDeductionsSuperannuation').text()||'false';
//       let deductionexemptActivityStatement = $(this).closest('tr').find('.colDeductionsReportableasW1').text()||'false';

//       $('#edtDeductionID').val(listData);
//       //$('#edtAllowanceType').val(allowanceType);
//       $('#edtDeductionName').val(deductionName);
//       //$('#edtDisplayNameAllowance').val(earningDisplayName);
//       $('#edtDeductionAmount').val(deductionAmount);
//       $('#edtDeductionAccount').val(deductionAccount);
//       $('#edtDeductionAccountID').val(deductionAccountID);
//         if(deductionType == 'None'){
//             $('#noneLabel').html('None');
//             $('#edtDeductionTitle').val('None');
//         }
//         if(deductionType == 'Workplace Giving'){
//           $('#noneLabel').html('Workplace Giving');
//           $('#edtDeductionTitle').val('WorkplaceGiving');
//         }
//         if(deductionType == 'Union / Association Fees'){
//           $('#noneLabel').html('Union / Association Fees');
//           $('#edtDeductionTitle').val('UnionAssociationFees');
//         }


  

  //  $('#tblDeductions tbody').on( 'click', 'td:not(.colDeleteDeductions)', function () {
 //   var listData = $(this).closest('tr').find('.colDeductionsID').text();
  //  if(listData){
  //    let deductionType = $(this).closest('tr').find('.colDeductionsType').text()||'';
  //    let deductionName = $(this).closest('tr').find('.colDeductionsNames').text()||'';
   //   let deductionDisplayName = $(this).closest('tr').find('.colDeductionsDisplayName').text()||'';
 //    let deductionAmount = $(this).closest('tr').find('.colDeductionsAmount').text()||'0.00';
//      let deductionAccount = $(this).closest('tr').find('.colDeductionsAccounts').text()||'';
 //     let deductionAccountID = $(this).closest('tr').find('.colDeductionsAccountsID').text()||'';
 //     let deductionexemptPAYG = $(this).closest('tr').find('.colDeductionsPAYG').text()||'false';
 //     let deductionexemptSupernation = $(this).closest('tr').find('.colDeductionsSuperannuation').text()||'false';
 //     let deductionexemptActivityStatement = $(this).closest('tr').find('.colDeductionsReportableasW1').text()||'false';
//
  //    $('#edtDeductionID').val(listData);
 //     $('#edtAllowanceType').val(allowanceType);
 //     $('#edtDeductionName').val(deductionName);
 //     $('#edtDisplayNameAllowance').val(earningDisplayName);
 //     $('#edtDeductionAmount').val(deductionAmount);
 //     $('#edtDeductionAccount').val(deductionAccount);
 //     $('#edtDeductionAccountID').val(deductionAccountID);
  //      if(deductionType == 'None'){
 //           $('#noneLabel').html('None');
  //          $('#edtDeductionTitle').val('None');
 //       }
 //       if(deductionType == 'Workplace Giving'){
 //         $('#noneLabel').html('Workplace Giving');
 //         $('#edtDeductionTitle').val('WorkplaceGiving');
 //       }
 //       if(deductionType == 'Union / Association Fees'){
 //         $('#noneLabel').html('Union / Association Fees');
  //        $('#edtDeductionTitle').val('UnionAssociationFees');
  //      }
//
//
 //       $('#deductionModal').modal('toggle');
//
 //  }
//    });


     setTimeout(function() {
        $('#tblPayRollRulesList').DataTable({
            columnDefs: [{
                "orderable": false,
                "targets": -1
            }],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "taxratelist_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible'
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Tax Rate List',
                filename: "taxratelist_" + moment().format(),
                exportOptions: {
                    columns: ':visible'
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
                fixedColumnsRight: 1
            },
            lengthMenu: [
                [25, -1],
                [25, "All"]
            ],
            // bStateSave: true,
            // rowId: 0,
            paging: true,
            info: true,
            responsive: true,
            "order": [
                [0, "asc"]
            ],
            action: function() {
                $('#tblPayRollRulesList').DataTable().ajax.reload();
            },
            "fnDrawCallback": function(oSettings) {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
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

        // $('#currencyLists').DataTable().column( 0 ).visible( true );
        $('.fullScreenSpin').css('display', 'none');
     }, 0);

  
    $(document).on('click', '.colDeleteAllowances', function() {
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').find('.colAlowancesID').text()||0; // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteAllowanceLineModal').modal('toggle');
    });
   
    

    $(document).on('click', '.colDeleteCalenders', function(event) {
        event.stopPropagation();
        let targetID = $(event.target).closest('tr').find('.colCalenderID').text()||0; // table row ID
      
        let calenderName = $(this).closest('tr').find('.colPayCalendarName').text()||'';
    
        $('#selectColDeleteLineID').val(targetID);
        $('#selectCalenderName').val(targetID);
        $('#deleteCalenderLineModal').modal('toggle');
    });

    $(document).on('click', '.colDeleteDeductions', function() {
        event.stopPropagation();
        var listData = $(this).closest('tr').find('.colDeductionsID').text();
        var targetID = $(event.target).closest('tr').find('.colDeleteDeductions').text()||0; // table row ID
        var listData = $(this).closest('tr').find('.colDeductionsID').text();
        let deductionType = $(this).closest('tr').find('.colDeductionsType').text()||'';
        let deductionName = $(this).closest('tr').find('.colDeductionsNames').text()||'';
        let deductionDisplayName = $(this).closest('tr').find('.colDeductionsDisplayName').text()||'';
        let deductionAmount = $(this).closest('tr').find('.colDeductionsAmount').text()||'0.00';
        let deductionAccount = $(this).closest('tr').find('.colDeductionsAccounts').text()||'';
        let deductionAccountID = $(this).closest('tr').find('.colDeductionsAccountsID').text()||'';
        let deductionexemptPAYG = $(this).closest('tr').find('.colDeductionsPAYG').text()||'false';
        let deductionexemptSupernation = $(this).closest('tr').find('.colDeductionsSuperannuation').text()||'false';
        let deductionexemptActivityStatement = $(this).closest('tr').find('.colDeductionsReportableasW1').text()||'false';
        
    
        $('#selectDeleteLineID').val(listData);     
        $('#selectAccountid').val(deductionAccountID);
        $('#selectAccountname').val(deductionAccount);  
        $('#selectdeductionAmount').val(deductionAmount);
        $('#selectideductionName').val(deductionName);
        $('#selectdisplayName').val(deductionDisplayName);
        $('#deleteDeductionLineModal').modal('toggle');
    });

    $(document).on('click', '.colDeleterei', function() {
        event.stopPropagation();
    
        var targetID = $(event.target).closest('tr').find('.colReimbursementID').text()||0; // table row ID
       
        $('#seleclReiName').val(targetID);     
        $('#selectColReiDeleteLineID').val(targetID); 
      
        $('#deletebReiumbursementLineModal').modal('toggle');
    });

    $(document).on('click', '.colDeletepaidrem', function() {
        event.stopPropagation();
    
        var targetID = $(event.target).closest('tr').find('.colLeaveID').text()||0; // table row ID
        var Type = $(event.target).closest('tr').find('.colLeavePaidLeave').text()||0;
       
        $('#selectLeaveName').val(targetID);     
        $('#selectLeaveDeleteLineID').val(targetID); 

        if(Type == true)
        {
             $('#leave_type').val(true); 

        }
        else{
            $('#leave_type').val(false); 

        }
      
        $('#deleteLeaveLineModal').modal('toggle');
    });

    $(document).on('click', '.colDeletesup', function() {
        event.stopPropagation();
    
        var targetID = $(event.target).closest('tr').find('.colSuperannuationID').text()||0; // table row ID
        var Name = $(event.target).closest('tr').find('.colSuperannuationName').text()||0;
       
        $('#selectSuperannuationDeleteLineID').val(targetID);     
        $('#selectSuperannuationName').val(targetID);  
   
        $('#deleteSuperannuationLineModal').modal('toggle');
    });


    
    $(document).on('click', '.colHolidayDelete', function() {
        event.stopPropagation();
    
        var targetID = $(event.target).closest('tr').find('.colHolidayID').text()||0; // table row ID
        var Name = $(event.target).closest('tr').find('.colPayCalendarName').text()||0;
       
        $('#selectholidayDeleteLineID').val(targetID);     
        $('#selectholidayName').val(targetID);  
   
        $('#deleteHolidayLineModal').modal('toggle');
        
    });



    $(document).ready(function() {
    
      $('#edtAllowanceType').editableSelect();
      $('#edtAllowanceType').editableSelect('add','Car');
      $('#edtAllowanceType').editableSelect('add','JobKeeper');
      $('#edtAllowanceType').editableSelect('add','Laundry');
      $('#edtAllowanceType').editableSelect('add','Meals');
      $('#edtAllowanceType').editableSelect('add','Qualifications');
      $('#edtAllowanceType').editableSelect('add','Tasks');
      $('#edtAllowanceType').editableSelect('add','Tools');
      $('#edtAllowanceType').editableSelect('add','Transport');
      $('#edtAllowanceType').editableSelect('add','Travel');
      $('#edtAllowanceType').editableSelect('add','Other');

      $('#employegroup').editableSelect('add','None');
      $('#employegroup').editableSelect('add','Region');
      $('#timesheetcat').editableSelect('add','None');
      $('#timesheetcat').editableSelect('add','Region');

      $('#payperiod').editableSelect('add','Weekly');
      $('#payperiod').editableSelect('add','Fortnightly');
      $('#payperiod').editableSelect('add','Twice Monthly');
      $('#payperiod').editableSelect('add','Four Weekly');
      $('#payperiod').editableSelect('add','Monthly');
      $('#payperiod').editableSelect('add','Quarterly');
      $('#edtTypeOfUnits').editableSelect('add','Hours');
      $('#edtTypeOfUnits').editableSelect('add','Days');
      $('#edtTypeOfUnits').editableSelect('add','Weeks');
      $('#edtTypeOfUnits').editableSelect('add','Monthly');
      $('#edtUnpaidTypeOfUnits').editableSelect('add','Hours');
      $('#edtUnpaidTypeOfUnits').editableSelect('add','Days');
      $('#edtUnpaidTypeOfUnits').editableSelect('add','Weeks');
      $('#edtUnpaidTypeOfUnits').editableSelect('add','Monthly');
      $('#edtExpenseAccountAllowance').editableSelect();
      $('#editbankaccount').editableSelect();
      $('#editpaygbankaccount').editableSelect();
      $('#edtReimbursementAccount').editableSelect();
      $('#editwagesexpbankaccount').editableSelect();
      $('#editwagespaybankaccount').editableSelect();
      $('#editsuperliabbankaccount').editableSelect();
      $('#editsuperexpbankaccount').editableSelect();
      $('#edtExpenseAccountDirectorsFees').editableSelect();
      $('#edtExpenseAccountTermnination').editableSelect();
      $('#edtExpenseAccount').editableSelect();
      $('#edtExpenseAccountOvertime').editableSelect();
      $('#edtExpenseAccountLumpSumE').editableSelect();
      $('#edtExpenseAccountBonusesCommissions').editableSelect();
      $('#edtExpenseAccountLumpSumW').editableSelect();
      $('#edtDeductionAccount').editableSelect();
      $('#edtRateTypeOvertime').editableSelect();
      $('#edtRateType').editableSelect();
      $('#edtRateTypeTermnination').editableSelect();
      $('#edtRateTypeLumpSumE').editableSelect();
      $('#edtRateTypeBonusesCommissions').editableSelect();
      $('#edtRateTypeDirectorsFees').editableSelect();
      $('#edtRateTypeLumpSumW').editableSelect();
      $('#edtFundType').editableSelect();

    });

     $('#editbankaccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('editbankaccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('BANK');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('editbankaccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('BANK');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });
    
     $('#editpaygbankaccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('editpaygbankaccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('LTLIAB');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('editpaygbankaccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('LTLIAB');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

    $('#edtReimbursementAccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('edtReimbursementAccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('LTLIAB');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtReimbursementAccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('LTLIAB');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });


     $('#editwagesexpbankaccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('editwagesexpbankaccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('editwagesexpbankaccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

     $('#editwagespaybankaccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('editwagespaybankaccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('AP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('editwagespaybankaccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('AP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });
    
     $('#editsuperliabbankaccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('editsuperliabbankaccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('OCLIAB');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('editsuperliabbankaccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('OCLIAB');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

     $('#editsuperexpbankaccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('editsuperexpbankaccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('editsuperexpbankaccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

     $('#edtExpenseAccountAllowance').editableSelect().on('click.editable-select', function (e, li) {
      var $earch = $(this);
      var offset = $earch.offset();
      let accountService = new AccountService();
      const accountTypeList = [];
      var accountDataName = e.target.value ||'';

      if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
         $('#selectLineID').val('edtExpenseAccountAllowance');
        $('#accountListModal').modal();
        setTimeout(function () {
            $('#tblAccount_filter .form-control-sm').focus();
            $('#tblAccount_filter .form-control-sm').val('EXP');
            $('#tblAccount_filter .form-control-sm').trigger("input");
            var datatable = $('#tblAccountlist').DataTable();
            datatable.draw();
            $('#tblAccountlist_filter .form-control-sm').trigger("input");
        }, 500);
       }else{
         if(accountDataName.replace(/\s/g, '') != ''){
           getVS1Data('TAccountVS1').then(function (dataObject) {
               if (dataObject.length == 0) {
                 accountService.getOneAccountByName(accountDataName).then(function (data) {
                   let lineItems = [];
                   let lineItemObj = {};
                   let fullAccountTypeName = '';
                   let accBalance = '';
                   $('#add-account-title').text('Edit Account Details');
                   $('#edtAccountName').attr('readonly', true);
                   $('#sltAccountType').attr('readonly', true);
                   $('#sltAccountType').attr('disabled', 'disabled');
                   if (accountTypeList) {
                       for (var h = 0; h < accountTypeList.length; h++) {

                           if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                               fullAccountTypeName = accountTypeList[h].description || '';

                           }
                       }

                   }

                    var accountid = data.taccountvs1[0].fields.ID || '';
                    var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                    var accountname = data.taccountvs1[0].fields.AccountName || '';
                    var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                    var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                    var accountdesc = data.taccountvs1[0].fields.Description || '';
                    var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                    var bankbsb = data.taccountvs1[0].fields.BSB || '';
                    var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                    var swiftCode = data.taccountvs1[0].fields.Extra || '';
                    var routingNo = data.taccountvs1[0].fields.BankCode || '';

                    var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                    var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                   var cardcvc = data.taccountvs1[0].fields.CVC || '';
                   var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                    if ((accounttype === "BANK")) {
                        $('.isBankAccount').removeClass('isNotBankAccount');
                        $('.isCreditAccount').addClass('isNotCreditAccount');
                    }else if ((accounttype === "CCARD")) {
                        $('.isCreditAccount').removeClass('isNotCreditAccount');
                        $('.isBankAccount').addClass('isNotBankAccount');
                    } else {
                        $('.isBankAccount').addClass('isNotBankAccount');
                        $('.isCreditAccount').addClass('isNotCreditAccount');
                    }

                    $('#edtAccountID').val(accountid);
                    $('#sltAccountType').val(accounttype);
                    $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                    $('#edtAccountName').val(accountname);
                    $('#edtAccountNo').val(accountno);
                    $('#sltTaxCode').val(taxcode);
                    $('#txaAccountDescription').val(accountdesc);
                    $('#edtBankAccountName').val(bankaccountname);
                    $('#edtBSB').val(bankbsb);
                    $('#edtBankAccountNo').val(bankacountno);
                    $('#swiftCode').val(swiftCode);
                    $('#routingNo').val(routingNo);
                    $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                    $('#edtCardNumber').val(cardnumber);
                    $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                    $('#edtCvc').val(cardcvc);

                    if(showTrans == 'true'){
                        $('.showOnTransactions').prop('checked', true);
                    }else{
                      $('.showOnTransactions').prop('checked', false);
                    }

                    setTimeout(function () {
                        $('#addNewAccount').modal('show');
                    }, 500);

                 }).catch(function (err) {
                     $('.fullScreenSpin').css('display','none');
                 });
               } else {
                   let data = JSON.parse(dataObject[0].data);
                   let useData = data.taccountvs1;
                     var added=false;
                   let lineItems = [];
                   let lineItemObj = {};
                   let fullAccountTypeName = '';
                   let accBalance = '';
                   $('#add-account-title').text('Edit Account Details');
                   $('#edtAccountName').attr('readonly', true);
                   $('#sltAccountType').attr('readonly', true);
                   $('#sltAccountType').attr('disabled', 'disabled');
                   for (let a = 0; a < data.taccountvs1.length; a++) {

                     if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                       added = true;
                       if (accountTypeList) {
                           for (var h = 0; h < accountTypeList.length; h++) {

                               if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                   fullAccountTypeName = accountTypeList[h].description || '';

                               }
                           }

                       }



                var accountid = data.taccountvs1[a].fields.ID || '';
                var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                var accountname = data.taccountvs1[a].fields.AccountName || '';
                var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                var accountdesc = data.taccountvs1[a].fields.Description || '';
                var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                var bankbsb = data.taccountvs1[a].fields.BSB || '';
                var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';

                var swiftCode = data.taccountvs1[a].fields.Extra || '';
                var routingNo = data.taccountvs1[a].BankCode || '';

                var showTrans = data.taccountvs1[a].fields.IsHeader || false;

                var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                var cardcvc = data.taccountvs1[a].fields.CVC || '';
                var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';

                if ((accounttype === "BANK")) {
                    $('.isBankAccount').removeClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }else if ((accounttype === "CCARD")) {
                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                    $('.isBankAccount').addClass('isNotBankAccount');
                } else {
                    $('.isBankAccount').addClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }

                $('#edtAccountID').val(accountid);
                $('#sltAccountType').val(accounttype);
                $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                $('#edtAccountName').val(accountname);
                $('#edtAccountNo').val(accountno);
                $('#sltTaxCode').val(taxcode);
                $('#txaAccountDescription').val(accountdesc);
                $('#edtBankAccountName').val(bankaccountname);
                $('#edtBSB').val(bankbsb);
                $('#edtBankAccountNo').val(bankacountno);
                $('#swiftCode').val(swiftCode);
                $('#routingNo').val(routingNo);
                $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                $('#edtCardNumber').val(cardnumber);
                $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                $('#edtCvc').val(cardcvc);

                if(showTrans == 'true'){
                    $('.showOnTransactions').prop('checked', true);
                }else{
                  $('.showOnTransactions').prop('checked', false);
                }

                setTimeout(function () {
                    $('#addNewAccount').modal('show');
                }, 500);

                     }
                   }
                   if(!added) {
                     accountService.getOneAccountByName(accountDataName).then(function (data) {
                       let lineItems = [];
                       let lineItemObj = {};
                       let fullAccountTypeName = '';
                       let accBalance = '';
                       $('#add-account-title').text('Edit Account Details');
                       $('#edtAccountName').attr('readonly', true);
                       $('#sltAccountType').attr('readonly', true);
                       $('#sltAccountType').attr('disabled', 'disabled');
                       if (accountTypeList) {
                           for (var h = 0; h < accountTypeList.length; h++) {

                               if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                   fullAccountTypeName = accountTypeList[h].description || '';

                               }
                           }

                       }

                        var accountid = data.taccountvs1[0].fields.ID || '';
                        var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                        var accountname = data.taccountvs1[0].fields.AccountName || '';
                        var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                        var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                        var accountdesc = data.taccountvs1[0].fields.Description || '';
                        var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                        var bankbsb = data.taccountvs1[0].fields.BSB || '';
                        var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                        var swiftCode = data.taccountvs1[0].fields.Extra || '';
                        var routingNo = data.taccountvs1[0].fields.BankCode || '';

                        var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                        var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                       var cardcvc = data.taccountvs1[0].fields.CVC || '';
                       var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                        if ((accounttype === "BANK")) {
                            $('.isBankAccount').removeClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        }else if ((accounttype === "CCARD")) {
                            $('.isCreditAccount').removeClass('isNotCreditAccount');
                            $('.isBankAccount').addClass('isNotBankAccount');
                        } else {
                            $('.isBankAccount').addClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        }

                        $('#edtAccountID').val(accountid);
                        $('#sltAccountType').val(accounttype);
                        $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                        $('#edtAccountName').val(accountname);
                        $('#edtAccountNo').val(accountno);
                        $('#sltTaxCode').val(taxcode);
                        $('#txaAccountDescription').val(accountdesc);
                        $('#edtBankAccountName').val(bankaccountname);
                        $('#edtBSB').val(bankbsb);
                        $('#edtBankAccountNo').val(bankacountno);
                        $('#swiftCode').val(swiftCode);
                        $('#routingNo').val(routingNo);
                        $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                        $('#edtCardNumber').val(cardnumber);
                        $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                        $('#edtCvc').val(cardcvc);

                        if(showTrans == 'true'){
                            $('.showOnTransactions').prop('checked', true);
                        }else{
                          $('.showOnTransactions').prop('checked', false);
                        }

                        setTimeout(function () {
                            $('#addNewAccount').modal('show');
                        }, 500);

                     }).catch(function (err) {
                         $('.fullScreenSpin').css('display','none');
                     });
                   }

               }
           }).catch(function (err) {
             accountService.getOneAccountByName(accountDataName).then(function (data) {
               let lineItems = [];
               let lineItemObj = {};
               let fullAccountTypeName = '';
               let accBalance = '';
               $('#add-account-title').text('Edit Account Details');
               $('#edtAccountName').attr('readonly', true);
               $('#sltAccountType').attr('readonly', true);
               $('#sltAccountType').attr('disabled', 'disabled');
               if (accountTypeList) {
                   for (var h = 0; h < accountTypeList.length; h++) {

                       if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                           fullAccountTypeName = accountTypeList[h].description || '';

                       }
                   }

               }

                var accountid = data.taccountvs1[0].fields.ID || '';
                var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                var accountname = data.taccountvs1[0].fields.AccountName || '';
                var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                var accountdesc = data.taccountvs1[0].fields.Description || '';
                var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                var bankbsb = data.taccountvs1[0].fields.BSB || '';
                var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                var swiftCode = data.taccountvs1[0].fields.Extra || '';
                var routingNo = data.taccountvs1[0].fields.BankCode || '';

                var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
               var cardcvc = data.taccountvs1[0].fields.CVC || '';
               var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                if ((accounttype === "BANK")) {
                    $('.isBankAccount').removeClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }else if ((accounttype === "CCARD")) {
                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                    $('.isBankAccount').addClass('isNotBankAccount');
                } else {
                    $('.isBankAccount').addClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }

                $('#edtAccountID').val(accountid);
                $('#sltAccountType').val(accounttype);
                $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                $('#edtAccountName').val(accountname);
                $('#edtAccountNo').val(accountno);
                $('#sltTaxCode').val(taxcode);
                $('#txaAccountDescription').val(accountdesc);
                $('#edtBankAccountName').val(bankaccountname);
                $('#edtBSB').val(bankbsb);
                $('#edtBankAccountNo').val(bankacountno);
                $('#swiftCode').val(swiftCode);
                $('#routingNo').val(routingNo);
                $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                $('#edtCardNumber').val(cardnumber);
                $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                $('#edtCvc').val(cardcvc);

                if(showTrans == 'true'){
                    $('.showOnTransactions').prop('checked', true);
                }else{
                  $('.showOnTransactions').prop('checked', false);
                }

                setTimeout(function () {
                    $('#addNewAccount').modal('show');
                }, 500);

             }).catch(function (err) {
                 $('.fullScreenSpin').css('display','none');
             });

           });
           $('#addAccountModal').modal('toggle');
         }else{
           $('#selectLineID').val('edtExpenseAccountAllowance');
           $('#accountListModal').modal();
           setTimeout(function () {
             $('#tblAccount_filter .form-control-sm').focus();
             $('#tblAccount_filter .form-control-sm').val('EXP');
             $('#tblAccount_filter .form-control-sm').trigger("input");
               var datatable = $('#tblSupplierlist').DataTable();
               datatable.draw();
               $('#tblAccount_filter .form-control-sm').trigger("input");
           }, 500);
         }
       }


     });

    $('#edtExpenseAccountDirectorsFees').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
           $('#selectLineID').val('edtExpenseAccountDirectorsFees');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtExpenseAccountDirectorsFees');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });
    
    $('#edtExpenseAccountTermnination').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
           $('#selectLineID').val('edtExpenseAccountTermnination');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtExpenseAccountTermnination');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

    $('#edtExpenseAccount').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('edtExpenseAccount');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtExpenseAccount');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

    $('#edtExpenseAccountOvertime').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('edtExpenseAccountOvertime');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                    var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
                                   
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }

                       
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtExpenseAccountOvertime');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

    $('#edtExpenseAccountLumpSumE').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('edtExpenseAccountLumpSumE');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtExpenseAccountLumpSumE');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

     $('#edtExpenseAccountBonusesCommissions').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('edtExpenseAccountBonusesCommissions');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtExpenseAccountBonusesCommissions');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

    $('#edtExpenseAccountLumpSumW').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var   accountDataName = e.target.value ||'';
  
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectLineID').val('edtExpenseAccountLumpSumW');
          $('#accountListModal').modal();
          setTimeout(function () {
              $('#tblAccount_filter .form-control-sm').focus();
              $('#tblAccount_filter .form-control-sm').val('EXP');
              $('#tblAccount_filter .form-control-sm').trigger("input");
              var datatable = $('#tblAccountlist').DataTable();
              datatable.draw();
              $('#tblAccountlist_filter .form-control-sm').trigger("input");
          }, 500);
         }else{
           if(accountDataName.replace(/\s/g, '') != ''){
             getVS1Data('TAccountVS1').then(function (dataObject) {
                 if (dataObject.length == 0) {
                   accountService.getOneAccountByName(accountDataName).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     if (accountTypeList) {
                         for (var h = 0; h < accountTypeList.length; h++) {
  
                             if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                 fullAccountTypeName = accountTypeList[h].description || '';
  
                             }
                         }
  
                     }
  
                      var accountid = data.taccountvs1[0].fields.ID || '';
                      var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                      var accountname = data.taccountvs1[0].fields.AccountName || '';
                      var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                      var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                      var accountdesc = data.taccountvs1[0].fields.Description || '';
                      var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                      var bankbsb = data.taccountvs1[0].fields.BSB || '';
                      var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                      var swiftCode = data.taccountvs1[0].fields.Extra || '';
                      var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                      var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                      var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                     var cardcvc = data.taccountvs1[0].fields.CVC || '';
                     var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                      if ((accounttype === "BANK")) {
                          $('.isBankAccount').removeClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }else if ((accounttype === "CCARD")) {
                          $('.isCreditAccount').removeClass('isNotCreditAccount');
                          $('.isBankAccount').addClass('isNotBankAccount');
                      } else {
                          $('.isBankAccount').addClass('isNotBankAccount');
                          $('.isCreditAccount').addClass('isNotCreditAccount');
                      }
  
                      $('#edtAccountID').val(accountid);
                      $('#sltAccountType').val(accounttype);
                      $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                      $('#edtAccountName').val(accountname);
                      $('#edtAccountNo').val(accountno);
                      $('#sltTaxCode').val(taxcode);
                      $('#txaAccountDescription').val(accountdesc);
                      $('#edtBankAccountName').val(bankaccountname);
                      $('#edtBSB').val(bankbsb);
                      $('#edtBankAccountNo').val(bankacountno);
                      $('#swiftCode').val(swiftCode);
                      $('#routingNo').val(routingNo);
                      $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                      $('#edtCardNumber').val(cardnumber);
                      $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                      $('#edtCvc').val(cardcvc);
  
                      if(showTrans == 'true'){
                          $('.showOnTransactions').prop('checked', true);
                      }else{
                        $('.showOnTransactions').prop('checked', false);
                      }
  
                      setTimeout(function () {
                          $('#addNewAccount').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.taccountvs1;
                       var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullAccountTypeName = '';
                     let accBalance = '';
                     $('#add-account-title').text('Edit Account Details');
                     $('#edtAccountName').attr('readonly', true);
                     $('#sltAccountType').attr('readonly', true);
                     $('#sltAccountType').attr('disabled', 'disabled');
                     for (let a = 0; a < data.taccountvs1.length; a++) {
  
                       if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                         added = true;
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
  
  
                  var accountid = data.taccountvs1[a].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                  var accountname = data.taccountvs1[a].fields.AccountName || '';
                  var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[a].fields.Description || '';
                  var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[a].fields.BSB || '';
                  var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[a].fields.Extra || '';
                  var routingNo = data.taccountvs1[a].BankCode || '';
  
                  var showTrans = data.taccountvs1[a].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                  var cardcvc = data.taccountvs1[a].fields.CVC || '';
                  var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
                       }
                     }
                     if(!added) {
                       accountService.getOneAccountByName(accountDataName).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                         let accBalance = '';
                         $('#add-account-title').text('Edit Account Details');
                         $('#edtAccountName').attr('readonly', true);
                         $('#sltAccountType').attr('readonly', true);
                         $('#sltAccountType').attr('disabled', 'disabled');
                         if (accountTypeList) {
                             for (var h = 0; h < accountTypeList.length; h++) {
  
                                 if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                                     fullAccountTypeName = accountTypeList[h].description || '';
  
                                 }
                             }
  
                         }
  
                          var accountid = data.taccountvs1[0].fields.ID || '';
                          var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                          var accountname = data.taccountvs1[0].fields.AccountName || '';
                          var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                          var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                          var accountdesc = data.taccountvs1[0].fields.Description || '';
                          var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                          var bankbsb = data.taccountvs1[0].fields.BSB || '';
                          var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                          var swiftCode = data.taccountvs1[0].fields.Extra || '';
                          var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                          var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                          var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                         var cardcvc = data.taccountvs1[0].fields.CVC || '';
                         var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                          if ((accounttype === "BANK")) {
                              $('.isBankAccount').removeClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }else if ((accounttype === "CCARD")) {
                              $('.isCreditAccount').removeClass('isNotCreditAccount');
                              $('.isBankAccount').addClass('isNotBankAccount');
                          } else {
                              $('.isBankAccount').addClass('isNotBankAccount');
                              $('.isCreditAccount').addClass('isNotCreditAccount');
                          }
  
                          $('#edtAccountID').val(accountid);
                          $('#sltAccountType').val(accounttype);
                          $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                          $('#edtAccountName').val(accountname);
                          $('#edtAccountNo').val(accountno);
                          $('#sltTaxCode').val(taxcode);
                          $('#txaAccountDescription').val(accountdesc);
                          $('#edtBankAccountName').val(bankaccountname);
                          $('#edtBSB').val(bankbsb);
                          $('#edtBankAccountNo').val(bankacountno);
                          $('#swiftCode').val(swiftCode);
                          $('#routingNo').val(routingNo);
                          $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                          $('#edtCardNumber').val(cardnumber);
                          $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                          $('#edtCvc').val(cardcvc);
  
                          if(showTrans == 'true'){
                              $('.showOnTransactions').prop('checked', true);
                          }else{
                            $('.showOnTransactions').prop('checked', false);
                          }
  
                          setTimeout(function () {
                              $('#addNewAccount').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
               accountService.getOneAccountByName(accountDataName).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
                 let accBalance = '';
                 $('#add-account-title').text('Edit Account Details');
                 $('#edtAccountName').attr('readonly', true);
                 $('#sltAccountType').attr('readonly', true);
                 $('#sltAccountType').attr('disabled', 'disabled');
                 if (accountTypeList) {
                     for (var h = 0; h < accountTypeList.length; h++) {
  
                         if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
  
                             fullAccountTypeName = accountTypeList[h].description || '';
  
                         }
                     }
  
                 }
  
                  var accountid = data.taccountvs1[0].fields.ID || '';
                  var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                  var accountname = data.taccountvs1[0].fields.AccountName || '';
                  var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                  var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                  var accountdesc = data.taccountvs1[0].fields.Description || '';
                  var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                  var bankbsb = data.taccountvs1[0].fields.BSB || '';
                  var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
  
                  var swiftCode = data.taccountvs1[0].fields.Extra || '';
                  var routingNo = data.taccountvs1[0].fields.BankCode || '';
  
                  var showTrans = data.taccountvs1[0].fields.IsHeader || false;
  
                  var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
  
                  if ((accounttype === "BANK")) {
                      $('.isBankAccount').removeClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }else if ((accounttype === "CCARD")) {
                      $('.isCreditAccount').removeClass('isNotCreditAccount');
                      $('.isBankAccount').addClass('isNotBankAccount');
                  } else {
                      $('.isBankAccount').addClass('isNotBankAccount');
                      $('.isCreditAccount').addClass('isNotCreditAccount');
                  }
  
                  $('#edtAccountID').val(accountid);
                  $('#sltAccountType').val(accounttype);
                  $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                  $('#edtAccountName').val(accountname);
                  $('#edtAccountNo').val(accountno);
                  $('#sltTaxCode').val(taxcode);
                  $('#txaAccountDescription').val(accountdesc);
                  $('#edtBankAccountName').val(bankaccountname);
                  $('#edtBSB').val(bankbsb);
                  $('#edtBankAccountNo').val(bankacountno);
                  $('#swiftCode').val(swiftCode);
                  $('#routingNo').val(routingNo);
                  $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
  
                  $('#edtCardNumber').val(cardnumber);
                  $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                  $('#edtCvc').val(cardcvc);
  
                  if(showTrans == 'true'){
                      $('.showOnTransactions').prop('checked', true);
                  }else{
                    $('.showOnTransactions').prop('checked', false);
                  }
  
                  setTimeout(function () {
                      $('#addNewAccount').modal('show');
                  }, 500);
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
             });
             $('#addAccountModal').modal('toggle');
           }else{
             $('#selectLineID').val('edtExpenseAccountLumpSumW');
             $('#accountListModal').modal();
             setTimeout(function () {
               $('#tblAccount_filter .form-control-sm').focus();
               $('#tblAccount_filter .form-control-sm').val('EXP');
               $('#tblAccount_filter .form-control-sm').trigger("input");
                 var datatable = $('#tblSupplierlist').DataTable();
                 datatable.draw();
                 $('#tblAccount_filter .form-control-sm').trigger("input");
             }, 500);
           }
         }
  
  
      });

    // $('#edtDeductionAccount').editableSelect().on('click.editable-select', function (e, li) {
    //   var $earch = $(this);
    //   var offset = $earch.offset();
    //   let accountService = new AccountService();
    //   const accountTypeList = [];
    //   var accountDataName = e.target.value ||'';

    //   if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
    //      $('#selectLineID').val('edtDeductionAccount');
    //     $('#accountListModal').modal();
    //     setTimeout(function () {
    //         $('#tblAccount_filter .form-control-sm').focus();
    //         $('#tblAccount_filter .form-control-sm').val('');
    //         $('#tblAccount_filter .form-control-sm').trigger("input");
    //         var datatable = $('#tblAccountlist').DataTable();
    //         datatable.draw();
    //         $('#tblAccountlist_filter .form-control-sm').trigger("input");
    //     }, 500);
    //    }else{
    //      if(accountDataName.replace(/\s/g, '') != ''){
    //        getVS1Data('TAccountVS1').then(function (dataObject) {
    //            if (dataObject.length == 0) {
    //              accountService.getOneAccountByName(accountDataName).then(function (data) {
    //                let lineItems = [];
    //                let lineItemObj = {};
    //                let fullAccountTypeName = '';
    //                let accBalance = '';
    //                $('#add-account-title').text('Edit Account Details');
    //                $('#edtAccountName').attr('readonly', true);
    //                $('#sltAccountType').attr('readonly', true);
    //                $('#sltAccountType').attr('disabled', 'disabled');
    //                if (accountTypeList) {
    //                    for (var h = 0; h < accountTypeList.length; h++) {

    //                        if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

    //                            fullAccountTypeName = accountTypeList[h].description || '';

    //                        }
    //                    }

    //                }

    //                 var accountid = data.taccountvs1[0].fields.ID || '';
    //                 var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
    //                 var accountname = data.taccountvs1[0].fields.AccountName || '';
    //                 var accountno = data.taccountvs1[0].fields.AccountNumber || '';
    //                 var taxcode = data.taccountvs1[0].fields.TaxCode || '';
    //                 var accountdesc = data.taccountvs1[0].fields.Description || '';
    //                 var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
    //                 var bankbsb = data.taccountvs1[0].fields.BSB || '';
    //                 var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

    //                 var swiftCode = data.taccountvs1[0].fields.Extra || '';
    //                 var routingNo = data.taccountvs1[0].fields.BankCode || '';

    //                 var showTrans = data.taccountvs1[0].fields.IsHeader || false;

    //                 var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
    //                 var cardcvc = data.taccountvs1[0].fields.CVC || '';
    //                 var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

    //                 if ((accounttype === "BANK")) {
    //                     $('.isBankAccount').removeClass('isNotBankAccount');
    //                     $('.isCreditAccount').addClass('isNotCreditAccount');
    //                 }else if ((accounttype === "CCARD")) {
    //                     $('.isCreditAccount').removeClass('isNotCreditAccount');
    //                     $('.isBankAccount').addClass('isNotBankAccount');
    //                 } else {
    //                     $('.isBankAccount').addClass('isNotBankAccount');
    //                     $('.isCreditAccount').addClass('isNotCreditAccount');
    //                 }

    //                 $('#edtAccountID').val(accountid);
    //                 $('#sltAccountType').val(accounttype);
    //                 $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
    //                 $('#edtAccountName').val(accountname);
    //                 $('#edtAccountNo').val(accountno);
    //                 $('#sltTaxCode').val(taxcode);
    //                 $('#txaAccountDescription').val(accountdesc);
    //                 $('#edtBankAccountName').val(bankaccountname);
    //                 $('#edtBSB').val(bankbsb);
    //                 $('#edtBankAccountNo').val(bankacountno);
    //                 $('#swiftCode').val(swiftCode);
    //                 $('#routingNo').val(routingNo);
    //                 $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

    //                 $('#edtCardNumber').val(cardnumber);
    //                 $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
    //                 $('#edtCvc').val(cardcvc);

    //                 if(showTrans == 'true'){
    //                     $('.showOnTransactions').prop('checked', true);
    //                 }else{
    //                   $('.showOnTransactions').prop('checked', false);
    //                 }

    //                 setTimeout(function () {
    //                     $('#addNewAccount').modal('show');
    //                 }, 500);

    //              }).catch(function (err) {
    //                  $('.fullScreenSpin').css('display','none');
    //              });
    //            } else {
    //                let data = JSON.parse(dataObject[0].data);
    //                let useData = data.taccountvs1;
    //                  var added=false;
    //                let lineItems = [];
    //                let lineItemObj = {};
    //                let fullAccountTypeName = '';
    //                let accBalance = '';
    //                $('#add-account-title').text('Edit Account Details');
    //                $('#edtAccountName').attr('readonly', true);
    //                $('#sltAccountType').attr('readonly', true);
    //                $('#sltAccountType').attr('disabled', 'disabled');
    //                for (let a = 0; a < data.taccountvs1.length; a++) {

    //                  if((data.taccountvs1[a].fields.AccountName) === accountDataName){
    //                    added = true;
    //                    if (accountTypeList) {
    //                        for (var h = 0; h < accountTypeList.length; h++) {

    //                            if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {

    //                                fullAccountTypeName = accountTypeList[h].description || '';

    //                            }
    //                        }

    //                    }



    //             var accountid = data.taccountvs1[a].fields.ID || '';
    //             var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
    //             var accountname = data.taccountvs1[a].fields.AccountName || '';
    //             var accountno = data.taccountvs1[a].fields.AccountNumber || '';
    //             var taxcode = data.taccountvs1[a].fields.TaxCode || '';
    //             var accountdesc = data.taccountvs1[a].fields.Description || '';
    //             var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
    //             var bankbsb = data.taccountvs1[a].fields.BSB || '';
    //             var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';

    //             var swiftCode = data.taccountvs1[a].fields.Extra || '';
    //             var routingNo = data.taccountvs1[a].BankCode || '';

    //             var showTrans = data.taccountvs1[a].fields.IsHeader || false;

    //             var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
    //             var cardcvc = data.taccountvs1[a].fields.CVC || '';
    //             var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';

    //             if ((accounttype === "BANK")) {
    //                 $('.isBankAccount').removeClass('isNotBankAccount');
    //                 $('.isCreditAccount').addClass('isNotCreditAccount');
    //             }else if ((accounttype === "CCARD")) {
    //                 $('.isCreditAccount').removeClass('isNotCreditAccount');
    //                 $('.isBankAccount').addClass('isNotBankAccount');
    //             } else {
    //                 $('.isBankAccount').addClass('isNotBankAccount');
    //                 $('.isCreditAccount').addClass('isNotCreditAccount');
    //             }

    //             $('#edtAccountID').val(accountid);
    //             $('#sltAccountType').val(accounttype);
    //             $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
    //             $('#edtAccountName').val(accountname);
    //             $('#edtAccountNo').val(accountno);
    //             $('#sltTaxCode').val(taxcode);
    //             $('#txaAccountDescription').val(accountdesc);
    //             $('#edtBankAccountName').val(bankaccountname);
    //             $('#edtBSB').val(bankbsb);
    //             $('#edtBankAccountNo').val(bankacountno);
    //             $('#swiftCode').val(swiftCode);
    //             $('#routingNo').val(routingNo);
    //             $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

    //             $('#edtCardNumber').val(cardnumber);
    //             $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
    //             $('#edtCvc').val(cardcvc);

    //             if(showTrans == 'true'){
    //                 $('.showOnTransactions').prop('checked', true);
    //             }else{
    //               $('.showOnTransactions').prop('checked', false);
    //             }

    //             setTimeout(function () {
    //                 $('#addNewAccount').modal('show');
    //             }, 500);

    //                  }
    //                }
    //                if(!added) {
    //                  accountService.getOneAccountByName(accountDataName).then(function (data) {
    //                    let lineItems = [];
    //                    let lineItemObj = {};
    //                    let fullAccountTypeName = '';
    //                    let accBalance = '';
    //                    $('#add-account-title').text('Edit Account Details');
    //                    $('#edtAccountName').attr('readonly', true);
    //                    $('#sltAccountType').attr('readonly', true);
    //                    $('#sltAccountType').attr('disabled', 'disabled');
    //                    if (accountTypeList) {
    //                        for (var h = 0; h < accountTypeList.length; h++) {

    //                            if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

    //                                fullAccountTypeName = accountTypeList[h].description || '';

    //                            }
    //                        }

    //                    }

    //                     var accountid = data.taccountvs1[0].fields.ID || '';
    //                     var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
    //                     var accountname = data.taccountvs1[0].fields.AccountName || '';
    //                     var accountno = data.taccountvs1[0].fields.AccountNumber || '';
    //                     var taxcode = data.taccountvs1[0].fields.TaxCode || '';
    //                     var accountdesc = data.taccountvs1[0].fields.Description || '';
    //                     var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
    //                     var bankbsb = data.taccountvs1[0].fields.BSB || '';
    //                     var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

    //                     var swiftCode = data.taccountvs1[0].fields.Extra || '';
    //                     var routingNo = data.taccountvs1[0].fields.BankCode || '';

    //                     var showTrans = data.taccountvs1[0].fields.IsHeader || false;

    //                     var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
    //                    var cardcvc = data.taccountvs1[0].fields.CVC || '';
    //                    var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

    //                     if ((accounttype === "BANK")) {
    //                         $('.isBankAccount').removeClass('isNotBankAccount');
    //                         $('.isCreditAccount').addClass('isNotCreditAccount');
    //                     }else if ((accounttype === "CCARD")) {
    //                         $('.isCreditAccount').removeClass('isNotCreditAccount');
    //                         $('.isBankAccount').addClass('isNotBankAccount');
    //                     } else {
    //                         $('.isBankAccount').addClass('isNotBankAccount');
    //                         $('.isCreditAccount').addClass('isNotCreditAccount');
    //                     }

    //                     $('#edtAccountID').val(accountid);
    //                     $('#sltAccountType').val(accounttype);
    //                     $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
    //                     $('#edtAccountName').val(accountname);
    //                     $('#edtAccountNo').val(accountno);
    //                     $('#sltTaxCode').val(taxcode);
    //                     $('#txaAccountDescription').val(accountdesc);
    //                     $('#edtBankAccountName').val(bankaccountname);
    //                     $('#edtBSB').val(bankbsb);
    //                     $('#edtBankAccountNo').val(bankacountno);
    //                     $('#swiftCode').val(swiftCode);
    //                     $('#routingNo').val(routingNo);
    //                     $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

    //                     $('#edtCardNumber').val(cardnumber);
    //                     $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
    //                     $('#edtCvc').val(cardcvc);

    //                     if(showTrans == 'true'){
    //                         $('.showOnTransactions').prop('checked', true);
    //                     }else{
    //                       $('.showOnTransactions').prop('checked', false);
    //                     }

    //                     setTimeout(function () {
    //                         $('#addNewAccount').modal('show');
    //                     }, 500);

    //                  }).catch(function (err) {
    //                      $('.fullScreenSpin').css('display','none');
    //                  });
    //                }

    //            }
    //        }).catch(function (err) {
    //          accountService.getOneAccountByName(accountDataName).then(function (data) {
    //            let lineItems = [];
    //            let lineItemObj = {};
    //            let fullAccountTypeName = '';
    //            let accBalance = '';
    //            $('#add-account-title').text('Edit Account Details');
    //            $('#edtAccountName').attr('readonly', true);
    //            $('#sltAccountType').attr('readonly', true);
    //            $('#sltAccountType').attr('disabled', 'disabled');
    //            if (accountTypeList) {
    //                for (var h = 0; h < accountTypeList.length; h++) {

    //                    if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

    //                        fullAccountTypeName = accountTypeList[h].description || '';

    //                    }
    //                }

    //            }

    //             var accountid = data.taccountvs1[0].fields.ID || '';
    //             var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
    //             var accountname = data.taccountvs1[0].fields.AccountName || '';
    //             var accountno = data.taccountvs1[0].fields.AccountNumber || '';
    //             var taxcode = data.taccountvs1[0].fields.TaxCode || '';
    //             var accountdesc = data.taccountvs1[0].fields.Description || '';
    //             var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
    //             var bankbsb = data.taccountvs1[0].fields.BSB || '';
    //             var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

    //             var swiftCode = data.taccountvs1[0].fields.Extra || '';
    //             var routingNo = data.taccountvs1[0].fields.BankCode || '';

    //             var showTrans = data.taccountvs1[0].fields.IsHeader || false;

    //             var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
    //            var cardcvc = data.taccountvs1[0].fields.CVC || '';
    //            var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

    //             if ((accounttype === "BANK")) {
    //                 $('.isBankAccount').removeClass('isNotBankAccount');
    //                 $('.isCreditAccount').addClass('isNotCreditAccount');
    //             }else if ((accounttype === "CCARD")) {
    //                 $('.isCreditAccount').removeClass('isNotCreditAccount');
    //                 $('.isBankAccount').addClass('isNotBankAccount');
    //             } else {
    //                 $('.isBankAccount').addClass('isNotBankAccount');
    //                 $('.isCreditAccount').addClass('isNotCreditAccount');
    //             }

    //             $('#edtAccountID').val(accountid);
    //             $('#sltAccountType').val(accounttype);
    //             $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
    //             $('#edtAccountName').val(accountname);
    //             $('#edtAccountNo').val(accountno);
    //             $('#sltTaxCode').val(taxcode);
    //             $('#txaAccountDescription').val(accountdesc);
    //             $('#edtBankAccountName').val(bankaccountname);
    //             $('#edtBSB').val(bankbsb);
    //             $('#edtBankAccountNo').val(bankacountno);
    //             $('#swiftCode').val(swiftCode);
    //             $('#routingNo').val(routingNo);
    //             $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

    //             $('#edtCardNumber').val(cardnumber);
    //             $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
    //             $('#edtCvc').val(cardcvc);

    //             if(showTrans == 'true'){
    //                 $('.showOnTransactions').prop('checked', true);
    //             }else{
    //               $('.showOnTransactions').prop('checked', false);
    //             }

    //             setTimeout(function () {
    //                 $('#addNewAccount').modal('show');
    //             }, 500);

    //          }).catch(function (err) {
    //              $('.fullScreenSpin').css('display','none');
    //          });

    //        });
    //        $('#addAccountModal').modal('toggle');
    //      }else{
    //         $('#selectLineID').val('edtDeductionAccount');
    //        $('#accountListModal').modal();
    //        setTimeout(function () {
    //          $('#tblAccount_filter .form-control-sm').focus();
    //          $('#tblAccount_filter .form-control-sm').val('');
    //          $('#tblAccount_filter .form-control-sm').trigger("input");
    //            var datatable = $('#tblSupplierlist').DataTable();
    //            datatable.draw();
    //            $('#tblAccount_filter .form-control-sm').trigger("input");
    //        }, 500);
    //      }
    //    }
    
    //                     $('#edtCardNumber').val(cardnumber);
   //                     $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
  //                      $('#edtCvc').val(cardcvc);
//
   //                     if(showTrans == 'true'){
   //                         $('.showOnTransactions').prop('checked', true);
   //                     }else{
   //                       $('.showOnTransactions').prop('checked', false);
   //                     }
//
  //                      setTimeout(function () {
  //                          $('#addNewAccount').modal('show');
  //                      }, 500);
//
  //                   }).catch(function (err) {
 //                        $('.fullScreenSpin').css('display','none');
 //                    });
 //                  }
//
 //              }
 //          }).catch(function (err) {
  //           accountService.getOneAccountByName(accountDataName).then(function (data) {
 //              let lineItems = [];
 //              let lineItemObj = {};
  //             let fullAccountTypeName = '';
 //              let accBalance = '';
  //             $('#add-account-title').text('Edit Account Details');
 //              $('#edtAccountName').attr('readonly', true);
 //              $('#sltAccountType').attr('readonly', true);
 //              $('#sltAccountType').attr('disabled', 'disabled');
 //             if (accountTypeList) {
 //                  for (var h = 0; h < accountTypeList.length; h++) {
//
 //                      if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {
//
  //                         fullAccountTypeName = accountTypeList[h].description || '';
//
  //                     }
 //                  }
//
  //             }
//
 //               var accountid = data.taccountvs1[0].fields.ID || '';
 //               var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
  //              var accountname = data.taccountvs1[0].fields.AccountName || '';
 //               var accountno = data.taccountvs1[0].fields.AccountNumber || '';
 //              var taxcode = data.taccountvs1[0].fields.TaxCode || '';
//                var accountdesc = data.taccountvs1[0].fields.Description || '';
 //               var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
//                var bankbsb = data.taccountvs1[0].fields.BSB || '';
//                var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';
//
 //               var swiftCode = data.taccountvs1[0].fields.Extra || '';
 //               var routingNo = data.taccountvs1[0].fields.BankCode || '';
//
 //               var showTrans = data.taccountvs1[0].fields.IsHeader || false;
//
 //               var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
 //              var cardcvc = data.taccountvs1[0].fields.CVC || '';
 //              var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';
//
 //               if ((accounttype === "BANK")) {
 //                   $('.isBankAccount').removeClass('isNotBankAccount');
  //                  $('.isCreditAccount').addClass('isNotCreditAccount');
 //               }else if ((accounttype === "CCARD")) {
  //                  $('.isCreditAccount').removeClass('isNotCreditAccount');
 //                   $('.isBankAccount').addClass('isNotBankAccount');
 //               } else {
 //                   $('.isBankAccount').addClass('isNotBankAccount');
 //                   $('.isCreditAccount').addClass('isNotCreditAccount');
 //               }
//
    //            $('#edtAccountID').val(accountid);
    //            $('#sltAccountType').val(accounttype);
   //             $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
   //            $('#edtAccountName').val(accountname);
    //            $('#edtAccountNo').val(accountno);
    //            $('#sltTaxCode').val(taxcode);
   //             $('#txaAccountDescription').val(accountdesc);
   //             $('#edtBankAccountName').val(bankaccountname);
   //             $('#edtBSB').val(bankbsb);
   //             $('#edtBankAccountNo').val(bankacountno);
   //             $('#swiftCode').val(swiftCode);
   //             $('#routingNo').val(routingNo);
   //             $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');
//
  //              $('#edtCardNumber').val(cardnumber);
  //              $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
   //             $('#edtCvc').val(cardcvc);
//
   //             if(showTrans == 'true'){
  //                  $('.showOnTransactions').prop('checked', true);
  //              }else{
   //               $('.showOnTransactions').prop('checked', false);
   //             }
//
   //             setTimeout(function () {
    //                $('#addNewAccount').modal('show');
   //             }, 500);
//
   //          }).catch(function (err) {
   //              $('.fullScreenSpin').css('display','none');
    //         });
//
    //       });
    //       $('#addAccountModal').modal('toggle');
    //     }else{
   //         $('#selectLineID').val('edtDeductionAccount');
   //        $('#accountListModal').modal();
   //        setTimeout(function () {
   //          $('#tblAccount_filter .form-control-sm').focus();
    //         $('#tblAccount_filter .form-control-sm').val('');
   //          $('#tblAccount_filter .form-control-sm').trigger("input");
 //              var datatable = $('#tblSupplierlist').DataTable();
  //             datatable.draw();
 //              $('#tblAccount_filter .form-control-sm').trigger("input");
   //        }, 500);
  //       }
 //      }
//
//
// });
    
    $('#edtRateTypeOvertime').editableSelect().on('click.editable-select', function (e, li) {
       
        var $earch = $(this);
        var offset = $earch.offset();
        let ratetypeService = new RateTypeService();
        const ratetypelist = [];
         var  Description = e.target.value ||'';

        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectRateLineID').val('edtRateTypeOvertime');
          $('#rateTypeListModel').modal();
          $('#tblratetypelist_filter .form-control-sm').focus();
          $('#tblratetypelist_filter .form-control-sm').val();
          $('#tblratetypelist_filter .form-control-sm').trigger("input");
          setTimeout(function () {
             var datatable = $('#tblratetypelist').DataTable();
             datatable.draw();   
             $('#tblratetypelist_filter .form-control-sm').trigger("input");       
          }, 500);
         }else{
           if(Description.replace(/\s/g, '') != ''){
             getVS1Data('TRateTypes').then(function (dataObject) {
              if (dataObject.length == 0) {
                     ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                      $('#add-rateype-title').text('Edit Rate Type Details');
            
                     if (ratetypelist) {
                         for (var h = 0; h < ratetypelist.length; h++) {
  
                             if (data.tpayratetype[0].fields.Description === ratetypelist[h].description) {
  
                                fullDescriptionname = ratetypelist[h].description || '';
  
                             }
                         }
  
                     }
  
                      var ratetypeid = data.tpayratetype[0].fields.ID || '';
                      var description = fullDescriptionname || data.tpayratetype[0].fields.Description;
                   
            
                      $('#edtRateID').val(ratetypeid);
                      $('#edtRateDescription').val(description);
               
                      
                      setTimeout(function () {
                          $('#addRateModel').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.tpayratetype;
                     var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                  
                     $('#add-rateype-title').text('Edit Rate Type Details');
                     $('#edtRateID').attr('readonly', true);
                     $('#edtRateDescription').attr('readonly', true);
            
                     for (let a = 0; a < data.tpayratetype.length; a++) {
  
                       if((data.tpayratetype[a].fields.Description) === Description){
                         added = true;
                         if (ratetypelist) {
                             for (var h = 0; h < ratetypelist.length; h++) {
  
                                 if (data.tpayratetype[a].fields.Description === ratetypelist[h].Description) {
  
                                    fullDescriptionname = ratetypelist[h].Description || '';

                                     console.log('Description '+fullDescriptionname);
  
                                 }
                             }
  
                         }
  
  
  
                  var ratetypeid = data.tpayratetype[a].fields.ID || '';
                  var ratetypedescription = fullDescriptionname || data.tpayratetype[a].fields.Description;
             
                  $('#edtRateID').val(ratetypeid);
                  $('#edtRateDescription').val(ratetypedescription);
                  
                  setTimeout(function () {
                      $('#addRateModel').modal('show');
                       }, 500); } }

                     if(!added) {
                        ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                      
                         $('#add-rateype-title').text('Edit Rate Type Details');                  
                         $('#edtRateID').attr('readonly', true);
                         $('#edtRateDescription').attr('readonly', true);
                         if (ratetypelist) {
                             for (var h = 0; h < ratetypelist.length; h++) {
  
                                 if (data.tpayratetype[0].fields.Description === ratetypelist[h].Description) {
  
                                     fullAccountTypeName = ratetypelist[h].description || '';
  
                                 }
                             }
  
                         }

                          var ratetypeid = data.tpayratetype[0].fields.ID || '';
                          var ratetypedescription = fullAccountTypeName || data.tpayratetype[0].fields.Description;
                         
                          $('#edtRateID').val(ratetypeid);
                          $('#edtRateDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addRateModel').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
                ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
              
                 $('#add-rateype-title').text('Edit Rate Type Details');                  
                 $('#edtRateID').attr('readonly', true);
                 $('#edtRateDescription').attr('readonly', true);

                 if (ratetypelist) {
                    for (var h = 0; h < ratetypelist.length; h++) {

                        if (data.tpayratetype[a].fields.Description === ratetypelist[h].Description) {
                            fullDescriptionname = ratetypelist[h].Description || '';
                            console.log('Description '+fullDescriptionname);
                        }
                    }

                }
  
                 var ratetypeid = data.tpayratetype[0].fields.ID || '';
                 var ratetypedescription = fullAccountTypeName || data.tpayratetype[0].fields.Description;
                         
                          $('#edtRateID').val(ratetypeid);
                          $('#edtRateDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addRateModel').modal('show');
                          }, 500);
  
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
               });
               $('#addRateModel').modal('toggle');
           }else{
             $('#selectRateLineID').val('edtRateTypeOvertime');
             $('#rateTypeListModel').modal();
             setTimeout(function () {
                  var datatable = $('#tblratetypelist').DataTable();
                 datatable.draw();
               
             }, 500);
           }
         }
  
      });
    
    $('#edtRateType').editableSelect().on('click.editable-select', function (e, li) {
       
        var $earch = $(this);
        var offset = $earch.offset();
        let ratetypeService = new RateTypeService();
        const ratetypelist = [];
         var  Description = e.target.value ||'';

        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectRateLineID').val('edtRateType');
          $('#rateTypeListModel').modal();
          $('#tblratetypelist_filter .form-control-sm').focus();
          $('#tblratetypelist_filter .form-control-sm').val();
          $('#tblratetypelist_filter .form-control-sm').trigger("input");
          setTimeout(function () {
             var datatable = $('#tblratetypelist').DataTable();
             datatable.draw();   
             $('#tblratetypelist_filter .form-control-sm').trigger("input");       
          }, 500);
         }else{
           if(Description.replace(/\s/g, '') != ''){
             getVS1Data('TRateTypes').then(function (dataObject) {
              if (dataObject.length == 0) {
                     ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                      $('#add-rateype-title').text('Edit Rate Type Details');
            
                     if (ratetypelist) {
                         for (var h = 0; h < ratetypelist.length; h++) {
  
                             if (data.tpayratetype[0].fields.Description === ratetypelist[h].description) {
  
                                fullDescriptionname = ratetypelist[h].description || '';
  
                             }
                         }
  
                     }
  
                      var ratetypeid = data.tpayratetype[0].fields.ID || '';
                      var description = fullDescriptionname || data.tpayratetype[0].fields.Description;
                   
            
                      $('#edtRateID').val(ratetypeid);
                      $('#edtRateDescription').val(description);
               
                      
                      setTimeout(function () {
                          $('#addRateModel').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.tpayratetype;
                     var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                  
                     $('#add-rateype-title').text('Edit Rate Type Details');
                     $('#edtRateID').attr('readonly', true);
                     $('#edtRateDescription').attr('readonly', true);
            
                     for (let a = 0; a < data.tpayratetype.length; a++) {
  
                       if((data.tpayratetype[a].fields.Description) === Description){
                         added = true;
                         if (ratetypelist) {
                             for (var h = 0; h < ratetypelist.length; h++) {
  
                                 if (data.tpayratetype[a].fields.Description === ratetypelist[h].Description) {
  
                                    fullDescriptionname = ratetypelist[h].Description || '';

                                     console.log('Description '+fullDescriptionname);
  
                                 }
                             }
  
                         }
  
  
  
                  var ratetypeid = data.tpayratetype[a].fields.ID || '';
                  var ratetypedescription = fullDescriptionname || data.tpayratetype[a].fields.Description;
             
                  $('#edtRateID').val(ratetypeid);
                  $('#edtRateDescription').val(ratetypedescription);
                  
                  setTimeout(function () {
                      $('#addRateModel').modal('show');
                       }, 500); } }

                     if(!added) {
                        ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                      
                         $('#add-rateype-title').text('Edit Rate Type Details');                  
                         $('#edtRateID').attr('readonly', true);
                         $('#edtRateDescription').attr('readonly', true);
                         if (ratetypelist) {
                             for (var h = 0; h < ratetypelist.length; h++) {
  
                                 if (data.tpayratetype[0].fields.Description === ratetypelist[h].Description) {
  
                                     fullAccountTypeName = ratetypelist[h].description || '';
  
                                 }
                             }
  
                         }

                          var ratetypeid = data.tpayratetype[0].fields.ID || '';
                          var ratetypedescription = fullAccountTypeName || data.tpayratetype[0].fields.Description;
                         
                          $('#edtRateID').val(ratetypeid);
                          $('#edtRateDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addRateModel').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
                ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
              
                 $('#add-rateype-title').text('Edit Rate Type Details');                  
                 $('#edtRateID').attr('readonly', true);
                 $('#edtRateDescription').attr('readonly', true);

                 if (ratetypelist) {
                    for (var h = 0; h < ratetypelist.length; h++) {

                        if (data.tpayratetype[a].fields.Description === ratetypelist[h].Description) {
                            fullDescriptionname = ratetypelist[h].Description || '';
                            console.log('Description '+fullDescriptionname);
                        }
                    }

                }
  
                 var ratetypeid = data.tpayratetype[0].fields.ID || '';
                 var ratetypedescription = fullAccountTypeName || data.tpayratetype[0].fields.Description;
                         
                          $('#edtRateID').val(ratetypeid);
                          $('#edtRateDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addRateModel').modal('show');
                          }, 500);
  
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
               });
               $('#addRateModel').modal('toggle');
           }else{
             $('#selectRateLineID').val('edtRateType');
             $('#rateTypeListModel').modal();
             setTimeout(function () {
                  var datatable = $('#tblratetypelist').DataTable();
                 datatable.draw();
               
             }, 500);
           }
         }
  
    });

    $('#edtFundType').editableSelect().on('click.editable-select', function (e, li) {
       
        var $earch = $(this);
        var offset = $earch.offset();
        let ratetypeService = new RateTypeService();
        const fundtypelist = [];
        var Description = e.target.value ||'';

        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectFundLineID').val('edtFundType');
          $('#fundTypeListModel').modal();
          $('#tblfundtypelist_filter .form-control-sm').focus();
          $('#tblfundtypelist_filter .form-control-sm').val();
          $('#tblfundtypelist_filter .form-control-sm').trigger("input");
          setTimeout(function () {
             var datatable = $('#tblfundtypelist').DataTable();
             datatable.draw();   
             $('#tblfundtypelist_filter .form-control-sm').trigger("input");       
          }, 500);
         }else{
           if(Description.replace(/\s/g, '') != ''){
             getVS1Data('TSuperType').then(function (dataObject) {
              if (dataObject.length == 0) {
                     ratetypeService.getOneFundTypeByName(Description).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                      $('#add-fundtype-title').text('Edit Fund Type Details');
            
                     if (fundtypelist) {
                         for (var h = 0; h < fundtypelist.length; h++) {
  
                             if (data.tsupertype[0].fields.Description === fundtypelist[h].description) {
  
                                fullDescriptionname = fundtypelist[h].description || '';
  
                             }
                         }
  
                     }
  
                      var supertypeid = data.tsupertype[0].fields.ID || '';
                      var description = fullDescriptionname || data.tsupertype[0].fields.Description;
                   
            
                      $('#edtfundID').val(supertypeid);
                      $('#edtFundDescription').val(description);
               
                      
                      setTimeout(function () {
                          $('#addFundModel').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.tsupertype;
                     var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                  
                     $('#add-fundtype-title').text('Edit Fund Type Details');
                     $('#edtfundID').attr('readonly', true);
                     $('#edtFundDescription').attr('readonly', true);
            
                     for (let a = 0; a < data.tsupertype.length; a++) {
  
                       if((data.tsupertype[a].fields.Description) === Description){
                         added = true;
                         if (fundtypelist) {
                             for (var h = 0; h < fundtypelist.length; h++) {
  
                                 if (data.tsupertype[a].fields.Description === fundtypelist[h].Description) {
  
                                    fullDescriptionname = fundtypelist[h].Description || '';

                            
  
                                 }
                             }
  
                         }
  
  
  
                  var ratetypeid = data.tsupertype[a].fields.ID || '';
                  var ratetypedescription = fullDescriptionname || data.tsupertype[a].fields.Description;
             
                  $('#edtfundID').val(ratetypeid);
                  $('#edtFundDescription').val(ratetypedescription);
                  
                  setTimeout(function () {
                      $('#addFundModel').modal('show');
                       }, 500); } }

                     if(!added) {
                        ratetypeService.getOneFundTypeByName(Description).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                      
                         $('#add-fundtype-title').text('Edit Fund Type Details');                  
                         $('#edtfundID').attr('readonly', true);
                         $('#edtFundDescription').attr('readonly', true);
                         if (fundtypelist) {
                             for (var h = 0; h < fundtypelist.length; h++) {
  
                                 if (data.tsupertype[0].fields.Description === fundtypelist[h].Description) {
  
                                     fullAccountTypeName = fundtypelist[h].description || '';
  
                                 }
                             }
  
                         }

                          var ratetypeid = data.tsupertype[0].fields.ID || '';
                          var ratetypedescription = fullAccountTypeName || data.tsupertype[0].fields.Description;
                         
                          $('#edtfundID').val(ratetypeid);
                          $('#edtFundDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addFundModel').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
                ratetypeService.getOneFundTypeByName(Description).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
              
                 $('#add-fundtype-title').text('Edit Fund Type Details');                  
                 $('#edtfundID').attr('readonly', true);
                 $('#edtFundDescription').attr('readonly', true);

                 if (ratetypelist) {
                    for (var h = 0; h < fundtypelist.length; h++) {

                        if (data.tsupertype[a].fields.Description === fundtypelist[h].Description) {
                            fullDescriptionname = fundtypelist[h].Description || '';
                           
                        }
                    }

                }
  
                 var ratetypeid = data.tsupertype[0].fields.ID || '';
                 var ratetypedescription = fullAccountTypeName || data.tsupertype[0].fields.Description;
                         
                          $('#edtfundID').val(ratetypeid);
                          $('#edtFundDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addFundModel').modal('show');
                          }, 500);
  
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
               });
               $('#addFundModel').modal('toggle');
           }else{
             $('#selectFundLineID').val('edtFundType');
             $('#fundTypeListModel').modal();
             setTimeout(function () {
                  var datatable = $('#tblfundtypelist').DataTable();
                 datatable.draw();
               
             }, 500);
           }
         }
  
    });
    
    $('#edtRateTypeTermnination').editableSelect().on('click.editable-select', function (e, li) {
       
        var $earch = $(this);
        var offset = $earch.offset();
        let ratetypeService = new RateTypeService();
        const ratetypelist = [];
         var  Description = e.target.value ||'';

        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectRateLineID').val('edtRateTypeTermnination');
          $('#rateTypeListModel').modal();
          $('#tblratetypelist_filter .form-control-sm').focus();
          $('#tblratetypelist_filter .form-control-sm').val();
          $('#tblratetypelist_filter .form-control-sm').trigger("input");
          setTimeout(function () {
             var datatable = $('#tblratetypelist').DataTable();
             datatable.draw();   
             $('#tblratetypelist_filter .form-control-sm').trigger("input");       
          }, 500);
         }else{
           if(Description.replace(/\s/g, '') != ''){
             getVS1Data('TRateTypes').then(function (dataObject) {
              if (dataObject.length == 0) {
                     ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                      $('#add-rateype-title').text('Edit Rate Type Details');
            
                     if (ratetypelist) {
                         for (var h = 0; h < ratetypelist.length; h++) {
  
                             if (data.tpayratetype[0].fields.Description === ratetypelist[h].description) {
  
                                fullDescriptionname = ratetypelist[h].description || '';
  
                             }
                         }
  
                     }
  
                      var ratetypeid = data.tpayratetype[0].fields.ID || '';
                      var description = fullDescriptionname || data.tpayratetype[0].fields.Description;
                   
            
                      $('#edtRateID').val(ratetypeid);
                      $('#edtRateDescription').val(description);
               
                      
                      setTimeout(function () {
                          $('#addRateModel').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.tpayratetype;
                     var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                  
                     $('#add-rateype-title').text('Edit Rate Type Details');
                     $('#edtRateID').attr('readonly', true);
                     $('#edtRateDescription').attr('readonly', true);
            
                     for (let a = 0; a < data.tpayratetype.length; a++) {
  
                       if((data.tpayratetype[a].fields.Description) === Description){
                         added = true;
                         if (ratetypelist) {
                             for (var h = 0; h < ratetypelist.length; h++) {
  
                                 if (data.tpayratetype[a].fields.Description === ratetypelist[h].Description) {
  
                                    fullDescriptionname = ratetypelist[h].Description || '';

                                     console.log('Description '+fullDescriptionname);
  
                                 }
                             }
  
                         }
  
  
  
                  var ratetypeid = data.tpayratetype[a].fields.ID || '';
                  var ratetypedescription = fullDescriptionname || data.tpayratetype[a].fields.Description;
             
                  $('#edtRateID').val(ratetypeid);
                  $('#edtRateDescription').val(ratetypedescription);
                  
                  setTimeout(function () {
                      $('#addRateModel').modal('show');
                       }, 500); } }

                     if(!added) {
                        ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                      
                         $('#add-rateype-title').text('Edit Rate Type Details');                  
                         $('#edtRateID').attr('readonly', true);
                         $('#edtRateDescription').attr('readonly', true);
                         if (ratetypelist) {
                             for (var h = 0; h < ratetypelist.length; h++) {
  
                                 if (data.tpayratetype[0].fields.Description === ratetypelist[h].Description) {
  
                                     fullAccountTypeName = ratetypelist[h].description || '';
  
                                 }
                             }
  
                         }

                          var ratetypeid = data.tpayratetype[0].fields.ID || '';
                          var ratetypedescription = fullAccountTypeName || data.tpayratetype[0].fields.Description;
                         
                          $('#edtRateID').val(ratetypeid);
                          $('#edtRateDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addRateModel').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
                ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
              
                 $('#add-rateype-title').text('Edit Rate Type Details');                  
                 $('#edtRateID').attr('readonly', true);
                 $('#edtRateDescription').attr('readonly', true);

                 if (ratetypelist) {
                    for (var h = 0; h < ratetypelist.length; h++) {

                        if (data.tpayratetype[a].fields.Description === ratetypelist[h].Description) {
                            fullDescriptionname = ratetypelist[h].Description || '';
                            console.log('Description '+fullDescriptionname);
                        }
                    }

                }
  
                 var ratetypeid = data.tpayratetype[0].fields.ID || '';
                 var ratetypedescription = fullAccountTypeName || data.tpayratetype[0].fields.Description;
                         
                          $('#edtRateID').val(ratetypeid);
                          $('#edtRateDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addRateModel').modal('show');
                          }, 500);
  
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
               });
               $('#addRateModel').modal('toggle');
           }else{
             $('#selectRateLineID').val('edtRateTypeTermnination');
             $('#rateTypeListModel').modal();
             setTimeout(function () {
                  var datatable = $('#tblratetypelist').DataTable();
                 datatable.draw();
               
             }, 500);
           }
         }
  
      });

    $('#edtRateTypeLumpSumE').editableSelect().on('click.editable-select', function (e, li) {
       
        var $earch = $(this);
        var offset = $earch.offset();
        let ratetypeService = new RateTypeService();
        const ratetypelist = [];
         var  Description = e.target.value ||'';

        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectRateLineID').val('edtRateTypeLumpSumE');
          $('#rateTypeListModel').modal();
          $('#tblratetypelist_filter .form-control-sm').focus();
          $('#tblratetypelist_filter .form-control-sm').val();
          $('#tblratetypelist_filter .form-control-sm').trigger("input");
          setTimeout(function () {
             var datatable = $('#tblratetypelist').DataTable();
             datatable.draw();   
             $('#tblratetypelist_filter .form-control-sm').trigger("input");       
          }, 500);
         }else{
           if(Description.replace(/\s/g, '') != ''){
             getVS1Data('TRateTypes').then(function (dataObject) {
              if (dataObject.length == 0) {
                     ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                      $('#add-rateype-title').text('Edit Rate Type Details');
            
                     if (ratetypelist) {
                         for (var h = 0; h < ratetypelist.length; h++) {
  
                             if (data.tpayratetype[0].fields.Description === ratetypelist[h].description) {
  
                                fullDescriptionname = ratetypelist[h].description || '';
  
                             }
                         }
  
                     }
  
                      var ratetypeid = data.tpayratetype[0].fields.ID || '';
                      var description = fullDescriptionname || data.tpayratetype[0].fields.Description;
                   
            
                      $('#edtRateID').val(ratetypeid);
                      $('#edtRateDescription').val(description);
               
                      
                      setTimeout(function () {
                          $('#addRateModel').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.tpayratetype;
                     var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                  
                     $('#add-rateype-title').text('Edit Rate Type Details');
                     $('#edtRateID').attr('readonly', true);
                     $('#edtRateDescription').attr('readonly', true);
            
                     for (let a = 0; a < data.tpayratetype.length; a++) {
  
                       if((data.tpayratetype[a].fields.Description) === Description){
                         added = true;
                         if (ratetypelist) {
                             for (var h = 0; h < ratetypelist.length; h++) {
  
                                 if (data.tpayratetype[a].fields.Description === ratetypelist[h].Description) {
  
                                    fullDescriptionname = ratetypelist[h].Description || '';

                                     console.log('Description '+fullDescriptionname);
  
                                 }
                             }
  
                         }
  
  
  
                  var ratetypeid = data.tpayratetype[a].fields.ID || '';
                  var ratetypedescription = fullDescriptionname || data.tpayratetype[a].fields.Description;
             
                  $('#edtRateID').val(ratetypeid);
                  $('#edtRateDescription').val(ratetypedescription);
                  
                  setTimeout(function () {
                      $('#addRateModel').modal('show');
                       }, 500); } }

                     if(!added) {
                        ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                      
                         $('#add-rateype-title').text('Edit Rate Type Details');                  
                         $('#edtRateID').attr('readonly', true);
                         $('#edtRateDescription').attr('readonly', true);
                         if (ratetypelist) {
                             for (var h = 0; h < ratetypelist.length; h++) {
  
                                 if (data.tpayratetype[0].fields.Description === ratetypelist[h].Description) {
  
                                     fullAccountTypeName = ratetypelist[h].description || '';
  
                                 }
                             }
  
                         }

                          var ratetypeid = data.tpayratetype[0].fields.ID || '';
                          var ratetypedescription = fullAccountTypeName || data.tpayratetype[0].fields.Description;
                         
                          $('#edtRateID').val(ratetypeid);
                          $('#edtRateDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addRateModel').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
                ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
              
                 $('#add-rateype-title').text('Edit Rate Type Details');                  
                 $('#edtRateID').attr('readonly', true);
                 $('#edtRateDescription').attr('readonly', true);

                 if (ratetypelist) {
                    for (var h = 0; h < ratetypelist.length; h++) {

                        if (data.tpayratetype[a].fields.Description === ratetypelist[h].Description) {
                            fullDescriptionname = ratetypelist[h].Description || '';
                            console.log('Description '+fullDescriptionname);
                        }
                    }

                }
  
                 var ratetypeid = data.tpayratetype[0].fields.ID || '';
                 var ratetypedescription = fullAccountTypeName || data.tpayratetype[0].fields.Description;
                         
                          $('#edtRateID').val(ratetypeid);
                          $('#edtRateDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addRateModel').modal('show');
                          }, 500);
  
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
               });
               $('#addRateModel').modal('toggle');
           }else{
             $('#selectRateLineID').val('edtRateTypeLumpSumE');
             $('#rateTypeListModel').modal();
             setTimeout(function () {
                  var datatable = $('#tblratetypelist').DataTable();
                 datatable.draw();
               
             }, 500);
           }
         }
  
      });
    
    $('#edtRateTypeBonusesCommissions').editableSelect().on('click.editable-select', function (e, li) {
       
        var $earch = $(this);
        var offset = $earch.offset();
        let ratetypeService = new RateTypeService();
        const ratetypelist = [];
         var  Description = e.target.value ||'';

        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectRateLineID').val('edtRateTypeBonusesCommissions');
          $('#rateTypeListModel').modal();
          $('#tblratetypelist_filter .form-control-sm').focus();
          $('#tblratetypelist_filter .form-control-sm').val();
          $('#tblratetypelist_filter .form-control-sm').trigger("input");
          setTimeout(function () {
             var datatable = $('#tblratetypelist').DataTable();
             datatable.draw();   
             $('#tblratetypelist_filter .form-control-sm').trigger("input");       
          }, 500);
         }else{
           if(Description.replace(/\s/g, '') != ''){
             getVS1Data('TRateTypes').then(function (dataObject) {
              if (dataObject.length == 0) {
                     ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                      $('#add-rateype-title').text('Edit Rate Type Details');
            
                     if (ratetypelist) {
                         for (var h = 0; h < ratetypelist.length; h++) {
  
                             if (data.tpayratetype[0].fields.Description === ratetypelist[h].description) {
  
                                fullDescriptionname = ratetypelist[h].description || '';
  
                             }
                         }
  
                     }
  
                      var ratetypeid = data.tpayratetype[0].fields.ID || '';
                      var description = fullDescriptionname || data.tpayratetype[0].fields.Description;
                   
            
                      $('#edtRateID').val(ratetypeid);
                      $('#edtRateDescription').val(description);
               
                      
                      setTimeout(function () {
                          $('#addRateModel').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.tpayratetype;
                     var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                  
                     $('#add-rateype-title').text('Edit Rate Type Details');
                     $('#edtRateID').attr('readonly', true);
                     $('#edtRateDescription').attr('readonly', true);
            
                     for (let a = 0; a < data.tpayratetype.length; a++) {
  
                       if((data.tpayratetype[a].fields.Description) === Description){
                         added = true;
                         if (ratetypelist) {
                             for (var h = 0; h < ratetypelist.length; h++) {
  
                                 if (data.tpayratetype[a].fields.Description === ratetypelist[h].Description) {
  
                                    fullDescriptionname = ratetypelist[h].Description || '';

                                     console.log('Description '+fullDescriptionname);
  
                                 }
                             }
  
                         }
  
  
  
                  var ratetypeid = data.tpayratetype[a].fields.ID || '';
                  var ratetypedescription = fullDescriptionname || data.tpayratetype[a].fields.Description;
             
                  $('#edtRateID').val(ratetypeid);
                  $('#edtRateDescription').val(ratetypedescription);
                  
                  setTimeout(function () {
                      $('#addRateModel').modal('show');
                       }, 500); } }

                     if(!added) {
                        ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                      
                         $('#add-rateype-title').text('Edit Rate Type Details');                  
                         $('#edtRateID').attr('readonly', true);
                         $('#edtRateDescription').attr('readonly', true);
                         if (ratetypelist) {
                             for (var h = 0; h < ratetypelist.length; h++) {
  
                                 if (data.tpayratetype[0].fields.Description === ratetypelist[h].Description) {
  
                                     fullAccountTypeName = ratetypelist[h].description || '';
  
                                 }
                             }
  
                         }

                          var ratetypeid = data.tpayratetype[0].fields.ID || '';
                          var ratetypedescription = fullAccountTypeName || data.tpayratetype[0].fields.Description;
                         
                          $('#edtRateID').val(ratetypeid);
                          $('#edtRateDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addRateModel').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
                ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
              
                 $('#add-rateype-title').text('Edit Rate Type Details');                  
                 $('#edtRateID').attr('readonly', true);
                 $('#edtRateDescription').attr('readonly', true);

                 if (ratetypelist) {
                    for (var h = 0; h < ratetypelist.length; h++) {

                        if (data.tpayratetype[a].fields.Description === ratetypelist[h].Description) {
                            fullDescriptionname = ratetypelist[h].Description || '';
                            console.log('Description '+fullDescriptionname);
                        }
                    }

                }
  
                 var ratetypeid = data.tpayratetype[0].fields.ID || '';
                 var ratetypedescription = fullAccountTypeName || data.tpayratetype[0].fields.Description;
                         
                          $('#edtRateID').val(ratetypeid);
                          $('#edtRateDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addRateModel').modal('show');
                          }, 500);
  
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
               });
               $('#addRateModel').modal('toggle');
           }else{
             $('#selectRateLineID').val('edtRateTypeBonusesCommissions');
             $('#rateTypeListModel').modal();
             setTimeout(function () {
                  var datatable = $('#tblratetypelist').DataTable();
                 datatable.draw();
               
             }, 500);
           }
         }
  
      });

    $('#edtRateTypeDirectorsFees').editableSelect().on('click.editable-select', function (e, li) {
       
        var $earch = $(this);
        var offset = $earch.offset();
        let ratetypeService = new RateTypeService();
        const ratetypelist = [];
         var  Description = e.target.value ||'';

        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectRateLineID').val('edtRateTypeDirectorsFees');
          $('#rateTypeListModel').modal();
          $('#tblratetypelist_filter .form-control-sm').focus();
          $('#tblratetypelist_filter .form-control-sm').val();
          $('#tblratetypelist_filter .form-control-sm').trigger("input");
          setTimeout(function () {
             var datatable = $('#tblratetypelist').DataTable();
             datatable.draw();   
             $('#tblratetypelist_filter .form-control-sm').trigger("input");       
          }, 500);
         }else{
           if(Description.replace(/\s/g, '') != ''){
             getVS1Data('TRateTypes').then(function (dataObject) {
              if (dataObject.length == 0) {
                     ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                      $('#add-rateype-title').text('Edit Rate Type Details');
            
                     if (ratetypelist) {
                         for (var h = 0; h < ratetypelist.length; h++) {
  
                             if (data.tpayratetype[0].fields.Description === ratetypelist[h].description) {
  
                                fullDescriptionname = ratetypelist[h].description || '';
  
                             }
                         }
  
                     }
  
                      var ratetypeid = data.tpayratetype[0].fields.ID || '';
                      var description = fullDescriptionname || data.tpayratetype[0].fields.Description;
                   
            
                      $('#edtRateID').val(ratetypeid);
                      $('#edtRateDescription').val(description);
               
                      
                      setTimeout(function () {
                          $('#addRateModel').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.tpayratetype;
                     var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                  
                     $('#add-rateype-title').text('Edit Rate Type Details');
                     $('#edtRateID').attr('readonly', true);
                     $('#edtRateDescription').attr('readonly', true);
            
                     for (let a = 0; a < data.tpayratetype.length; a++) {
  
                       if((data.tpayratetype[a].fields.Description) === Description){
                         added = true;
                         if (ratetypelist) {
                             for (var h = 0; h < ratetypelist.length; h++) {
  
                                 if (data.tpayratetype[a].fields.Description === ratetypelist[h].Description) {
  
                                    fullDescriptionname = ratetypelist[h].Description || '';

                                     console.log('Description '+fullDescriptionname);
  
                                 }
                             }
  
                         }
  
  
  
                  var ratetypeid = data.tpayratetype[a].fields.ID || '';
                  var ratetypedescription = fullDescriptionname || data.tpayratetype[a].fields.Description;
             
                  $('#edtRateID').val(ratetypeid);
                  $('#edtRateDescription').val(ratetypedescription);
                  
                  setTimeout(function () {
                      $('#addRateModel').modal('show');
                       }, 500); } }

                     if(!added) {
                        ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                      
                         $('#add-rateype-title').text('Edit Rate Type Details');                  
                         $('#edtRateID').attr('readonly', true);
                         $('#edtRateDescription').attr('readonly', true);
                         if (ratetypelist) {
                             for (var h = 0; h < ratetypelist.length; h++) {
  
                                 if (data.tpayratetype[0].fields.Description === ratetypelist[h].Description) {
  
                                     fullAccountTypeName = ratetypelist[h].description || '';
  
                                 }
                             }
  
                         }

                          var ratetypeid = data.tpayratetype[0].fields.ID || '';
                          var ratetypedescription = fullAccountTypeName || data.tpayratetype[0].fields.Description;
                         
                          $('#edtRateID').val(ratetypeid);
                          $('#edtRateDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addRateModel').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
                ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
              
                 $('#add-rateype-title').text('Edit Rate Type Details');                  
                 $('#edtRateID').attr('readonly', true);
                 $('#edtRateDescription').attr('readonly', true);

                 if (ratetypelist) {
                    for (var h = 0; h < ratetypelist.length; h++) {

                        if (data.tpayratetype[a].fields.Description === ratetypelist[h].Description) {
                            fullDescriptionname = ratetypelist[h].Description || '';
                            console.log('Description '+fullDescriptionname);
                        }
                    }

                }
  
                 var ratetypeid = data.tpayratetype[0].fields.ID || '';
                 var ratetypedescription = fullAccountTypeName || data.tpayratetype[0].fields.Description;
                         
                          $('#edtRateID').val(ratetypeid);
                          $('#edtRateDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addRateModel').modal('show');
                          }, 500);
  
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
               });
               $('#addRateModel').modal('toggle');
           }else{
             $('#selectRateLineID').val('edtRateTypeDirectorsFees');
             $('#rateTypeListModel').modal();
             setTimeout(function () {
                  var datatable = $('#tblratetypelist').DataTable();
                 datatable.draw();
               
             }, 500);
           }
         }
  
      });
    
    $('#edtRateTypeLumpSumW').editableSelect().on('click.editable-select', function (e, li) {
       
        var $earch = $(this);
        var offset = $earch.offset();
        let ratetypeService = new RateTypeService();
        const ratetypelist = [];
         var  Description = e.target.value ||'';

        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
          $('#selectRateLineID').val('edtRateTypeLumpSumW');
          $('#rateTypeListModel').modal();
          $('#tblratetypelist_filter .form-control-sm').focus();
          $('#tblratetypelist_filter .form-control-sm').val();
          $('#tblratetypelist_filter .form-control-sm').trigger("input");
          setTimeout(function () {
             var datatable = $('#tblratetypelist').DataTable();
             datatable.draw();   
             $('#tblratetypelist_filter .form-control-sm').trigger("input");       
          }, 500);
         }else{
           if(Description.replace(/\s/g, '') != ''){
             getVS1Data('TRateTypes').then(function (dataObject) {
              if (dataObject.length == 0) {
                     ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                      $('#add-rateype-title').text('Edit Rate Type Details');
            
                     if (ratetypelist) {
                         for (var h = 0; h < ratetypelist.length; h++) {
  
                             if (data.tpayratetype[0].fields.Description === ratetypelist[h].description) {
  
                                fullDescriptionname = ratetypelist[h].description || '';
  
                             }
                         }
  
                     }
  
                      var ratetypeid = data.tpayratetype[0].fields.ID || '';
                      var description = fullDescriptionname || data.tpayratetype[0].fields.Description;
                   
            
                      $('#edtRateID').val(ratetypeid);
                      $('#edtRateDescription').val(description);
               
                      
                      setTimeout(function () {
                          $('#addRateModel').modal('show');
                      }, 500);
  
                   }).catch(function (err) {
                       $('.fullScreenSpin').css('display','none');
                   });
                 } else {
                     let data = JSON.parse(dataObject[0].data);
                     let useData = data.tpayratetype;
                     var added=false;
                     let lineItems = [];
                     let lineItemObj = {};
                     let fullDescriptionname = '';
                  
                     $('#add-rateype-title').text('Edit Rate Type Details');
                     $('#edtRateID').attr('readonly', true);
                     $('#edtRateDescription').attr('readonly', true);
            
                     for (let a = 0; a < data.tpayratetype.length; a++) {
  
                       if((data.tpayratetype[a].fields.Description) === Description){
                         added = true;
                         if (ratetypelist) {
                             for (var h = 0; h < ratetypelist.length; h++) {
  
                                 if (data.tpayratetype[a].fields.Description === ratetypelist[h].Description) {
  
                                    fullDescriptionname = ratetypelist[h].Description || '';

                                     console.log('Description '+fullDescriptionname);
  
                                 }
                             }
  
                         }
  
  
  
                  var ratetypeid = data.tpayratetype[a].fields.ID || '';
                  var ratetypedescription = fullDescriptionname || data.tpayratetype[a].fields.Description;
             
                  $('#edtRateID').val(ratetypeid);
                  $('#edtRateDescription').val(ratetypedescription);
                  
                  setTimeout(function () {
                      $('#addRateModel').modal('show');
                       }, 500); } }

                     if(!added) {
                        ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                         let lineItems = [];
                         let lineItemObj = {};
                         let fullAccountTypeName = '';
                      
                         $('#add-rateype-title').text('Edit Rate Type Details');                  
                         $('#edtRateID').attr('readonly', true);
                         $('#edtRateDescription').attr('readonly', true);
                         if (ratetypelist) {
                             for (var h = 0; h < ratetypelist.length; h++) {
  
                                 if (data.tpayratetype[0].fields.Description === ratetypelist[h].Description) {
  
                                     fullAccountTypeName = ratetypelist[h].description || '';
  
                                 }
                             }
  
                         }

                          var ratetypeid = data.tpayratetype[0].fields.ID || '';
                          var ratetypedescription = fullAccountTypeName || data.tpayratetype[0].fields.Description;
                         
                          $('#edtRateID').val(ratetypeid);
                          $('#edtRateDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addRateModel').modal('show');
                          }, 500);
  
                       }).catch(function (err) {
                           $('.fullScreenSpin').css('display','none');
                       });
                     }
  
                 }
             }).catch(function (err) {
                ratetypeService.getOneRateTypeByName(Description).then(function (data) {
                 let lineItems = [];
                 let lineItemObj = {};
                 let fullAccountTypeName = '';
              
                 $('#add-rateype-title').text('Edit Rate Type Details');                  
                 $('#edtRateID').attr('readonly', true);
                 $('#edtRateDescription').attr('readonly', true);

                 if (ratetypelist) {
                    for (var h = 0; h < ratetypelist.length; h++) {

                        if (data.tpayratetype[a].fields.Description === ratetypelist[h].Description) {
                            fullDescriptionname = ratetypelist[h].Description || '';
                            console.log('Description '+fullDescriptionname);
                        }
                    }

                }
  
                 var ratetypeid = data.tpayratetype[0].fields.ID || '';
                 var ratetypedescription = fullAccountTypeName || data.tpayratetype[0].fields.Description;
                         
                          $('#edtRateID').val(ratetypeid);
                          $('#edtRateDescription').val(ratetypedescription);

                          setTimeout(function () {
                              $('#addRateModel').modal('show');
                          }, 500);
  
  
               }).catch(function (err) {
                   $('.fullScreenSpin').css('display','none');
               });
  
               });
               $('#addRateModel').modal('toggle');
           }else{
             $('#selectRateLineID').val('edtRateTypeLumpSumW');
             $('#rateTypeListModel').modal();
             setTimeout(function () {
                  var datatable = $('#tblratetypelist').DataTable();
                 datatable.draw();
               
             }, 500);
           }
         }
  
      });

    $(document).on("click", "#tblratetypelist tbody tr", function(e) {

        let selectLineID = $('#selectRateLineID').val()||'edtRateTypeOvertime';
       
        var table = $(this);
        let description = table.find(".thDescription").text();
        let ratetypeid = table.find(".thRateID").text()||0;
        $('#rateTypeListModel').modal('toggle');

          if(selectLineID == 'edtRateTypeOvertime'){          
           $('#edtRateDescription').val(description);
           $('#edtRateID').val(ratetypeid);
           $('#edtRateTypeOvertime').val(description);
           $('#add-rateype-title').text('Edit Rate Type Details');

          }

        $('#tblratetypelist_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshRateType').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblratetypelist tbody tr", function(e) {

        let selectLineID = $('#selectRateLineID').val()||'edtRateType';
       
        var table = $(this);
        let description = table.find(".thDescription").text();
        let ratetypeid = table.find(".thRateID").text()||0;
        $('#rateTypeListModel').modal('toggle');

          if(selectLineID == 'edtRateType'){          
           $('#edtRateDescription').val(description);
           $('#edtRateID').val(ratetypeid);
           $('#edtRateType').val(description);
           $('#add-rateype-title').text('Edit Rate Type Details');

          }

        $('#tblratetypelist_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshRateType').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblratetypelist tbody tr", function(e) {

        let selectLineID = $('#selectRateLineID').val()||'edtRateTypeTermnination';
       
        var table = $(this);
        let description = table.find(".thDescription").text();
        let ratetypeid = table.find(".thRateID").text()||0;
        $('#rateTypeListModel').modal('toggle');

          if(selectLineID == 'edtRateTypeTermnination'){                            
           $('#edtRateDescription').val(description);
           $('#edtRateID').val(ratetypeid);
           $('#edtRateTypeTermnination').val(description);
           $('#add-rateype-title').text('Edit Rate Type Details');

          }

        $('#tblratetypelist_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshRateType').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });
    $(document).on("click", "#tblratetypelist tbody tr", function(e) {

        let selectLineID = $('#selectRateLineID').val()||'edtRateTypeLumpSumE';
       
        var table = $(this);
        let description = table.find(".thDescription").text();
        let ratetypeid = table.find(".thRateID").text()||0;
        $('#rateTypeListModel').modal('toggle');

          if(selectLineID == 'edtRateTypeLumpSumE'){          
           $('#edtRateDescription').val(description);
           $('#edtRateID').val(ratetypeid);
           $('#edtRateTypeLumpSumE').val(description);
           $('#add-rateype-title').text('Edit Rate Type Details');

          }

        $('#tblratetypelist_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshRateType').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });
    $(document).on("click", "#tblratetypelist tbody tr", function(e) {

        let selectLineID = $('#selectRateLineID').val()||'edtRateTypeBonusesCommissions';
       
        var table = $(this);
        let description = table.find(".thDescription").text();
        let ratetypeid = table.find(".thRateID").text()||0;
        $('#rateTypeListModel').modal('toggle');

          if(selectLineID == 'edtRateTypeBonusesCommissions'){          
           $('#edtRateDescription').val(description);
           $('#edtRateID').val(ratetypeid);
           $('#edtRateTypeBonusesCommissions').val(description);
           $('#add-rateype-title').text('Edit Rate Type Details');

          }

        $('#tblratetypelist_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshRateType').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });
    $(document).on("click", "#tblratetypelist tbody tr", function(e) {

        let selectLineID = $('#selectRateLineID').val()||'edtRateTypeLumpSumW';
       
        var table = $(this);
        let description = table.find(".thDescription").text();
        let ratetypeid = table.find(".thRateID").text()||0;
        $('#rateTypeListModel').modal('toggle');

          if(selectLineID == 'edtRateTypeLumpSumW'){          
           $('#edtRateDescription').val(description);
           $('#edtRateID').val(ratetypeid);
           $('#edtRateTypeLumpSumW').val(description);
           $('#add-rateype-title').text('Edit Rate Type Details');

          }

        $('#tblratetypelist_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshRateType').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });
    $(document).on("click", "#tblratetypelist tbody tr", function(e) {

        let selectLineID = $('#selectRateLineID').val()||'edtRateTypeDirectorsFees';
       
        var table = $(this);
        let description = table.find(".thDescription").text();
        let ratetypeid = table.find(".thRateID").text()||0;
        $('#rateTypeListModel').modal('toggle');

          if(selectLineID == 'edtRateTypeDirectorsFees'){          
           $('#edtRateDescription').val(description);
           $('#edtRateID').val(ratetypeid);
           $('#edtRateTypeDirectorsFees').val(description);
           $('#add-rateype-title').text('Edit Rate Type Details');

          }

        $('#tblratetypelist_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshRateType').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblfundtypelist tbody tr", function(e) {

        let selectLineID = $('#selectFundLineID').val()||'edtFundType';
       
        var table = $(this);
        let description = table.find(".thfundDescription").text();
        let fundid = table.find(".thfundID").text()||0;
        $('#fundTypeListModel').modal('toggle');

          if(selectLineID == 'edtFundType'){          
           $('#edtFundDescription').val(description);
           $('#edtfundID').val(fundid);
           $('#edtFundType').val(description);
           $('#add-fundype-title').text('Edit Fund Type Details');

          }

        $('#tblfundtypelist_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshFundType').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    // $(document).on("click", "#tblPayCalendars tbody tr td:not(.colDeleteCalenders) ", function(e) {
    
    //     let calender_id =   $(this).closest('tr').find(".colCalenderID").text();
    //     let calenderName =  $(this).closest('tr').find(".colPayCalendarName").text()||'';
    //     let payperiod =     $(this).closest('tr').find(".colPayPeriod").text()||'';
    //     let NextPayPeriod = $(this).closest('tr').find(".colNextPayPeriod").text()||'';
    //     let NextPaymentdate = $(this).closest('tr').find(".colNextPaymentDate").text()||'';
        
    //     $('#newPayCalendarLabel').text('Edit Calender Details');
    //     $('#paycalendarId').val(calender_id);
    //     $('#calender_name').val(calenderName);
    //     $('#calender_name').val(calenderName);
    //     $('#payperiod').val(payperiod);
    //     $('#edtStartDate').val(NextPayPeriod);
    //     $('#edtFirstPaymentDate').val(NextPaymentdate);
        
    //     $('#newPayCalendarModal').modal('toggle');
           
    // });

    // $(document).on("click", "#tblHolidays tbody tr td:not(.colHolidayDelete) ", function(e) {
    
    //     var table = $(this);
    //     let holiday_id = table.find(".colHolidayID").text();
    //     let holidayName = table.find(".colHolidayName").text()||'';
    //     let holiday_date = table.find(".colHolidayDate").text()||'';
    //     let holidaygroup = table.find(".colHolidaygroup").text() || '';   
    //     $('#newHolidayLabel').text('Edit Holiday Details');
    //     $('#holidayid').val(holiday_id);
    //     $('#holidayname').val(holidayName);
    //     $('#edtHolidayDate').val(holiday_date);   
    //     $('#holidaygroup').val(holidaygroup);
    //     $('#newHolidayModal').modal('toggle');
           
    // });

    // $(document).on("click", "#tblSuperannuation tbody tr", function(e) {
    
    //     var table = $(this);
    //     let super_id = table.find(".colSuperannuationID").text();
    //     let super_name = table.find(".colSuperannuationName").text()||'';
    //     let super_type = table.find(".colSuperannuationType").text()||'';
    //     let super_employe_num = table.find(".colEmployerNum").text() || '';   
    //     let super_abn = table.find(".colabn").text();
    //     let super_service = table.find(".colservicealias").text()||'';
    //     let super_bsb = table.find(".colbsb").text()||'';
    //     let super_account_number = table.find(".colaccountnumber").text() || '';  
    //     let super_account_name = table.find(".colaccountname").text()||'';
          

    //     $('#newSuperannuationFundLabel').text('Edit Superannuation Details');
    //     $('#newSuperannuationFundId').val(super_id);
    //     $('#edtFundType').val(super_type);
    //     $('#edtabn').val(super_abn);
    //     $('#edtelectronicsalias').val(super_service);
    //     $('#edtEmployerNumber').val(super_employe_num);
    //     $('#edtaccountnumber').val(super_account_number);
    //     $('#edtaccountname').val(super_account_name);     
    //     $('#newSuperannuationFundModal').modal('toggle');
           
    // });


    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccountAllowance';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtExpenseAccountAllowance'){
          $('#edtExpenseAccountAllowance').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });
    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccountDirectorsFees';
        var table = $(this);
        let accountname = table.find(".productName").text();
        let accountID = table.find(".colAccountID").text()||0;
        $('#accountListModal').modal('toggle');

        if(selectLineID == 'edtExpenseAccountDirectorsFees'){
          $('#edtExpenseAccountDirectorsFees').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
        }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
        }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
        
    });
    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccountTermnination';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtExpenseAccountTermnination'){
          $('#edtExpenseAccountTermnination').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
            
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtExpenseAccount'){
          $('#edtExpenseAccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccountOvertime';
     
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtExpenseAccountOvertime'){
          $('#edtExpenseAccountOvertime').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccountLumpSumE';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtExpenseAccountLumpSumE'){
          $('#edtExpenseAccountLumpSumE').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccountBonusesCommissions';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtExpenseAccountBonusesCommissions'){
          $('#edtExpenseAccountBonusesCommissions').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtExpenseAccountLumpSumW';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtExpenseAccountLumpSumW'){
          $('#edtExpenseAccountLumpSumW').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'editbankaccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'editbankaccount'){
          $('#editbankaccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'editpaygbankaccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'editpaygbankaccount'){
          $('#editpaygbankaccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'edtReimbursementAccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'edtReimbursementAccount'){
          $('#edtReimbursementAccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'editwagesexpbankaccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'editwagesexpbankaccount'){
          $('#editwagesexpbankaccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'editwagespaybankaccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'editwagespaybankaccount'){
          $('#editwagespaybankaccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'editsuperliabbankaccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'editsuperliabbankaccount'){
          $('#editsuperliabbankaccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val()||'editsuperexpbankaccount';
        var table = $(this);
          let accountname = table.find(".productName").text();
          let accountID = table.find(".colAccountID").text()||0;
          $('#accountListModal').modal('toggle');

          if(selectLineID == 'editsuperexpbankaccount'){
          $('#editsuperexpbankaccount').val(accountname);
          $('#edtExpenseAccountID').val(accountID);
          }else if(selectLineID == 'edtDeductionAccount'){
            $('#edtDeductionAccount').val(accountname);
            $('#edtDeductionAccountID').val(accountID);
          }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

  
});

Template.payrollrules.events({
    'click #btnEarnings': function() {
        document.getElementById("allowances").style.display = "none";
        document.getElementById("earnings").style.display = "block";
        document.getElementById("deductions").style.display = "none";
        document.getElementById("reimbursements").style.display = "none";
        document.getElementById("leave").style.display = "none";
    },
    'click #btnAllowances': function() {
        document.getElementById("allowances").style.display = "block";
        document.getElementById("earnings").style.display = "none";
        document.getElementById("deductions").style.display = "none";
        document.getElementById("reimbursements").style.display = "none";
        document.getElementById("leave").style.display = "none";
    },
    'click #btnDeductions': function() {
        document.getElementById("allowances").style.display = "none";
        document.getElementById("earnings").style.display = "none";
        document.getElementById("deductions").style.display = "block";
        document.getElementById("reimbursements").style.display = "none";
        document.getElementById("leave").style.display = "none";
    },
    'click #btnReiumbursement': function() {
        document.getElementById("allowances").style.display = "none";
        document.getElementById("earnings").style.display = "none";
        document.getElementById("deductions").style.display = "none";
        document.getElementById("reimbursements").style.display = "block";
        document.getElementById("leave").style.display = "none";
    },
    'click #btnLeave': function() {
        document.getElementById("allowances").style.display = "none";
        document.getElementById("earnings").style.display = "none";
        document.getElementById("deductions").style.display = "none";
        document.getElementById("reimbursements").style.display = "none";
        document.getElementById("leave").style.display = "block";
    },
    'click .btnRefresh': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        location.reload(true);
    },
    'change #ruleModifierInitial': function(event) {
        var optionSelected = $(event.target).val();

        if (optionSelected == "greaterthan") {
            document.getElementById("ruleModifierTimeDiv").style.display = "inline-flex";
            document.getElementById("ruleModifierDayDiv").style.display = "none";
            $("#ruleModifierInitial").addClass("noradiusright");
        } else if (optionSelected == "lessthan") {
            document.getElementById("ruleModifierTimeDiv").style.display = "inline-flex";
            document.getElementById("ruleModifierDayDiv").style.display = "none";
            $("#ruleModifierInitial").addClass("noradiusright");
        } else if (optionSelected == "dayoftheweek") {
            document.getElementById("ruleModifierTimeDiv").style.display = "none";
            document.getElementById("ruleModifierDayDiv").style.display = "inline-flex";
            $("#ruleModifierInitial").addClass("noradiusright");
        } else {
            document.getElementById("ruleModifierTimeDiv").style.display = "none";
            document.getElementById("ruleModifierDayDiv").style.display = "none";
            $("#ruleModifierInitial").removeClass("noradiusright");

        }


    },
    'click #ruleLessThan': function() {
        document.getElementById("ruleConstructOne").value = "Less Than";
        document.getElementById("ruleModifierTimeDiv").style.display = "inline-flex";
        document.getElementById("ruleModifierDay").style.display = "none";
    },
    'click #ruleSpecificDay': function() {
        document.getElementById("ruleConstructOne").value = "Specific Day";
        document.getElementById("ruleModifierTime").style.display = "none";
        document.getElementById("ruleModifierDay").style.display = "inline-flex";
    },

    'click .addholiday':function(){
        
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let holidayname = $('#holidayname').val() || '';
        let edtHolidayDate = $('#edtHolidayDate').val() || '';
        let holidaygroup = $('#holidaygroup').val() || '';

        let oldholiday = $('#holidayid').val() || 0 ;
      
    
        if (holidayname === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Holiday name has not been selected!', '', 'warning');
            e.preventDefault();
         }
         else {
          
                    // if(Session.get('holidayname'))
                    // {
                    //     let output  = Session.get('holidayname');
                    //     objDetails = {
                    //         type: "Tholiday",
                    //         fields: {
                    //             ID: '325523',
                    //             holidayname:holidayname,
                    //             holidaydate:edtHolidayDate,
                    //             holidaygroup:holidaygroup,
                                  
                    //         }
                    //     };

                    //     output.push(objDetails);
                    //     Session.set('holidayname',output);

                    // }
                    // else
                    // {
                    //     let object_array = [];
                    //     objDetails = {
                    //         type: "Tholiday",
                    //         fields: {
                               
                    //             holidayname:holidayname,
                    //             holidaydate:edtHolidayDate,
                    //             holidaygroup:holidaygroup,
                                  
                    //         }
                    //     };


                    //     object_array.push(objDetails);
                    //     Session.set('holidayname',object_array);

                    // }


                    // let output  = Session.get('holidayname');

                    // Meteor._reload.reload()


                    if(oldholiday != 0)
                    {
                        $('.fullScreenSpin').css('display','inline-block');
                        objDetails = {
                            type: "Tpayrollholidays",
                            fields: {
                                ID: parseInt(oldholiday),
                                PayrollHolidaysName:holidayname,
                                PayrollHolidaysGroupName:holidaygroup,
                                PayrollHolidaysDate:moment(edtHolidayDate,'DD/MM/YYYY').format('YYYY-MM-DD'),
                                PayrollHolidaysActive:true     
                            }
                        };

                       taxRateService.saveHoliday(objDetails).then(function (objDetails) {
                   
                       swal({
                        title: 'Success',
                        text: 'success',
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'Done'

                        }).then((result) => {
                        if (result.value) {
                                    Meteor._reload.reload();
                        }else if (result.dismiss === 'cancel') {
                    
                        }
                        });
            
                        $('.fullScreenSpin').css('display','none');

                    
                       });

                    }
                    else
                    {
                        $('.fullScreenSpin').css('display','inline-block');
                        taxRateService.checkHolidaybyName(holidayname).then(function (data) {
                        
                        holidayid = data.Tpayrollholidays[0].Id;
                        objDetails = {
                           type: "Tpayrollholidays",
                           fields: {
                               ID: parseInt(holidayid),
                               PayrollHolidaysName:holidayname,
                               PayrollHolidaysGroupName:holidaygroup,
                               PayrollHolidaysDate:moment(edtHolidayDate,'DD/MM/YYYY').format('YYYY-MM-DD'),
                               PayrollHolidaysActive:true     
                           }
                       };
            
                      taxRateService.saveHoliday(objDetails).then(function (objDetails) {
                         sideBarService.getHolidayData().then(function(dataReload) {
                            addVS1Data('TPayrollHolidays',JSON.stringify(dataReload)).then(function (datareturn) {
                              Meteor._reload.reload();
                            }).catch(function (err) {
                              Meteor._reload.reload();
                            });
                          }).catch(function(err) {
                            Meteor._reload.reload();
                          });
                        }).catch(function (err) {
                          swal({
                          title: 'Oooops...',
                          text: err,
                          type: 'error',
                          showCancelButton: false,
                          confirmButtonText: 'Try Again'
                          }).then((result) => {
                          if (result.value) {
                            Meteor._reload.reload();
                          } else if (result.dismiss === 'cancel') {
            
                          }
                          });
                          
                          $('.fullScreenSpin').css('display','none');
                          });
                          }).catch(function (err) {
                            objDetails = {
                            type: "Tpayrollholidays",
                            fields: {
                                PayrollHolidaysName:holidayname,
                                PayrollHolidaysGroupName:holidaygroup,
                                PayrollHolidaysDate:moment(edtHolidayDate,'DD/MM/YYYY').format('YYYY-MM-DD'),
                                PayrollHolidaysActive:true          
                           }
                        };
            
                        taxRateService.saveHoliday(objDetails).then(function (objDetails) {
                        sideBarService.getHolidayData().then(function(dataReload) {
                            addVS1Data('TPayrollHolidays',JSON.stringify(dataReload)).then(function (datareturn) {
                              Meteor._reload.reload();
                            }).catch(function (err) {
                              Meteor._reload.reload();
                            });
                          }).catch(function(err) {
                            Meteor._reload.reload();
                          });
                        }).catch(function (err) {
                         swal({
                         title: 'Oooops...',
                         text: err,
                         type: 'error',
                         showCancelButton: false,
                         confirmButtonText: 'Try Again'
                         }).then((result) => {
                         if (result.value) {
                          Meteor._reload.reload();
                         } else if (result.dismiss === 'cancel') {
            
                         }
                         });
                           $('.fullScreenSpin').css('display','none');
                       });
                      });
                }   
      }
    },

    'click .btnSaveAllowance': function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let earningName = $('#edtEarningsNameAllowance').val()||'';
        let taxRateService = new TaxRateService();

        let allowanceID = $('#edtAllowanceID').val()||'';
        let allowanceType = $('#edtAllowanceType').val()||'';
        let displayName = $('#edtDisplayNameAllowance').val();
        let expensesAccount = $('#edtExpenseAccountAllowance').val();
        let diexpensesAccount = $('#edtExpenseAccountDirectorsFees').val();
        let termexpensesAccount = $('#edtExpenseAccountTermnination').val();
        let epexpensesAccount = $('#edtExpenseAccount').val();
        let overexpensesAccount = $('#edtExpenseAccountOvertime').val();
        let lumpexpensesAccount = $('#edtExpenseAccountLumpSumE').val();
        let bonusesexpensesAccount = $('#edtExpenseAccountBonusesCommissions').val();
        let lumpshumwexpensesAccount = $('#edtExpenseAccountLumpSumW').val();

        let lumpeditbankaccount = $('#editbankaccount').val();
        let lumpeditpaygbankaccount = $('#editpaygbankaccount').val();
        let lumpeditedtReimbursementAccount = $('#edtReimbursementAccount').val();
        let lumpeditwagesexpbankaccount = $('#editwagesexpbankaccount').val();
        let lumpeditwagespaybankaccount = $('#editwagespaybankaccount').val();
        let lumpeditsuperliabbankaccount = $('#editsuperliabbankaccount').val();
        let lumpeditsuperexpbankaccount = $('#editsuperexpbankaccount').val();

        let expensesAccountID = $('#edtExpenseAccountID').val()||0;

        let allowanceAmount = $('#edtAllowanceAmount').val()||0;

        let exemptFromPAYG = false;
        let exemptFromSupernation = false;
        let reportableW1ActivityStatement = false;

        if($('#formCheck-ExemptPAYGAllowance').is(':checked')){
          exemptFromPAYG = true;
        }else{
          exemptFromPAYG = false;
        }

        if($('#formCheck-ExemptSuperannuationAllowance').is(':checked')){
          exemptFromSupernation = true;
        }else{
          exemptFromSupernation = false;
        }

        if($('#formCheck-ExemptReportableAllowance').is(':checked')){
          reportableW1ActivityStatement = true;
        }else{
          reportableW1ActivityStatement = false;
        }


        if (earningName === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Earning has not been selected!', '', 'warning');
            e.preventDefault();
        } else {
          $('.fullScreenSpin').css('display','inline-block');

          if(allowanceID == ""){
            taxRateService.checkAllowanceByName(earningName).then(function (data) {
              allowanceID = data.tallowance[0].Id;
              objDetails = {
                 type: "TAllowance",
                 fields: {
                     ID: parseInt(allowanceID),
                     Active: true,
                     Accountid: expensesAccountID,
                     Accountname: expensesAccount,
                     Amount:Number(allowanceAmount.replace(/[^0-9.-]+/g, "")) || 0,
                     Basedonid:1,
                     AllowanceType: allowanceType,
                     Description: earningName,
                     DisplayIn: displayName,
                     Superinc: exemptFromSupernation,
                     Workcoverexempt: reportableW1ActivityStatement,
                     Payrolltaxexempt: exemptFromPAYG
                 }
             };

             taxRateService.saveAllowance(objDetails).then(function (objDetails) {
               sideBarService.getAllowance().then(function(dataReload) {
                  addVS1Data('TAllowance',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
             }).catch(function (err) {
               swal({
               title: 'Oooops...',
               text: err,
               type: 'error',
               showCancelButton: false,
               confirmButtonText: 'Try Again'
               }).then((result) => {
               if (result.value) {
                Meteor._reload.reload();
               } else if (result.dismiss === 'cancel') {

               }
               });
                 $('.fullScreenSpin').css('display','none');
             });
            }).catch(function (err) {
              objDetails = {
                 type: "TAllowance",
                 fields: {
                     Active: true,
                     Accountid: expensesAccountID,
                     Accountname: expensesAccount,
                     Amount:Number(allowanceAmount.replace(/[^0-9.-]+/g, "")) || 0,
                     Basedonid:1,
                     AllowanceType: allowanceType,
                     Description: earningName,
                     DisplayIn: displayName,
                     Superinc: exemptFromSupernation,
                     Workcoverexempt: reportableW1ActivityStatement,
                     Payrolltaxexempt: exemptFromPAYG
                 }
             };

             taxRateService.saveAllowance(objDetails).then(function (objDetails) {
               sideBarService.getAllowance().then(function(dataReload) {
                  addVS1Data('TAllowance',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
             }).catch(function (err) {
               swal({
               title: 'Oooops...',
               text: err,
               type: 'error',
               showCancelButton: false,
               confirmButtonText: 'Try Again'
               }).then((result) => {
               if (result.value) {
                Meteor._reload.reload();
               } else if (result.dismiss === 'cancel') {

               }
               });
                 $('.fullScreenSpin').css('display','none');
             });
            });

         }else{
           objDetails = {
              type: "TAllowance",
              fields: {
                  ID: parseInt(allowanceID),
                  Accountid: expensesAccountID,
                  Accountname: expensesAccount,
                  Amount:Number(allowanceAmount.replace(/[^0-9.-]+/g, "")) || 0,
                  Basedonid:1,
                  AllowanceType: allowanceType,
                  Description: earningName,
                  DisplayIn: displayName,
                  Superinc: exemptFromSupernation,
                  Workcoverexempt: reportableW1ActivityStatement,
                  Payrolltaxexempt: exemptFromPAYG
              }
          };

          taxRateService.saveAllowance(objDetails).then(function (objDetails) {
            sideBarService.getAllowance().then(function(dataReload) {
                  addVS1Data('TAllowance',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
          }).catch(function (err) {
            swal({
            title: 'Oooops...',
            text: err,
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Try Again'
            }).then((result) => {
            if (result.value) {
             Meteor._reload.reload();
            } else if (result.dismiss === 'cancel') {

            }
            });
              $('.fullScreenSpin').css('display','none');
          });
         }


        }
    },

    'click .btnSaveRatePOP': function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
   
        let taxRateService = new TaxRateService();

        let rateTypeId = $('#edtRateID').val()|| 0;
        let ratetypedescription = $('#edtRateDescription').val()||'';

        if (ratetypedescription === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Rate type description can not be blank !', '', 'warning');
            e.preventDefault();
        } else {
          $('.fullScreenSpin').css('display','inline-block');
          if(rateTypeId == ""){
            
            taxRateService.checkRateTypeByName(ratetypedescription).then(function (data) {
             rateTypeId = data.tpayratetype[0].Id;
              objDetails = {
                 type: "TPayRateType",
                 fields: {
                     ID: parseInt(rateTypeId),                   
                     Description: ratetypedescription,
                    
                 }
             };

             taxRateService.saveRateType(objDetails).then(function (objDetails) {
               sideBarService.getRateListVS1().then(function(dataReload) {
                  addVS1Data('TRateTypes',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
             }).catch(function (err) {
               swal({
               title: 'Oooops...',
               text: err,
               type: 'error',
               showCancelButton: false,
               confirmButtonText: 'Try Again'
               }).then((result) => {
               if (result.value) {
                Meteor._reload.reload();
               } else if (result.dismiss === 'cancel') {

               }
               });
                 $('.fullScreenSpin').css('display','none');
             });
            }).catch(function (err) {
                objDetails = {
                    type: "TPayRateType",
                    fields: {
                        ID: parseInt(rateTypeId),                   
                        Description: ratetypedescription,
                      }
                       
                    };

             taxRateService.saveRateType(objDetails).then(function (objDetails) {
               sideBarService.getRateListVS1().then(function(dataReload) {
                  addVS1Data('TRateTypes',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
             }).catch(function (err) {
               swal({
               title: 'Oooops...',
               text: err,
               type: 'error',
               showCancelButton: false,
               confirmButtonText: 'Try Again'
               }).then((result) => {
               if (result.value) {
                Meteor._reload.reload();
               } else if (result.dismiss === 'cancel') {

               }
               });
                 $('.fullScreenSpin').css('display','none');
             });
            });

         }else{
            objDetails = {
                type: "TPayRateType",
                fields: {
                    ID: parseInt(rateTypeId),                   
                    Description: ratetypedescription,
                  }
                   
                };

          taxRateService.saveRateType(objDetails).then(function (objDetails) {
            sideBarService.getRateListVS1().then(function(dataReload) {
                  addVS1Data('TRateTypes',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
          }).catch(function (err) {
            swal({
            title: 'Oooops...',
            text: err,
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Try Again'
            }).then((result) => {
            if (result.value) {
             Meteor._reload.reload();
            } else if (result.dismiss === 'cancel') {

            }
            });
              $('.fullScreenSpin').css('display','none');
          });
         }


        }
    },

    'click .btnSavefund':function(){
     
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
   
        let taxRateService = new TaxRateService();

        let fundTypeId = $('#edtfundID').val()|| 0;
        let fundtypedescription = $('#edtFundDescription').val()||'';

        if (fundtypedescription === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Fund type description can not be blank !', '', 'warning');
            e.preventDefault();
        } else {
          $('.fullScreenSpin').css('display','inline-block');
          if(fundTypeId == ""){
            
            taxRateService.checkfundTypeByName(fundtypedescription).then(function (data) {
                fundTypeId = data.tsupertype[0].Id;
                 objDetails = {
                 type: "TSuperType",
                 fields: {
                     ID: parseInt(fundTypeId),                   
                     Description: fundtypedescription,
                    
                 }
             };

             taxRateService.saveSuperType(objDetails).then(function (objDetails) {
               sideBarService.getSuperType().then(function(dataReload) {
                  addVS1Data('TSuperType',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
             }).catch(function (err) {
               swal({
               title: 'Oooops...',
               text: err,
               type: 'error',
               showCancelButton: false,
               confirmButtonText: 'Try Again'
               }).then((result) => {
               if (result.value) {
                Meteor._reload.reload();
               } else if (result.dismiss === 'cancel') {

               }
               });
                 $('.fullScreenSpin').css('display','none');
             });
            }).catch(function (err) {
                objDetails = {
                    type: "TSuperType",
                    fields: {
                        ID: parseInt(fundTypeId),                   
                        Description: fundtypedescription,
                      }
                       
                    };

             taxRateService.saveSuperType(objDetails).then(function (objDetails) {
               sideBarService.getSuperType(objDetails).then(function(dataReload) {
                  addVS1Data('TSuperType',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
             }).catch(function (err) {
               swal({
               title: 'Oooops...',
               text: err,
               type: 'error',
               showCancelButton: false,
               confirmButtonText: 'Try Again'
               }).then((result) => {
               if (result.value) {
                Meteor._reload.reload();
               } else if (result.dismiss === 'cancel') {

               }
               });
                 $('.fullScreenSpin').css('display','none');
             });
            });

         }else{
            objDetails = {
                type: "TSuperType",
                fields: {
                    ID: parseInt(fundTypeId),                   
                    Description: fundtypedescription,
                  }
                   
                };

          taxRateService.saveSuperType(objDetails).then(function (objDetails) {
            sideBarService.getSuperType().then(function(dataReload) {
                  addVS1Data('TSuperType',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
          }).catch(function (err) {
            swal({
            title: 'Oooops...',
            text: err,
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Try Again'
            }).then((result) => {
            if (result.value) {
             Meteor._reload.reload();
            } else if (result.dismiss === 'cancel') {

            }
            });
              $('.fullScreenSpin').css('display','none');
          });
         }


        }


    },

    'click .btnSaveDeduction': function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let deductionName = $('#edtDeductionName').val()||'';
        let taxRateService = new TaxRateService();

        let deductionID = $('#edtDeductionID').val()||'';

        let deductionType = $('#edtDeductionTitle').val()||'None';
        let isTaxexempt = false;
        let isIsWorkPlacegiving = false;
        let isUnionfees = false;
        if(deductionType == 'None'){
          isTaxexempt = true;
        }else if(deductionType == 'WorkplaceGiving'){
          isIsWorkPlacegiving = true;
        }else if(deductionType == 'UnionAssociationFees'){
          isUnionfees = true;
        }
        let displayName = 'Deductions';
        let deductionAccount = $('#edtDeductionAccount').val();
        let deductionAccountID = $('#edtDeductionAccountID').val()||0;

        let deductionAmount = $('#edtDeductionAmount').val()||0;

        let exemptFromPAYG = false;
        let exemptFromSupernation = false;
        let reportableW1ActivityStatement = false;

        if($('#formCheck-ReducesPAYGDeduction').is(':checked')){
          exemptFromPAYG = true;
        }else{
          exemptFromPAYG = false;
        }

        if($('#formCheck-ReducesSuperannuationDeduction').is(':checked')){
          exemptFromSupernation = true;
        }else{
          exemptFromSupernation = false;
        }

        if($('#formCheck-ExcludedDeduction').is(':checked')){
          reportableW1ActivityStatement = true;
        }else{
          reportableW1ActivityStatement = false;
        }


        if (deductionName === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Deduction has not been selected!', '', 'warning');
            e.preventDefault();
        } else {
          $('.fullScreenSpin').css('display','inline-block');

          if(deductionID == ""){
            taxRateService.checkDeductionByName(deductionName).then(function (data) {
              deductionID = data.tdeduction[0].Id;
              objDetails = {
                 type: "TDeduction",
                 fields: {
                     ID: parseInt(deductionID),
                     Active: true,
                     Accountid: deductionAccountID,
                     Accountname: deductionAccount,
                     IsWorkPlacegiving:isIsWorkPlacegiving,
                     Taxexempt:isTaxexempt,
                     Unionfees:isUnionfees,
                     Amount:Number(deductionAmount.replace(/[^0-9.-]+/g, "")) || 0,
                     Basedonid:1,
                     //AllowanceType: allowanceType,
                     Description: deductionName,
                     DisplayIn: displayName,
                     // Superinc: exemptFromSupernation,
                     // Workcoverexempt: reportableW1ActivityStatement,
                     // Payrolltaxexempt: exemptFromPAYG
                 }
             };

             taxRateService.saveDeduction(objDetails).then(function (objDetails) {
               sideBarService.getDeduction().then(function(dataReload) {
                  addVS1Data('TDeduction',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
             }).catch(function (err) {
               swal({
               title: 'Oooops...',
               text: err,
               type: 'error',
               showCancelButton: false,
               confirmButtonText: 'Try Again'
               }).then((result) => {
               if (result.value) {
                Meteor._reload.reload();
               } else if (result.dismiss === 'cancel') {

               }
               });
                 $('.fullScreenSpin').css('display','none');
             });
            }).catch(function (err) {
              objDetails = {
                 type: "TDeduction",
                 fields: {
                     Active: true,
                     Active: true,
                     Accountid: deductionAccountID,
                     Accountname: deductionAccount,
                     IsWorkPlacegiving:isIsWorkPlacegiving,
                     Taxexempt:isTaxexempt,
                     Unionfees:isUnionfees,
                     Amount:Number(deductionAmount.replace(/[^0-9.-]+/g, "")) || 0,
                     Basedonid:1,
                     //AllowanceType: allowanceType,
                     Description: deductionName,
                     DisplayIn: displayName,
                 }
             };

             taxRateService.saveDeduction(objDetails).then(function (objDetails) {
               sideBarService.getDeduction().then(function(dataReload) {
                  addVS1Data('TDeduction',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
             }).catch(function (err) {
               swal({
               title: 'Oooops...',
               text: err,
               type: 'error',
               showCancelButton: false,
               confirmButtonText: 'Try Again'
               }).then((result) => {
               if (result.value) {
                Meteor._reload.reload();
               } else if (result.dismiss === 'cancel') {

               }
               });
                 $('.fullScreenSpin').css('display','none');
             });
            });

         }else{
           objDetails = {
              type: "TDeduction",
              fields: {
                  ID: parseInt(deductionID),
                  Active: true,
                  Accountid: deductionAccountID,
                  Accountname: deductionAccount,
                  IsWorkPlacegiving:isIsWorkPlacegiving,
                  Taxexempt:isTaxexempt,
                  Unionfees:isUnionfees,
                  Amount:Number(deductionAmount.replace(/[^0-9.-]+/g, "")) || 0,
                  Basedonid:1,
                  //AllowanceType: allowanceType,
                  Description: deductionName,
                  DisplayIn: displayName,
              }
          };

          taxRateService.saveDeduction(objDetails).then(function (objDetails) {
            sideBarService.getDeduction().then(function(dataReload) {
                  addVS1Data('TDeduction',JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                  }).catch(function (err) {
                    Meteor._reload.reload();
                  });
                }).catch(function(err) {
                  Meteor._reload.reload();
                });
          }).catch(function (err) {
            swal({
            title: 'Oooops...',
            text: err,
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Try Again'
            }).then((result) => {
            if (result.value) {
             Meteor._reload.reload();
            } else if (result.dismiss === 'cancel') {

            }
            });
              $('.fullScreenSpin').css('display','none');
          });
         }


        }
    },
    

   'click .savenewcalender': function(){
      
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();

        let oldpaycalenderid  = $('#paycalendarId').val() || 0;
        let payperiod = $('#payperiod').val() || '';
        let calender_name = $('#calender_name').val() || '';
        let startdate = $('#edtStartDate').val() || '';
        let FirstPaymentDate = $('#edtFirstPaymentDate').val() || '';
      
        if (payperiod === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Pay period has not been selected!', '', 'warning');
            e.preventDefault();
         }
         else {
             
            if(oldpaycalenderid != 0 )
            {
                $('.fullScreenSpin').css('display','inline-block');
                objDetails = {
                    type: "TPayrollCalendars",
                    fields: {
                        ID: parseInt(oldpaycalenderid),
                        PayrollCalendarPayPeriod:payperiod,
                        PayrollCalendarName:calender_name,
                        PayrollCalendarStartDate:moment(startdate,'DD/MM/YYYY').format('YYYY-MM-DD'),
                        PayrollCalendarFirstPaymentDate:moment(FirstPaymentDate,'DD/MM/YYYY').format('YYYY-MM-DD'),
                        PayrollCalendarActive :true,              
                    }
                };

                taxRateService.saveCalender(objDetails).then(function (objDetails) {
                   
                    swal({
                        title: 'Success',
                        text: 'success',
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'Done'

                     }).then((result) => {
                        if (result.value) {
                                    Meteor._reload.reload();
                        }else if (result.dismiss === 'cancel') {
                    
                        }
                    });
            
                $('.fullScreenSpin').css('display','none');

                    
                });


            }
            else
            {
                $('.fullScreenSpin').css('display','inline-block');
                taxRateService.checkCalenderName(calender_name).then(function (data) {
                    calenderID = data.tpayrollcalendars[0].Id;
                    objDetails = {
                       type: "TPayrollCalendars",
                       fields: {
                           ID: parseInt(calenderID),
                           PayrollCalendarPayPeriod:payperiod,
                           PayrollCalendarName:calender_name,
                           PayrollCalendarStartDate:moment(startdate,'DD/MM/YYYY').format('YYYY-MM-DD'),
                           PayrollCalendarFirstPaymentDate:moment(FirstPaymentDate,'DD/MM/YYYY').format('YYYY-MM-DD'),
                           PayrollCalendarActive :true,              
                       }
                   };
      
                  taxRateService.saveCalender(objDetails).then(function (objDetails) {
                     sideBarService.getCalender().then(function(dataReload) {
                        addVS1Data('TPayrollCalendars',JSON.stringify(dataReload)).then(function (datareturn) {
                          
                          swal({
                                      title: 'Success',
                                      text: 'success',
                                      type: 'success',
                                      showCancelButton: false,
                                      confirmButtonText: 'Done'
        
                         }).then((result) => {
                         if (result.value) {
                                        Meteor._reload.reload();
                         }else if (result.dismiss === 'cancel') {
                        
                         }
                         });
                                      
                         $('.fullScreenSpin').css('display','none');
    
    
                        }).catch(function (err) {
                          Meteor._reload.reload();
                        });
                      }).catch(function(err) {
                        Meteor._reload.reload();
                      });
                    }).catch(function (err) {
                      swal({
                      title: 'Oooops...',
                      text: err,
                      type: 'error',
                      showCancelButton: false,
                      confirmButtonText: 'Try Again'
                      }).then((result) => {
                      if (result.value) {
                        Meteor._reload.reload();
                      } else if (result.dismiss === 'cancel') {
      
                      }
                      });
                      
                      $('.fullScreenSpin').css('display','none');
                      });
                      }).catch(function (err) {
                        objDetails = {
                        type: "TPayrollCalendars",
                        fields: {
                            PayrollCalendarPayPeriod:payperiod,
                            PayrollCalendarName:calender_name,
                            PayrollCalendarStartDate:moment(startdate,'DD/MM/YYYY').format('YYYY-MM-DD'),
                            PayrollCalendarFirstPaymentDate:moment(FirstPaymentDate,'DD/MM/YYYY').format('YYYY-MM-DD'),
                            PayrollCalendarActive :true, 
                       }
                    };
      
                    taxRateService.saveCalender(objDetails).then(function (objDetails) {
                     sideBarService.getCalender().then(function(dataReload) {
                        addVS1Data('TPayrollCalendars',JSON.stringify(dataReload)).then(function (datareturn) {
    
                            swal({
                                title: 'Success',
                                text: 'success',
                                type: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'Done'
    
                            }).then((result) => {
                            if (result.value) {
                                            Meteor._reload.reload();
                            }else if (result.dismiss === 'cancel') {
                            
                            }
                            });
                         
                        }).catch(function (err) {
                          Meteor._reload.reload();
                        });
                      }).catch(function(err) {
                        Meteor._reload.reload();
                      });
                    }).catch(function (err) {
                     swal({
                     title: 'Oooops...',
                     text: err,
                     type: 'error',
                     showCancelButton: false,
                     confirmButtonText: 'Try Again'
                     }).then((result) => {
                     if (result.value) {
                      Meteor._reload.reload();
                     } else if (result.dismiss === 'cancel') {
      
                     }
                     });
                       $('.fullScreenSpin').css('display','none');
                   });
                  });
            }
                      
         }




    },

   'click .btnSaveDefaultTax':function(){

        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let editbankaccount = $('#editbankaccount').val() || '';
        let editpaygbankaccount = $('#editpaygbankaccount').val() || '';
        let editwagesexpbankaccount = $('#editwagesexpbankaccount').val() || '';
        let editwagespaybankaccount = $('#editwagespaybankaccount').val() || '';
        let editsuperliabbankaccount = $('#editsuperliabbankaccount').val() || '';
        let editsuperexpbankaccount = $('#editsuperexpbankaccount').val() || '';
        let employegroup = $('#employegroup').val() || '';
        let timesheetcat = $('#timesheetcat').val() || '';
        let swtShowAnnualSalary = false;
        let swtShowEmploymentBasis = false;
        let uploadedImage = $('#uploadedImage').attr('src');

        let payrollsettingor = $('#payrollsettingor').val() || 0;
        
        if($('#swtShowAnnualSalary').is(':checked')){
            swtShowAnnualSalary = true;
        }else{
            swtShowAnnualSalary = false;
        }

        if($('#payrollsettingor').val() == '')
        {
            payrollsettingor = 0;
        }

        if($('#swtShowEmploymentBasis').is(':checked')){
            swtShowEmploymentBasis = true;
        }else{
            swtShowEmploymentBasis = false;
        }

    
         if (editbankaccount === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Bank account has not been selected!', '', 'warning');
            e.preventDefault();
         }
         else if(editpaygbankaccount === '')
         { 
             $('.fullScreenSpin').css('display','none');
             swal('PAYG Liability Account has not been selected!', '', 'warning');
             e.preventDefault();

         }
         else if(editwagesexpbankaccount === '')
         { 
             $('.fullScreenSpin').css('display','none');
             swal('Wages Expense Account has not been selected!', '', 'warning');
             e.preventDefault();

         }
         else if(editwagespaybankaccount === '')
         { 
             $('.fullScreenSpin').css('display','none');
             swal('Wages Payable Account has not been selected!', '', 'warning');
             e.preventDefault();

         }
         else if(editsuperliabbankaccount === '')
         { 
             $('.fullScreenSpin').css('display','none');
             swal('Superannuation Liability Account has not been selected!', '', 'warning');
             e.preventDefault();

         }
         else if(editsuperexpbankaccount === '')
         { 
             $('.fullScreenSpin').css('display','none');
             swal('Superannuation Expense Account has not been selected!', '', 'warning');
             e.preventDefault();

         }
         else 
         {
            $('.fullScreenSpin').css('display','inline-block');

            objDetails = {
                type: "Tpayrollorganization",
                fields: {
                    ID: parseInt(payrollsettingor),
                    PayrollBankAccount:editbankaccount,
                    PayrollEmployeeGroup:employegroup,
                    PayrollPaygLiabilityAccount:editpaygbankaccount,
                    PayrollShowAnnualSalary:swtShowAnnualSalary,
                    PayrollShowEmploymentBasis :swtShowEmploymentBasis, 
                    PayrollSuperannuationLiabilityAccount:editsuperliabbankaccount,
                    PayrollSuperannuationPayableAccount:editsuperexpbankaccount,
                    PayrollTimesheetCategories:timesheetcat,
                    PayrollWagesExpenseAccount:editwagesexpbankaccount,
                    PayrollWagesPayableAccount:editwagespaybankaccount             
                }
            };

            taxRateService.savePayOrganization(objDetails).then(function (objDetails){
                
                swal({
                    title: 'Success',
                    text: 'success',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Done'
            
                }).then((result) => {
                if (result.value) {
               
                 
                    
                  Meteor._reload.reload();
                             
                }else if (result.dismiss === 'cancel') {
                
                }
                });

                $('.fullScreenSpin').css('display','none')

            });



        
         }
       
    },

   'click .saveSuperannuation': function(){
      
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let fundType = $('#edtFundType').val() || '';
        let fundName = $('#edtFundName').val() || '';
        let employeNumber = $('#edtEmployerNumber').val() || '';
         
        if (fundName === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Fund Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {

            // if(Session.get('supperannuation'))
            // {
            //       let output  = Session.get('supperannuation');
            //       objDetails = {
            //         type: "TSuperannuation",
            //         fields: {
            //             ID: '2144234523',
            //             SuperannuationType:fundType,
            //             SuperannuationName:fundName,
            //             SuperannuationEmployerNumber:employeNumber,
            //             SuperannuationSpin:'',
            //             SuperannuationsUsi :'',     
            //             SuperannuationsAutoMigratedFund:true,
            //             SuperannuationActive:true,         
            //         }
            //     };

            //     output.push(objDetails);
            //     Session.set('supperannuation',output);

            // }
            // else
            // {
            //     let object_array = [];
            //     objDetails = {
            //         type: "TSuperannuation",
            //         fields: {
            //             ID: '2144234523',
            //             SuperannuationType:fundType,
            //             SuperannuationName:fundName,
            //             SuperannuationEmployerNumber:employeNumber,
            //             SuperannuationSpin:'',
            //             SuperannuationsUsi :'',     
            //             SuperannuationsAutoMigratedFund:true,
            //             SuperannuationActive:true,         
            //         }
            //     };

            //     object_array.push(objDetails);
            //     Session.set('supperannuation',object_array);

            // }
          
           
            // let output  = Session.get('supperannuation');
            // $('.fullScreenSpin').css('display','inline-block')
            // swal({
            //           title: 'Success',
            //           text: 'success',
            //           type: 'success',
            //           showCancelButton: false,
            //           confirmButtonText: 'Done'

            //      }).then((result) => {
            //           if (result.value) {
            //             Meteor._reload.reload();
            //           } else if (result.dismiss === 'cancel') {
        
            //           }
            //           });
                      
            //           $('.fullScreenSpin').css('display','none');
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkSuperannuationName(fundName).then(function (data) {
                supperannuationId = data.tsuperannuation[0].Id;
                objDetails = {
                   type: "TSuperannuation",
                   fields: {
                       ID: parseInt(supperannuationId),
                       Superfund:fundName,
                       Employeeid:employeNumber,
                       KeyStringFieldName:fundType,                     
                    //    SuperannuationSpin:'',
                    //    SuperannuationsUsi :'',     
                    //    SuperannuationsAutoMigratedFund:true,
                        
                          
                   }
               };
  
              taxRateService.saveSuperannuation(objDetails).then(function (objDetails) {
                 sideBarService.getSuperannuation().then(function(dataReload) {
                    addVS1Data('TSuperannuation',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
  
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "TSuperannuation",
                    fields: {
                        Superfund:fundName,
                        Employeeid:employeNumber,
                        KeyStringFieldName:fundType,    
                        
                   }
                };
          
                taxRateService.saveSuperannuation(objDetails).then(function (objDetails) {
                 sideBarService.getSuperannuation().then(function(objDetails) {
                    addVS1Data('TSuperannuation',JSON.stringify(objDetails)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
  
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             


         }




    },

   'click .newreiumbursement': function(){
      
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let reimbursementname = $('#edtReimbursementName').val() || '';
        let account = $('#edtReimbursementAccount').val() || '';     
        
        if (reimbursementname === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Reimbursement name Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {
            
            //     if(Session.get('reimbursement'))
            //    {
            //         let output  = Session.get('supperannuation');
            //         objDetails = {
            //             type: "TReimbursement",
            //             fields: {
            //                 ID: 955662665,
            //                 PayItemsReiumbursementName:reimbursementname,
            //                 PayItemsReiumbursementAccount:account,
            //                 PayItemsReiumbursementActive:true,         
            //             }
            //         };

            //             output.push(objDetails);
            //             Session.set('reimbursement',output);

            //     }
            //     else
            //     {
            //         let object_array = [];
            //         objDetails = {
            //             type: "TReimbursement",
            //             fields: {
            //                 ID: 955662665,
            //                 PayItemsReiumbursementName:reimbursementname,
            //                 PayItemsReiumbursementAccount:account,
            //                 PayItemsReiumbursementActive:true,         
            //             }
            //         };

            //         object_array.push(objDetails);
            //         Session.set('reimbursement',object_array);

            //     }
               
                // let output  = Session.get('reimbursement');
                // $('.fullScreenSpin').css('display','inline-block')
                // swal({
                //           title: 'Success',
                //           text: 'success',
                //           type: 'success',
                //           showCancelButton: false,
                //           confirmButtonText: 'Done'

                //      }).then((result) => {
                //           if (result.value) {
                //             Meteor._reload.reload();
                //           } else if (result.dismiss === 'cancel') {
            
                //           }
                //           });
                          
                //           $('.fullScreenSpin').css('display','none');

           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkReimbursementByName(reimbursementname).then(function (data) {
                TReimbursementid = data.treimbursement[0].Id;
                objDetails = {
                   type: "TReimbursement",
                   fields: {
                       ID: parseInt(TReimbursementid),
                       ReimbursementName:reimbursementname,
                       ReimbursementAccount:account,
                       ReimbursementActive:true, 
                   }
               };
  
              taxRateService.saveReimbursement(objDetails).then(function (objDetails) {
                 sideBarService.getReimbursement().then(function(dataReload) {
                    addVS1Data('TReimbursement',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
  
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "TReimbursement",
                    fields: {
                        ReimbursementName:reimbursementname,
                        ReimbursementAccount:account,
                        ReimbursementActive:true,    
                   }
                };
  
                taxRateService.saveReimbursement(objDetails).then(function (objDetails) {
                sideBarService.getSupgetReimbursementerannuation().then(function(dataReload) {
                    addVS1Data('TReimbursement',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
  
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             


         }




     },

   'click .savePaidLeave':function(){
     
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let Leavename = $('#edtLeaveName').val() || '';
        let Typeofunit = $('#edtTypeOfUnits').val() || '';     
        let edtLeaveLoadingRate = $('#edtLeaveLoadingRate').val() || '';
        let edtNormalEntitlement = $('#edtNormalEntitlement').val() || '';
        let payonslip = false;

        if($('#formCheck-ShowBalance').is(':checked')){
            payonslip = true;
        }else{
            payonslip = false;
        }



        if (Leavename === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Leave name Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {
           
            // if(Session.get('paidleave'))
            // {
            //       let output  = Session.get('paidleave');
            //       objDetails = {
            //         type: "TPaidLeave",
            //         fields: {
            //             ID: 463654464,
            //             PayItemsLeavePaidName:Leavename,
            //             PayItemsLeavePaidUnits:Typeofunit,
            //             PayItemsLeavePaidLeaveLoadingRate:edtLeaveLoadingRate,
            //             PayItemsLeavePaidNormalEntitlement:edtNormalEntitlement,
            //             PayItemsLeavePaidShowBalanceOnPayslip:payonslip,
            //             PayItemsLeavePaidActive:true,        
            //         }
            //     };
            
            //     output.push(objDetails);
            //     Session.set('paidleave',output);
            
            // }
            // else
            // {
            //     let object_array = [];
            //     objDetails = {
            //         type: "TPaidLeave",
            //         fields: {
            //             ID: 463654464,
            //             PayItemsLeavePaidName:Leavename,
            //             PayItemsLeavePaidUnits:Typeofunit,
            //             PayItemsLeavePaidLeaveLoadingRate:edtLeaveLoadingRate,
            //             PayItemsLeavePaidNormalEntitlement:edtNormalEntitlement,
            //             PayItemsLeavePaidShowBalanceOnPayslip:payonslip,
            //             PayItemsLeavePaidActive:true,        
            //         }
            //     };
            
            //     object_array.push(objDetails);
            //     Session.set('paidleave',object_array);
            
            // }
            
            
            // let output  = Session.get('paidleave');
            // $('.fullScreenSpin').css('display','inline-block')
            // swal({
            //           title: 'Success',
            //           text: 'success',
            //           type: 'success',
            //           showCancelButton: false,
            //           confirmButtonText: 'Done'

            //      }).then((result) => {
            //           if (result.value) {
            //             Meteor._reload.reload();
            //           } else if (result.dismiss === 'cancel') {
        
            //           }
            //           });
                      
            //           $('.fullScreenSpin').css('display','none');


            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkPaidLeaveByName(Leavename).then(function (data) {
                paidleaveid = data.tpaidleave[0].Id;
                objDetails = {
                   type: "TPaidLeave",
                   fields: {
                       ID: parseInt(paidleaveid),
                       LeavePaidName:Leavename,
                       LeavePaidUnits:Typeofunit,
                       LeavePaidLeaveLoadingRate:edtLeaveLoadingRate,
                       LeavePaidNormalEntitlement:edtNormalEntitlement,
                       LeavePaidShowBalanceOnPayslip:payonslip,
                       LeavePaidActive:true,        
                   }
               };
  
              taxRateService.savePaidLeave(objDetails).then(function (objDetails) {
                 sideBarService.getPaidLeave().then(function(dataReload) {
                    addVS1Data('TPaidLeave',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
  
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "TPaidLeave",
                    fields: {
                        LeavePaidName:Leavename,
                        LeavePaidUnits:Typeofunit,
                        LeavePaidLeaveLoadingRate:edtLeaveLoadingRate,
                        LeavePaidNormalEntitlement:edtNormalEntitlement,
                        LeavePaidShowBalanceOnPayslip:payonslip,
                        LeavePaidActive:true,     
                   }
                };
  
                taxRateService.savePaidLeave(objDetails).then(function (objDetails) {
                sideBarService.getPaidLeave().then(function(dataReload) {
                    addVS1Data('TPaidLeave',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
  
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             


         }




     },

   'click .saveUnpaidLeave':function(){
      
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let Leavename = $('#edtUnpaidLeaveName').val() || '';
        let Typeofunit = $('#edtUnpaidTypeOfUnits').val() || '';     
        let edtLeaveLoadingRate = $('#edtUnpaidLeaveLoadingRate').val() || '';
        let edtNormalEntitlement = $('#edtUnpaidNormalEntitlement').val() || '';
        let payonslip = false;

        if($('#formCheck-UnpaidShowBalance').is(':checked')){
            payonslip = true;
        }else{
            payonslip = false;
        }



        if (Leavename === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Leave name Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {


            // if(Session.get('leave'))
            // {
            //       let output  = Session.get('leave');
            //       objDetails = {
            //         type: "TUnpaidLeave",
            //         fields: {
            //             ID: 353242432432,
            //             PayItemsLeaveUnpaidName:Leavename,
            //             PayItemsLeaveUnpaidUnits:Typeofunit,
            //             PayItemsLeaveUnpaidLeaveLoadingRate:edtLeaveLoadingRate,
            //             PayItemsLeaveUnpaidNormalEntitlement:edtNormalEntitlement,
            //             PayItemsLeaveUnpaidShowBalanceOnPayslip:payonslip,
            //             PayItemsLeaveUnpaidActive:true,        
            //         }
            //     };
            
            //     output.push(objDetails);
            //     Session.set('leave',output);
            
            // }
            // else
            // {
            //     let object_array = [];
            //     objDetails = {
            //         type: "TUnpaidLeave",
            //         fields: {
            //             ID: 353242432432,
            //             PayItemsLeaveUnpaidName:Leavename,
            //             PayItemsLeaveUnpaidUnits:Typeofunit,
            //             PayItemsLeaveUnpaidLeaveLoadingRate:edtLeaveLoadingRate,
            //             PayItemsLeaveUnpaidNormalEntitlement:edtNormalEntitlement,
            //             PayItemsLeaveUnpaidShowBalanceOnPayslip:payonslip,
            //             PayItemsLeaveUnpaidActive:true,        
            //         }
            //     };
            
            //     object_array.push(objDetails);
            //     Session.set('leave',object_array);
            
            // }
            
            
            // let output  = Session.get('leave');
            // $('.fullScreenSpin').css('display','inline-block')
            //  swal({
            //                   title: 'Success',
            //                   text: 'success',
            //                   type: 'success',
            //                   showCancelButton: false,
            //                   confirmButtonText: 'Done'

            //    }).then((result) => {
            //                   if (result.value) {
            //                     Meteor._reload.reload();
            //                    } else if (result.dismiss === 'cancel') {
                
            //    }
             
            //  });
                              
            // $('.fullScreenSpin').css('display','none');
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkunPaidLeaveByName(Leavename).then(function (data) {
                paidleaveid = data.tupaidleave[0].Id;
                objDetails = {
                   type: "TUnpaidLeave",
                   fields: {
                       ID: parseInt(paidleaveid),
                
                       LeaveUnPaidName:Leavename,
                       LeaveUnPaidUnits:Typeofunit,
                       LeaveUnPaidLeaveLoadingRate:edtLeaveLoadingRate,
                       LeaveUnPaidNormalEntitlement:edtNormalEntitlement,
                       LeaveUnPaidShowBalanceOnPayslip:payonslip,
                       LeaveUnPaidActive:true,    
                      
                   }
               };
  
              taxRateService.saveUnPaidLeave(objDetails).then(function (objDetails) {
                 sideBarService.getUnPaidLeave().then(function(dataReload) {
                    addVS1Data('TUnpaidLeave',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
  
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "TUnpaidLeave",
                    fields: {
                        LeaveUnPaidName:Leavename,
                        LeaveUnPaidUnits:Typeofunit,
                        LeaveUnPaidLeaveLoadingRate:edtLeaveLoadingRate,
                        LeaveUnPaidNormalEntitlement:edtNormalEntitlement,
                        LeaveUnPaidShowBalanceOnPayslip:payonslip,
                        LeaveUnPaidActive:true,    
                          
                   }
                };
  
                taxRateService.saveUnPaidLeave(objDetails).then(function (objDetails) {
                sideBarService.getUnPaidLeave().then(function(dataReload) {
                    addVS1Data('TUnpaidLeave',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
  
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             


         }


     },
   
   'click .saveExemptReportable':function(){
      
    let templateObject = Template.instance();
    $('.fullScreenSpin').css('display','inline-block');
    let taxRateService = new TaxRateService();
    let edtEarningsName = $('#edtEarningsName').val() || '';
    let edtDisplayName = $('#edtDisplayName').val() || '';     
    let edtRateType = $('#edtRateType').val() || '';
    let edtExpenseAccount = $('#edtExpenseAccount').val() || '';
    let ExemptPAYGp = false;
    let ExemptSuperannuation = false;
    let ExemptReportable = false;

    if($('#formCheck-ExemptPAYG').is(':checked')){
        ExemptPAYGp = true;
    }else{
        ExemptPAYGp = false;
    }

    if($('#formCheck-ExemptSuperannuation').is(':checked')){
        ExemptSuperannuation = true;
    }else{
        ExemptSuperannuation = false;
    }

    if($('#formCheck-ExemptReportable').is(':checked')){
        ExemptReportable = true;
    }else{
        ExemptReportable = false;
    }

    if (edtEarningsName === '') {
        $('.fullScreenSpin').css('display','none');
        swal('Earnings Name has not been Filled!', '', 'warning');
        e.preventDefault();
     }
     else {

            // if(Session.get('ExemptReportable'))
            // {
            //     let output  = Session.get('ExemptReportable');
            //     objDetails = {
            //         type: "TOrdinaryTimeEarnings",
            //         fields: {
            //             ID: 5999899,
            //             PayItemsEarningsOrdinaryTimeEarningsName:edtEarningsName,
            //             PayItemsEarningsOrdinaryTimeEarningsDisplayName:edtDisplayName,
            //             PayItemsEarningsOrdinaryTimeEarningsRateType:edtRateType,
            //             PayItemsEarningsOrdinaryTimeEarningsExpenseAccount:edtExpenseAccount,
            //             PayItemsEarningsOrdinaryTimeEarningsExemptPaygWithholding:ExemptPAYGp,
            //             PayItemsEarningsOrdinaryTimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //             PayItemsEarningsOrdinaryTimeEarningsReportableW1onActivityStatement:ExemptReportable,
            //             PayItemsEarningsOrdinaryTimeEarningsActive:true     
            //         }
            //     };

            //     output.push(objDetails);
            //     Session.set('ExemptReportable',output);

            // }
            // else
            // {
            //     let object_array = [];
            //     objDetails = {
            //         type: "TOrdinaryTimeEarnings",
            //         fields: {
            //             ID: 89599895,
            //             PayItemsEarningsOrdinaryTimeEarningsName:edtEarningsName,
            //             PayItemsEarningsOrdinaryTimeEarningsDisplayName:edtDisplayName,
            //             PayItemsEarningsOrdinaryTimeEarningsRateType:edtRateType,
            //             PayItemsEarningsOrdinaryTimeEarningsExpenseAccount:edtExpenseAccount,
            //             PayItemsEarningsOrdinaryTimeEarningsExemptPaygWithholding:ExemptPAYGp,
            //             PayItemsEarningsOrdinaryTimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //             PayItemsEarningsOrdinaryTimeEarningsReportableW1onActivityStatement:ExemptReportable,
            //             PayItemsEarningsOrdinaryTimeEarningsActive:true     
            //         }
            //     };

            //     object_array.push(objDetails);
            //     Session.set('ExemptReportable',object_array);

            // }


            // let output  = Session.get('ExemptReportable');
            // $('.fullScreenSpin').css('display','inline-block')
            // swal({
            //           title: 'Success',
            //           text: 'success',
            //           type: 'success',
            //           showCancelButton: false,
            //           confirmButtonText: 'Done'

            //      }).then((result) => {
            //           if (result.value) {
            //             Meteor._reload.reload();
            //           } else if (result.dismiss === 'cancel') {
        
            //           }
            //           });
                      
            //           $('.fullScreenSpin').css('display','none');
       
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkordinaryEarningByName(edtEarningsName).then(function (data) {
                console.log(data);
                earningid = data.tordinarytimeearnings[0].Id;
                objDetails = {
               type: "TOrdinaryTimeEarnings",
                fields: {
                   ID: parseInt(earningid),
                   OrdinaryTimeEarningsName:edtEarningsName,
                   OrdinaryTimeEarningsDisplayName:edtDisplayName,
                   OrdinaryTimeEarningsRateType:edtRateType,
                   OrdinaryTimeEarningsExpenseAccount:edtExpenseAccount,
                   OrdinaryTimeEarningsExemptPaygWithholding:ExemptPAYGp,
                   OrdinaryTimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                   OrdinaryTimeEarningsReportableW1onActivityStatement:ExemptReportable,
                   OrdinaryTimeEarningsActive:true     
               }
           };

          taxRateService.saveordinaryEarningByName(objDetails).then(function (objDetails) {
             sideBarService.getordinaryEarningByName().then(function(dataReload) {
                addVS1Data('TOrdinaryTimeEarnings',JSON.stringify(dataReload)).then(function (datareturn) {
                  Meteor._reload.reload();
                }).catch(function (err) {
                  Meteor._reload.reload();
                });
              }).catch(function(err) {
                Meteor._reload.reload();
              });
            }).catch(function (err) {
              swal({
              title: 'Oooops...',
              text: err,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
              }).then((result) => {
              if (result.value) {
                Meteor._reload.reload();
              } else if (result.dismiss === 'cancel') {

              }
              });
              
              $('.fullScreenSpin').css('display','none');
              });
              }).catch(function (err) {
                objDetails = {
                type: "TOrdinaryTimeEarnings",
                fields: {
                    OrdinaryTimeEarningsName:edtEarningsName,
                    OrdinaryTimeEarningsDisplayName:edtDisplayName,
                    OrdinaryTimeEarningsRateType:edtRateType,
                    OrdinaryTimeEarningsExpenseAccount:edtExpenseAccount,
                    OrdinaryTimeEarningsExemptPaygWithholding:ExemptPAYGp,
                    OrdinaryTimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                    OrdinaryTimeEarningsReportableW1onActivityStatement:ExemptReportable,
                    OrdinaryTimeEarningsActive:true           
               }
            };

            taxRateService.saveordinaryEarningByName(objDetails).then(function (objDetails) {
            sideBarService.getordinaryEarningByName().then(function(dataReload) {
                addVS1Data('TOrdinaryTimeEarnings',JSON.stringify(dataReload)).then(function (datareturn) {
                  Meteor._reload.reload();
                }).catch(function (err) {
                  Meteor._reload.reload();
                });
              }).catch(function(err) {
                Meteor._reload.reload();
              });
            }).catch(function (err) {
             swal({
             title: 'Oooops...',
             text: err,
             type: 'error',
             showCancelButton: false,
             confirmButtonText: 'Try Again'
             }).then((result) => {
             if (result.value) {
              Meteor._reload.reload();
             } else if (result.dismiss === 'cancel') {

             }
             });
               $('.fullScreenSpin').css('display','none');
           });
          });
         


     }




    },

   'click .saveExemptReportableOvertime':function(){
       
    let templateObject = Template.instance();
    $('.fullScreenSpin').css('display','inline-block');
    let taxRateService = new TaxRateService();
    let edtEarningsName = $('#edtEarningsNameOvertime').val() || '';
    let edtDisplayName = $('#edtDisplayNameOvertime').val() || '';     
    let edtRateType = $('#edtRateTypeOvertime').val() || '';
    let edtExpenseAccount = $('#edtExpenseAccountOvertime').val() || '';
    let ExemptPAYGp = false;
    let ExemptSuperannuation = false;
    let ExemptReportable = false;

    if($('#formCheck-ExemptPAYGOvertime').is(':checked')){
        ExemptPAYGp = true;
    }else{
        ExemptPAYGp = false;
    }

    if($('#formCheck-ExemptSuperannuationOvertime').is(':checked')){
        ExemptSuperannuation = true;
    }else{
        ExemptSuperannuation = false;
    }

    if($('#formCheck-ExemptReportableOvertime').is(':checked')){
        ExemptReportable = true;
    }else{
        ExemptReportable = false;
    }

    if (edtEarningsName === '') {
        $('.fullScreenSpin').css('display','none');
        swal('Earnings Name has not been Filled!', '', 'warning');
        e.preventDefault();
     }
     else {

        // if(Session.get('ExemptReportableOvertime'))
        // {
        //     let output  = Session.get('ExemptReportableOvertime');
        //     objDetails = {
        //         type: "TOvertimeEarnigns",
        //         fields: {
        //             ID: 897979867565,
        //             PayItemsEarningsOvertimeEarningsName:edtEarningsName,
        //             PayItemsEarningsOvertimeEarningsDisplayName:edtDisplayName,
        //             PayItemsEarningsOvertimeEarningsRateType:edtRateType,
        //             PayItemsEarningsOvertimeEarningsExpenseAccount:edtExpenseAccount,
        //             PayItemsEarningsOvertimeEarningsExemptPaygWithholding:ExemptPAYGp,
        //             PayItemsEarningsOvertimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
        //             PayItemsEarningsOvertimeEarningsReportableW1onActivityStatement:ExemptReportable,
        //             PayItemsEarningsOvertimeEarningsActive:true     
        //         }
        //     };
            

        //     output.push(objDetails);
        //     Session.set('ExemptReportableOvertime',output);

        // }
        // else
        // {
        //     let object_array = [];
        //     objDetails = {
        //         type: "TOvertimeEarnigns",
        //         fields: {
        //             ID: 897979867565,
        //             PayItemsEarningsOvertimeEarningsName:edtEarningsName,
        //             PayItemsEarningsOvertimeEarningsDisplayName:edtDisplayName,
        //             PayItemsEarningsOvertimeEarningsRateType:edtRateType,
        //             PayItemsEarningsOvertimeEarningsExpenseAccount:edtExpenseAccount,
        //             PayItemsEarningsOvertimeEarningsExemptPaygWithholding:ExemptPAYGp,
        //             PayItemsEarningsOvertimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
        //             PayItemsEarningsOvertimeEarningsReportableW1onActivityStatement:ExemptReportable,
        //             PayItemsEarningsOvertimeEarningsActive:true     
        //         }
        //     };

        //     object_array.push(objDetails);
        //     Session.set('ExemptReportableOvertime',object_array);

        // }


        // let output  = Session.get('ExemptReportableOvertime');
        // $('.fullScreenSpin').css('display','inline-block')
        //             swal({
        //                       title: 'Success',
        //                       text: 'success',
        //                       type: 'success',
        //                       showCancelButton: false,
        //                       confirmButtonText: 'Done'

        //                  }).then((result) => {
        //                       if (result.value) {
        //                         Meteor._reload.reload();
        //                       } else if (result.dismiss === 'cancel') {
                
        //                       }
        //                       });
                              
        //                       $('.fullScreenSpin').css('display','none');
       
        $('.fullScreenSpin').css('display','inline-block');
        taxRateService.checkExemptReportableOvertime(edtEarningsName).then(function (data) {
            earningid = data.tovertimeEarnigns[0].Id;
            objDetails = {
               type: "Tovertimeearnings",
               fields: {
                   ID: parseInt(earningid),
                   OverTimeEarningsName:edtEarningsName,
                   OverTimeEarningsDisplayName:edtDisplayName,
                   OverTimeEarningsRateType:edtRateType,
                   OverTimeEarningsExpenseAccount:edtExpenseAccount,
                   OverTimeEarningsExemptPaygWithholding:ExemptPAYGp,
                   OverTimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                   OverTimeEarningsReportableW1onActivityStatement:ExemptReportable,
                   OverTimeEarningsActive:true     
               }
           };

          taxRateService.saveExemptReportableOvertime(objDetails).then(function (objDetails) {
             sideBarService.getExemptReportableOvertime().then(function(dataReload) {
                addVS1Data('TOverTimeEarnings',JSON.stringify(dataReload)).then(function (datareturn) {
                  Meteor._reload.reload();
                }).catch(function (err) {
                  Meteor._reload.reload();
                });
              }).catch(function(err) {
                Meteor._reload.reload();
              });
            }).catch(function (err) {
              swal({
              title: 'Oooops...',
              text: err,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
              }).then((result) => {
              if (result.value) {
                Meteor._reload.reload();
              } else if (result.dismiss === 'cancel') {

              }
              });
              
              $('.fullScreenSpin').css('display','none');
              });
              }).catch(function (err) {
                objDetails = {
                type: "Tovertimeearnings",
                fields: {
                    OverTimeEarningsName:edtEarningsName,
                    OverTimeEarningsDisplayName:edtDisplayName,
                    OverTimeEarningsRateType:edtRateType,
                    OverTimeEarningsExpenseAccount:edtExpenseAccount,
                    OverTimeEarningsExemptPaygWithholding:ExemptPAYGp,
                    OverTimeEarningsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                    OverTimeEarningsReportableW1onActivityStatement:ExemptReportable,
                    OverTimeEarningsActive:true            
               }
            };

            taxRateService.saveExemptReportableOvertime(objDetails).then(function (objDetails) {
            sideBarService.getExemptReportableOvertime().then(function(dataReload) {
                addVS1Data('TOverTimeEarnings',JSON.stringify(dataReload)).then(function (datareturn) {
                  Meteor._reload.reload();
                }).catch(function (err) {
                  Meteor._reload.reload();
                });
              }).catch(function(err) {
                Meteor._reload.reload();
              });
            }).catch(function (err) {
             swal({
             title: 'Oooops...',
             text: err,
             type: 'error',
             showCancelButton: false,
             confirmButtonText: 'Try Again'
             }).then((result) => {
             if (result.value) {
              Meteor._reload.reload();
             } else if (result.dismiss === 'cancel') {

             }
             });
               $('.fullScreenSpin').css('display','none');
           });
          });
         


     }

    },

   'click .saveSuperannuationBonusesCommissions':function(){
    let templateObject = Template.instance();
    $('.fullScreenSpin').css('display','inline-block');
    let taxRateService = new TaxRateService();
    let edtEarningsName = $('#edtEarningsNameBonusesCommissions').val() || '';
    let edtDisplayName = $('#edtDisplayNameBonusesCommissions').val() || '';     
    let edtRateType = $('#edtRateTypeBonusesCommissions').val() || '';
    let edtExpenseAccount = $('#edtExpenseAccountBonusesCommissions').val() || '';
    let ExemptPAYGp = false;
    let ExemptSuperannuation = false;
    let ExemptReportable = false;

    if($('#ormCheck-ExemptPAYGBonusesCommissions').is(':checked')){
        ExemptPAYGp = true;
    }else{
        ExemptPAYGp = false;
    }

    if($('#formCheck-ExemptSuperannuationBonusesCommissions').is(':checked')){
        ExemptSuperannuation = true;
    }else{
        ExemptSuperannuation = false;
    }

    if($('#formCheck-ExemptReportableBonusesCommissions').is(':checked')){
        ExemptReportable = true;
    }else{
        ExemptReportable = false;
    }

    if (edtEarningsName === '') {
        $('.fullScreenSpin').css('display','none');
        swal('Earnings Name has not been Filled!', '', 'warning');
        e.preventDefault();
     }
     else {

        // if(Session.get('ExemptReportableBonusesCommissions'))
        // {
        //     let output  = Session.get('ExemptReportableBonusesCommissions');
        //     objDetails = {
        //         type: "TEarningsBonusesCommissions",
        //         fields: {
        //             ID: 9685565999,
        //             EarningsBonusesCommissionsName:edtEarningsName,
        //             EarningsBonusesCommissionsDisplayName:edtDisplayName,
        //             EarningsBonusesCommissionsRateType:edtRateType,
        //             EarningsBonusesCommissionsExpenseAccount:edtExpenseAccount,
        //             EarningsBonusesCommissionsExemptPaygWithholding:ExemptPAYGp,
        //             EarningsBonusesCommissionsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
        //             EarningsBonusesCommissionsReportableW1onActivityStatement:ExemptReportable,
        //             EarningsBonusesCommissionsActive:true     
        //         }
        //     };

        //     output.push(objDetails);
        //     Session.set('ExemptReportableBonusesCommissions',output);

        // }
        // else
        // {
        //     let object_array = [];
        //     objDetails = {
        //         type: "TEarningsBonusesCommissions",
        //         fields: {
        //             ID: 9685565999,
        //             EarningsBonusesCommissionsName:edtEarningsName,
        //             EarningsBonusesCommissionsDisplayName:edtDisplayName,
        //             EarningsBonusesCommissionsRateType:edtRateType,
        //             EarningsBonusesCommissionsExpenseAccount:edtExpenseAccount,
        //             EarningsBonusesCommissionsExemptPaygWithholding:ExemptPAYGp,
        //             EarningsBonusesCommissionsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
        //             EarningsBonusesCommissionsReportableW1onActivityStatement:ExemptReportable,
        //             EarningsBonusesCommissionsActive:true     
        //         }
        //     };

        //     object_array.push(objDetails);
        //     Session.set('ExemptReportableBonusesCommissions',object_array);

        // }


        // let output  = Session.get('ExemptReportableBonusesCommissions');
        // $('.fullScreenSpin').css('display','inline-block')
        // swal({
        //           title: 'Success',
        //           text: 'success',
        //           type: 'success',
        //           showCancelButton: false,
        //           confirmButtonText: 'Done'

        //      }).then((result) => {
        //           if (result.value) {
        //             Meteor._reload.reload();
        //           } else if (result.dismiss === 'cancel') {
    
        //           }
        //           });
                  
        //           $('.fullScreenSpin').css('display','none');
       
        $('.fullScreenSpin').css('display','inline-block');
        taxRateService.checkSuperannuationBonusesCommissions(edtEarningsName).then(function (data) {
            earningid = data.tearningsbonusescommissions[0].Id;
            objDetails = {
               type: "Tearningsbonusescommissions",
               fields: {
                   ID: parseInt(earningid),
                   EarningBonusesCommisionsName:edtEarningsName,
                   EarningBonusesCommisionsDisplayName:edtDisplayName,
                   EarningBonusesCommisionsRateType:edtRateType,
                   EarningBonusesCommisionsExpenseAccount:edtExpenseAccount,
                   EarningBonusesCommisionsExemptPaygWithholding:ExemptPAYGp,
                   EarningBonusesCommisionsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                   EarningBonusesCommisionsReportableW1onActivityStatement:ExemptReportable,
                   EarningBonusesCommisionsActive:true     
               }
           };

          taxRateService.saveSuperannuationBonusesCommissions(objDetails).then(function (objDetails) {
             sideBarService.getsuperannuationBonusesCommissions().then(function(dataReload) {
                addVS1Data('TEarningsBonusesCommissions',JSON.stringify(dataReload)).then(function (datareturn) {
                  Meteor._reload.reload();
                }).catch(function (err) {
                  Meteor._reload.reload();
                });
              }).catch(function(err) {
                Meteor._reload.reload();
              });
            }).catch(function (err) {
              swal({
              title: 'Oooops...',
              text: err,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
              }).then((result) => {
              if (result.value) {
                Meteor._reload.reload();
              } else if (result.dismiss === 'cancel') {

              }
              });
              
              $('.fullScreenSpin').css('display','none');
              });
              }).catch(function (err) {
                objDetails = {
                type: "Tearningsbonusescommissions",
                fields: {
                    EarningBonusesCommisionsName:edtEarningsName,
                    EarningBonusesCommisionsDisplayName:edtDisplayName,
                    EarningBonusesCommisionsRateType:edtRateType,
                    EarningBonusesCommisionsExpenseAccount:edtExpenseAccount,
                    EarningBonusesCommisionsExemptPaygWithholding:ExemptPAYGp,
                    EarningBonusesCommisionsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                    EarningBonusesCommisionsReportableW1onActivityStatement:ExemptReportable,
                    EarningBonusesCommisionsActive:true          
               }
            };

            taxRateService.saveSuperannuationBonusesCommissions(objDetails).then(function (objDetails) {
            sideBarService.getsuperannuationBonusesCommissions().then(function(dataReload) {
                addVS1Data('TEarningsBonusesCommissions',JSON.stringify(dataReload)).then(function (datareturn) {
                  Meteor._reload.reload();
                }).catch(function (err) {
                  Meteor._reload.reload();
                });
              }).catch(function(err) {
                Meteor._reload.reload();
              });
            }).catch(function (err) {
             swal({
             title: 'Oooops...',
             text: err,
             type: 'error',
             showCancelButton: false,
             confirmButtonText: 'Try Again'
             }).then((result) => {
             if (result.value) {
              Meteor._reload.reload();
             } else if (result.dismiss === 'cancel') {

             }
             });
               $('.fullScreenSpin').css('display','none');
           });
          });
     }
    },

   'click .saveExemptReportableLumpSumE':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let edtEarningsName = $('#edtEarningsNameLumpSumE').val() || '';
        let edtDisplayName = $('#edtDisplayNameLumpSumE').val() || '';     
        let edtRateType = $('#edtRateTypeLumpSumE').val() || '';
        let edtExpenseAccount = $('#edtExpenseAccountLumpSumE').val() || '';
        let ExemptPAYGp = false;
        let ExemptSuperannuation = false;
        let ExemptReportable = false;
    
        if($('#formCheck-ExemptPAYGLumpSumE').is(':checked')){
            ExemptPAYGp = true;
        }else{
            ExemptPAYGp = false;
        }
    
        if($('#formCheck-ExemptSuperannuationLumpSumE').is(':checked')){
            ExemptSuperannuation = true;
        }else{
            ExemptSuperannuation = false;
        }
    
        if($('#ormCheck-ExemptReportableLumpSumE').is(':checked')){
            ExemptReportable = true;
        }else{
            ExemptReportable = false;
        }
    
        if (edtEarningsName === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Earnings Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {


            // if(Session.get('ExemptReportableLumpSumE'))
            // {
            //     let output  = Session.get('ExemptReportableLumpSumE');
            //     objDetails = {
            //         type: "TLumpSumE",
            //         fields: {
            //              ID: 15995945889,
            //              LumpSumEName:edtEarningsName,
            //              LumpSumEDisplayName:edtDisplayName,
            //              LumpSumERateType:edtRateType,
            //              LumpSumEExpenseAccount:edtExpenseAccount,
            //              LumpSumEExemptPaygWithholding:ExemptPAYGp,
            //              LumpSumEExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //              LumpSumEReportableW1onActivityStatement:ExemptReportable,
            //              LumpSumEActive:true        
            //         }
            //     };
    
            //     output.push(objDetails);
            //     Session.set('ExemptReportableLumpSumE',output);
    
            // }
            // else
            // {
            //     let object_array = [];
            //     objDetails = {
            //         type: "TLumpSumE",
            //         fields: {
            //              ID: 15995945889,
            //              LumpSumEName:edtEarningsName,
            //              LumpSumEDisplayName:edtDisplayName,
            //              LumpSumERateType:edtRateType,
            //              LumpSumEExpenseAccount:edtExpenseAccount,
            //              LumpSumEExemptPaygWithholding:ExemptPAYGp,
            //              LumpSumEExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //              LumpSumEReportableW1onActivityStatement:ExemptReportable,
            //              LumpSumEActive:true        
            //         }
            //     };
    
            //     object_array.push(objDetails);
            //     Session.set('ExemptReportableLumpSumE',object_array);
    
            // }
    
    
            // let output  = Session.get('ExemptReportableLumpSumE');
            // $('.fullScreenSpin').css('display','inline-block')
            //         swal({
            //                   title: 'Success',
            //                   text: 'success',
            //                   type: 'success',
            //                   showCancelButton: false,
            //                   confirmButtonText: 'Done'

            //              }).then((result) => {
            //                   if (result.value) {
            //                     Meteor._reload.reload();
            //                   } else if (result.dismiss === 'cancel') {
                
            //                   }
            //                   });
                              
            //                   $('.fullScreenSpin').css('display','none');


           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkExemptReportableLumpSumE(edtEarningsName).then(function (data) {
                earningid = data.tlumpsume[0].Id;
                objDetails = {
                   type: "Tlumpsume",
                   fields: {
                       ID: parseInt(earningid),
                        LumpSumEName:edtEarningsName,
                        LumpSumEDisplayName:edtDisplayName,
                        LumpSumERateType:edtRateType,
                        LumpSumEExpenseAccount:edtExpenseAccount,
                        LumpSumEExemptPaygWithholding:ExemptPAYGp,
                        LumpSumEExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        LumpSumEReportableW1onActivityStatement:ExemptReportable,
                        LumpSumEActive:true        
                   }
               };
    
              taxRateService.saveExemptReportableLumpSumE(objDetails).then(function (objDetails) {
                 sideBarService.getExemptReportableLumpSumE().then(function(dataReload) {
                    addVS1Data('TLumpSumE',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
    
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "Tlumpsume",
                    fields: {
                        LumpSumEName:edtEarningsName,
                        LumpSumEDisplayName:edtDisplayName,
                        LumpSumERateType:edtRateType,
                        LumpSumEExpenseAccount:edtExpenseAccount,
                        LumpSumEExemptPaygWithholding:ExemptPAYGp,
                        LumpSumEExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        LumpSumEReportableW1onActivityStatement:ExemptReportable,
                        LumpSumEActive:true         
                   }
                };
    
                taxRateService.saveExemptReportableLumpSumE(objDetails).then(function (objDetails) {
                sideBarService.getExemptReportableLumpSumE().then(function(dataReload) {
                    addVS1Data('TLumpSumE',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
    
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             
    
    
         }
    
    


    },

   'click .saveExemptReportableTermnination':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let edtEarningsName = $('#edtEarningsNameTermnination').val() || '';
        let edtDisplayName = $('#edtDisplayNameTermnination').val() || '';     
        let edtRateType = $('#edtRateTypeTermnination').val() || '';
        let edtExpenseAccount = $('#edtExpenseAccountTermnination').val() || '';
        let ExemptPAYGp = false;
        let ExemptSuperannuation = false;
        let ExemptReportable = false;
    
        if($('#formCheck-ExemptPAYGTermnination').is(':checked')){
            ExemptPAYGp = true;
        }else{
            ExemptPAYGp = false;
        }
    
        if($('#formCheck-ExemptSuperannuationTermnination').is(':checked')){
            ExemptSuperannuation = true;
        }else{
            ExemptSuperannuation = false;
        }
    
        if($('#formCheck-ExemptReportableTermnination').is(':checked')){
            ExemptReportable = true;
        }else{
            ExemptReportable = false;
        }
    
        if (edtEarningsName === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Earnings Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {

            // if(Session.get('ExemptReportableTermnination'))
            // {
            //     let output  = Session.get('ExemptReportableTermnination');
            //     objDetails = {
            //         type: "TEmployeeTerminations",
            //         fields: {
            //              ID: 9809987787897,
            //              EmployeeTerminationPaymentsName:edtEarningsName,
            //              EmployeeTerminationPaymentsDisplayName:edtDisplayName,
            //              EmployeeTerminationPaymentsRateType:edtRateType,
            //              EmployeeTerminationPaymentsExpenseAccount:edtExpenseAccount,
            //              EmployeeTerminationPaymentsExemptPaygWithholding:ExemptPAYGp,
            //              EmployeeTerminationPaymentsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //              EmployeeTerminationPaymentsReportableW1onActivityStatement:ExemptReportable,
            //              EmployeeTerminationPaymentsActive:true        
            //         }
            //     };
    
            //     output.push(objDetails);
            //     Session.set('ExemptReportableTermnination',output);
    
            // }
            // else
            // {
            //     let object_array = [];
            //     objDetails = {
            //         type: "TEmployeeTerminations",
            //         fields: {
            //              ID: 9809987787897,
            //              EmployeeTerminationPaymentsName:edtEarningsName,
            //              EmployeeTerminationPaymentsDisplayName:edtDisplayName,
            //              EmployeeTerminationPaymentsRateType:edtRateType,
            //              EmployeeTerminationPaymentsExpenseAccount:edtExpenseAccount,
            //              EmployeeTerminationPaymentsExemptPaygWithholding:ExemptPAYGp,
            //              EmployeeTerminationPaymentsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //              EmployeeTerminationPaymentsReportableW1onActivityStatement:ExemptReportable,
            //              EmployeeTerminationPaymentsActive:true        
            //         }
            //     };
            //     object_array.push(objDetails);
            //     Session.set('ExemptReportableTermnination',object_array);
    
            // }
    
    
            // let output  = Session.get('ExemptReportableTermnination');
            // $('.fullScreenSpin').css('display','inline-block')
            // swal({
            //                   title: 'Success',
            //                   text: 'success',
            //                   type: 'success',
            //                   showCancelButton: false,
            //                   confirmButtonText: 'Done'

            // }).then((result) => {
            //         if (result.value) {
            //              Meteor._reload.reload();
            //         } else if (result.dismiss === 'cancel') {
                
            //         }
            //  });
                              
            // $('.fullScreenSpin').css('display','none');
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkExemptReportableTermnination(edtEarningsName).then(function (data) {
                earningid = data.tterminationimple[0].Id;
                objDetails = {
                   type: "TTerminationSimple",
                   fields: {
                        ID: parseInt(earningid),
                        EmployeeTerminationPaymentsName:edtEarningsName,
                        EmployeeTerminationPaymentsDisplayName:edtDisplayName,
                        EmployeeTerminationPaymentsRateType:edtRateType,
                        EmployeeTerminationPaymentsExpenseAccount:edtExpenseAccount,
                        EmployeeTerminationPaymentsExemptPaygWithholding:ExemptPAYGp,
                        EmployeeTerminationPaymentsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        EmployeeTerminationPaymentsReportableW1onActivityStatement:ExemptReportable,
                        EmployeeTerminationPaymentsActive:true,
                      
                   }
               };
    
              taxRateService.saveExemptReportableTermnination(objDetails).then(function (objDetails) {
                 sideBarService.getExemptReportableTermnination().then(function(dataReload) {
                    addVS1Data('TTerminationSimple',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
    
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "TTerminationSimple",
                    fields: {
                        EmployeeTerminationPaymentsName:edtEarningsName,
                        EmployeeTerminationPaymentsDisplayName:edtDisplayName,
                        EmployeeTerminationPaymentsRateType:edtRateType,
                        EmployeeTerminationPaymentsExpenseAccount:edtExpenseAccount,
                        EmployeeTerminationPaymentsExemptPaygWithholding:ExemptPAYGp,
                        EmployeeTerminationPaymentsExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        EmployeeTerminationPaymentsReportableW1onActivityStatement:ExemptReportable,
                        EmployeeTerminationPaymentsActive:true
                        
                   }
                };
    
                taxRateService.saveExemptReportableTermnination(objDetails).then(function (objDetails) {
                sideBarService.getExemptReportableTermnination().then(function(dataReload) {
                    addVS1Data('TTerminationSimple',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
    
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             
    
    
         }
    
    



    },

    'click .saveDirectorFee':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let edtEarningsName = $('#edtEarningsNameDirectorsFees').val() || '';
        let edtDisplayName = $('#edtDisplayNameDirectorsFees').val() || '';     
        let edtRateType = $('#edtRateTypeDirectorsFees').val() || '';
        let edtExpenseAccount = $('#edtExpenseAccountDirectorsFees').val() || '';
        let ExemptPAYGp = false;
        let ExemptSuperannuation = false;
        let ExemptReportable = false;
    
        if($('#formCheck-ExemptPAYGDirectorsFees').is(':checked')){
            ExemptPAYGp = true;
        }else{
            ExemptPAYGp = false;
        }
    
        if($('#formCheck-ExemptSuperannuationDirectorsFees').is(':checked')){
            ExemptSuperannuation = true;
        }else{
            ExemptSuperannuation = false;
        }
    
        if($('#formCheck-ExemptReportableDirectorsFees').is(':checked')){
            ExemptReportable = true;
        }else{
            ExemptReportable = false;
        }
    
        if (edtEarningsName === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Earnings Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {

            // if(Session.get('DirectorFeesaveDirectorFee'))
            // {
            //     let output  = Session.get('DirectorFeesaveDirectorFee');
            //     objDetails = {
            //         type: "TDirectorsFees",
            //         fields: {
            //             ID: 365989559959,
            //             DirectorsFeesName:edtEarningsName,
            //             DirectorsFeesDisplayName:edtDisplayName,
            //             DirectorsFeesRateType:edtRateType,
            //             DirectorsFeesExpenseAccount:edtExpenseAccount,
            //             DirectorsFeesExemptPaygWithholding:ExemptPAYGp,
            //             DirectorsFeesExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //             DirectorsFeesReportableW1onActivityStatement:ExemptReportable,
            //             DirectorsFeesActive:true     
            //         }
            //     };
    
            //     output.push(objDetails);
            //     Session.set('DirectorFeesaveDirectorFee',output);
    
            // }
            // else
            // {
            //     let object_array = [];
            //     objDetails = {
            //         type: "TDirectorsFees",
            //         fields: {
            //             ID: 365989559959,
            //             DirectorsFeesName:edtEarningsName,
            //             DirectorsFeesDisplayName:edtDisplayName,
            //             DirectorsFeesRateType:edtRateType,
            //             DirectorsFeesExpenseAccount:edtExpenseAccount,
            //             DirectorsFeesExemptPaygWithholding:ExemptPAYGp,
            //             DirectorsFeesExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //             DirectorsFeesReportableW1onActivityStatement:ExemptReportable,
            //             DirectorsFeesActive:true     
            //         }
            //     };
            //     object_array.push(objDetails);
            //     Session.set('DirectorFeesaveDirectorFee',object_array);
    
            // }
    
    
            // let output  = Session.get('DirectorFeesaveDirectorFee');
            // $('.fullScreenSpin').css('display','inline-block')
            // swal({
            //           title: 'Success',
            //           text: 'success',
            //           type: 'success',
            //           showCancelButton: false,
            //           confirmButtonText: 'Done'

            //      }).then((result) => {
            //           if (result.value) {
            //             Meteor._reload.reload();
            //           } else if (result.dismiss === 'cancel') {
        
            //           }
            //           });
                      
            //  $('.fullScreenSpin').css('display','none');
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkDirectorFee(edtEarningsName).then(function (data) {
                earningid = data.tdirectorsfees[0].Id;
                objDetails = {
                   type: "Tdirectorsfees",
                   fields: {
                       ID: parseInt(earningid),
                       DirectorsFeesName:edtEarningsName,
                       DirectorsFeesDisplayName:edtDisplayName,
                       DirectorsFeesRateType:edtRateType,
                       DirectorsFeesExpenseAccount:edtExpenseAccount,
                       DirectorsFeesExemptPaygWithholding:ExemptPAYGp,
                       DirectorsFeesExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                       DirectorsFeesReportableW1onActivityStatement:ExemptReportable,
                       DirectorsFeesActive:true     
                   }
               };
    
              taxRateService.saveDirectorFee(objDetails).then(function (objDetails) {
                 sideBarService.getDirectorFee().then(function(dataReload) {
                    addVS1Data('TDirectorsFees',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
    
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "Tdirectorsfees",
                    fields: {
                        DirectorsFeesName:edtEarningsName,
                        DirectorsFeesDisplayName:edtDisplayName,
                        DirectorsFeesRateType:edtRateType,
                        DirectorsFeesExpenseAccount:edtExpenseAccount,
                        DirectorsFeesExemptPaygWithholding:ExemptPAYGp,
                        DirectorsFeesExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        DirectorsFeesReportableW1onActivityStatement:ExemptReportable,
                        DirectorsFeesActive:true          
                   }
                };
    
                taxRateService.saveDirectorFee(objDetails).then(function (objDetails) {
                sideBarService.getDirectorFee().then(function(dataReload) {
                    addVS1Data('TDirectorsFees',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
    
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             
    
    
         }
    
    


    },

    'click .saveLumpSumW':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let edtEarningsName = $('#edtEarningsNameLumpSumW').val() || '';
        let edtDisplayName = $('#edtDisplayNameLumpSumW').val() || '';     
        let edtRateType = $('#edtRateTypeLumpSumW').val() || '';
        let edtExpenseAccount = $('#edtExpenseAccountLumpSumW').val() || '';
        let ExemptPAYGp = false;
        let ExemptSuperannuation = false;
        let ExemptReportable = false;
    
        if($('#formCheck-ExemptPAYGLumpSumW').is(':checked')){
            ExemptPAYGp = true;
        }else{
            ExemptPAYGp = false;
        }
    
        if($('#formCheck-ExemptSuperannuationLumpSumW').is(':checked')){
            ExemptSuperannuation = true;
        }else{
            ExemptSuperannuation = false;
        }
    
        if($('#formCheck-ExemptReportableLumpSumW').is(':checked')){
            ExemptReportable = true;
        }else{
            ExemptReportable = false;
        }
    
        if (edtEarningsName === '') {
            $('.fullScreenSpin').css('display','none');
            swal('Earnings Name has not been Filled!', '', 'warning');
            e.preventDefault();
         }
         else {


            // if(Session.get('LumpSumW'))
            // {
            //     let output  = Session.get('LumpSumW');
            //      objDetails = {
            //        type: "TLumpSumW",
            //        fields: {
            //            ID: 7956992945455,
            //            LumpSumWName:edtEarningsName,
            //            LumpSumWDisplayName:edtDisplayName,
            //            LumpSumWRateType:edtRateType,
            //            LumpSumWExpenseAccount:edtExpenseAccount,
            //            LumpSumWExemptPaygWithholding:ExemptPAYGp,
            //            LumpSumWExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //            LumpSumWReportableW1onActivityStatement:ExemptReportable,
            //            LumpSumWActive:true     
            //        }
            //    };
    
            //     output.push(objDetails);
            //     Session.set('LumpSumW',output);
    
            // }
            // else
            // {
            //     let object_array = [];
            //     objDetails = {
            //         type: "TLumpSumW",
            //         fields: {
            //             ID: 7956992945455,
            //             LumpSumWName:edtEarningsName,
            //             LumpSumWDisplayName:edtDisplayName,
            //             LumpSumWRateType:edtRateType,
            //             LumpSumWExpenseAccount:edtExpenseAccount,
            //             LumpSumWExemptPaygWithholding:ExemptPAYGp,
            //             LumpSumWExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
            //             LumpSumWReportableW1onActivityStatement:ExemptReportable,
            //             LumpSumWActive:true     
            //         }
            //     };
            //     object_array.push(objDetails);
            //     Session.set('LumpSumW',object_array);
    
            // }
    
    
            // let output  = Session.get('LumpSumW');
            // $('.fullScreenSpin').css('display','inline-block')
            // swal({
            //           title: 'Success',
            //           text: 'success',
            //           type: 'success',
            //           showCancelButton: false,
            //           confirmButtonText: 'Done'

            //      }).then((result) => {
            //           if (result.value) {
            //             Meteor._reload.reload();
            //           } else if (result.dismiss === 'cancel') {
        
            //           }
            //           });
                      
            //           $('.fullScreenSpin').css('display','none');
           
            $('.fullScreenSpin').css('display','inline-block');
            taxRateService.checkLumpSumW(edtEarningsName).then(function (data) {
                earningid = data.tlumpsumw[0].Id;
                objDetails = {
                   type: "TLumpSumW",
                   fields: {
                       ID: parseInt(earningid),
                       LumpSumWName:edtEarningsName,
                       LumpSumWDisplayName:edtDisplayName,
                       LumpSumWRateType:edtRateType,
                       LumpSumWExpenseAccount:edtExpenseAccount,
                       LumpSumWExemptPaygWithholding:ExemptPAYGp,
                       LumpSumWExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                       LumpSumWReportableW1onActivityStatement:ExemptReportable,
                       LumpSumWActive:true     
                   }
               };
    
              taxRateService.saveLumpSumW(objDetails).then(function (objDetails) {
                 sideBarService.getLumpSumW().then(function(dataReload) {
                    addVS1Data('TLumpSumW',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                  swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {
    
                  }
                  });
                  
                  $('.fullScreenSpin').css('display','none');
                  });
                  }).catch(function (err) {
                    objDetails = {
                    type: "TLumpSumW",
                    fields: {
                        LumpSumWName:edtEarningsName,
                        LumpSumWDisplayName:edtDisplayName,
                        LumpSumWRateType:edtRateType,
                        LumpSumWExpenseAccount:edtExpenseAccount,
                        LumpSumWExemptPaygWithholding:ExemptPAYGp,
                        LumpSumWExemptSuperannuationGuaranteeCont:ExemptSuperannuation,
                        LumpSumWReportableW1onActivityStatement:ExemptReportable,
                        LumpSumWActive:true         
                   }
                };
    
                taxRateService.saveLumpSumW(objDetails).then(function (objDetails) {
                sideBarService.getLumpSumW().then(function(dataReload) {
                    addVS1Data('TLumpSumW',JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function(err) {
                    Meteor._reload.reload();
                  });
                }).catch(function (err) {
                 swal({
                 title: 'Oooops...',
                 text: err,
                 type: 'error',
                 showCancelButton: false,
                 confirmButtonText: 'Try Again'
                 }).then((result) => {
                 if (result.value) {
                  Meteor._reload.reload();
                 } else if (result.dismiss === 'cancel') {
    
                 }
                 });
                   $('.fullScreenSpin').css('display','none');
               });
              });
             
    
    
         }
    
    


    },

    'change #edtFundType':function(){
     
        let fundType = $('#edtFundType').val();
        if(fundType == 'selfmanged')
        {
            $('#acountabmandelectronic').css('display','block');
            $('#accountbsb').css('display','block');
            $('#account_name').css('display','block');
        }
        else{
            $('#acountabmandelectronic').css('display','none');
            $('#accountbsb').css('display','none');
            $('#account_name').css('display','none');
        }

    },

    'change #edtAllowanceAmount, change #edtDeductionAmount': function(event) {

        let utilityService = new UtilityService();
        if (!isNaN($(event.target).val())) {
            let inputUnitPrice = parseFloat($(event.target).val()) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        } else {
            let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;

            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));


        }

    },
    'keydown #edtAllowanceAmount, keydown #edtDeductionAmount': function(event) {
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||

            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||

            (event.keyCode >= 35 && event.keyCode <= 40)) {

            return;
        }

        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {} else {
            event.preventDefault();
        }
    },
    'click .btnDeleteAllowance': function () {
      let taxRateService = new TaxRateService();
      let allowanceId = $('#selectDeleteLineID').val()||0;
      $('.fullScreenSpin').css('display','inline-block');

      let objDetails = {
          type: "TAllowance",
          fields: {
              Id: parseInt(allowanceId),
              Active: false,
              DisplayIn: "Allowances",

          }
      };



      taxRateService.saveAllowance(objDetails).then(function (objDetails) {
        $('.fullScreenSpin').css('display','none');
        sideBarService.getAllowance().then(function(dataReload) {
           addVS1Data('TAllowance',JSON.stringify(dataReload)).then(function (datareturn) {
             Meteor._reload.reload();
           }).catch(function (err) {
             Meteor._reload.reload();
           });
         }).catch(function(err) {
           Meteor._reload.reload();
         });
      }).catch(function (err) {
        swal({
        title: 'Oooops...',
        text: err,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Try Again'
        }).then((result) => {
        if (result.value) {
         Meteor._reload.reload();
        } else if (result.dismiss === 'cancel') {

        }
        });
          $('.fullScreenSpin').css('display','none');
      });

    },

    'click .btnDeleteCalender': function () {
        let taxRateService = new TaxRateService();
        let calenderid = $('#selectColDeleteLineID').val()||0;
        let calendername = $('#selectCalenderName').val()||0;
        $('.fullScreenSpin').css('display','inline-block');
     
        let objDetails = {
            type: "TPayrollCalendars",
            fields: {
                Id: calendername,
                PayrollCalendarActive: false,          
            }
        };
  
        if(calendername != 0)
        {
            taxRateService.saveCalender(objDetails).then(function (objDetails) {
                $('.fullScreenSpin').css('display','none');
                sideBarService.getCalender().then(function(dataReload) {
                   addVS1Data('TPayrollCalendars',JSON.stringify(dataReload)).then(function (datareturn) {
                     Meteor._reload.reload();
                   }).catch(function (err) {
                     Meteor._reload.reload();
                   });
                 }).catch(function(err) {
                   Meteor._reload.reload();
                 });
              }).catch(function (err) {
                swal({
                title: 'Oooops...',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
                }).then((result) => {
                if (result.value) {
                 Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {
        
                }
                });
                  $('.fullScreenSpin').css('display','none');
              });

        }
        else{
              alert(calenderid);
        }
  
       
  
      },

    'click .btnDeleteLeave': function () {
        let taxRateService = new TaxRateService();
        let LeaveId = $('#selectLeaveDeleteLineID').val()||0;
        let LeaveName = $('#selectLeaveName').val()||0;
        let Type = $('#selectLeaveType').val()|| '';
        if(Type == 'paid'){
           
            $('.fullScreenSpin').css('display','inline-block');
            let objDetails = {
                type: "TPaidLeave",
                fields: {
                    Id: LeaveId,
                    LeavePaidActive: false,          
                }
            };
            if(LeaveName != 0)
             {
                taxRateService.savePaidLeave(objDetails).then(function (objDetails) {
                       $('.fullScreenSpin').css('display','none');
                       sideBarService.getPaidLeave().then(function(dataReload) {
                       addVS1Data('TPaidLeave',JSON.stringify(dataReload)).then(function (datareturn) {
                         Meteor._reload.reload();
                       }).catch(function (err) {
                         Meteor._reload.reload();
                       });
                       }).catch(function(err) {
                        Meteor._reload.reload();
                       });
                       }).catch(function (err) {
                        swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                        }).then((result) => {
                        if (result.value) {
                        Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {
                
                        }
                        });
                        $('.fullScreenSpin').css('display','none');
                    });
    
            }
            else{
                  alert(LeaveName);
            }
      

        }
        else{

            $('.fullScreenSpin').css('display','inline-block');
            let objDetails = {
                type: "TUnPaidLeave",
                fields: {
                    Id: LeaveId,
                    LeaveUnPaidActive: false,          
                }
            };
            if(LeaveName != 0)
             {
                taxRateService.saveUnPaidLeave(objDetails).then(function (objDetails) {
                       $('.fullScreenSpin').css('display','none');
                       sideBarService.getUnPaidLeave().then(function(dataReload) {
                       addVS1Data('TUnPaidLeave',JSON.stringify(dataReload)).then(function (datareturn) {
                         Meteor._reload.reload();
                       }).catch(function (err) {
                         Meteor._reload.reload();
                       });
                       }).catch(function(err) {
                        Meteor._reload.reload();
                       });
                       }).catch(function (err) {
                        swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                        }).then((result) => {
                        if (result.value) {
                        Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {
                
                        }
                        });
                        $('.fullScreenSpin').css('display','none');
                    });
    
            }
            else{
                  alert(LeaveName);
            }


        }
       
       
  
      },

    'click .btnDeleteHoliday': function () {
        let taxRateService = new TaxRateService();
        let holidayid = $('#selectholidayDeleteLineID').val()||0;
        let holidayname = $('#selectholidayName').val()||0;
        $('.fullScreenSpin').css('display','inline-block');
     
        let objDetails = {
            type: "TPayrollHolidays",
            fields: {
                Id: holidayname,
                PayrollHolidaysActive: false,          
            }
        };
  
        if(holidayname != 0)
        {
            taxRateService.saveHoliday(objDetails).then(function (objDetails) {
                $('.fullScreenSpin').css('display','none');
                sideBarService.getHolidayData().then(function(dataReload) {
                   addVS1Data('TPayrollHolidays',JSON.stringify(dataReload)).then(function (datareturn) {
                     Meteor._reload.reload();
                   }).catch(function (err) {
                     Meteor._reload.reload();
                   });
                 }).catch(function(err) {
                   Meteor._reload.reload();
                 });
              }).catch(function (err) {
                swal({
                title: 'Oooops...',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
                }).then((result) => {
                if (result.value) {
                 Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {
        
                }
                });
                  $('.fullScreenSpin').css('display','none');
              });

        }
        else{
              alert(holidayname);
        }
  
       
  
      }, 
      

      'click .btnDeleteSuperannuation': function () {
        let taxRateService = new TaxRateService();
        let superannutionid = $('#selectSuperannuationDeleteLineID').val()||0;
        let superannutionname = $('#selectSuperannuationName').val()||0;
        
        $('.fullScreenSpin').css('display','inline-block');
        let objDetails = {
            type: "TSuperannuation",
            fields: {
                Id: superannutionname,
                Allclasses: false,          
            }
        };
        if(superannutionname != 0)
         {
            taxRateService.saveSuperannuation(objDetails).then(function (objDetails) {
                   $('.fullScreenSpin').css('display','none');
                   sideBarService.getSuperannuation().then(function(dataReload) {
                   addVS1Data('TSuperannuation',JSON.stringify(dataReload)).then(function (datareturn) {
                     Meteor._reload.reload();
                   }).catch(function (err) {
                     Meteor._reload.reload();
                   });
                   }).catch(function(err) {
                    Meteor._reload.reload();
                   });
                   }).catch(function (err) {
                    swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                    }).then((result) => {
                    if (result.value) {
                    Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {
            
                    }
                    });
                    $('.fullScreenSpin').css('display','none');
                });

        }
        else{
              alert(superannutionname);
        }
      
       
       
  
      },

    'click .btnDeleteReimsument': function () {
        let taxRateService = new TaxRateService();
        let reid = $('#selectColReiDeleteLineID').val()||0;
        let ReiName = $('#seleclReiName').val()||0;
        $('.fullScreenSpin').css('display','inline-block');
     
        let objDetails = {
            type: "TReimbursement",
            fields: {
                Id: ReiName,
                ReimbursementActive: false,          
            }
        };
  
        if(ReiName != 0)
        {
            taxRateService.saveReimbursement(objDetails).then(function (objDetails) {
                $('.fullScreenSpin').css('display','none');
                sideBarService.getReimbursement().then(function(dataReload) {
                   addVS1Data('TReimbursement',JSON.stringify(dataReload)).then(function (datareturn) {
                     Meteor._reload.reload();
                   }).catch(function (err) {
                     Meteor._reload.reload();
                   });
                 }).catch(function(err) {
                   Meteor._reload.reload();
                 });
              }).catch(function (err) {
                swal({
                title: 'Oooops...',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
                }).then((result) => {
                if (result.value) {
                 Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {
        
                }
                });
                  $('.fullScreenSpin').css('display','none');
              });

        }
        else{
              alert(reid);
        }
  
       
  
      },

    'click .btnDeleteDeduction': function () {

        let taxRateService = new TaxRateService();
        let deductionID = $('#selectDeleteLineID').val()||0;
        let deductionAccountID = $('#selectAccountid').val()||0;
        let deductionAccount = $('#selectAccountname').val()||0;
        let isIsWorkPlacegiving = $('#selectIsWorkPlacegiving').val()||0;
        let isTaxexempt = $('#selectisTaxexempt').val()||0;
        let isUnionfees = $('#selectisUnionfees').val()||0;
        let deductionAmount = $('#selectdeductionAmount').val()||0;
        let deductionName = $('#selectideductionName').val()||0;
        let displayName = $('#selectdisplayName').val()||0;

    

        $('.fullScreenSpin').css('display','inline-block');
  
        let objDetails = {
            type: "TDeduction",
            fields: {
                Id: parseInt(deductionID),
                Active: false,    
               
                Amount:Number(deductionAmount.replace(/[^0-9.-]+/g, "")) || 0,
                Basedonid:1,
                Description: deductionName,
                DisplayIn: displayName,        
  
            }
        };
  
        taxRateService.saveDeduction(objDetails).then(function (objDetails) {
          $('.fullScreenSpin').css('display','none');
          sideBarService.getDeduction().then(function(dataReload) {
             addVS1Data('TDeduction',JSON.stringify(dataReload)).then(function (datareturn) {
               Meteor._reload.reload();
             }).catch(function (err) {
               Meteor._reload.reload();
             });
           }).catch(function(err) {
             Meteor._reload.reload();
           });
        }).catch(function (err) {
          swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
          }).then((result) => {
          if (result.value) {
           Meteor._reload.reload();
          }else if (result.dismiss === 'cancel') {
  
          }
          });
            $('.fullScreenSpin').css('display','none');
        });
  
      },
     'click .btnAddNewDeduction': function(event) {
        $('.btnAddNewDeduction').attr("data-toggle", "modal");
        $('.btnAddNewDeduction').attr("data-target", "#deductionModal");
        $('#edtDeductionID').val('');
        $('#noneLabel').html("None");
        $('#edtDeductionTitle').val("None");
     },
     'click .noneModal': function(event) {
        $('.noneModal').attr("data-toggle", "modal");
        $('.noneModal').attr("data-target", "#deductionModal");
        $('#edtDeductionID').val('');
        $('#noneLabel').html("None");
        $('#edtDeductionTitle').val("None");
     },
     'click .workplaceGivingModal': function(event) {
        $('.workplaceGivingModal').attr("data-toggle", "modal");
        $('.workplaceGivingModal').attr("data-target", "#deductionModal");
        $('#edtDeductionID').val('');
        $('#noneLabel').html("Workplace Giving");
        $('#edtDeductionTitle').val("WorkplaceGiving");
     },
    'click .unionAssociationFeesModal': function(event) {
        $('.unionAssociationFeesModal').attr("data-toggle", "modal");
        $('.unionAssociationFeesModal').attr("data-target", "#deductionModal");
        $('#edtDeductionID').val('');
        $('#noneLabel').html("Union / Association Fees");
        $('#edtDeductionTitle').val("UnionAssociationFees");
    },

    'click #uploadImg':function (event) {
        //let imageData= (localStorage.getItem("Image"));
        let templateObject = Template.instance();
        let imageData=templateObject.imageFileData.get();
        if(imageData!=null && imageData!="")
        {   
            console.log(imageData);
            localStorage.setItem("Image",imageData);
            $('#uploadedImage').attr('src', imageData);
            $('#uploadedImage').attr('width','50%');
            $('#removeLogo').show();
            $('#changeLogo').show();
        }

    },

    'change #fileInput' :function (event) {
        let templateObject = Template.instance();
        let selectedFile = event.target.files[0];
        let reader = new FileReader();
        $(".Choose_file").text('');
        reader.onload = function(event) {

            $( "#uploadImg" ).prop( "disabled", false );
            $("#uploadImg").addClass("on-upload-logo");
            $(".Choose_file").text(selectedFile.name);
            //$("#uploadImg").css("background-color","yellow");
            templateObject.imageFileData.set(event.target.result);

            //localStorage.setItem("Image",event.target.result);
        };
        reader.readAsDataURL(selectedFile);
    },
    'click #removeLogo':function (event) {
        let templateObject = Template.instance();
        templateObject.imageFileData.set(null);
        localStorage.removeItem("Image");
        // location.reload();
        Meteor._reload.reload();
        
    },
    'click .btnBack':function(event){
      event.preventDefault();
      history.back(1);
     
    },
    
    'click .btnUploadFile':function(event){
        // $('#attachment-upload').val('');
        // $('.file-name').text('');
        //$(".btnImport").removeAttr("disabled");
        $('#fileInput').trigger('click');
    
        },
     
    


});

Template.payrollrules.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.code == 'NA') {
                return 1;
            } else if (b.code == 'NA') {
                return -1;
            }
            return (a.code.toUpperCase() > b.code.toUpperCase()) ? 1 : -1;
            // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
        });
    }
});
