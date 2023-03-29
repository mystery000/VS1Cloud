import {ReactiveVar} from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import "./reportcard.html"
import { TaxRateService } from '../../settings/settings-service';
import { SideBarService } from '../../js/sidebar-service';
import { ReportService } from '../report-service';
import { UtilityService } from '../../utility-service';
import FxGlobalFunctions from '../../packages/currency/FxGlobalFunctions';
import Datehandler from '../../DateHandler';

let sideBarService = new SideBarService();
let reportService = new ReportService();
let utilityService = new UtilityService();
let taxRateService = new TaxRateService();

let defaultCurrencyCode = CountryAbbr;

Template.reportcard.onCreated(function(){
    let templateObject = Template.instance();
    templateObject.reportrecords = new ReactiveVar();
    templateObject.transactiondatatablerecords = new ReactiveVar([]);
    templateObject.grandrecords = new ReactiveVar();
    templateObject.dateAsAt = new ReactiveVar();
    templateObject.deptrecords = new ReactiveVar();
    templateObject.agedpayablesth = new ReactiveVar([]);
  
    FxGlobalFunctions.initVars(templateObject);
    templateObject.reportOptions = new ReactiveVar();

})

Template.reportcard.onRendered(function() {
    let templateObject = Template.instance();
    LoadingOverlay.show();
  
    templateObject.init_reset_data = function () {
      let reset_data = [];
      reset_data = [
          { index: 1, label: 'Contact', class: 'colName', active: true, display: true, width: "150" },
          { index: 2, label: 'Type', class: 'colType', active: true, display: true, width: "150" },
          { index: 3, label: 'PO No.', class: 'colPONumber', active: true, display: true, width: "150" },
          { index: 4, label: 'Due Date', class: 'colDueDate', active: true, display: true, width: "150" },
          { index: 5, label: 'Amount Due', class: 'colAmountDue text-right', active: true, display: true, width: "150" },
          { index: 6, label: 'Current', class: 'colCurrent text-right', active: true, display: true, width: "150" },
          { index: 7, label: '1 - 30 Days', class: 'col130Days text-right', active: true, display: true, width: "150" },
          { index: 8, label: '30 - 60 Days', class: 'col3060Days text-right', active: true, display: true, width: "150" },
          { index: 9, label: '60 - 90 Days', class: 'col6090Days text-right', active: true, display: true, width: "150" },
          { index: 10, label: '> 90 Days', class: 'col90Days text-right', active: true, display: true, width: "150" },
      ];
      templateObject.agedpayablesth.set(reset_data);
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
  
    templateObject.getAgedPayablesData = async function (dateFrom, dateTo, ignoreDate, contactID) {
  
      templateObject.setDateAs(dateFrom);
      getVS1Data('TAPReport').then(function (dataObject) {
        if (dataObject.length == 0) {
          sideBarService.getTAPReportPage(dateFrom, dateTo, ignoreDate,contactID).then(async function (data) {
            await addVS1Data('TAPReport', JSON.stringify(data));
            templateObject.displayAgedPayablesData(data);
          }).catch(function (err) {
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          templateObject.displayAgedPayablesData(data);
        }
      }).catch(function (err) {
        sideBarService.getTAPReportPage(dateFrom, dateTo, ignoreDate,contactID).then(async function (data) {
          await addVS1Data('TAPReport', JSON.stringify(data));
          templateObject.displayAgedPayablesData(data);
        }).catch(function (err) {
  
        });
      });
    }
    let url = FlowRouter.current().path;
    if (url.indexOf("?dateFrom") > 0) {
      url = new URL(window.location.href);
      var getDateFrom = url.searchParams.get("dateFrom");
      var getLoadDate = url.searchParams.get("dateTo");
      if( typeof getDateFrom === undefined || getDateFrom == "" || getDateFrom === null){
        let currentUrl = FlowRouter.current().queryParams;
        getDateFrom = currentUrl.dateFrom
        getLoadDate = currentUrl.dateTo
      }
      $("#dateFrom").datepicker('setDate', moment(getDateFrom).format('DD/MM/YYYY'));
      $("#dateTo").datepicker('setDate', moment(getLoadDate).format('DD/MM/YYYY'));
    }
  
    templateObject.getAgedPayablesData(
      GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
      GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
      false
    );
    templateObject.displayAgedPayablesData = async function (data) {
      var splashArrayAgedPayablesReport = new Array();
      let deleteFilter = false;
      if (data.Params.Search.replace(/\s/g, "") == "") {
        deleteFilter = true;
      } else {
        deleteFilter = false;
      };
      for (let i = 0; i < data.tapreport.length; i++) {
        var dataList = [
            data.tapreport[i].Name || "",
            data.tapreport[i].Type || "",
            data.tapreport[i].PONumber || "",
            data.tapreport[i].DueDate || "",
            data.tapreport[i].AmountDue || 0,
            data.tapreport[i].Current || 0,
            data.tapreport[i]["30Days"] || 0,
            data.tapreport[i]["60Days"] || 0,
            data.tapreport[i]["90Days"] || 0,
            data.tapreport[i]["120Days"] || 0,
        ];
        splashArrayAgedPayablesReport.push(dataList);
      }
        splashArrayAgedPayablesReport.sort(GlobalFunctions.sortFunction);
  
        let start;
        if(splashArrayAgedPayablesReport.length != 0) start = splashArrayAgedPayablesReport[0][0] || '';
        let sum, totalSum;
        sum = new Array(6);
        totalSum = new Array(6);
  
        let T_AccountName = start;
        let agedPayableList = [];
        agedPayableList.push([
            GlobalFunctions.generateSpan(T_AccountName, "table-cells text-bold"),
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
        let j;
        for(j = 0 ; j < 6; j ++)  sum[j] = 0, totalSum[j] = 0;
        for(let i = 0 ; i < splashArrayAgedPayablesReport.length ; i ++){
            if(start != splashArrayAgedPayablesReport[i][0]) {
                start = splashArrayAgedPayablesReport[i][0];
                for(j = 0 ; j < 6; j ++){
                    totalSum[j] += (sum[j] - 0);
                    sum[j] = sum[j] >= 0 ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(sum[j]), "table-cells text-bold", "text-right listhr") : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(sum[j]), "text-danger text-bold", "text-right listhr");
                }
                agedPayableList.push([
                    GlobalFunctions.generateSpan(`Total ${T_AccountName}`, "table-cells text-bold", "listhr"),
                    GlobalFunctions.generateSpan("","","listhr"),
                    GlobalFunctions.generateSpan("","","listhr"),
                    GlobalFunctions.generateSpan("","","listhr"),
                    sum[0],
                    sum[1],
                    sum[2],
                    sum[3],
                    sum[4],
                    sum[5],
                ]);
                agedPayableList.push([
                    GlobalFunctions.generateSpan(splashArrayAgedPayablesReport[i][0], "table-cells text-bold"),
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
                for(j = 0 ; j < 6; j ++) sum[j] = 0;
            }
            T_AccountName = splashArrayAgedPayablesReport[i][0];
            splashArrayAgedPayablesReport[i][0] = "";
            splashArrayAgedPayablesReport[i][1] = GlobalFunctions.generateSpan(splashArrayAgedPayablesReport[i][1], 'text-primary');
            splashArrayAgedPayablesReport[i][2] = GlobalFunctions.generateSpan(splashArrayAgedPayablesReport[i][2], 'text-primary');
            splashArrayAgedPayablesReport[i][3] = GlobalFunctions.generateSpan(GlobalFunctions.formatDate(splashArrayAgedPayablesReport[i][3]), 'text-primary');
            let tmp;
            for(j = 0 ; j < 6; j ++) {
                tmp = splashArrayAgedPayablesReport[i][4 + j] - 0;
                splashArrayAgedPayablesReport[i][4 + j] = (tmp >= 0) ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tmp), 'text-success', "text-right") : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tmp), 'text-danger', "text-right");
                sum[j] += tmp;
            }
            agedPayableList.push(splashArrayAgedPayablesReport[i]);
        }
        for(j = 0 ; j < 6; j ++){
            totalSum[j] += sum[j] - 0;
            sum[j] = sum[j] >= 0 ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(sum[j]), "table-cells text-bold", "text-right listhr") : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(sum[j]), "text-danger text-bold", "text-right listhr");
        }
        agedPayableList.push([
            GlobalFunctions.generateSpan(`Total ${T_AccountName}`, 'table-cells text-bold', "listhr"),
            GlobalFunctions.generateSpan("","","listhr"),
            GlobalFunctions.generateSpan("","","listhr"),
            GlobalFunctions.generateSpan("","","listhr"),
            sum[0],
            sum[1],
            sum[2],
            sum[3],
            sum[4],
            sum[5],
        ]);
        for(j = 0 ; j < 6; j ++){
            totalSum[j] = totalSum[j] >= 0 ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(totalSum[j]), "table-cells text-bold", "text-right listhr") : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(totalSum[j]), "text-danger text-bold", "text-right listhr");
        }
        agedPayableList.push([
            GlobalFunctions.generateSpan(`Grand Total`, 'table-cells text-bold', "listhr"),
            GlobalFunctions.generateSpan("","","listhr"),
            GlobalFunctions.generateSpan("","","listhr"),
            GlobalFunctions.generateSpan("","","listhr"),
            totalSum[0],
            totalSum[1],
            totalSum[2],
            totalSum[3],
            totalSum[4],
            totalSum[5],
        ]);
        templateObject.transactiondatatablerecords.set(agedPayableList);
  
        setTimeout(function () {
        $('#tableExport1').DataTable({
          data: agedPayableList,
          searching: false,
          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
          columnDefs: [
              {
                  targets: 0,
                  className: "colName",
              },
              {
                  targets: 1,
                  className: "colType"
              },
              {
                  targets: 2,
                  className: "colPONumber"
              },
              {
                  targets: 3,
                  className: "colDueDate",
              },
              {
                  targets: 4,
                  className: "colAmoutDue",
              },
              {
                  targets: 5,
                  className: "colCurrent",
              },
              {
                  targets: 6,
                  className: "col30Days",
              },
              {
                  targets: 7,
                  className: "col60Days",
              },
              {
                  targets: 8,
                  className: "col90Days",
              },
              {
                  targets: 9,
                  className: "col120Days",
              },
          ],
          select: true,
          destroy: true,
          colReorder: true,
          pageLength: initialDatatableLoad,
          lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
          info: true,
          // responsive: true,
          "order": [],
          "bsort": false,
          action: function () {
            $('#tableExport').DataTable().ajax.reload();
          },
          "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
                if(aData[0] == GlobalFunctions.generateSpan(`Grand Total`, 'table-cells text-bold'))
                    $(nRow).addClass("grandtotal");
                else if(nRow != 0 && aData[6] == "")
                    $(nRow).addClass("totalhr");
          },
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
    
})

Template.reportcard.helpers({

})

Template.reportcard.events({

})