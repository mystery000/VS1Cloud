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
  let usedCategories = [];
  let salesOrderTable;
  var splashArray = new Array();
  var splashArrayCustomerList = new Array();
  const lineCustomerItems = [];
  const dataTableList = [];
  const tableHeaderList = [];

  if(FlowRouter.current().queryParams.success){
      $('.btnRefresh').addClass('btnRefreshAlert');
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

      });
  };

  var url = FlowRouter.current().path;
  let currenttablename = "";
  if (url.includes("/contactoverview")) {
    currenttablename = "tblcontactoverview";
  }else if (url.includes("/employeelist")) {
    currenttablename = "tblEmployeelist";
  }else if (url.includes("/accountsoverview")) {
    currenttablename = "tblAccountOverview";
  };
  templateObject.tablename.set(currenttablename);

  // set initial table rest_data
  templateObject.init_reset_data = function(){
      let reset_data = [];
      if (currenttablename == "tblcontactoverview") {
         reset_data = [
          { index: 0, label: '#ID', class:'colContactID', active: false, display: true, width: "10" },
          { index: 1, label: 'Contact Name', class: 'colClientName', active: true, display: true, width: "200" },
          { index: 2, label: 'Type', class: 'colType', active: true, display: true, width: "130" },
          { index: 3, label: 'Phone', class: 'colPhone', active: true, display: true, width: "95" },
          { index: 4, label: 'Mobile', class: 'colMobile', active: false, display: true, width: "95" },
          { index: 5, label: 'AR Balance', class: 'colARBalance', active: true, display: true, width: "90" },
          { index: 6, label: 'Credit Balance', class: 'colCreditBalance', active: true, display: true, width: "110" },
          { index: 7, label: 'Balance', class: 'colBalance', active: true, display: true, width: "80" },
          { index: 8, label: 'Credit Limit', class: 'colCreditLimit', active: false, display: true, width: "90" },
          { index: 9, label: 'Order Balance', class: 'colSalesOrderBalance', active: true, display: true, width: "120" },
          { index: 10, label: 'Email', class: 'colEmail', active: false, display: true, width: "200" },
          { index: 11, label: 'Custom Field 1', class: 'colCustFld1', active: false, display: true, width: "120" },
          { index: 12, label: 'Custom Field 2', class: 'colCustFld2', active: false, display: true, width: "120" },
          { index: 13, label: 'Address', class: 'colAddress', active: true, display: true, width: "" },
          { index: 14, label: 'City/Suburb', class: 'colSuburb', active: false, display: true, width: "120" },
          { index: 15, label: 'State', class: 'colState', active: false, display: true, width: "120" },
          { index: 16, label: 'Postcode', class: 'colPostcode', active: false, display: true, width: "80" },
          { index: 17, label: 'Country', class: 'colCountry', active: false, display: true, width: "200" },
        ];
      }else if(currenttablename == "tblEmployeelist") {
           reset_data = [
            { index: 0, label: 'Emp #', class:'colEmployeeNo', active: false, display: true, width: "10" },
            { index: 1, label: 'Employee Name', class: 'colEmployeeName', active: true, display: true, width: "200" },
            { index: 2, label: 'First Name', class: 'colFirstName', active: true, display: true, width: "100" },
            { index: 3, label: 'Last Name', class: 'colLastName', active: true, display: true, width: "100" },
            { index: 4, label: 'Phone', class: 'colPhone', active: true, display: true, width: "95" },
            { index: 5, label: 'Mobile', class: 'colMobile', active: false, display: true, width: "95" },
            { index: 6, label: 'Email', class: 'colEmail', active: true, display: true, width: "200" },
            { index: 7, label: 'Department', class: 'colDepartment', active: true, display: true, width: "80" },
            { index: 8, label: 'Custom Field 1', class: 'colCustFld1', active: false, display: true, width: "120" },
            { index: 9, label: 'Custom Field 2', class: 'colCustFld2', active: false, display: true, width: "120" },
            { index: 10, label: 'Status', class: 'colStatus', active: true, display: true, width: "" },
            { index: 11, label: 'Address', class: 'colAddress', active: true, display: true, width: "" },
            { index: 12, label: 'City/Suburb', class: 'colSuburb', active: false, display: true, width: "120" },
            { index: 13, label: 'State', class: 'colState', active: false, display: true, width: "120" },
            { index: 14, label: 'Postcode', class: 'colPostcode', active: false, display: true, width: "80" },
            { index: 15, label: 'Country', class: 'colCountry', active: false, display: true, width: "200" },
          ];
      }else if(currenttablename == "tblAccountOverview") {
           let bsbname = "Branch Code";
           if (Session.get("ERPLoggedCountry") === "Australia") {
               bsbname = "BSB";
           }
            reset_data = [
              { index: 0, label: '#ID', class: 'AccountId', active: false, display: true, width: "10" },
              { index: 1, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "200" },
              { index: 2, label: 'Description', class: 'colDescription', active: true, display: true, width: "" },
              { index: 3, label: 'Account No', class: 'colAccountNo', active: true, display: true, width: "90" },
              { index: 4, label: 'Type', class: 'colType', active: true, display: true, width: "60" },
              { index: 5, label: 'Balance', class: 'colBalance', active: true, display: true, width: "80" },
              { index: 6, label: 'Tax Code', class: 'colTaxCode', active: true, display: true, width: "80" },
              { index: 7, label: 'Bank Name', class: 'colBankName', active: false, display: true, width: "120" },
              { index: 8, label: 'Bank Acc Name', class: 'colBankAccountName', active: true, display: true, width: "120" },
              { index: 9, label: bsbname, class: 'colBSB', active: true, display: true, width: "90" },
              { index: 10, label: 'Bank Acc No', class: 'colBankAccountNo', active: true, display: true, width: "120" },
              { index: 11, label: 'Card Number', class: 'colCardNumber', active: false, display: true, width: "120" },
              { index: 12, label: 'Expiry Date', class: 'colExpiryDate', active: false, display: true, width: "60" },
              { index: 13, label: 'CVC', class: 'colCVC', active: false, display: true, width: "60" },
              { index: 14, label: 'Swift Code', class: 'colExtra', active: false, display: true, width: "80" },
              { index: 15, label: 'Routing Number', class: 'colAPCANumber', active: false, display: true, width: "120" },
              { index: 16, label: 'Header', class: 'colIsHeader', active: false, display: true, width: "60" },
              { index: 17, label: 'Use Receipt Claim', class: 'colUseReceiptClaim', active: false, display: true, width: "60" },
              { index: 18, label: 'Category', class: 'colExpenseCategory', active: false, display: true, width: "80" },
              { index: 19, label: 'Status', class: 'colStatus', active: true, display: true, width: "" },
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

  //Contact Overview Data
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
    var splashArrayContactOverview = new Array();
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
        data.terpcombinedcontactsvs1[i].suburb|| "",
        data.terpcombinedcontactsvs1[i].state|| "",
        data.terpcombinedcontactsvs1[i].postcode|| "",
        "",
      ];



      //if (data.terpcombinedcontactsvs1[i].name.replace(/\s/g, "") !== "") {
        splashArrayContactOverview.push(dataList);
        templateObject.transactiondatatablerecords.set(splashArrayContactOverview);

    }


    if (templateObject.transactiondatatablerecords.get()) {
        setTimeout(function () {
            MakeNegative();
        }, 100);
    }
    //$('.fullScreenSpin').css('display','none');
    setTimeout(function () {
        //$('#'+currenttablename).removeClass('hiddenColumn');
        $('#'+currenttablename).DataTable({
            data: splashArrayContactOverview,
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            columnDefs: [
                {
                targets: 0,
                className: "colContactID colID hiddenColumn",
                width: "10px",
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
                  width: "200px",
                },
                {
                  targets: 11,
                  className: "colCustFld1 hiddenColumn",
                  width: "120px",
                },
                {
                  targets: 12,
                  className: "colCustFld2 hiddenColumn",
                  width: "120px",
                },
                {
                  targets: 13,
                  className: "colAddress"
                },
                {
                  targets: 14,
                  className: "colSuburb hiddenColumn",
                  width: "120px",
                },
                {
                  targets: 15,
                  className: "colState hiddenColumn",
                  width: "120px",
                },
                {
                  targets: 16,
                  className: "colPostcode hiddenColumn",
                  width: "80px",
                },
                {
                  targets: 17,
                  className: "colCountry hiddenColumn",
                  width: "200px",
                }
            ],
            buttons: [
                {
                    extend: 'csvHtml5',
                    text: '',
                    download: 'open',
                    className: "btntabletocsv hiddenColumn",
                    filename: "Contact Overview",
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
                    filename: "Contact Overview",
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
                    filename: "Contact Overview",
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
                $('#'+currenttablename).DataTable().ajax.reload();
            },
            "fnDrawCallback": function (oSettings) {
                $('.paginate_button.page-item').removeClass('disabled');
                $('#'+currenttablename+'_ellipsis').addClass('disabled');
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
              let customerSearch = $('#'+currenttablename+'_filter input').val();

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
                      dataObjectnew.terpcombinedcontactsvs1[j].suburb|| "",
                      dataObjectnew.terpcombinedcontactsvs1[j].state|| "",
                      dataObjectnew.terpcombinedcontactsvs1[j].postcode|| "",
                      "",
                    ];

                    splashArrayContactOverview.push(dataListContactDupp);
                    //}
                }
                let uniqueChars = [...new Set(splashArrayContactOverview)];
                templateObject.transactiondatatablerecords.set(uniqueChars);
                var datatable = $('#'+currenttablename).DataTable();
                datatable.clear();
                datatable.rows.add(uniqueChars);
                datatable.draw(false);
                setTimeout(function () {
                  $('#'+currenttablename).dataTable().fnPageChange('last');
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
                    $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#'+currenttablename+'_filter');
                  }else{
                    $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#'+currenttablename+'_filter');
                  }
                  $("<button class='btn btn-primary btnRefreshContactOverview' type='button' id='btnRefreshContactOverview' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#'+currenttablename+'_filter');
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

  //Employee List Data
  templateObject.getEmployeeListData = async function (deleteFilter = false) {
    var customerpage = 0;
    getVS1Data('TEmployeeList').then(function (dataObject) {
        if (dataObject.length == 0) {
            sideBarService.getAllTEmployeeList(initialBaseDataLoad, 0,deleteFilter).then(async function (data) {
                await addVS1Data('TEmployeeList', JSON.stringify(data));
                templateObject.displayEmployeeListData(data);
            }).catch(function (err) {

            });
        } else {
            let data = JSON.parse(dataObject[0].data);
            templateObject.displayEmployeeListData(data);
        }
    }).catch(function (err) {
      sideBarService.getAllTEmployeeList(initialBaseDataLoad, 0,deleteFilter).then(async function (data) {
          await addVS1Data('TEmployeeList', JSON.stringify(data));
          templateObject.displayEmployeeListData(data);
      }).catch(function (err) {

      });
    });
  }
  templateObject.displayEmployeeListData = async function (data) {
    var splashArrayEmployeeList = new Array();
    let lineItems = [];
    let lineItemObj = {};
    let deleteFilter = false;
    if(data.Params.Search.replace(/\s/g, "") == ""){
      deleteFilter = true;
    }else{
      deleteFilter = false;
    };

    for (let i = 0; i < data.temployeelist.length; i++) {
      let mobile = "";
      //sideBarService.changeDialFormat(data.temployeelist[i].Mobile, data.temployeelist[i].Country);
      let linestatus = '';
      if (data.temployeelist[i].Active == true) {
          linestatus = "";
      } else if (data.temployeelist[i].Active == false) {
          linestatus = "In-Active";
      };
      var dataList = [
        data.temployeelist[i].EmployeeID || "",
        data.temployeelist[i].EmployeeName || "",
        data.temployeelist[i].FirstName || "",
        data.temployeelist[i].LastName || "",
        data.temployeelist[i].Phone || "",
        data.temployeelist[i].Mobile || '',
        data.temployeelist[i].Email || '',
        data.temployeelist[i].DefaultClassName || '',
        data.temployeelist[i].CustFld1 || '',
        data.temployeelist[i].CustFld2 || '',
        linestatus,
        data.temployeelist[i].Street || "",
        data.temployeelist[i].Street2 || "",
        data.temployeelist[i].State || "",
        data.temployeelist[i].Postcode || "",
        data.temployeelist[i].Country || "",
      ];

      //if (data.temployeelist[i].EmployeeName.replace(/\s/g, "") !== "") {
        splashArrayEmployeeList.push(dataList);
        templateObject.transactiondatatablerecords.set(splashArrayEmployeeList);
      //}

      //}
    }

    if (templateObject.transactiondatatablerecords.get()) {
        setTimeout(function () {
            MakeNegative();
        }, 100);
    }
    //$('.fullScreenSpin').css('display','none');
    setTimeout(function () {
        //$('#'+currenttablename).removeClass('hiddenColumn');
        $('#'+currenttablename).DataTable({
            data: splashArrayEmployeeList,
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            columnDefs: [
                {
                targets: 0,
                className: "colEmployeeNo colID hiddenColumn",
                width: "10px",
                createdCell: function (td, cellData, rowData, row, col) {
                  $(td).closest("tr").attr("id", rowData[0]);
                }},
                {
                  targets: 1,
                  className: "colEmployeeName",
                  width: "200px",
                },
                {
                  targets: 2,
                  className: "colFirstName",
                  width: "85px",
                },
                {
                  targets: 3,
                  className: "colLastName",
                  width: "85px",
                },
                {
                  targets: 4,
                  className: "colPhone",
                  width: "95px",
                },
                {
                  targets: 5,
                  className: "colMobile hiddenColumn",
                  width: "95px",
                },
                {
                  targets: 6,
                  className: "colEmail",
                  width: "200px",
                },
                {
                  targets: 7,
                  className: "colDepartment hiddenColumn",
                  width: "100px",
                },
                {
                  targets: 8,
                  className: "colCustFld1 hiddenColumn",
                  width: "120px",
                },
                {
                  targets: 9,
                  className: "colCustFld2 hiddenColumn",
                  width: "120px",
                },
                {
                  targets: 10,
                  className: "colStatus",
                  width: "100px",
                },
                {
                  targets: 11,
                  className: "colAddress colStreetAddress"
                },
                {
                  targets: 12,
                  className: "colCity colSuburb hiddenColumn",
                  width: "120px",
                },
                {
                  targets: 13,
                  className: "colState hiddenColumn",
                  width: "120px",
                },
                {
                  targets: 14,
                  className: "colPostcode colZipCode hiddenColumn",
                  width: "80px",
                },
                {
                  targets: 15,
                  className: "colCountry hiddenColumn",
                  width: "200px",
                }
            ],
            buttons: [
                {
                    extend: 'csvHtml5',
                    text: '',
                    download: 'open',
                    className: "btntabletocsv hiddenColumn",
                    filename: "Employee List",
                    orientation:'portrait',
                    exportOptions: {
                        columns: ':visible'
                    }
                },{
                    extend: 'print',
                    download: 'open',
                    className: "btntabletopdf hiddenColumn",
                    text: '',
                    title: 'Employee List',
                    filename: "Employee List",
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
                    filename: "Employee List",
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
            action: function () {
                $('#'+currenttablename).DataTable().ajax.reload();
            },
            "fnDrawCallback": function (oSettings) {
                $('.paginate_button.page-item').removeClass('disabled');
                $('#'+currenttablename+'_ellipsis').addClass('disabled');
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
              let customerSearch = $('#'+currenttablename+'_filter input').val();

                sideBarService.getAllTEmployeeList(initialDatatableLoad, oSettings.fnRecordsDisplay(),deleteFilter).then(function (dataObjectnew) {

                for (let j = 0; j < dataObjectnew.temployeelist.length; j++) {
                  let mobile = sideBarService.changeDialFormat(dataObjectnew.temployeelist[j].Mobile, dataObjectnew.temployeelist[j].Country);
                  let linestatus = '';
                  if (dataObjectnew.temployeelist[j].Active == true) {
                      linestatus = "";
                  } else if (dataObjectnew.temployeelist[j].Active == false) {
                      linestatus = "In-Active";
                  };


                    var dataListDupp = [
                      dataObjectnew.temployeelist[j].EmployeeID || "",
                      dataObjectnew.temployeelist[j].EmployeeName || "",
                      dataObjectnew.temployeelist[j].FirstName || "",
                      dataObjectnew.temployeelist[j].LastName || "",
                      dataObjectnew.temployeelist[j].Phone || "",
                      mobile || '',
                      dataObjectnew.temployeelist[j].Email || '',
                      dataObjectnew.temployeelist[j].DefaultClassName || '',
                      dataObjectnew.temployeelist[j].CustFld1 || '',
                      dataObjectnew.temployeelist[j].CustFld2 || '',
                      linestatus,
                      dataObjectnew.temployeelist[j].Street || "",
                      dataObjectnew.temployeelist[j].Street2 || "",
                      dataObjectnew.temployeelist[j].State || "",
                      dataObjectnew.temployeelist[j].Postcode || "",
                      dataObjectnew.temployeelist[j].Country || "",
                    ];

                    splashArrayEmployeeList.push(dataListDupp);
                    //}
                }
                let uniqueChars = [...new Set(splashArrayEmployeeList)];
                templateObject.transactiondatatablerecords.set(uniqueChars);
                var datatable = $('#'+currenttablename).DataTable();
                datatable.clear();
                datatable.rows.add(uniqueChars);
                datatable.draw(false);
                setTimeout(function () {
                  $('#'+currenttablename).dataTable().fnPageChange('last');
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
                    $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#'+currenttablename+'_filter');
                  }else{
                    $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#'+currenttablename+'_filter');
                  }
                  $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#'+currenttablename+'_filter');
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

  //Accounts Overview List Data
  templateObject.getAccountsOverviewData = async function (deleteFilter = false) {
    var customerpage = 0;
    getVS1Data('TAccountVS1List').then(function (dataObject) {
        if (dataObject.length == 0) {
            sideBarService.getAllTAccountVS1List(initialBaseDataLoad, 0,deleteFilter).then(async function (data) {
                await addVS1Data('TAccountVS1List', JSON.stringify(data));
                templateObject.displayAccountsOverviewListData(data);
            }).catch(function (err) {

            });
        } else {
            let data = JSON.parse(dataObject[0].data);
            templateObject.displayAccountsOverviewListData(data);
        }
    }).catch(function (err) {
      sideBarService.getAllTAccountVS1List(initialBaseDataLoad, 0,deleteFilter).then(async function (data) {
          await addVS1Data('TAccountVS1List', JSON.stringify(data));
          templateObject.displayAccountsOverviewListData(data);
      }).catch(function (err) {

      });
    });
  }
  templateObject.displayAccountsOverviewListData = async function (data) {
    var splashArrayAccountsOverview = new Array();
    let lineItems = [];
    let lineItemObj = {};
    let fullAccountTypeName = "";
    let accBalance = "";
    let deleteFilter = false;
    if(data.Params.Search.replace(/\s/g, "") == ""){
      deleteFilter = true;
    }else{
      deleteFilter = false;
    };

    for (let i = 0; i < data.taccountvs1list.length; i++) {
      if (!isNaN(data.taccountvs1list[i].Balance)) {
          accBalance = utilityService.modifynegativeCurrencyFormat(data.taccountvs1list[i].Balance) || 0.0;
      } else {
          accBalance = Currency + "0.00";
      }
      if (data.taccountvs1list[i].ReceiptCategory && data.taccountvs1list[i].ReceiptCategory != '') {
          usedCategories.push(data.taccountvs1list[i].fields);
      }
      let linestatus = '';
      if (data.taccountvs1list[i].Active == true) {
          linestatus = "";
      } else if (data.taccountvs1list[i].Active == false) {
          linestatus = "In-Active";
      };
      var dataList = [
        data.taccountvs1list[i].AccountID || "",
        data.taccountvs1list[i].AccountName || "",
        data.taccountvs1list[i].Description || "",
        data.taccountvs1list[i].AccountNumber || "",
        data.taccountvs1list[i].AccountType || "",
        accBalance || '',
        data.taccountvs1list[i].TaxCode || '',
        data.taccountvs1list[i].BankName || '',
        data.taccountvs1list[i].BankAccountName || '',
        data.taccountvs1list[i].BSB || '',
        data.taccountvs1list[i].BankAccountNumber || "",
        data.taccountvs1list[i].CarNumber || "",
        data.taccountvs1list[i].ExpiryDate || "",
        data.taccountvs1list[i].CVC || "",
        data.taccountvs1list[i].Extra || "",
        data.taccountvs1list[i].BankNumber || "",
        data.taccountvs1list[i].IsHeader || false,
        data.taccountvs1list[i].AllowExpenseClaim || false,
        data.taccountvs1list[i].ReceiptCategory || "",
        linestatus,
      ];

        splashArrayAccountsOverview.push(dataList);
        templateObject.transactiondatatablerecords.set(splashArrayAccountsOverview);

    }

    if (templateObject.transactiondatatablerecords.get()) {
        setTimeout(function () {
            MakeNegative();
        }, 100);
    }
    //$('.fullScreenSpin').css('display','none');
    setTimeout(function () {
        $('#'+currenttablename).DataTable({
            data: splashArrayAccountsOverview,
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            columnDefs: [
                {
                targets: 0,
                className: "colAccountId colID hiddenColumn",
                width: "10px",
                createdCell: function (td, cellData, rowData, row, col) {
                  $(td).closest("tr").attr("id", rowData[0]);
                }},
                {
                  targets: 1,
                  className: "colAccountName",
                  width: "200px",
                },
                {
                  targets: 2,
                  className: "colDescription"
                },
                {
                  targets: 3,
                  className: "colAccountNo",
                  width: "90px",
                },
                {
                  targets: 4,
                  className: "colType",
                  width: "60px",
                },
                {
                  targets: 5,
                  className: "colBalance text-right",
                  width: "80px",
                },
                {
                  targets: 6,
                  className: "colTaxCode",
                  width: "80px",
                },
                {
                  targets: 7,
                  className: "colBankName hiddenColumn",
                  width: "120px",
                },
                {
                  targets: 8,
                  className: "colBankAccountName",
                  width: "120px",
                },
                {
                  targets: 9,
                  className: "colBSB",
                  width: "60px",
                },
                {
                  targets: 10,
                  className: "colBankAccountNo",
                  width: "120px",
                },
                {
                  targets: 11,
                  className: "colCardNumber hiddenColumn",
                  width: "120px",
                },
                {
                  targets: 12,
                  className: "colExpiryDate hiddenColumn",
                  width: "60px",
                },
                {
                  targets: 13,
                  className: "colCVC hiddenColumn",
                  width: "60px",
                },
                {
                  targets: 14,
                  className: "colExtra hiddenColumn",
                  width: "80px",
                },
                {
                  targets: 15,
                  className: "colAPCANumber hiddenColumn",
                  width: "120px",
                },
                {
                  targets: 16,
                  className: "colIsHeader hiddenColumn",
                  width: "60px",
                },
                {
                  targets: 17,
                  className: "colUseReceiptClaim hiddenColumn",
                  width: "60px",
                },
                {
                  targets: 18,
                  className: "colExpenseCategory hiddenColumn",
                  width: "80px",
                },
                {
                  targets: 19,
                  className: "colStatus",
                  width: "100px",
                }
            ],
            buttons: [
                {
                    extend: 'csvHtml5',
                    text: '',
                    download: 'open',
                    className: "btntabletocsv hiddenColumn",
                    filename: "Accounts Overview",
                    orientation:'portrait',
                    exportOptions: {
                        columns: ':visible'
                    }
                },{
                    extend: 'print',
                    download: 'open',
                    className: "btntabletopdf hiddenColumn",
                    text: '',
                    title: 'Accounts Overview',
                    filename: "Accounts Overview",
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
                    filename: "Accounts Overview",
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
            action: function () {
                $('#'+currenttablename).DataTable().ajax.reload();
            },
            "fnDrawCallback": function (oSettings) {
                $('.paginate_button.page-item').removeClass('disabled');
                $('#'+currenttablename+'_ellipsis').addClass('disabled');
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
              let customerSearch = $('#'+currenttablename+'_filter input').val();

                sideBarService.getAllTAccountVS1List(initialDatatableLoad, oSettings.fnRecordsDisplay(),deleteFilter).then(function (dataObjectnew) {

                for (let j = 0; j < dataObjectnew.taccountvs1list.length; j++) {
                  if (!isNaN(dataObjectnew.taccountvs1list[j].Balance)) {
                      accBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.taccountvs1list[j].Balance) || 0.0;
                  } else {
                      accBalance = Currency + "0.00";
                  }
                  if (dataObjectnew.taccountvs1list[j].ReceiptCategory && dataObjectnew.taccountvs1list[j].ReceiptCategory != '') {
                      usedCategories.push(dataObjectnew.taccountvs1list[j].fields);
                  }
                  let linestatus = '';
                  if (dataObjectnew.taccountvs1list[j].Active == true) {
                      linestatus = "";
                  } else if (dataObjectnew.taccountvs1list[j].Active == false) {
                      linestatus = "In-Active";
                  };


                    var dataListDupp = [
                      dataObjectnew.taccountvs1list[j].AccountID || "",
                      dataObjectnew.taccountvs1list[j].AccountName || "",
                      dataObjectnew.taccountvs1list[j].Description || "",
                      dataObjectnew.taccountvs1list[j].AccountNumber || "",
                      dataObjectnew.taccountvs1list[j].AccountType || "",
                      accBalance || '',
                      dataObjectnew.taccountvs1list[j].TaxCode || '',
                      dataObjectnew.taccountvs1list[j].BankName || '',
                      dataObjectnew.taccountvs1list[j].BankAccountName || '',
                      dataObjectnew.taccountvs1list[j].BSB || '',
                      dataObjectnew.taccountvs1list[j].BankAccountNumber || "",
                      dataObjectnew.taccountvs1list[j].CarNumber || "",
                      dataObjectnew.taccountvs1list[j].ExpiryDate || "",
                      dataObjectnew.taccountvs1list[j].CVC || "",
                      dataObjectnew.taccountvs1list[j].Extra || "",
                      dataObjectnew.taccountvs1list[j].BankNumber || "",
                      dataObjectnew.taccountvs1list[j].IsHeader || false,
                      dataObjectnew.taccountvs1list[j].AllowExpenseClaim || false,
                      dataObjectnew.taccountvs1list[j].ReceiptCategory || "",
                      linestatus,
                    ];

                    splashArrayAccountsOverview.push(dataListDupp);
                    //}
                }
                let uniqueChars = [...new Set(splashArrayAccountsOverview)];
                templateObject.transactiondatatablerecords.set(uniqueChars);
                var datatable = $('#'+currenttablename).DataTable();
                datatable.clear();
                datatable.rows.add(uniqueChars);
                datatable.draw(false);
                setTimeout(function () {
                  $('#'+currenttablename).dataTable().fnPageChange('last');
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
                    $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#'+currenttablename+'_filter');
                  }else{
                    $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#'+currenttablename+'_filter');
                  }
                  $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#'+currenttablename+'_filter');
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

  //Check URL to make right call.
  if(currenttablename == "tblcontactoverview"){
    templateObject.getContactOverviewData();
  }else if(currenttablename == "tblEmployeelist"){
    templateObject.getEmployeeListData();
  }else if(currenttablename == "tblAccountOverview"){
    templateObject.getAccountsOverviewData();
  }

});

Template.non_transactional_list.events({
  "click .btnViewDeleted": async function (e) {
      $(".fullScreenSpin").css("display", "inline-block");
      e.stopImmediatePropagation();
      const templateObject = Template.instance();
      let currenttablename = await templateObject.tablename.get()||'';

      // var datatable = $(`#${currenttablename}`).DataTable();
      // datatable.clear();
      // datatable.draw(false);
      $('.btnViewDeleted').css('display','none');
      $('.btnHideDeleted').css('display','inline-block');
      if(currenttablename == "tblcontactoverview"){
        await clearData('TERPCombinedContactsVS1');
        templateObject.getContactOverviewData(true);
      }else if(currenttablename == "tblEmployeelist"){
        await clearData('TEmployeeList');
        templateObject.getEmployeeListData(true);
      }else if(currenttablename == "tblAccountOverview"){
        await clearData('TAccountVS1List');
        templateObject.getAccountsOverviewData(true);
      }

    },
  "click .btnHideDeleted": async function (e) {
      $(".fullScreenSpin").css("display", "inline-block");
      e.stopImmediatePropagation();
      let templateObject = Template.instance();
      let currenttablename = await templateObject.tablename.get()||'';

      // var datatable = $(`#${currenttablename}`).DataTable();
      // datatable.clear();
      // datatable.draw(false);
      $('.btnHideDeleted').css('display','none');
      $('.btnViewDeleted').css('display','inline-block');

      if(currenttablename == "tblcontactoverview"){
        await clearData('TERPCombinedContactsVS1');
        templateObject.getContactOverviewData(false);
      }else if(currenttablename == "tblEmployeelist"){
        await clearData('TEmployeeList');
        templateObject.getEmployeeListData(false);
      }else if(currenttablename == "tblAccountOverview"){
        await clearData('TAccountVS1List');
        templateObject.getAccountsOverviewData(false);
      };
    },
  'change .custom-range': async function(event) {
    const tableHandler = new TableHandler();
    let range = $(event.target).val()||0;
    let colClassName = $(event.target).attr("valueclass");
    await $('.col' + colClassName).css('width', range);
    $('.dataTable').resizable();
  },
  'click .chkDatatable': function(event) {
      let columnDataValue = $(event.target).closest("div").find(".divcolumn").attr('valueupdate');
      if ($(event.target).is(':checked')) {
        $('.col'+columnDataValue).addClass('showColumn');
        $('.col'+columnDataValue).removeClass('hiddenColumn');
      } else {
        $('.col'+columnDataValue).addClass('hiddenColumn');
        $('.col'+columnDataValue).removeClass('showColumn');
      }
  },
  "blur .divcolumn": async function (event) {
    const templateObject = Template.instance();
    let columData = $(event.target).text();
    let columnDatanIndex = $(event.target).closest("div.columnSettings").attr("custid");
    let currenttablename = await templateObject.tablename.get()||'';
    var datable = $('#'+currenttablename).DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  'click .resetTable' : async function(event){
    let templateObject = Template.instance();
    let reset_data = templateObject.reset_data.get();
    let currenttablename = await templateObject.tablename.get()||'';
      //reset_data[9].display = false;
      reset_data = reset_data.filter(redata => redata.display);

    $(".displaySettings").each(function (index) {
      let $tblrow = $(this);
      $tblrow.find(".divcolumn").text(reset_data[index].label);
      $tblrow.find(".custom-control-input").prop("checked", reset_data[index].active);

      let title = $('#'+currenttablename).find("th").eq(index);
        $(title).html(reset_data[index].label);

      if (reset_data[index].active) {
        $('.col' + reset_data[index].class).addClass('showColumn');
        $('.col' + reset_data[index].class).removeClass('hiddenColumn');
      } else {
        $('.col' + reset_data[index].class).addClass('hiddenColumn');
        $('.col' + reset_data[index].class).removeClass('showColumn');
      }
      $(".rngRange" + reset_data[index].class).val(reset_data[index].width);
      $(".col" + reset_data[index].class).css('width', reset_data[index].width);
    });
  },
  "click .saveTable": async function(event) {
    let lineItems = [];
    $(".fullScreenSpin").css("display", "inline-block");

    $(".displaySettings").each(function (index) {
      var $tblrow = $(this);
      var fieldID = $tblrow.attr("custid") || 0;
      var colTitle = $tblrow.find(".divcolumn").text() || "";
      var colWidth = $tblrow.find(".custom-range").val() || 0;
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
        width: parseInt(colWidth),
        class: colthClass,
        display: true
      };

      lineItems.push(lineItemObj);
    });

    let templateObject = Template.instance();
    let reset_data = templateObject.reset_data.get();
    reset_data = reset_data.filter(redata => redata.display == false);
    lineItems.push(...reset_data);
    lineItems.sort((a,b) => a.index - b.index);
      let erpGet = erpDb();
      let tableName = await templateObject.tablename.get()||'';
      let employeeId = parseInt(Session.get('mySessionEmployeeLoggedID'))||0;
      let added = await sideBarService.saveNewCustomFields(erpGet, tableName, employeeId, lineItems);

      if(added){
        sideBarService.getNewCustomFieldsWithQuery(parseInt(Session.get('mySessionEmployeeLoggedID')),'').then(function (dataCustomize) {
            addVS1Data('VS1_Customize', JSON.stringify(dataCustomize));
        }).catch(function (err) {
        });
        $(".fullScreenSpin").css("display", "none");
        swal({
          title: 'SUCCESS',
          text: "Display settings is updated!",
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'OK'
        }).then((result) => {
            if (result.value) {
                $('#'+tableName+'_Modal').modal('hide');
            }
        });
      }else{
        $(".fullScreenSpin").css("display", "none");
      }

    },
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
