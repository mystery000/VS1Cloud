// import { ReportService } from "../report-service";
// import 'jQuery.print/jQuery.print.js';
import { UtilityService } from "../../utility-service";

// import { OrganisationService } from "../../js/organisation-service";
import { CountryService } from "../../js/country-service";
import { ReactiveVar } from "meteor/reactive-var";
import { AccountService } from "../../accounts/account-service";
import { SideBarService } from "../../js/sidebar-service";
import "../../lib/global/indexdbstorage.js";
import LoadingOverlay from "../../LoadingOverlay";
let sideBarService = new SideBarService();
// let organisationService = new OrganisationService();


// let reportService = new ReportService();
let utilityService = new UtilityService();

Template.accountant.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.countryList = new ReactiveVar([]);
    templateObject.countryData = new ReactiveVar();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.accountantPanList = new ReactiveVar([]);
});

Template.accountant.onRendered(() => {

    const templateObject = Template.instance();
    let accountService = new AccountService();
    let countries = [];
    const accountTypeList = [];
    const dataTableList = [];

    let accountantID = FlowRouter.getParam("_id");

    templateObject.accountantPanList.set([
      {
        no: 2,
        name:"Cash and Cash Equivalents",
      },{
        no: 3,
        name:"Receivables",
      },{
        no: 4,
        name:"Inventory",
      },{
        no: 5,
        name:"Property Plant and Equipment",
      },{
        no: 6,
        name:"Financial Assets",
      },{
        no: 7,
        name:"Intangibles",
      },{
        no: 8,
        name:"Provisions",
      },{
        no: 9,
        name:"Payables",
      }
    ]);
    
    
    let imageData = (localStorage.getItem("Image"));
    if (imageData) {
        $('#uploadedImage').attr('src', imageData);
        $('#uploadedImage').attr('width', '50%');
    }

    function MakeNegative() {
      var TDs = document.getElementsByTagName("td");
      for (var i = 0; i < TDs.length; i++) {
        var temp = TDs[i];
        if (temp.firstChild.nodeValue.indexOf("-" + Currency) === 0) {
          temp.className = "colBalance text-danger";
        }
      }
    }

    var countryService = new CountryService();
    templateObject.getCountryData = function () {
        getVS1Data("TCountries")
          .then(function (dataObject) {
            if (dataObject.length == 0) {
              countryService.getCountry().then((data) => {
                for (let i = 0; i < data.tcountries.length; i++) {
                  countries.push(data.tcountries[i].Country);
                }
                countries = _.sortBy(countries);
                templateObject.countryData.set(countries);
              });
            } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.tcountries;
              for (let i = 0; i < useData.length; i++) {
                countries.push(useData[i].Country);
              }
              countries = _.sortBy(countries);
              templateObject.countryData.set(countries);
            }
          })
          .catch(function (err) {
            countryService.getCountry().then((data) => {
              for (let i = 0; i < data.tcountries.length; i++) {
                countries.push(data.tcountries[i].Country);
              }
              countries = _.sortBy(countries);
              templateObject.countryData.set(countries);
            });
          });
    };
    templateObject.getCountryData();

    templateObject.getAccountLists = function () {
      getVS1Data("TAccountVS1")
        .then(function (dataObject) {
          if (dataObject.length == 0) {
            accountService
              .getAccountListVS1()
              .then(function (data) {
                setAccountListVS1(data);
              })
              .catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $(".fullScreenSpin").css("display", "none");
                // Meteor._reload.reload();
              });
          } else {
            let data = JSON.parse(dataObject[0].data);
            setAccountListVS1(data, true);
          }
        })
        .catch(function (err) {
          accountService
            .getAccountListVS1()
            .then(function (data) {
              setAccountListVS1(data);
            })
            .catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $(".fullScreenSpin").css("display", "none");
              // Meteor._reload.reload();
            });
        });
    };

    function setAccountListVS1(data, isField=false) {

      //addVS1Data('TAccountVS1', JSON.stringify(data));
      let lineItems = [];
      let lineItemObj = {};
      let fullAccountTypeName = "";
      let accBalance = "";
      dataTableList = [];

      for (let i = 0; i < data.taccountvs1.length; i++) {
        let lineData = data.taccountvs1[i];
        if (isField) {
          lineData = data.taccountvs1[i].fields;
        }
        if (accountTypeList) {
          for (var j = 0; j < accountTypeList.length; j++) {
            if (
                lineData.AccountTypeName ===
                accountTypeList[j].accounttypename
            ) {
              fullAccountTypeName = accountTypeList[j].description || "";
            }
          }
        }
  
        if (!isNaN(data.taccountvs1[i].Balance)) {
          accBalance =
              utilityService.modifynegativeCurrencyFormat(
                  lineData.Balance
              ) || 0.0;
        } else {
          accBalance = Currency + "0.00";
        }

        var dataList = {
          id: lineData.ID || lineData.Id || "",
          accountname: lineData.AccountName || "",
          description: lineData.Description || "",
          accountnumber: lineData.AccountNumber || "",
          accounttypename:fullAccountTypeName || lineData.AccountTypeName,
          accounttypeshort: lineData.AccountTypeName || "",
          taxcode: lineData.TaxCode || "",
          bankaccountname: lineData.BankAccountName || "",
          bankname: lineData.BankName || "",
          bsb: lineData.BSB || "",
          bankaccountnumber:lineData.BankAccountNumber || "",
          swiftcode: lineData.Extra || "",
          routingNo: lineData.BankCode || "",
          apcanumber: lineData.BankNumber || "",
          balance: accBalance || 0.0,
          isheader: lineData.IsHeader || false,
          cardnumber: lineData.CarNumber || "",
          expirydate: lineData.ExpiryDate || "",
          cvc: lineData.CVC || "",
          useReceiptClaim: lineData.AllowExpenseClaim || false,
          expenseCategory: lineData.AccountGroup || ""
        };
        dataTableList.push(dataList);
      }

      
      templateObject.datatablerecords.set(dataTableList);
  
      if (templateObject.datatablerecords.get()) {
        Meteor.call(
            "readPrefMethod",
            Session.get("mycloudLogonID"),
            "tblAccountOverview",
            function (error, result) {
              if (error) {
              } else {
                if (result) {
                  for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[
                      i
                    ].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split(".")[1];
                    let columnWidth = customcolumn[i].width;
                    let columnindex = customcolumn[i].index + 1;
  
                    if (hiddenColumn == true) {
                      $("." + columnClass + "").addClass("hiddenColumn");
                      $("." + columnClass + "").removeClass("showColumn");
                    } else if (hiddenColumn == false) {
                      $("." + columnClass + "").removeClass(
                          "hiddenColumn"
                      );
                      $("." + columnClass + "").addClass("showColumn");
                    }
                  }
                }
              }
            }
        );
  
        setTimeout(function () {
          MakeNegative();
        }, 100);
      }
  
      $(".fullScreenSpin").css("display", "none");
      setTimeout(function () {
        // //$.fn.dataTable.moment('DD/MM/YY');
        $("#tblAccountOverview")
            .DataTable({
              columnDefs: [
                // { type: 'currency', targets: 4 }
              ],
              select: true,
              destroy: true,
              colReorder: true,
              sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
              buttons: [
                {
                  extend: "csvHtml5",
                  text: "",
                  download: "open",
                  className: "btntabletocsv hiddenColumn",
                  filename: "accountoverview_" + moment().format(),
                  orientation: "portrait",
                  exportOptions: {
                    columns: ":visible",
                  },
                },
                {
                  extend: "print",
                  download: "open",
                  className: "btntabletopdf hiddenColumn",
                  text: "",
                  title: "Accounts Overview",
                  filename: "Accounts Overview_" + moment().format(),
                  exportOptions: {
                    columns: ":visible",
                  },
                },
                {
                  extend: "excelHtml5",
                  title: "",
                  download: "open",
                  className: "btntabletoexcel hiddenColumn",
                  filename: "accountoverview_" + moment().format(),
                  orientation: "portrait",
                  exportOptions: {
                    columns: ":visible",
                  },
                  // ,
                  // customize: function ( win ) {
                  //   $(win.document.body).children("h1:first").remove();
                  // }
                },
              ],
              // bStateSave: true,
              // rowId: 0,
              pageLength: initialDatatableLoad,
              lengthMenu: [
                [initialDatatableLoad, -1],
                [initialDatatableLoad, "All"],
              ],
              info: true,
              responsive: true,
              order: [[0, "asc"]],
              // "aaSorting": [[1,'desc']],
              action: function () {
                $("#tblAccountOverview").DataTable().ajax.reload();
              },
              fnDrawCallback: function (oSettings) {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
              },
              fnInitComplete: function () {
                $(
                    "<button class='btn btn-primary btnRefreshAccount' type='button' id='btnRefreshAccount' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                ).insertAfter("#tblAccountOverview_filter");
              },
            })
            .on("page", function () {
              setTimeout(function () {
                MakeNegative();
              }, 100);
              let draftRecord = templateObject.datatablerecords.get();
              templateObject.datatablerecords.set(draftRecord);
            })
            .on("column-reorder", function () {})
            .on("length.dt", function (e, settings, len) {
              setTimeout(function () {
                MakeNegative();
              }, 100);
            });
        // $('.fullScreenSpin').css('display','none');
      }, 10);
  
      var columns = $("#tblAccountOverview th");
      let sTible = "";
      let sWidth = "";
      let sIndex = "";
      let sVisible = "";
      let columVisible = false;
      let sClass = "";
      $.each(columns, function (i, v) {
        if (v.hidden === false) {
          columVisible = true;
        }
        if (v.className.includes("hiddenColumn")) {
          columVisible = false;
        }
        sWidth = v.style.width.replace("px", "");
  
        let datatablerecordObj = {
          sTitle: v.innerText || "",
          sWidth: sWidth || "",
          sIndex: v.cellIndex || "",
          sVisible: columVisible || false,
          sClass: v.className || "",
        };
        tableHeaderList.push(datatablerecordObj);
      });
      templateObject.tableheaderrecords.set(tableHeaderList);
      $("div.dataTables_filter input").addClass(
          "form-control form-control-sm"
      );
    }

    templateObject.getAccountLists();
});

Template.accountant.events({
  'click #btndispAccountant': function() {
    
    if($("#edtFirstName").val() != "" && $("#edtLastName").val() != "" && $("#edtAddress").val() != "" && $("#edtDocName").val() != "" && $("#edtCompanyName").val() != ""){
      let headerHtml = "<span>"+$("#edtFirstName").val()+" "+$("#edtLastName").val()+", CPA</span><br>";
      // headerHtml += "<h4>OnPoint Advisory</h4>";
      headerHtml += "<span>"+$("#edtAddress").val()+", "+$("#edtTownCity").val()+", "+$("#edtPostalZip").val()+", "+$("#edtStateRegion").val()+", "+$("#edtCountry").val()+"</span>";
      headerHtml += "<h3>"+$("#edtDocName").val()+"</h3>";
      headerHtml += "<span>"+$("#edtCompanyName").val()+"<br>For the year ended "+(new Date())+"</span>";
      
      $("#reportsAccountantHeader").html(headerHtml);
      $("#editReportsAccountant").show();
    }
  },

  'click .custom-control-input': function(event) {
    const templateObject = Template.instance();
    let accountantList = templateObject.datatablerecords.curValue;
    
    let innerHtml = "";
    let accountantItemID = $("#"+$(event.target).attr('id')).val();
    let accountantPanID = $(event.target).attr('id').split("-")[1];

    for(var i=0; i<accountantList.length; i++){
      if(accountantList[i].id == accountantItemID){
        if($("#"+$(event.target).attr('id')).prop('checked') == true){    
          innerHtml += "<div class='col-6 col-md-12' id='row-"+accountantPanID+"-"+accountantList[i].id+"' style='border-bottom: 1px solid #ccc;'>";
          innerHtml += "<div style='width:80%; float:left; padding-left:6px; padding-top:6px'><label>"+accountantList[i].accountname+"</label></div>";
          innerHtml += "<div style='float:left; padding-top:6px'><label>"+accountantList[i].balance+"</label></div>";
          innerHtml += "</div>";

          $("#reportAccPan"+accountantPanID).append(innerHtml);
        }
        else{
          $("#row-"+accountantPanID+"-"+accountantList[i].id).remove();
        }
      }
    }
  },

  // 'click #btnSummary': function() {
  //     FlowRouter.go('/customersummaryreport');
  // },
  // 'click .btnRefresh': function() {
  //     $('.fullScreenSpin').css('display', 'inline-block');
  //     localStorage.setItem('VS1CustomerDetails_Report', '');
  //     Meteor._reload.reload();
  // },
  // 'click .btnExportReport': function() {
  //     $('.fullScreenSpin').css('display', 'inline-block');
  //     let utilityService = new UtilityService();
  //     let templateObject = Template.instance();
  //     var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
  //     var dateTo = new Date($("#dateTo").datepicker("getDate"));

  //     let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
  //     let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

  //     const filename = loggedCompany + '- Customer Details Report' + '.csv';
  //     utilityService.exportReportToCsvTable('tableExport', filename, 'csv');
  //     let rows = [];
  // },
  // 'click .btnPrintReport': function(event) {

  //     let values = [];
  //     let basedOnTypeStorages = Object.keys(localStorage);
  //     basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
  //         let employeeId = storage.split('_')[2];
  //         return storage.includes('BasedOnType_') && employeeId == Session.get('mySessionEmployeeLoggedID')
  //     });
  //     let i = basedOnTypeStorages.length;
  //     if (i > 0) {
  //         while (i--) {
  //             values.push(localStorage.getItem(basedOnTypeStorages[i]));
  //         }
  //     }
  //     values.forEach(value => {
  //         let reportData = JSON.parse(value);
  //         reportData.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://' + $(location).attr('hostname');
  //         if (reportData.BasedOnType.includes("P")) {
  //             if (reportData.FormID == 1) {
  //                 let formIds = reportData.FormIDs.split(',');
  //                 if (formIds.includes("225")) {
  //                     reportData.FormID = 225;
  //                     Meteor.call('sendNormalEmail', reportData);
  //                 }
  //             } else {
  //                 if (reportData.FormID == 225)
  //                     Meteor.call('sendNormalEmail', reportData);
  //             }
  //         }
  //     });

  //     document.title = 'Customer Details Report';
  //     $(".printReport").print({
  //         title: "Customer Details Report | " + loggedCompany,
  //         noPrintSelector: ".addSummaryEditor"
  //     })
  // },
  // 'keyup #myInputSearch': function(event) {
  //     $('.table tbody tr').show();
  //     let searchItem = $(event.target).val();
  //     if (searchItem != '') {
  //         var value = searchItem.toLowerCase();
  //         $('.table tbody tr').each(function() {
  //             var found = 'false';
  //             $(this).each(function() {
  //                 if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
  //                     found = 'true';
  //                 }
  //             });
  //             if (found == 'true') {
  //                 $(this).show();
  //             } else {
  //                 $(this).hide();
  //             }
  //         });
  //     } else {
  //         $('.table tbody tr').show();
  //     }
  // },
  // 'blur #myInputSearch': function(event) {
  //     $('.table tbody tr').show();
  //     let searchItem = $(event.target).val();
  //     if (searchItem != '') {
  //         var value = searchItem.toLowerCase();
  //         $('.table tbody tr').each(function() {
  //             var found = 'false';
  //             $(this).each(function() {
  //                 if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
  //                     found = 'true';
  //                 }
  //             });
  //             if (found == 'true') {
  //                 $(this).show();
  //             } else {
  //                 $(this).hide();
  //             }
  //         });
  //     } else {
  //         $('.table tbody tr').show();
  //     }
  // }
});

Template.accountant.helpers({
    countryList: () => {
        return Template.instance().countryData.get();
    },
    datatablerecords: () => {
      return Template.instance()
        .datatablerecords.get()
        .sort(function (a, b) {
          if (a.accountname === "NA") {
            return 1;
          } else if (b.accountname === "NA") {
            return -1;
          }
          return a.accountname.toUpperCase() > b.accountname.toUpperCase()
            ? 1
            : -1;
        });
    },
    accountantPanList: () => {
      return Template.instance().accountantPanList.get();
  },
});

// Template.registerHelper('equals', function(a, b) {
//     return a === b;
// });

// Template.registerHelper('notEquals', function(a, b) {
//     return a != b;
// });

// Template.registerHelper('containsequals', function(a, b) {
//     return (a.indexOf(b) >= 0);
// });
