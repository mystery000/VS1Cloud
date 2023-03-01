import { ReportService } from "../report-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
import Datehandler from "../../DateHandler";
import GlobalFunctions from "../../GlobalFunctions";
import CachedHttp from "../../lib/global/CachedHttp";
import erpObject from "../../lib/global/erp-objects";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";
import { Template } from 'meteor/templating';
import "./supplierproductreport.html";

let reportService = new ReportService();
let utilityService = new UtilityService();
let taxRateService = new TaxRateService();
let defaultCurrencyCode = CountryAbbr;

Template.supplierproductreport.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.transactiondatatablerecords = new ReactiveVar([]);
  templateObject.reportOptions = new ReactiveVar([]);
  templateObject.supplierproductreportth = new ReactiveVar([]);

  FxGlobalFunctions.initVars(templateObject);
});

Template.supplierproductreport.onRendered(() => {
  const templateObject = Template.instance();
  LoadingOverlay.show();

  templateObject.init_reset_data = function () {
    let reset_data = [];
    reset_data = [
      { index: 1, label: 'Supplier', class: 'colSupplier', active: true, display: true, width: "200" },
      { index: 2, label: 'PO No', class: 'colPoNumber', active: true, display: true, width: "150" },
      { index: 3, label: 'Trans Type', class: 'colTransType', active: true, display: true, width: "150" },
      { index: 4, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "150" },
      { index: 5, label: 'Product Desc', class: 'colProductDesc', active: true, display: true, width: "150" },
      { index: 6, label: 'Cost (ex)', class: 'colCostEX', active: true, display: true, width: "150" },
      { index: 7, label: 'Tax', class: 'colTax', active: true, display: true, width: "150" },
      { index: 8, label: 'Cost (inc)', class: 'colCostINC', active: true, display: true, width: "150" },
      { index: 9, label: 'Tax Code', class: 'colTaxCode', active: true, display: true, width: "150" },
      { index: 10, label: 'Qty Ordered', class: 'colOrdered', active: true, display: true, width: "150" },
      { index: 11, label: 'Qty Received', class: 'colReceived', active: true, display: true, width: "150" },
      { index: 12, label: 'Qty BO', class: 'colBO', active: true, display: true, width: "150" },
      { index: 13, label: 'ETA Date', class: 'colETADate', active: true, display: true, width: "150" },
      { index: 14, label: 'Order Date', class: 'colOrderDate', active: true, display: true, width: "150" },
      { index: 15, label: 'Received Date', class: 'colReceivedDate', active: true, display: true, width: "150" },
    ]

    templateObject.supplierproductreportth.set(reset_data);
  }
  templateObject.init_reset_data();

  // await reportService.getcustomerProductReport(dateAOsf) :

  // --------------------------------------------------------------------------------------------------
  templateObject.initDate = () => {
    Datehandler.initOneMonth();
  };
  templateObject.setDateAs = (dateFrom = null) => {
    templateObject.dateAsAt.set((dateFrom) ? moment(dateFrom).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY"))
  };
  templateObject.initDate();

  // let date = new Date();
  // templateObject.currentYear.set(date.getFullYear());
  // templateObject.nextYear.set(date.getFullYear() + 1);
  // let currentMonth = moment(date).format("DD/MM/YYYY");
  // templateObject.currentMonth.set(currentMonth);

  // templateObject.setDateAs(GlobalFunctions.convertYearMonthDay($('#dateFrom').val()));
  templateObject.loadReport = async (dateFrom, dateTo, ignoreDate) => {
    LoadingOverlay.show();
    templateObject.setDateAs(dateFrom);
    let data = await CachedHttp.get(erpObject.TSupplierProduct, async () => {
      return await reportService.getSupplierProductReport(dateFrom, dateTo, ignoreDate);
    }, {
      useIndexDb: true,
      useLocalStorage: false,
      validate: (cachedResponse) => {
        return false;
      }
    });
    await addVS1Data('TSupplierProduct', JSON.stringify(data.response));
    templateObject.displayReportData(data.response);
  }
  templateObject.getReportData = async function (dateFrom, dateTo, ignoreDate) {

    templateObject.setDateAs(dateFrom);
    getVS1Data('TSupplierProduct').then(function (dataObject) {
      if (dataObject.length == 0) {
        reportService.getSupplierProductReport(dateFrom, dateTo, ignoreDate).then(async function (data) {
          await addVS1Data('TSupplierProduct', JSON.stringify(data));
          templateObject.displayReportData(data);
        }).catch(function (err) {
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        templateObject.displayReportData(data);
      }
    }).catch(function (err) {
      reportService.getSupplierProductReport(dateFrom, dateTo, ignoreDate).then(async function (data) {
        await addVS1Data('TSupplierProduct', JSON.stringify(data));
        templateObject.displayReportData(data);
      }).catch(function (err) {

      });
    });
  }

  templateObject.getReportData(
    GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
    GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
    false
  );
  templateObject.displayReportData = async function (data) {
    var splashArrayReport = new Array();
    let deleteFilter = false;
    if (data.Params.Search.replace(/\s/g, "") == "") {
      deleteFilter = true;
    } else {
      deleteFilter = false;
    };
    for (let i = 0; i < data.tsupplierproduct.length; i++) {
      var dataList = [
        data.tsupplierproduct[i]["Supplier Name"] || "",
        data.tsupplierproduct[i]["Purchase Order Number"] || "",
        data.tsupplierproduct[i]["Transaction Type"] || "",
        data.tsupplierproduct[i]["ProductID"] || "",
        data.tsupplierproduct[i]["Product Description"] || "",
        data.tsupplierproduct[i]["Line Cost (Ex)"] || "",
        data.tsupplierproduct[i]["Line Tax"] || "",
        data.tsupplierproduct[i]["Line Cost (Inc)"] || "",
        data.tsupplierproduct[i]["Tax Code"] || "",
        data.tsupplierproduct[i]["Ordered"] || "",
        data.tsupplierproduct[i]["Shipped"] || "",
        data.tsupplierproduct[i]["BackOrder"] || "",
        data.tsupplierproduct[i]["ETADate"] || "",
        data.tsupplierproduct[i]["Order Date"] || "",
        data.tsupplierproduct[i]["ReceivedDate"] || "",
      ];
      splashArrayReport.push(dataList);
      // templateObject.transactiondatatablerecords.set(splashArrayReport);
    }

    splashArrayReport.sort(GlobalFunctions.sortFunction);

    let start = splashArrayReport[0][0], costEx = 0, tax = 0, costInc = 0;
    let T_AccountName = splashArrayReport[0][0];
    let customerProductReport = [];
    customerProductReport.push([
      GlobalFunctions.generateSpan(T_AccountName, "table-cells text-bold"),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ]);
    for(let i = 0 ; i < splashArrayReport.length ; i ++){
      if(start != splashArrayReport[i][0]) {
        start = splashArrayReport[i][0];
        costEx = costEx >= 0 ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(costEx), "table-cells text-bold") : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(costEx), "table-danger text-bold");
        tax = tax >= 0 ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tax), "table-cells text-bold") : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tax), "table-danger text-bold");
        costInc = costInc >= 0 ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(costInc), "table-cells text-bold") : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(costInc), "table-danger text-bold");
        customerProductReport.push([
          GlobalFunctions.generateSpan(`${T_AccountName} Total`, "table-cells text-bold"),
          "",
          "",
          "",
          "",
          costEx,
          tax,
          costInc,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ]);
        customerProductReport.push([
          GlobalFunctions.generateSpan(splashArrayReport[i][0], "table-cells text-bold"),
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ]);
        costEx = 0, tax = 0, costInc = 0;
      }
      T_AccountName = splashArrayReport[i][0];
      splashArrayReport[i][0] = "";
      let tmpDate = new Date(splashArrayReport[i][2]);
      splashArrayReport[i][1] = GlobalFunctions.generateSpan(splashArrayReport[i][1], 'text-primary');
      splashArrayReport[i][2] = GlobalFunctions.generateSpan(splashArrayReport[i][2], 'text-primary');
      splashArrayReport[i][3] = GlobalFunctions.generateSpan(splashArrayReport[i][3], 'text-primary');
      splashArrayReport[i][4] = GlobalFunctions.generateSpan(splashArrayReport[i][4], 'text-primary');
      splashArrayReport[i][8] = GlobalFunctions.generateSpan(splashArrayReport[i][8], 'text-primary');
      splashArrayReport[i][9] = GlobalFunctions.generateSpan(splashArrayReport[i][9], 'text-primary');
      splashArrayReport[i][10] = GlobalFunctions.generateSpan(splashArrayReport[i][10], 'text-primary');
      splashArrayReport[i][11] = GlobalFunctions.generateSpan(splashArrayReport[i][11], 'text-primary');
      splashArrayReport[i][12] = GlobalFunctions.generateSpan(GlobalFunctions.formatDate(splashArrayReport[i][12]), 'text-primary');
      splashArrayReport[i][13] = GlobalFunctions.generateSpan(GlobalFunctions.formatDate(splashArrayReport[i][13]), 'text-primary');
      splashArrayReport[i][14] = GlobalFunctions.generateSpan(GlobalFunctions.formatDate(splashArrayReport[i][14]), 'text-primary');
      let tmp;
      tmp = splashArrayReport[i][5] - 0;
      costEx += tmp; //costEx
      splashArrayReport[i][5] = (tmp >= 0) ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tmp), 'text-primary') : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tmp), 'text-danger');

      tmp = splashArrayReport[i][6] - 0;
      tax += tmp; //tax
      splashArrayReport[i][6] = (tmp >= 0) ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tmp), 'text-primary') : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tmp), 'text-danger');

      tmp = splashArrayReport[i][7] - 0;
      costInc += tmp; //costInc
      splashArrayReport[i][7] = (tmp >= 0) ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tmp), 'text-primary') : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tmp), 'text-danger');
      customerProductReport.push(splashArrayReport[i]);
    }
    customerProductReport.push([
      GlobalFunctions.generateSpan(`Total ${T_AccountName}`, 'table-cells text-bold'),
      "",
      "",
      "",
      "",
      costEx >= 0 ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(costEx), 'table-cells text-bold') : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(costEx), 'text-danger text-bold'),
      tax >= 0 ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tax), 'table-cells text-bold') : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tax), 'text-danger text-bold'),
      costInc >= 0 ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(costInc), 'table-cells text-bold') : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(costInc), 'text-danger text-bold'),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    templateObject.transactiondatatablerecords.set(customerProductReport);
    if (templateObject.transactiondatatablerecords.get()) {
      setTimeout(function () {
        // MakeNegative();
      }, 100);
    }
    //$('.fullScreenSpin').css('display','none');

    setTimeout(function () {
      $('#tableExport1').DataTable({
        data: customerProductReport,
        searching: false,
        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
        columnDefs: [
          {
            targets: 0,
            className: "colSupplier",
          },
          {
            targets: 1,
            className: "colPoNumber"
          },
          {
            targets: 2,
            className: "colTransType"
          },
          {
            targets: 3,
            className: "colProductID",
          },
          {
            targets: 4,
            className: "colProductDesc",
          },
          {
            targets: 5,
            className: "colCostEX",
          },
          {
            targets: 6,
            className: "colTax",
          },
          {
            targets: 7,
            className: "colCostINC",
          },
          {
            targets: 8,
            className: "colTaxCode",
          },
          {
            targets: 9,
            className: "colOrdered",
          },
          {
            targets: 10,
            className: "colReceived",
          },
          {
            targets: 11,
            className: "colBO",
          },
          {
            targets: 12,
            className: "colETADate",
          },
          {
            targets: 13,
            className: "colOrderDate",
          },
          {
            targets: 14,
            className: "colReceivedDate",
          },
        ],
        select: true,
        destroy: true,
        colReorder: true,
        pageLength: initialDatatableLoad,
        lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
        info: true,
        "bsort": false,
        // responsive: true,
        "order": [],
        action: function () {
          $('#' + currenttablename).DataTable().ajax.reload();
        },

      }).on('page', function () {
        setTimeout(function () {
          // MakeNegative();
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
          // MakeNegative();
        }, 100);
      });
      $(".fullScreenSpin").css("display", "none");
    }, 0);

    $('div.dataTables_filter input').addClass('form-control form-control-sm');
  }


  // ------------------------------------------------------------------------------------------------------
  // $("#tblgeneralledger tbody").on("click", "tr", function () {
  //   var listData = $(this).closest("tr").children('td').eq(8).text();
  //   var checkDeleted = $(this).closest("tr").find(".colStatus").text() || "";

  //   if (listData) {
  //     if (checkDeleted == "Deleted") {
  //       swal("You Cannot View This Transaction", "Because It Has Been Deleted", "info");
  //     } else {
  //       FlowRouter.go("/journalentrycard?id=" + listData);
  //     }
  //   }
  // });


  LoadingOverlay.hide();
});
// Template.supplierproductreport.onRendered(() => {
//   const templateObject = Template.instance();
//   LoadingOverlay.show();

//   templateObject.initDate = () => {
//     Datehandler.initOneMonth();
//   };

//   templateObject.setDateAs = ( dateFrom = null ) => {
//     templateObject.dateAsAt.set( ( dateFrom )? moment(dateFrom).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY") )
//   };


//   templateObject.setReportOptions = async function ( ignoreDate = true, formatDateFrom = new Date(),  formatDateTo = new Date() ) {
//     let defaultOptions = templateObject.reportOptions.get();
//     if (defaultOptions) {
//       defaultOptions.fromDate = formatDateFrom;
//       defaultOptions.toDate = formatDateTo;
//       defaultOptions.ignoreDate = ignoreDate;
//     } else {
//       defaultOptions = {
//         fromDate: moment().subtract(1, "months").format("YYYY-MM-DD"),
//         toDate: moment().format("YYYY-MM-DD"),
//         ignoreDate: true
//       };
//     }
//     $('.edtReportDates').attr('disabled', false)
//     if( ignoreDate == true ){
//       $('.edtReportDates').attr('disabled', true);
//       templateObject.dateAsAt.set(moment().format('DD/MM/YYYY'));
//     }
//     $("#dateFrom").val(moment(defaultOptions.fromDate).format('DD/MM/YYYY'));
//     $("#dateTo").val(moment(defaultOptions.toDate).format('DD/MM/YYYY'));
//     await templateObject.reportOptions.set(defaultOptions);
//     await templateObject.getSupplierProductReportData();

//     // await templateObject.loadReport(
//     //   GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
//     //   GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
//     //   ignoreDate
//     // );
//   };


//   /**
//    * @deprecated since 23 septemeber 2022
//    */
//   templateObject.getSupplierProductReportData = async function () {
//     let data = [];
//     if (!localStorage.getItem('VS1SupplierProduct_Report')) {
//       const options = await templateObject.reportOptions.get();
//       let dateFrom = moment(options.fromDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
//       let dateTo = moment(options.toDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
//       let ignoreDate = options.ignoreDate || false;
//       data = await reportService.getSupplierProductReport( dateFrom, dateTo, ignoreDate);
//       if( data.tsupplierproduct.length > 0 ){
//         localStorage.setItem('VS1SupplierProduct_Report', JSON.stringify(data)||'');
//       }
//     }else{
//       data = JSON.parse(localStorage.getItem('VS1SupplierProduct_Report'));
//     }

//     let reportSummary = data.tsupplierproduct.map(el => {
//       let resultobj = {};
//       Object.entries(el).map(([key, val]) => {
//           resultobj[key.split(" ").join("_").replace(/\W+/g, '')] = val;
//           return resultobj;
//       })
//       return resultobj;
//     })
//     let reportData = [];
//     if( reportSummary.length > 0 ){
//       for (const item of reportSummary ) {
//         let isExist = reportData.filter((subitem) => {
//           if( subitem.Supplier_Name == item.Supplier_Name ){
//               subitem.SubAccounts.push(item)
//               return subitem
//           }
//         });

//         if( isExist.length == 0 ){
//           reportData.push({
//               TotalCostEx: 0,
//               TotalCostInc: 0,
//               TotalTax: 0,
//               SubAccounts: [item],
//               ...item
//           });
//         }
//        LoadingOverlay.hide();
//       }
//     }
//     let useData = reportData.filter((item) => {
//       let TotalCostEx = 0;
//       let TotalCostInc = 0;
//       let TotalTax = 0;
//       item.SubAccounts.map((subitem) => {
//         TotalCostEx += subitem.Line_Cost_Ex;
//         TotalCostInc += subitem.Line_Cost_Inc;
//         TotalTax += subitem.Line_Tax;
//       });
//       item.TotalCostEx = TotalCostEx;
//       item.TotalCostInc = TotalCostInc;
//       item.TotalTax = TotalTax;
//       return item;
//     });
//     templateObject.records.set(useData);


//     if (templateObject.records.get()) {
//       setTimeout(function () {
//         $("td a").each(function () {
//           if ( $(this).text().indexOf("-" + Currency) >= 0 ) {
//             $(this).addClass("text-danger");
//             $(this).removeClass("fgrblue");
//           }
//         });
//         $("td").each(function () {
//           if ($(this).text().indexOf("-" + Currency) >= 0) {
//             $(this).addClass("text-danger");
//             $(this).removeClass("fgrblue");
//           }
//         });
//        LoadingOverlay.hide();
//       }, 1000);
//     }
//   }



//     let reportSummary = data.tsupplierproduct.map(el => {
//       let resultobj = {};
//       Object.entries(el).map(([key, val]) => {
//           resultobj[key.split(" ").join("_").replace(/\W+/g, '')] = val;
//           return resultobj;
//       })
//       return resultobj;
//     })
//     let reportData = [];
//     if( reportSummary.length > 0 ){
//       for (const item of reportSummary ) {
//         let isExist = reportData.filter((subitem) => {
//           if( subitem.Supplier_Name == item.Supplier_Name ){
//               subitem.SubAccounts.push(item)
//               return subitem
//           }
//         });

//         if( isExist.length == 0 ){
//           reportData.push({
//               TotalCostEx: 0,
//               TotalCostInc: 0,
//               TotalTax: 0,
//               SubAccounts: [item],
//               ...item
//           });
//         }
//        LoadingOverlay.hide();
//       }
//     }
//     let useData = reportData.filter((item) => {
//       let TotalCostEx = 0;
//       let TotalCostInc = 0;
//       let TotalTax = 0;
//       item.SubAccounts.map((subitem) => {
//         TotalCostEx += subitem.Line_Cost_Ex;
//         TotalCostInc += subitem.Line_Cost_Inc;
//         TotalTax += subitem.Line_Tax;
//       });
//       item.TotalCostEx = TotalCostEx;
//       item.TotalCostInc = TotalCostInc;
//       item.TotalTax = TotalTax;
//       return item;
//     });
//     templateObject.records.set(useData);


//     if (templateObject.records.get()) {
//       setTimeout(function () {
//         $("td a").each(function () {
//           if ( $(this).text().indexOf("-" + Currency) >= 0 ) {
//             $(this).addClass("text-danger");
//             $(this).removeClass("fgrblue");
//           }
//         });
//         $("td").each(function () {
//           if ($(this).text().indexOf("-" + Currency) >= 0) {
//             $(this).addClass("text-danger");
//             $(this).removeClass("fgrblue");
//           }
//         });
//        LoadingOverlay.hide();
//       }, 1000);
//     }
//   }

//   templateObject.initDate();
//   templateObject.loadReport(
//     GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
//     GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
//     false
//   );
//   templateObject.setDateAs( GlobalFunctions.convertYearMonthDay($('#dateFrom').val()) );

// });

Template.supplierproductreport.events({
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    localStorage.setItem("VS1SupplierProduct_Report", "");
    Meteor._reload.reload();
  },
  "click .btnExportReport": function () {
    alert();
    $(".fullScreenSpin").css("display", "inline-block");
    let utilityService = new UtilityService();
    let templateObject = Template.instance();
    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    var dateTo = new Date($("#dateTo").datepicker("getDate"));

    let formatDateFrom =
      dateFrom.getFullYear() +
      "-" +
      (dateFrom.getMonth() + 1) +
      "-" +
      dateFrom.getDate();
    let formatDateTo =
      dateTo.getFullYear() +
      "-" +
      (dateTo.getMonth() + 1) +
      "-" +
      dateTo.getDate();

    const filename = loggedCompany + "- Supplier Product Report" + ".csv";
    utilityService.exportReportToCsvTable("tableExport", filename, "csv");
    let rows = [];
  },
  "click .btnPrintReport": function (event) {
    playPrintAudio();
    setTimeout(function(){
    let values = [];
    let basedOnTypeStorages = Object.keys(localStorage);
    basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
      let employeeId = storage.split("_")[2];
      return (
        storage.includes("BasedOnType_") &&
        employeeId == localStorage.getItem("mySessionEmployeeLoggedID")
      );
    });
    let i = basedOnTypeStorages.length;
    if (i > 0) {
      while (i--) {
        values.push(localStorage.getItem(basedOnTypeStorages[i]));
      }
    }
    values.forEach((value) => {
      let reportData = JSON.parse(value);
      reportData.HostURL = $(location).attr("protocal")
        ? $(location).attr("protocal") + "://" + $(location).attr("hostname")
        : "http://" + $(location).attr("hostname");
      if (reportData.BasedOnType.includes("P")) {
        if (reportData.FormID == 1) {
          let formIds = reportData.FormIDs.split(",");
          if (formIds.includes("225")) {
            reportData.FormID = 225;
            Meteor.call("sendNormalEmail", reportData);
          }
        } else {
          if (reportData.FormID == 225)
            Meteor.call("sendNormalEmail", reportData);
        }
      }
    });

    document.title = "Supplier Product Report";
    $(".printReport").print({
      title: "Supplier Product Report | " + loggedCompany,
      noPrintSelector: ".addSummaryEditor",
    });
  }, delayTimeAfterSound);
  },
  "keyup #myInputSearch": function (event) {
    $(".table tbody tr").show();
    let searchItem = $(event.target).val();
    if (searchItem != "") {
      var value = searchItem.toLowerCase();
      $(".table tbody tr").each(function () {
        var found = "false";
        $(this).each(function () {
          if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            found = "true";
          }
        });
        if (found == "true") {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    } else {
      $(".table tbody tr").show();
    }
  },
  "blur #myInputSearch": function (event) {
    $(".table tbody tr").show();
    let searchItem = $(event.target).val();
    if (searchItem != "") {
      var value = searchItem.toLowerCase();
      $(".table tbody tr").each(function () {
        var found = "false";
        $(this).each(function () {
          if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            found = "true";
          }
        });
        if (found == "true") {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    } else {
      $(".table tbody tr").show();
    }
  },
  // "click #lastMonth": async function () {
  //   LoadingOverlay.show();
  //   localStorage.setItem('VS1SupplierProduct_Report', '');
  //   let templateObject = Template.instance();
  //   let fromDate = moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD");
  //   let endDate = moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD");
  //   await templateObject.setReportOptions(false, fromDate, endDate);
  //   //LoadingOverlay.hide();
  // },
  // "click #lastQuarter": async function () {
  //   LoadingOverlay.show();
  //   localStorage.setItem('VS1SupplierProduct_Report', '');
  //   let templateObject = Template.instance();
  //   let fromDate = moment().subtract(1, "Q").startOf("Q").format("YYYY-MM-DD");
  //   let endDate = moment().subtract(1, "Q").endOf("Q").format("YYYY-MM-DD");
  //   await templateObject.setReportOptions(false, fromDate, endDate);
  //   //LoadingOverlay.hide();
  // },
  // "click #last12Months": async function () {
  //   LoadingOverlay.show();
  //   localStorage.setItem('VS1SupplierProduct_Report', '');
  //   let templateObject = Template.instance();
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   $("#dateFrom").attr("readonly", false);
  //   $("#dateTo").attr("readonly", false);
  //   var currentDate = new Date();
  //   var begunDate = moment(currentDate).format("DD/MM/YYYY");

  //   let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
  //   let fromDateDay = currentDate.getDate();
  //   if (currentDate.getMonth() + 1 < 10) {
  //     fromDateMonth = "0" + (currentDate.getMonth() + 1);
  //   }
  //   if (currentDate.getDate() < 10) {
  //     fromDateDay = "0" + currentDate.getDate();
  //   }

  //   var fromDate = fromDateDay + "/" + fromDateMonth + "/" + Math.floor(currentDate.getFullYear() - 1);
  //   templateObject.dateAsAt.set(begunDate);
  //   $("#dateFrom").val(fromDate);
  //   $("#dateTo").val(begunDate);

  //   var currentDate2 = new Date();
  //   var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
  //   let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + Math.floor(currentDate2.getMonth() + 1) + "-" + currentDate2.getDate();
  //   await templateObject.setReportOptions(false, getDateFrom, getLoadDate);
  //   //LoadingOverlay.hide();
  // },
  "click #ignoreDate": async () => {
    // $(".fullScreenSpin").css("display", "inline-block");
    // $("#dateFrom").attr("readonly", true);
    // $("#dateTo").attr("readonly", true);
    // localStorage.setItem('VS1SupplierProduct_Report', '');

    let templateObject = Template.instance();
    LoadingOverlay.show();
    localStorage.setItem("VS1SupplierProduct_Report", "");
    $("#dateFrom").attr("readonly", true);
    $("#dateTo").attr("readonly", true);
    templateObject.dateAsAt.set(moment().format('DD/MM/YYYY'));
    templateObject.loadReport(null, null, true);
  },

  // CURRENCY MODULE //
  ...FxGlobalFunctions.getEvents(),
  "click .currency-modal-save": (e) => {
    //$(e.currentTarget).parentsUntil(".modal").modal("hide");
    LoadingOverlay.show();

    let templateObject = Template.instance();

    // Get all currency list
    let _currencyList = templateObject.currencyList.get();

    // Get all selected currencies
    const currencySelected = $(".currency-selector-js:checked");
    let _currencySelectedList = [];
    if (currencySelected.length > 0) {
      $.each(currencySelected, (index, e) => {
        const sellRate = $(e).attr("sell-rate");
        const buyRate = $(e).attr("buy-rate");
        const currencyCode = $(e).attr("currency");
        const currencyId = $(e).attr("currency-id");
        let _currency = _currencyList.find((c) => c.id == currencyId);
        _currency.active = true;
        _currencySelectedList.push(_currency);
      });
    } else {
      let _currency = _currencyList.find((c) => c.code == defaultCurrencyCode);
      _currency.active = true;
      _currencySelectedList.push(_currency);
    }

    _currencyList.forEach((value, index) => {
      if (_currencySelectedList.some((c) => c.id == _currencyList[index].id)) {
        _currencyList[index].active = _currencySelectedList.find(
          (c) => c.id == _currencyList[index].id
        ).active;
      } else {
        _currencyList[index].active = false;
      }
    });

    _currencyList = _currencyList.sort((a, b) => {
      if (a.code == defaultCurrencyCode) {
        return -1;
      }
      return 1;
    });

    // templateObject.activeCurrencyList.set(_activeCurrencyList);
    templateObject.currencyList.set(_currencyList);

    LoadingOverlay.hide();
  },
  "click [href='#noInfoFound']": function () {
    swal({
        title: 'Information',
        text: "No further information available on this column",
        type: 'warning',
        confirmButtonText: 'Ok'
      })
  },


  /**
   * This is the new way to handle any modification on the date fields
   */
   "change #dateTo, change #dateFrom": (e, templateObject) => {
    templateObject.loadReport(
      GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
      GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
      false
    );
  },
  ...Datehandler.getDateRangeEvents()
});

Template.supplierproductreport.helpers({
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
  },
  transactiondatatablerecords: () => {
    return Template.instance().transactiondatatablerecords.get();
  },
  checkZero( value ){
    return ( value == 0 )? '': value;
  },
  formatDate: ( date ) => GlobalFunctions.formatDate(date),
  redirectionType(item) {
    if(item.Transaction_Type === 'Purchase Order') {
      return '/purchaseordercard?id=' + item.PurchaseOrderID;
    } else if (item.Transaction_Type === 'Bill') {
      return '#noInfoFound';
      return '/billcard?id=' + item.PurchaseOrderID;
    } else {
      return '#noInfoFound';
    }
  },
  // FX Module //
  convertAmount: (amount, currencyData) => {
    let currencyList = Template.instance().tcurrencyratehistory.get(); // Get tCurrencyHistory

    if(isNaN(amount)) {
      if (!amount || amount.trim() == "") {
        return "";
      }
      amount = utilityService.convertSubstringParseFloat(amount); // This will remove all currency symbol
    }
    // if (currencyData.code == defaultCurrencyCode) {
    //   // default currency
    //   return amount;
    // }


    // Lets remove the minus character
    const isMinus = amount < 0;
    if (isMinus == true) amount = amount * -1; // make it positive for now

    // // get default currency symbol
    // let _defaultCurrency = currencyList.filter(
    //   (a) => a.Code == defaultCurrencyCode
    // )[0];

    // amount = amount.replace(_defaultCurrency.symbol, "");


    // amount =
    //   isNaN(amount) == true
    //     ? parseFloat(amount.substring(1))
    //     : parseFloat(amount);



    // Get the selected date
    let dateTo = $("#dateTo").val();
    const day = dateTo.split("/")[0];
    const m = dateTo.split("/")[1];
    const y = dateTo.split("/")[2];
    dateTo = new Date(y, m, day);
    dateTo.setMonth(dateTo.getMonth() - 1); // remove one month (because we added one before)


    // Filter by currency code
    currencyList = currencyList.filter((a) => a.Code == currencyData.code);

    // Sort by the closest date
    currencyList = currencyList.sort((a, b) => {
      a = GlobalFunctions.timestampToDate(a.MsTimeStamp);
      a.setHours(0);
      a.setMinutes(0);
      a.setSeconds(0);

      b = GlobalFunctions.timestampToDate(b.MsTimeStamp);
      b.setHours(0);
      b.setMinutes(0);
      b.setSeconds(0);

      var distancea = Math.abs(dateTo - a);
      var distanceb = Math.abs(dateTo - b);
      return distancea - distanceb; // sort a before b when the distance is smaller

      // const adate= new Date(a.MsTimeStamp);
      // const bdate = new Date(b.MsTimeStamp);

      // if(adate < bdate) {
      //   return 1;
      // }
      // return -1;
    });

    const [firstElem] = currencyList; // Get the firest element of the array which is the closest to that date



    let rate = currencyData.code == defaultCurrencyCode ? 1 : firstElem.BuyRate; // Must used from tcurrecyhistory




    amount = parseFloat(amount * rate); // Multiply by the rate
    amount = Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }); // Add commas

    let convertedAmount =
      isMinus == true
        ? `- ${currencyData.symbol} ${amount}`
        : `${currencyData.symbol} ${amount}`;


    return convertedAmount;
  },
  count: (array) => {
    return array.length;
  },
  countActive: (array) => {
    if (array.length == 0) {
      return 0;
    }
    let activeArray = array.filter((c) => c.active == true);
    return activeArray.length;
  },
  supplierproductreportth: () => {
    return Template.instance().supplierproductreportth.get();
  },
  isNegativeAmount(amount) {
    if (Math.sign(amount) === -1) {

      return true;
    }
    return false;
  },
  isOnlyDefaultActive() {
    const array = Template.instance().currencyList.get();
    if (array.length == 0) {
      return false;
    }
    let activeArray = array.filter((c) => c.active == true);

    if (activeArray.length == 1) {

      if (activeArray[0].code == defaultCurrencyCode) {
        return !true;
      } else {
        return !false;
      }
    } else {
      return !false;
    }
  },
  isCurrencyListActive() {
    const array = Template.instance().currencyList.get();
    let activeArray = array.filter((c) => c.active == true);

    return activeArray.length > 0;
  },
  isObject(variable) {
    return typeof variable === "object" && variable !== null;
  },
  currency: () => {
    return Currency;
  },

  formatPrice( amount){

    let utilityService = new UtilityService();
    if( isNaN( amount ) ){
        amount = ( amount === undefined || amount === null || amount.length === 0 ) ? 0 : amount;
        amount = ( amount )? Number(amount.replace(/[^0-9.-]+/g,"")): 0;
    }
      return utilityService.modifynegativeCurrencyFormat(amount)|| 0.00;
  },
  formatTax( amount){

    if( isNaN( amount ) ){
        amount = ( amount === undefined || amount === null || amount.length === 0 ) ? 0 : amount;
        amount = ( amount )? Number(amount.replace(/[^0-9.-]+/g,"")): 0;
    }
      return amount + "%" || "0.00 %";
  },
});

Template.registerHelper("equals", function (a, b) {
  return a === b;
});

Template.registerHelper("notEquals", function (a, b) {
  return a != b;
});

Template.registerHelper("containsequals", function (a, b) {
  return a.indexOf(b) >= 0;
});
