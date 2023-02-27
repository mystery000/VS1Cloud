import { ReportService } from "../report-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
import Datehandler from "../../DateHandler";
import CachedHttp from "../../lib/global/CachedHttp";
import erpObject from "../../lib/global/erp-objects";
import GlobalFunctions from "../../GlobalFunctions";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";
import { Template } from 'meteor/templating';
import "./jobprofitabilityreport.html";

let taxRateService = new TaxRateService();
let reportService = new ReportService();
let utilityService = new UtilityService();
let defaultCurrencyCode = CountryAbbr;

function MakeNegative() {
  $('td').each(function(){
    if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
  });
}

Template.jobprofitabilityreport.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.records = new ReactiveVar([]);
  templateObject.reportOptions = new ReactiveVar([]);
  templateObject.jobprofitabilityreportth = new ReactiveVar([]);

  FxGlobalFunctions.initVars(templateObject);
});

Template.jobprofitabilityreport.onRendered(() => {
  const templateObject = Template.instance();
  LoadingOverlay.show();

  templateObject.init_reset_data = function () {
    let reset_data = [];
    reset_data = [
      { index: 1, label: 'Company', class: 'colCompanyName', active: true, display: true, width: "200" },
      { index: 2, label: 'Job Name', class: 'colJobName', active: true, display: true, width: "120" },
      { index: 3, label: 'Job No', class: 'colJobNo', active: true, display: true, width: "120" },
      { index: 4, label: 'Cost (ex)', class: 'colCostEX', active: true, display: true, width: "120" },
      { index: 5, label: 'Income (ex)', class: 'colIncomeEX', active: true, display: true, width: "120" },
      { index: 6, label: 'Quoted (ex)', class: 'colQuotedEX', active: true, display: true, width: "120" },
      { index: 7, label: 'Diff Inc Cost', class: 'colDiffIncCost', active: true, display: true, width: "120" },
      { index: 8, label: 'Backorders', class: 'colBackorders', active: true, display: true, width: "120" },
      { index: 9, label: 'Credit', class: 'colCredit', active: true, display: true, width: "120" },
      { index: 10, label: 'Profit %', class: 'colProfit%', active: true, display: true, width: "120" },
      { index: 11, label: 'Profit', class: 'colProfit', active: true, display: true, width: "120" },
      // { index: 1, label: 'Company Name', class: 'colCompanyName', active: true, display: true, width: "120" },
      // { index: 2, label: 'Job Name', class: 'colJobName', active: true, display: true, width: "120" },
      // { index: 3, label: 'Job Number', class: 'colJobNumber', active: true, display: true, width: "120" },
      // { index: 4, label: 'Txn Type', class: 'colTxnType', active: true, display: true, width: "120" },
      // { index: 5, label: 'Txn No', class: 'colTxnNo', active: true, display: true, width: "120" },
      // { index: 6, label: 'Cost Ex', class: 'colCostEx', active: true, display: true, width: "120" },
      // { index: 7, label: 'Income Ex', class: 'colIncomeEx', active: true, display: true, width: "120" },
      // { index: 8, label: 'Quoted Ex', class: 'colQuotedEx', active: true, display: true, width: "120" },
      // { index: 9, label: 'Diff Inc Cost', class: 'colDiffIncCost', active: true, display: true, width: "120" },
      // { index: 10, label: '%Diff Inc By Cost', class: 'colDiffIncByCost', active: true, display: true, width: "200" },
      // { index: 11, label: 'Diff Inc Quote', class: 'colDiffIncQuote', active: true, display: true, width: "120" },
      // { index: 12, label: '%Diff Inc By Quote', class: 'colDiffIncByQuote', active: true, display: true, width: "200" },
      // { index: 13, label: 'Backorders', class: 'colBackorders', active: true, display: true, width: "120" },
      // { index: 14, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "120" },
      // { index: 15, label: 'Debit Ex', class: 'colDebitEx', active: true, display: true, width: "120" },
      // { index: 16, label: 'Credit Ex', class: 'colCreditEx', active: true, display: true, width: "120" },
      // { index: 17, label: 'Profit %', class: 'colProfitpercent', active: true, display: true, width: "150" },
      // { index: 18, label: 'Department', class: 'colDepartment', active: true, display: true, width: "120" },
      // { index: 19, label: 'Product', class: 'colProduct', active: true, display: true, width: "120" },
      // { index: 20, label: 'Sub Group', class: 'colSubGroup', active: true, display: true, width: "120" },
      // { index: 21, label: 'Type', class: 'colType', active: true, display: true, width: "120" },
      // { index: 22, label: 'Dept', class: 'colDept', active: true, display: true, width: "120" },
      // { index: 23, label: 'Area', class: 'colArea', active: true, display: true, width: "120" },
      // { index: 24, label: 'Landed Cost', class: 'colLandedCost', active: true, display: true, width: "120" },
      // { index: 25, label: 'Latestcost', class: 'colLatestcost', active: true, display: true, width: "120" },
      // { index: 26, label: 'Diff Inc Landedcost', class: 'colDiffIncLandedcost', active: true, display: true, width: "200" },
      // { index: 27, label: '%Diff Inc By Landedcost', class: 'colDiffIncByLandedcost', active: true, display: true, width: "200" },
      // { index: 28, label: 'Diff Inc Latestcost', class: 'colDiffIncLatestcost', active: true, display: true, width: "200" },
      // { index: 29, label: '%Diff Inc By Latestcost', class: 'colDiffIncByLatestcost', active: true, display: true, width: "200" },
      // { index: 30, label: 'Ordered', class: 'colOrderd', active: true, display: true, width: "120" },
      // { index: 31, label: 'Shipped', class: 'colShipped', active: true, display: true, width: "120" },
      // { index: 32, label: 'Back Ordered', class: 'colBackOrdered', active: true, display: true, width: "120" },
      // { index: 33, label: 'CUSTFLD1', class: 'colCUSTFLD1', active: true, display: true, width: "120" },
      // { index: 34, label: 'CUSTFLD2', class: 'colCUSTFLD2', active: true, display: true, width: "120" },
      // { index: 35, label: 'CUSTFLD3', class: 'colCUSTFLD3', active: true, display: true, width: "120" },
      // { index: 36, label: 'CUSTFLD4', class: 'colCUSTFLD4', active: true, display: true, width: "120" },
      // { index: 37, label: 'CUSTFLD5', class: 'colCUSTFLD5', active: true, display: true, width: "120" },
      // { index: 38, label: 'CUSTFLD6', class: 'colCUSTFLD6', active: true, display: true, width: "120" },
      // { index: 39, label: 'CUSTFLD7', class: 'colCUSTFLD7', active: true, display: true, width: "120" },
      // { index: 40, label: 'CUSTFLD8', class: 'colCUSTFLD8', active: true, display: true, width: "120" },
      // { index: 41, label: 'CUSTFLD9', class: 'colCUSTFLD9', active: true, display: true, width: "120" },
      // { index: 42, label: 'CUSTFLD10', class: 'colCUSTFLD10', active: true, display: true, width: "120" },
      // { index: 43, label: 'CUSTFLD11', class: 'colCUSTFLD11', active: true, display: true, width: "120" },
      // { index: 44, label: 'CUSTFLD12', class: 'colCUSTFLD12', active: true, display: true, width: "120" },
      // { index: 45, label: 'CUSTFLD13', class: 'colCUSTFLD13', active: true, display: true, width: "120" },
      // { index: 46, label: 'CUSTFLD14', class: 'colCUSTFLD14', active: true, display: true, width: "120" },
      // { index: 47, label: 'CUSTFLD15', class: 'colCUSTFLD15', active: true, display: true, width: "120" },
      // { index: 48, label: 'Profit $', class: 'colProfitdoller', active: true, display: true, width: "120" },
      // { index: 49, label: 'Trans Date', class: 'colTransDate', active: true, display: true, width: "200" },
      // { index: 50, label: 'Supplier ID', class: 'colSupplierID', active: false, display: true, width: "120" },
    ]

    templateObject.jobprofitabilityreportth.set(reset_data);
  }
  templateObject.init_reset_data();

  // await reportService.getBalanceSheetReport(dateAOsf) :

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
  templateObject.loadReport = async (dateFrom = null, dateTo = null, ignoreDate = false) => {
    LoadingOverlay.show();
    templateObject.setDateAs(dateFrom);
    let data = await CachedHttp.get(erpObject.TJobProfitability, async () => {
      return await reportService.getJobProfitabilityReport(dateFrom, dateTo, ignoreDate);
    }, {
      useIndexDb: true,
      useLocalStorage: false,
      validate: (cachedResponse) => {
        return false;
      }
    });
    addVS1Data('TJobProfitability', JSON.stringify(data.response));
    templateObject.displayReportData(data.response);
    LoadingOverlay.hide();
  }
  templateObject.getReportData = async function (dateFrom, dateTo, ignoreDate) {

    templateObject.setDateAs(dateFrom);
    getVS1Data('TJobProfitability').then(function (dataObject) {
      if (dataObject.length == 0) {
        reportService.getJobProfitabilityReport(dateFrom, dateTo, ignoreDate).then(async function (data) {
          await addVS1Data('TJobProfitability', JSON.stringify(data));
          templateObject.displayReportData(data);
        }).catch(function (err) {
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        templateObject.displayReportData(data);
      }
    }).catch(function (err) {
      reportService.getJobProfitabilityReport(dateFrom, dateTo, ignoreDate).then(async function (data) {
        await addVS1Data('TJobProfitability', JSON.stringify(data));
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

    for (let i = 0; i < data.tjobprofitability.length; i++) {
      var dataList = [
        data.tjobprofitability[i].CompanyName || "",
        data.tjobprofitability[i].JobName || "",
        data.tjobprofitability[i].JobNumber || "",
        data.tjobprofitability[i].CostEx || "",
        data.tjobprofitability[i].IncomeEx || "",
        data.tjobprofitability[i].Quotedex || "",
        data.tjobprofitability[i].DiffIncome_Cost || "",
        data.tjobprofitability[i].Backorders || "",
        data.tjobprofitability[i].CreditEx || "",
        data.tjobprofitability[i].ProfitPercent || "",
        data.tjobprofitability[i].ProfitDollars || "",
        // data.tjobprofitability[i].CompanyName || "",
        // data.tjobprofitability[i].JobName || "",
        // data.tjobprofitability[i].JobNumber || "",
        // data.tjobprofitability[i].TransactionType || "",
        // data.tjobprofitability[i].TransactionNo || "",
        // data.tjobprofitability[i].CostEx || "",
        // data.tjobprofitability[i].IncomeEx || "",
        // data.tjobprofitability[i].Quotedex || "",
        // data.tjobprofitability[i].DiffIncome_Cost || "",
        // data.tjobprofitability[i].PercentDiffIncomebyCost || "",
        // data.tjobprofitability[i].DiffIncome_Quote || "",
        // data.tjobprofitability[i].PercentDiffIncomebyQuote || "",
        // data.tjobprofitability[i].Backorders || "",
        // data.tjobprofitability[i].AccountName || "",
        // data.tjobprofitability[i].DebitEx || "",
        // data.tjobprofitability[i].CreditEx || "",
        // data.tjobprofitability[i].ProfitPercent || "",
        // data.tjobprofitability[i].Department || "",
        // data.tjobprofitability[i].ProductID || "",
        // data.tjobprofitability[i].ProductName || "",
        // data.tjobprofitability[i].ClientID || "",
        // data.tjobprofitability[i].Details || "",
        // data.tjobprofitability[i].Area || "",
        // data.tjobprofitability[i].LandedCost || "",
        // data.tjobprofitability[i].Latestcost || "",
        // data.tjobprofitability[i].DiffIncome_Landedcost || "",
        // data.tjobprofitability[i].PercentDiffIncomebyLandedcost || "",
        // data.tjobprofitability[i].DiffIncome_Latestcost || "",
        // data.tjobprofitability[i].PercentDiffIncomebyLatestcost || "",
        // data.tjobprofitability[i].QtyOrdered || "",
        // data.tjobprofitability[i].QtyShipped || "",
        // data.tjobprofitability[i].QtyBackOrder || "",
        // data.tjobprofitability[i].CUSTFLD1 || "",
        // data.tjobprofitability[i].CUSTFLD2 || "",
        // data.tjobprofitability[i].CUSTFLD3 || "",
        // data.tjobprofitability[i].CUSTFLD4 || "",
        // data.tjobprofitability[i].CUSTFLD5 || "",
        // data.tjobprofitability[i].CUSTFLD6 || "",
        // data.tjobprofitability[i].CUSTFLD7 || "",
        // data.tjobprofitability[i].CUSTFLD8|| "",
        // data.tjobprofitability[i].CUSTFLD9 || "",
        // data.tjobprofitability[i].CUSTFLD10 || "",
        // data.tjobprofitability[i].CUSTFLD11 || "",
        // data.tjobprofitability[i].CUSTFLD12 || "",
        // data.tjobprofitability[i].CUSTFLD13 || "",
        // data.tjobprofitability[i].CUSTFLD14 || "",
        // data.tjobprofitability[i].CUSTFLD15 || "",
        // data.tjobprofitability[i].ProfitDollars || "",
        // data.tjobprofitability[i].Transdate || "",
        // data.tjobprofitability[i].SupplierName || "",
      ];
      splashArrayReport.push(dataList);
    }
    let T_AccountName = "", j, customerProductReport = [];
    function currencySpan(tmp){
      return (tmp >= 0) ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tmp), 'text-success') : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tmp), 'text-danger');
    }
    for(let i = 0 ; i < splashArrayReport.length ; i ++){
      if(T_AccountName != splashArrayReport[i][0]) {
        T_AccountName = splashArrayReport[i][0];
        customerProductReport.push([
          GlobalFunctions.generateSpan(`${T_AccountName}`, "table-cells text-bold"),
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
        ]);
      }
      T_AccountName = splashArrayReport[i][0];
      splashArrayReport[i][0] = "";

      splashArrayReport[i][1] = GlobalFunctions.generateSpan(splashArrayReport[i][1], 'text-primary');
      splashArrayReport[i][2] = GlobalFunctions.generateSpan(splashArrayReport[i][2], 'text-primary');
      splashArrayReport[i][7] = GlobalFunctions.generateSpan(splashArrayReport[i][7], 'text-primary');
      splashArrayReport[i][9] = GlobalFunctions.generateSpan(GlobalFunctions.covert2Comma(splashArrayReport[i][9] - 0) + '%', 'text-primary');

      splashArrayReport[i][3] = currencySpan(splashArrayReport[i][3] - 0);
      splashArrayReport[i][4] = currencySpan(splashArrayReport[i][4] - 0);
      splashArrayReport[i][5] = currencySpan(splashArrayReport[i][5] - 0);
      splashArrayReport[i][6] = currencySpan(splashArrayReport[i][6] - 0);
      splashArrayReport[i][8] = currencySpan(splashArrayReport[i][8] - 0);
      splashArrayReport[i][10] = currencySpan(splashArrayReport[i][10] - 0);

      customerProductReport.push(splashArrayReport[i]);
    }
    templateObject.records.set(customerProductReport);
    console.log(customerProductReport);
    if (templateObject.records.get()) {
      setTimeout(function () {
        MakeNegative();
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
            className: "colCompanyName",
          },
          {
            targets: 1,
            className: "colJobName",
          },
          {
            targets: 2,
            className: "colJobNo",
          },
          {
            targets: 3,
            className: "colCostEX",
          },
          {
            targets: 4,
            className: "colIncomeEX",
          },
          {
            targets: 5,
            className: "colQuotedEX",
          },
          {
            targets: 6,
            className: "colDiffIncCost",
          },
          {
            targets: 7,
            className: "colBackorders",
          },
          {
            targets: 8,
            className: "colCredit",
          },
          {
            targets: 9,
            className: "colProfit%",
          },
          {
            targets: 10,
            className: "colProfit",
          },
          // {
          //   targets: 0,
          //   className: "colCompanyName",
          // },
          // {
          //   targets: 1,
          //   className: "colJobName"
          // },
          // {
          //   targets: 2,
          //   className: "colJobNumber"
          // },
          // {
          //   targets: 3,
          //   className: "colTxnType",
          // },
          // {
          //   targets: 4,
          //   className: "colTxnNo",
          // },
          // {
          //   targets: 5,
          //   className: "colCostEx",
          // },
          // {
          //   targets: 6,
          //   className: "colIncomeEx",
          // },
          // {
          //   targets: 7,
          //   className: "colQuotedEx",
          // },
          // {
          //   targets: 8,
          //   className: "colDiffIncCost",
          // },
          // {
          //   targets: 9,
          //   className: "colDiffIncByCost",
          // },
          // {
          //   targets: 10,
          //   className: "colDiffIncQuote",
          // },
          // {
          //   targets: 11,
          //   className: "colDiffIncByQuote",
          // },
          // {
          //   targets: 12,
          //   className: "colBackorders",
          // },
          // {
          //   targets: 13,
          //   className: "colAccountName",
          // },
          // {
          //   targets: 14,
          //   className: "colDebitEx"
          // },
          // {
          //   targets: 15,
          //   className: "colCreditEx"
          // },
          // {
          //   targets: 16,
          //   className: "colProfitpercent",
          // },
          // {
          //   targets: 17,
          //   className: "colDepartment",
          // },
          // {
          //   targets: 18,
          //   className: "colProduct",
          // },
          // {
          //   targets: 19,
          //   className: "colSubGroup",
          // },
          // {
          //   targets: 20,
          //   className: "colType",
          // },
          // {
          //   targets: 21,
          //   className: "colDept",
          // },
          // {
          //   targets: 22,
          //   className: "colArea",
          // },
          // {
          //   targets: 23,
          //   className: "colLandedCost",
          // },
          // {
          //   targets: 24,
          //   className: "colLatestcost",
          // },
          // {
          //   targets: 25,
          //   className: "colDiffIncLandedcost",
          // },
          // {
          //   targets: 26,
          //   className: "colDiffIncByLandedcost",
          // },
          // {
          //   targets: 27,
          //   className: "colDiffIncLatestcost"
          // },
          // {
          //   targets: 28,
          //   className: "colDiffIncByLatestcost"
          // },
          // {
          //   targets: 29,
          //   className: "colOrderd",
          // },
          // {
          //   targets: 30,
          //   className: "colShipped",
          // },
          // {
          //   targets: 31,
          //   className: "colBackOrdered",
          // },
          // {
          //   targets: 32,
          //   className: "colCUSTFLD1",
          // },
          // {
          //   targets: 33,
          //   className: "colCUSTFLD2",
          // },
          // {
          //   targets: 34,
          //   className: "colCUSTFLD3",
          // },
          // {
          //   targets: 35,
          //   className: "colCUSTFLD4",
          // },
          // {
          //   targets: 36,
          //   className: "colCUSTFLD5",
          // },
          // {
          //   targets: 37,
          //   className: "colCUSTFLD6",
          // },
          // {
          //   targets: 38,
          //   className: "colCUSTFLD7",
          // },
          // {
          //   targets: 39,
          //   className: "colCUSTFLD8",
          // },
          // {
          //   targets: 40,
          //   className: "colCUSTFLD9"
          // },
          // {
          //   targets: 41,
          //   className: "colCUSTFLD10"
          // },
          // {
          //   targets: 42,
          //   className: "colCUSTFLD11",
          // },
          // {
          //   targets: 43,
          //   className: "colCUSTFLD12",
          // },
          // {
          //   targets: 44,
          //   className: "colCUSTFLD13",
          // },
          // {
          //   targets: 45,
          //   className: "colCUSTFLD14",
          // },
          // {
          //   targets: 46,
          //   className: "colCUSTFLD15",
          // },
          // {
          //   targets: 47,
          //   className: "colProfitdoller",
          // },
          // {
          //   targets: 48,
          //   className: "colTransDate",
          // },
          // {
          //   targets: 49,
          //   className: "colSupplierID hiddenColumn",
          // },
        ],
        select: true,
        destroy: true,
        colReorder: true,
        pageLength: initialDatatableLoad,
        lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
        info: true,
        // responsive: true,
        "bsort": false,
        "order": [],
        action: function () {
          $('#tableExport').DataTable().ajax.reload();
        },

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

// Template.jobprofitabilityreport.onRendered(() => {
//   const templateObject = Template.instance();
//   LoadingOverlay.show();

//   let reset_data = [
//     { index: 1, label: 'Company Name', class: 'colCompanyName', active: true, display: true, width: "120" },
//     { index: 2, label: 'Job Name', class: 'colJobName', active: true, display: true, width: "120" },
//     { index: 3, label: 'Job Number', class: 'colJobNumber', active: true, display: true, width: "120" },
//     { index: 4, label: 'Txn Type', class: 'colTxnType', active: true, display: true, width: "120" },
//     { index: 5, label: 'Txn No', class: 'colTxnNo', active: true, display: true, width: "120" },
//     { index: 6, label: 'Cost Ex', class: 'colCostEx', active: true, display: true, width: "120" },
//     { index: 7, label: 'Income Ex', class: 'colIncomeEx', active: true, display: true, width: "120" },
//     { index: 8, label: 'Quoted Ex', class: 'colQuotedEx', active: true, display: true, width: "120" },
//     { index: 9, label: 'Diff Inc Cost', class: 'colDiffIncCost', active: true, display: true, width: "120" },
//     { index: 10, label: '%Diff Inc By Cost', class: 'colDiffIncByCost', active: true, display: true, width: "120" },
//     { index: 11, label: 'Diff Inc Quote', class: 'colDiffIncQuote', active: true, display: true, width: "120" },
//     { index: 12, label: '%Diff Inc By Quote', class: 'colDiffIncByQuote', active: true, display: true, width: "120" },
//     { index: 13, label: 'Backorders', class: 'colBackorders', active: true, display: true, width: "120" },
//     { index: 14, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "120" },
//     { index: 15, label: 'Debit Ex', class: 'colDebitEx', active: true, display: true, width: "120" },
//     { index: 16, label: 'Credit Ex', class: 'colCreditEx', active: true, display: true, width: "120" },
//     { index: 17, label: 'Profit %', class: 'colProfitpercent', active: true, display: true, width: "120" },
//     { index: 18, label: 'Department', class: 'colDepartment', active: true, display: true, width: "120" },
//     { index: 19, label: 'Product', class: 'colProduct', active: true, display: true, width: "120" },
//     { index: 20, label: 'Sub  Group', class: 'colSubGroup', active: true, display: true, width: "120" },
//     { index: 21, label: 'Type', class: 'colType', active: true, display: true, width: "120" },
//     { index: 22, label: 'Dept', class: 'colDept', active: true, display: true, width: "120" },
//     { index: 23, label: 'Area', class: 'colArea', active: true, display: true, width: "120" },
//     { index: 24, label: 'Landed Cost', class: 'colLandedCost', active: true, display: true, width: "120" },
//     { index: 25, label: 'Latestcost', class: 'colLatestcost', active: true, display: true, width: "120" },
//     { index: 26, label: 'First Name', class: 'colFirstName', active: true, display: true, width: "120" },
//     { index: 27, label: 'Last Name', class: 'colLastName', active: true, display: true, width: "120" },
//     { index: 28, label: 'Diff Inc Landedcost', class: 'colDiffIncLandedcost', active: true, display: true, width: "120" },
//     { index: 29, label: '%Diff Inc By Landedcost', class: 'colDiffIncByLandedcost', active: true, display: true, width: "120" },
//     { index: 30, label: 'Diff Inc Latestcost', class: 'colDiffIncLatestcost', active: true, display: true, width: "120" },
//     { index: 31, label: '%Diff Inc By Latestcost', class: 'colDiffIncByLatestcost', active: true, display: true, width: "120" },
//     { index: 32, label: 'Ordered', class: 'colOrderd', active: true, display: true, width: "120" },
//     { index: 33, label: 'Shipped', class: 'colShipped', active: true, display: true, width: "120" },
//     { index: 34, label: 'Back Ordered', class: 'colBackOrdered', active: true, display: true, width: "120" },
//     { index: 35, label: 'CUSTFLD1', class: 'colCUSTFLD1', active: true, display: true, width: "120" },
//     { index: 36, label: 'CUSTFLD2', class: 'colCUSTFLD2', active: true, display: true, width: "120" },
//     { index: 37, label: 'CUSTFLD3', class: 'colCUSTFLD3', active: true, display: true, width: "120" },
//     { index: 39, label: 'CUSTFLD4', class: 'colCUSTFLD4', acticve: true, display: true, width: "120" },
//     { index: 40, label: 'CUSTFLD5', class: 'colCUSTFLD5', active: true, display: true, width: "120" },
//     { index: 41, label: 'CUSTFLD6', class: 'colCUSTFLD6', active: true, display: true, width: "120" },
//     { index: 42, label: 'CUSTFLD7', class: 'colCUSTFLD7', active: true, display: true, width: "120" },
//     { index: 43, label: 'CUSTFLD8', class: 'colCUSTFLD8', active: true, display: true, width: "120" },
//     { index: 44, label: 'JobNotes', class: 'colJobNotes', active: true, display: true, width: "120" },
//     { index: 45, label: 'CUSTFLD9', class: 'colCUSTFLD9', active: true, display: true, width: "120" },
//     { index: 46, label: 'CUSTFLD10', class: 'colCUSTFLD10', active: true, display: true, width: "120" },
//     { index: 47, label: 'CUSTFLD11', class: 'colCUSTFLD11', active: true, display: true, width: "120" },
//     { index: 48, label: 'CUSTFLD12', class: 'colCUSTFLD12', active: true, display: true, width: "120" },
//     { index: 49, label: 'CUSTFLD13', class: 'colCUSTFLD13', active: true, display: true, width: "120" },
//     { index: 50, label: 'CUSTFLD14', class: 'colCUSTFLD14', active: true, display: true, width: "120" },
//     { index: 51, label: 'CUSTFLD15', class: 'colCUSTFLD15', active: true, display: true, width: "120" },
//     { index: 52, label: 'Profit $', class: 'colProfitdoller', active: true, display: true, width: "120" },
//   ]
//   templateObject.jobprofitabilityreportth.set(reset_data);

//   templateObject.initDate = () => {
//     Datehandler.initOneMonth();
//   };

//   templateObject.setDateAs = (dateFrom = null) => {
//     templateObject.dateAsAt.set((dateFrom) ? moment(dateFrom).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY"))
//   };

//   templateObject.setReportOptions = async function (ignoreDate = true, formatDateFrom = new Date(), formatDateTo = new Date()) {
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
//     if (ignoreDate == true) {
//       $('.edtReportDates').attr('disabled', true);
//       templateObject.dateAsAt.set("Current Date");
//     }
//     $("#dateFrom").val(moment(defaultOptions.fromDate).format('DD/MM/YYYY'));
//     $("#dateTo").val(moment(defaultOptions.toDate).format('DD/MM/YYYY'));
//     templateObject.dateAsAt.set(moment(defaultOptions.toDate).format('DD/MM/YYYY'));
//     await templateObject.reportOptions.set(defaultOptions);
//     await templateObject.getJobProfitabilityReportData();
//   };

  // templateObject.loadReport = async (dateFrom = null, dateTo = null, ignoreDate = false) => {
  //   LoadingOverlay.show();
  //   templateObject.setDateAs(dateFrom);
  //   // let data = [];
  //   // if (!localStorage.getItem('VS1JobProfitability_Report')) {
  //   //   const options = await templateObject.reportOptions.get();
  //   //   let dateFrom = moment(options.fromDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
  //   //   let dateTo = moment(options.toDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
  //   //   let ignoreDate = options.ignoreDate || false;
  //   //   data = await reportService.getJobProfitabilityReport( dateFrom, dateTo, ignoreDate);
  //   //   if( data.tjobprofitability.length > 0 ){
  //   //     localStorage.setItem('VS1JobProfitability_Report', JSON.stringify(data)||'');
  //   //   }
  //   // }else{
  //   //   data = JSON.parse(localStorage.getItem('VS1JobProfitability_Report'));
  //   // }
  //
  //   // const options = await templateObject.reportOptions.get();
  //   // let dateFrom = moment(options.fromDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
  //   // let dateTo = moment(options.toDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
  //   // let ignoreDate = options.ignoreDate || false;
  //
  //   let data = await CachedHttp.get(erpObject.TJobProfitability, async () => {
  //     return await reportService.getJobProfitabilityReport(dateFrom, dateTo, ignoreDate);
  //   }, {
  //     useIndexDb: true,
  //     useLocalStorage: false,
  //     validate: (cachedResponse) => {
  //       return false;
  //     }
  //   });
  //
  //   data = data.response;


//     let reportData = [];
//     if (data.tjobprofitability.length > 0) {
//       for (const item of data.tjobprofitability) {
//         let isExist = reportData.filter((subitem) => {
//           if (subitem.CompanyName == item.CompanyName) {
//             subitem.SubAccounts.push(item)
//             return subitem
//           }
//         });

//         if (isExist.length == 0) {
//           reportData.push({
//             // TotalOrCost: 0,
//             // TotalCrCost: 0,
//             SubAccounts: [item],
//             ...item
//           });
//         }
//         $(".fullScreenSpin").css("display", "none");
//       }
//     }
//     // let useData = reportData.filter((item) => {
//     //   let TotalOrCost = 0;
//     //   let TotalCrCost = 0;
//     //   item.SubAccounts.map((subitem) => {
//     //     TotalOrCost += subitem.Linecost;
//     //     TotalCrCost += subitem.linecostinc;
//     //   });
//     //   item.TotalOrCost = TotalOrCost;
//     //   item.TotalCrCost = TotalCrCost;
//     //   return item;
//     // });
//     templateObject.records.set(reportData);
//     if (templateObject.records.get()) {
//       setTimeout(function () {
//         $("td a").each(function () {
//           if ($(this).text().indexOf("-" + Currency) >= 0) {
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
//         $(".fullScreenSpin").css("display", "none");
//       }, 1000);
//     }

//     LoadingOverlay.hide();
//   }

//   // templateObject.setReportOptions();


//   templateObject.initDate();

//   templateObject.loadReport(
//     GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
//     GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
//     false
//   );
//   templateObject.setDateAs(GlobalFunctions.convertYearMonthDay($('#dateFrom').val()))
//   LoadingOverlay.hide();
// });

Template.jobprofitabilityreport.events({
  'click .chkDatatable': function (event) {
    let columnDataValue = $(event.target).closest("div").find(".divcolumn").attr('valueupdate');
    if ($(event.target).is(':checked')) {
      $('.' + columnDataValue).addClass('showColumn');
      $('.' + columnDataValue).removeClass('hiddenColumn');
    } else {
      $('.' + columnDataValue).addClass('hiddenColumn');
      $('.' + columnDataValue).removeClass('showColumn');
    }
  },
  'click .btnOpenReportSettings': () => {
    let templateObject = Template.instance();
    // let currenttranstablename = templateObject.data.tablename||";
    $(`thead tr th`).each(function (index) {
      var $tblrow = $(this);
      var colWidth = $tblrow.width() || 0;
      var colthClass = $tblrow.attr('data-class') || "";
      $('.rngRange' + colthClass).val(colWidth);
    });
    $('.' + templateObject.data.tablename + '_Modal').modal('toggle');
  },
  'change .custom-range': async function (event) {
    //   const tableHandler = new TableHandler();
    let range = $(event.target).val() || 0;
    let colClassName = $(event.target).attr("valueclass");
    await $('.' + colClassName).css('width', range);
    //   await $('.colAccountTree').css('width', range);
    $('.dataTable').resizable();
  },
  "click .btnRefresh": function () {
    LoadingOverlay.show();
    localStorage.setItem("VS1JobProfitability_Report", "");
    Meteor._reload.reload();
  },
  "click .btnExportReport": function () {
    LoadingOverlay.show();
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

    const filename = loggedCompany + "- Job Profitability Report" + ".csv";
    utilityService.exportReportToCsvTable("tableExport", filename, "csv");
    let rows = [];
  },
  "click .btnPrintReport": function (event) {
    playPrintAudio();
    setTimeout(function () {
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

      document.title = "Job Profitability Report";
      $(".printReport").print({
        title: "Job Profitability Report | " + loggedCompany,
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
  // "click #lastMonth": function () {
  //   let templateObject = Template.instance();
  //   LoadingOverlay.show();
  //   localStorage.setItem("VS1GeneralLedger_Report", "");
  //   $("#dateFrom").attr("readonly", false);
  //   $("#dateTo").attr("readonly", false);
  //   var currentDate = new Date();

  //   var prevMonthLastDate = new Date(
  //     currentDate.getFullYear(),
  //     currentDate.getMonth(),
  //     0
  //   );
  //   var prevMonthFirstDate = new Date(
  //     currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1),
  //     (currentDate.getMonth() - 1 + 12) % 12,
  //     1
  //   );

  //   var formatDateComponent = function (dateComponent) {
  //     return (dateComponent < 10 ? "0" : "") + dateComponent;
  //   };

  //   var formatDate = function (date) {
  //     return (
  //       formatDateComponent(date.getDate()) +
  //       "/" +
  //       formatDateComponent(date.getMonth() + 1) +
  //       "/" +
  //       date.getFullYear()
  //     );
  //   };

  //   var formatDateERP = function (date) {
  //     return (
  //       date.getFullYear() +
  //       "-" +
  //       formatDateComponent(date.getMonth() + 1) +
  //       "-" +
  //       formatDateComponent(date.getDate())
  //     );
  //   };

  //   var fromDate = formatDate(prevMonthFirstDate);
  //   var toDate = formatDate(prevMonthLastDate);

  //   $("#dateFrom").val(fromDate);
  //   $("#dateTo").val(toDate);

  //   var getLoadDate = formatDateERP(prevMonthLastDate);
  //   let getDateFrom = formatDateERP(prevMonthFirstDate);
  //   templateObject.dateAsAt.set(fromDate);

  //   // templateObject.getGeneralLedgerReports(getDateFrom, getLoadDate, false);
  // },
  // "click #lastQuarter": function () {
  //   let templateObject = Template.instance();
  //   LoadingOverlay.show();
  //   localStorage.setItem("VS1GeneralLedger_Report", "");
  //   $("#dateFrom").attr("readonly", false);
  //   $("#dateTo").attr("readonly", false);
  //   var currentDate = new Date();
  //   var begunDate = moment(currentDate).format("DD/MM/YYYY");

  //   var begunDate = moment(currentDate).format("DD/MM/YYYY");
  //   function getQuarter(d) {
  //     d = d || new Date();
  //     var m = Math.floor(d.getMonth() / 3) + 2;
  //     return m > 4 ? m - 4 : m;
  //   }

  //   var quarterAdjustment = (moment().month() % 3) + 1;
  //   var lastQuarterEndDate = moment()
  //     .subtract({ months: quarterAdjustment })
  //     .endOf("month");
  //   var lastQuarterStartDate = lastQuarterEndDate
  //     .clone()
  //     .subtract({ months: 2 })
  //     .startOf("month");

  //   var lastQuarterStartDateFormat =
  //     moment(lastQuarterStartDate).format("DD/MM/YYYY");
  //   var lastQuarterEndDateFormat =
  //     moment(lastQuarterEndDate).format("DD/MM/YYYY");

  //   templateObject.dateAsAt.set(lastQuarterStartDateFormat);
  //   $("#dateFrom").val(lastQuarterStartDateFormat);
  //   $("#dateTo").val(lastQuarterEndDateFormat);

  //   let fromDateMonth = getQuarter(currentDate);
  //   var quarterMonth = getQuarter(currentDate);
  //   let fromDateDay = currentDate.getDate();

  //   var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
  //   let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
  //   // templateObject.getGeneralLedgerReports(getDateFrom, getLoadDate, false);
  // },
  // "click #last12Months": function () {
  //   let templateObject = Template.instance();
  //   LoadingOverlay.show();
  //   localStorage.setItem("VS1GeneralLedger_Report", "");
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

  //   var fromDate =
  //     fromDateDay +
  //     "/" +
  //     fromDateMonth +
  //     "/" +
  //     Math.floor(currentDate.getFullYear() - 1);
  //   templateObject.dateAsAt.set(begunDate);
  //   $("#dateFrom").val(fromDate);
  //   $("#dateTo").val(begunDate);

  //   var currentDate2 = new Date();
  //   var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
  //   let getDateFrom =
  //     Math.floor(currentDate2.getFullYear() - 1) +
  //     "-" +
  //     Math.floor(currentDate2.getMonth() + 1) +
  //     "-" +
  //     currentDate2.getDate();
  //   // templateObject.getGeneralLedgerReports(getDateFrom, getLoadDate, false);
  // },
  "click #ignoreDate": (e, templateObject) => {
    // LoadingOverlay.show();
    localStorage.setItem("VS1GeneralLedger_Report", "");
    $("#dateFrom").attr("readonly", true);
    $("#dateTo").attr("readonly", true);
    templateObject.dateAsAt.set("Current Date");
    templateObject.loadReport(null, null,
      false
    );
  },

  // CURRENCY MODULE
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
    templateObject.dateAsAt.set($('#dateTo').val());
  },
  ...Datehandler.getDateRangeEvents()
});

Template.jobprofitabilityreport.helpers({
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
  },
  records: () => {
    return Template.instance().records.get();
  },

  redirectionType(item) {
    if (item.TransactionType === 'Invoice') {
      return '/invoicecard?id=' + item.SaleID;
    } else if (item.TransactionType === 'Quote') {
      return 'quotecard?id=' + item.saleId;
    } else if (item.TransactionType === 'Bill') {
      return '/billcard?id=' + item.saleId;
    } else if (item.TransactionType === 'Timesheet') {
      return '#noInfoFound';
    } else if (item.TransactionType === 'Refund') {
      return 'refundcard?id=' + item.SaleID;
    } else if (item.TransactionType === 'Purchase Order') {
      return '/purchaseordercard?id=' + item.saleId;
    } else {
      return '#noInfoFound';
    }
  },
  formatPrice(amount) {
    let utilityService = new UtilityService();
    if (isNaN(amount)) {
      amount = (amount === undefined || amount === null || amount.length === 0) ? 0 : amount;
      amount = (amount) ? Number(amount.replace(/[^0-9.-]+/g, "")) : 0;
    }
    return (amount != 0) ? utilityService.modifynegativeCurrencyFormat(amount) : "" || "";
  },
  formatPercent(percentVal) {
    if (isNaN(percentVal)) {
      percentVal = (percentVal === undefined || percentVal === null || percentVal.length === 0) ? 0 : percentVal;
      percentVal = (percentVal) ? Number(percentVal.replace(/[^0-9.-]+/g, "")) : 0;
    }
    return (percentVal != 0) ? `${parseFloat(percentVal).toFixed(2)}%` : '';
  },
  checkZero(value) {
    return (value == 0) ? '' : value;
  },
  formatDate: (date) => {
    return (date) ? moment(date).format("YYYY/MM/DD") : '';
  },
  // FX Module //
  convertAmount: (amount, currencyData) => {
    let currencyList = Template.instance().tcurrencyratehistory.get(); // Get tCurrencyHistory

    if (isNaN(amount)) {
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
  currencyList: () => {
    return Template.instance().currencyList.get();
  },
  jobprofitabilityreportth: () => {
    return Template.instance().jobprofitabilityreportth.get();
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
