import {ContactService} from "../../contacts/contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {UtilityService} from "../../utility-service";
import XLSX from 'xlsx';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import TableHandler from '../../js/Table/TableHandler';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let contactService = new ContactService();

// Template.non_transactional_list.inheritsHelpersFrom('display_settings_list');
// Template.non_transactional_list.inheritsEventsFrom('display_settings_list');
Template.non_transactional_list.inheritsHooksFrom('display_settings_list');

Template.non_transactional_list.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.transactiondatatablerecords = new ReactiveVar([]);
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.selectedFile = new ReactiveVar();
    templateObject.non_trans_displayfields = new ReactiveVar([]);
    templateObject.reset_data = new ReactiveVar([]);
    templateObject.tablename = new ReactiveVar();
});

Template.non_transactional_list.onRendered(function() {
  let templateObject = Template.instance();
  const customerList = [];
  let salesOrderTable;
  var splashArray = new Array();
  var splashArrayCustomerList = new Array();
  var splashArrayContactOverview = new Array();

  const lineCustomerItems = [];
  const dataTableList = [];
  const tableHeaderList = [];

  if(FlowRouter.current().queryParams.success){
      $('.btnRefresh').addClass('btnRefreshAlert');
  }

  var url = FlowRouter.current().path;
  let currenttablename = "";
  if (url.includes("/contactoverview")) {
    currenttablename = "tblcontactoverview";
  };
  templateObject.tablename.set(currenttablename);

  // set initial table rest_data
  templateObject.init_reset_data = function(){
      let reset_data = [];
      if (url.includes("/contactoverview")) {

         reset_data = [
          { index: 0, label: '#ID', class:'colContactID', active: false, display: true, width: "0" },
          { index: 1, label: 'Contact Name', class: 'colClientName', active: true, display: true, width: "200" },
          { index: 2, label: 'Type', class: 'colType', active: true, display: true, width: "130" },
          { index: 3, label: 'Phone', class: 'colPhone', active: true, display: true, width: "95" },
          { index: 4, label: 'Mobile', class: 'colMobile', active: false, display: true, width: "0" },
          { index: 5, label: 'AR Balance', class: 'colARBalance', active: true, display: true, width: "90" },
          { index: 6, label: 'Credit Balance', class: 'colCreditBalance', active: true, display: true, width: "110" },
          { index: 7, label: 'Balance', class: 'colBalance', active: true, display: true, width: "80" },
          { index: 8, label: 'Credit Limit', class: 'colCreditLimit', active: false, display: true, width: "80" },
          { index: 9, label: 'Order Balance', class: 'colSalesOrderBalance', active: true, display: true, width: "120" },
          { index: 10, label: 'Email', class: 'colEmail', active: false, display: true, width: "0" },
          { index: 11, label: 'Custom Field 1', class: 'colCustFld1', active: false, display: true, width: "0" },
          { index: 12, label: 'Custom Field 2', class: 'colCustFld2', active: false, display: true, width: "0" },
          { index: 13, label: 'Address', class: 'colAddress', active: true, display: true, width: "" },
        ];
     }
    templateObject.reset_data.set(reset_data);
  }
  templateObject.init_reset_data();

  // set initial table rest_data


  // custom field displaysettings

  templateObject.initCustomFieldDisplaySettings = function(data, listType){
  //function initCustomFieldDisplaySettings(data, listType) {
    let templateObject = Template.instance();
    let reset_data = templateObject.reset_data.get();
    templateObject.showCustomFieldDisplaySettings(reset_data);

    try {
      getVS1Data("VS1_Customize").then(function (dataObject) {
        if (dataObject.length == 0) {
          sideBarService.getNewCustomFieldsWithQuery(parseInt(Session.get('mySessionEmployeeLoggedID')), listType).then(function (data) {
              reset_data = data.ProcessLog.Obj.CustomLayout[0].Columns;
              templateObject.showCustomFieldDisplaySettings(reset_data);
          }).catch(function (err) {
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          if(data.ProcessLog.Obj.CustomLayout.length > 0){
           for (let i = 0; i < data.ProcessLog.Obj.CustomLayout.length; i++) {
             if(data.ProcessLog.Obj.CustomLayout[i].TableName == listType){
               reset_data = data.ProcessLog.Obj.CustomLayout[i].Columns;
               templateObject.showCustomFieldDisplaySettings(reset_data);
             }
           }
         };
          // handle process here
        }
      });
    } catch (error) {
    }
    return;
  }
  templateObject.showCustomFieldDisplaySettings = async function(reset_data){
  //function showCustomFieldDisplaySettings(reset_data) {
    let custFields = [];
    let customData = {};
    let customFieldCount = reset_data.length;

    for (let r = 0; r < customFieldCount; r++) {
      customData = {
        active: reset_data[r].active,
        id: reset_data[r].index,
        custfieldlabel: reset_data[r].label,
        class: reset_data[r].class,
        display: reset_data[r].display,
        width: reset_data[r].width ? reset_data[r].width : ''
      };

      if(reset_data[r].active == true){
        $('#'+currenttablename+' .'+reset_data[r].class).removeClass('hiddenColumn');
      }else if(reset_data[r].active == false){
        $('#'+currenttablename+' .'+reset_data[r].class).addClass('hiddenColumn');
      };
      custFields.push(customData);
    }
    await templateObject.non_trans_displayfields.set(custFields);
    $('.dataTable').resizable();
  }
  templateObject.initCustomFieldDisplaySettings("", currenttablename);

  templateObject.resetData = function (dataVal) {
      location.reload();
  };

  templateObject.getContactOverviewData = async function (deleteFilter = false) {
    var customerpage = 0;
    getVS1Data('TERPCombinedContactsVS1').then(function (dataObject) {
        if (dataObject.length == 0) {
            sideBarService.getAllContactCombineVS1(initialBaseDataLoad, 0,deleteFilter).then(async function (data) {
                await addVS1Data('TERPCombinedContactsVS1', JSON.stringify(data));
                templateObject.displayContactOverviewData(data);
            }).catch(function (err) {

            });
        } else {
            let data = JSON.parse(dataObject[0].data);
            templateObject.displayContactOverviewData(data);
        }
    }).catch(function (err) {
      sideBarService.getAllContactCombineVS1(initialBaseDataLoad, 0,deleteFilter).then(async function (data) {
          await addVS1Data('TERPCombinedContactsVS1', JSON.stringify(data));
          templateObject.displayContactOverviewData(data);
      }).catch(function (err) {

      });
    });
  }

  templateObject.displayContactOverviewData = async function (data) {
    let lineItems = [];
    let lineItemObj = {};
    let clienttype = "";
    let isprospect = false;
    let iscustomer = false;
    let isEmployee = false;
    let issupplier = false;
    let deleteFilter = false;
    if(data.Params.Search.replace(/\s/g, "") == ""){
      deleteFilter = true;
    }else{
      deleteFilter = false;
    };

    for (let i = 0; i < data.terpcombinedcontactsvs1.length; i++) {
      isprospect = data.terpcombinedcontactsvs1[i].isprospect;
      iscustomer = data.terpcombinedcontactsvs1[i].iscustomer;
      isEmployee = data.terpcombinedcontactsvs1[i].isEmployee;
      issupplier = data.terpcombinedcontactsvs1[i].issupplier;

      if (isprospect == true && iscustomer == true && isEmployee == true && issupplier == true) {
        clienttype = "Customer / Employee / Supplier";
      } else if (isprospect == true && iscustomer == true && issupplier == true) {
        clienttype = "Customer / Supplier";
      } else if (iscustomer == true && issupplier == true) {
        clienttype = "Customer / Supplier";
      } else if (iscustomer == true) {
        if (data.terpcombinedcontactsvs1[i].name.toLowerCase().indexOf("^") >= 0) {
          clienttype = "Job";
        } else {
          clienttype = "Customer";
        }
      } else if (isEmployee == true) {
        clienttype = "Employee";
      } else if (issupplier == true) {
        clienttype = "Supplier";
      } else if (isprospect == true) {
        clienttype = "Lead";
      } else {
        clienttype = " ";
      }

      let arBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].ARBalance) || 0.0;
      let creditBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditBalance) || 0.0;
      let balance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].Balance) ||0.0;
      let creditLimit =utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditLimit) || 0.0;
      let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].SalesOrderBalance) || 0.0;
      if (isNaN(data.terpcombinedcontactsvs1[i].ARBalance)) {
        arBalance = Currency + "0.00";
      }

      if (isNaN(data.terpcombinedcontactsvs1[i].CreditBalance)) {
        creditBalance = Currency + "0.00";
      }
      if (isNaN(data.terpcombinedcontactsvs1[i].Balance)) {
        balance = Currency + "0.00";
      }
      if (isNaN(data.terpcombinedcontactsvs1[i].CreditLimit)) {
        creditLimit = Currency + "0.00";
      }

      if (isNaN(data.terpcombinedcontactsvs1[i].SalesOrderBalance)) {
        salesOrderBalance = Currency + "0.00";
      }

      var dataList = [
        data.terpcombinedcontactsvs1[i].ID || "",
        data.terpcombinedcontactsvs1[i].name || "",
        clienttype || "",
        data.terpcombinedcontactsvs1[i].phone || "",
        data.terpcombinedcontactsvs1[i].mobile || "",
        arBalance || 0.0,
        creditBalance || 0.0,
        balance || 0.0,
        creditLimit || 0.0,
        salesOrderBalance || 0.0,
        data.terpcombinedcontactsvs1[i].email || "",
        data.terpcombinedcontactsvs1[i].CUSTFLD1 || "",
        data.terpcombinedcontactsvs1[i].CUSTFLD2 || "",
        data.terpcombinedcontactsvs1[i].street || "",
      ];



      if (data.terpcombinedcontactsvs1[i].name.replace(/\s/g, "") !== "") {
        splashArrayContactOverview.push(dataList);
        templateObject.transactiondatatablerecords.set(splashArrayContactOverview);
      }

      //}
    }
    function MakeNegative() {
        $('td').each(function () {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };



    if (templateObject.transactiondatatablerecords.get()) {
        setTimeout(function () {
            MakeNegative();
        }, 100);
    }
    //$('.fullScreenSpin').css('display','none');
    setTimeout(function () {
        $('#tblcontactoverview').DataTable({
            data: splashArrayContactOverview,
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            columnDefs: [
                {
                targets: 0,
                className: "colContactID colID hiddenColumn",
                createdCell: function (td, cellData, rowData, row, col) {
                  $(td).closest("tr").attr("id", rowData[0]);
                  $(td).closest("tr").attr("isjob", rowData[2]);
                }},
                {
                  targets: 1,
                  className: "colClientName",
                  width: "200px",
                },
                {
                  targets: 2,
                  className: "colType",
                  width: "130px",
                },
                {
                  targets: 3,
                  className: "colPhone",
                  width: "95px",
                },
                {
                  targets: 4,
                  className: "colMobile hiddenColumn",
                  width: "95px",
                },
                {
                  targets: 5,
                  className: "colARBalance text-right",
                  width: "90px",
                },
                {
                  targets: 6,
                  className: "colCreditBalance text-right",
                  width: "110px",
                },
                {
                  targets: 7,
                  className: "colBalance text-right",
                  width: "110px",
                },
                {
                  targets: 8,
                  className: "colCreditLimit hiddenColumn text-right",
                  width: "90px",
                },
                {
                  targets: 9,
                  className: "colSalesOrderBalance text-right",
                  width: "120px",
                },
                {
                  targets: 10,
                  className: "colEmail hiddenColumn",
                  width: "95px",
                },
                {
                  targets: 11,
                  className: "colCustFld1 hiddenColumn",
                },
                {
                  targets: 12,
                  className: "colCustFld2 hiddenColumn",
                },
                {
                  targets: 13,
                  className: "colAddress"
                }
            ],
            buttons: [
                {
                    extend: 'csvHtml5',
                    text: '',
                    download: 'open',
                    className: "btntabletocsv hiddenColumn",
                    filename: "contactoverview_"+ moment().format(),
                    orientation:'portrait',
                    exportOptions: {
                        columns: ':visible'
                    }
                },{
                    extend: 'print',
                    download: 'open',
                    className: "btntabletopdf hiddenColumn",
                    text: '',
                    title: 'Contact Overview',
                    filename: "Contact Overview - "+ moment().format(),
                    exportOptions: {
                        columns: ':visible',
                        stripHtml: false
                    }
                },
                {
                    extend: 'excelHtml5',
                    title: '',
                    download: 'open',
                    className: "btntabletoexcel hiddenColumn",
                    filename: "Contact Overview - "+ moment().format(),
                    orientation:'portrait',
                    exportOptions: {
                        columns: ':visible'
                    }

                }],
            select: true,
            destroy: true,
            colReorder: true,
            pageLength: initialDatatableLoad,
            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
            info: true,
            responsive: true,
            "order": [[1, "asc"]],
            // "autoWidth": false,
            action: function () {
                $('#tblcontactoverview').DataTable().ajax.reload();
            },
            "fnDrawCallback": function (oSettings) {
                $('.paginate_button.page-item').removeClass('disabled');
                $('#tblcontactoverview_ellipsis').addClass('disabled');
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
              var splashArrayCustomerListDupp = new Array();
              let dataLenght = oSettings._iDisplayLength;
              let customerSearch = $('#tblcontactoverview_filter input').val();

                sideBarService.getAllContactCombineVS1(initialDatatableLoad, oSettings.fnRecordsDisplay(),deleteFilter).then(function (dataObjectnew) {

                for (let j = 0; j < dataObjectnew.terpcombinedcontactsvs1.length; j++) {
                  isprospect = dataObjectnew.terpcombinedcontactsvs1[j].isprospect;
                  iscustomer = dataObjectnew.terpcombinedcontactsvs1[j].iscustomer;
                  isEmployee = dataObjectnew.terpcombinedcontactsvs1[j].isEmployee;
                  issupplier = dataObjectnew.terpcombinedcontactsvs1[j].issupplier;

                  if (isprospect == true && iscustomer == true && isEmployee == true && issupplier == true) {
                    clienttype = "Customer / Employee / Supplier";
                  } else if (isprospect == true && iscustomer == true && issupplier == true) {
                    clienttype = "Customer / Supplier";
                  } else if (iscustomer == true && issupplier == true) {
                    clienttype = "Customer / Supplier";
                  } else if (iscustomer == true) {
                    if (dataObjectnew.terpcombinedcontactsvs1[j].name.toLowerCase().indexOf("^") >= 0) {
                      clienttype = "Job";
                    } else {
                      clienttype = "Customer";
                    }
                  } else if (isEmployee == true) {
                    clienttype = "Employee";
                  } else if (issupplier == true) {
                    clienttype = "Supplier";
                  } else if (isprospect == true) {
                    clienttype = "Lead";
                  } else {
                    clienttype = " ";
                  }

                  let arBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].ARBalance) || 0.0;
                  let creditBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].CreditBalance) || 0.0;
                  let balance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].Balance) ||0.0;
                  let creditLimit =utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].CreditLimit) || 0.0;
                  let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].SalesOrderBalance) || 0.0;
                  if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].ARBalance)) {
                    arBalance = Currency + "0.00";
                  }

                  if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].CreditBalance)) {
                    creditBalance = Currency + "0.00";
                  }
                  if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].Balance)) {
                    balance = Currency + "0.00";
                  }
                  if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].CreditLimit)) {
                    creditLimit = Currency + "0.00";
                  }

                  if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].SalesOrderBalance)) {
                    salesOrderBalance = Currency + "0.00";
                  }

                    var dataListContactDupp = [
                      dataObjectnew.terpcombinedcontactsvs1[j].ID || "",
                      dataObjectnew.terpcombinedcontactsvs1[j].name || "",
                      clienttype || "",
                      dataObjectnew.terpcombinedcontactsvs1[j].phone || "",
                      dataObjectnew.terpcombinedcontactsvs1[j].mobile || "",
                      arBalance || 0.0,
                      creditBalance || 0.0,
                      balance || 0.0,
                      creditLimit || 0.0,
                      salesOrderBalance || 0.0,
                      dataObjectnew.terpcombinedcontactsvs1[j].email || "",
                      dataObjectnew.terpcombinedcontactsvs1[j].CUSTFLD1 || "",
                      dataObjectnew.terpcombinedcontactsvs1[j].CUSTFLD2 || "",
                      dataObjectnew.terpcombinedcontactsvs1[j].street || "",
                    ];

                    splashArrayContactOverview.push(dataListContactDupp);
                    //}
                }
                let uniqueChars = [...new Set(splashArrayContactOverview)];
                templateObject.transactiondatatablerecords.set(uniqueChars);
                var datatable = $('#tblcontactoverview').DataTable();
                datatable.clear();
                datatable.rows.add(uniqueChars);
                datatable.draw(false);
                setTimeout(function () {
                  $("#tblcontactoverview").dataTable().fnPageChange('last');
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
            language: { search: "",searchPlaceholder: "Search List..." },
            "fnInitComplete": function (oSettings) {
                  if(data.Params.Search.replace(/\s/g, "") == ""){
                    $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide Deleted</button>").insertAfter("#tblcontactoverview_filter");
                  }else{
                    $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Deleted</button>").insertAfter("#tblcontactoverview_filter");
                  }
                  $("<button class='btn btn-primary btnRefreshContactOverview' type='button' id='btnRefreshContactOverview' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblcontactoverview_filter");
            },
            "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                let countTableData = data.Params.Count || 0; //get count from API data

                return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
            }

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
        });
        $(".fullScreenSpin").css("display", "none");
    }, 0);

    $('div.dataTables_filter input').addClass('form-control form-control-sm');
  }

  if (url.includes("/contactoverview")) {
  templateObject.getContactOverviewData();
  }

// tableResize();
});

Template.non_transactional_list.events({
  "click .btnViewDeleted": async function (e) {
      $(".fullScreenSpin").css("display", "inline-block");
      e.stopImmediatePropagation();
      const templateObject = Template.instance();

      $('.btnViewDeleted').css('display','none');
      $('.btnHideDeleted').css('display','inline-block');
      await clearData('TERPCombinedContactsVS1');
      templateObject.getContactOverviewData(true);
    },
  "click .btnHideDeleted": async function (e) {
      $(".fullScreenSpin").css("display", "inline-block");
      e.stopImmediatePropagation();
      let templateObject = Template.instance();

      $('.btnHideDeleted').css('display','none');
      $('.btnViewDeleted').css('display','inline-block');
      await clearData('TERPCombinedContactsVS1');
      templateObject.getContactOverviewData(false);
    },
  'change .custom-range': async function(event) {
    const tableHandler = new TableHandler();
    let range = $(event.target).val()||0;
    let colClassName = $(event.target).attr("valueclass");
    await $('.' + colClassName).css('width', range);
    $('.dataTable').resizable();
  },
    'click .custom-control-input': function(event) {
      let colClassName = $(event.target).attr("id");
      if ($(event.target).is(':checked')) {
        $('.' + colClassName).addClass('showColumn');
        $('.' + colClassName).removeClass('hiddenColumn');
      } else {
        $('.' + colClassName).addClass('hiddenColumn');
        $('.' + colClassName).removeClass('showColumn');
      }
    }
});

Template.non_transactional_list.helpers({
  transactiondatatablerecords: () => {
      return Template.instance().transactiondatatablerecords.get();
  },
  tableheaderrecords: () => {
      return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
      return CloudPreference.findOne({
          userid: Session.get('mycloudLogonID'),
          PrefName: Template.instance().tablename.get()
      });
  },
  loggedCompany: () => {
      return localStorage.getItem('mySession') || '';
  },
  showSetupFinishedAlert: () => {
      let setupFinished = localStorage.getItem("IS_SETUP_FINISHED") || false;
      if (setupFinished == true || setupFinished == "true") {
          return false;
      } else {
          return true;
      }
  },
  non_trans_displayfields: () => {
    return Template.instance().non_trans_displayfields.get();
  },
  tablename: () => {
      return Template.instance().tablename.get();
  }
});
