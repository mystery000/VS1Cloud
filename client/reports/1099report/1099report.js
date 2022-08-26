import {ReportService} from "../report-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
import { TaxRateService } from "../../settings/settings-service";
import LoadingOverlay from "../../LoadingOverlay";
import GlobalFunctions from "../../GlobalFunctions";

const reportService = new ReportService();
const utilityService = new UtilityService();
const taxRateService = new TaxRateService();

let defaultCurrencyCode = CountryAbbr;


Template.report1099.onCreated(()=>{
const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.grandrecords = new ReactiveVar();
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();

  templateObject.isIgnoreDate = new ReactiveVar();
  templateObject.isIgnoreDate.set(false);

   // Currency related vars //
   templateObject.currencyList = new ReactiveVar([]);
   templateObject.activeCurrencyList = new ReactiveVar([]);
   templateObject.tcurrencyratehistory = new ReactiveVar([]);
});

Template.report1099.onRendered(()=>{
  LoadingOverlay.show();
  const templateObject = Template.instance();
  let utilityService = new UtilityService();
  let salesOrderTable;
  var splashArray = new Array();
  var today = moment().format('DD/MM/YYYY');
  var currentDate = new Date();
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  let fromDateMonth = (currentDate.getMonth() + 1);
  let fromDateDay = currentDate.getDate();
  if((currentDate.getMonth()+1) < 10){
    fromDateMonth = "0" + (currentDate.getMonth()+1);
  }

  let imageData= (localStorage.getItem("Image"));
  if(imageData)
  {
      $('#uploadedImage').attr('src', imageData);
      $('#uploadedImage').attr('width','50%');
  }

  if(currentDate.getDate() < 10){
    fromDateDay = "0" + currentDate.getDate();
  }
  var fromDate =fromDateDay + "/" +(fromDateMonth) + "/" + currentDate.getFullYear();


  templateObject.dateAsAt.set(begunDate);
 const dataTableList = [];
 const deptrecords = [];
  $("#date-input,#dateTo,#dateFrom").datepicker({
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
      onChangeMonthYear: function(year, month, inst){
      // Set date to picker
      $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
      // Hide (close) the picker
      // $(this).datepicker('hide');
      // // Change ttrigger the on change function
      // $(this).trigger('change');
     }
  });

  $("#dateFrom").val(fromDate);
   $("#dateTo").val(begunDate);

    templateObject.ContractorPaymentSummaryReports = function (dateFrom, dateTo, ignoreDate) {
      templateObject.records.set('');
      templateObject.grandrecords.set('');
      if(!localStorage.getItem('VS11099Contractor_Report')){
        reportService.getContractorPaymentSummaryData(dateFrom, dateTo,ignoreDate).then(function (data) {
          let totalRecord = [];
          let grandtotalRecord = [];
          localStorage.setItem('VS11099Contractor_Report', JSON.stringify(data)||'');
        if(data.tcontractorpaymentsummary.length){
          let records = [];
          let allRecords = [];
          let current = [];

          let totalNetAssets = 0;
          let GrandTotalLiability = 0;
          let GrandTotalAsset = 0;
          let incArr = [];
          let cogsArr = [];
          let expArr = [];
          let accountData = data.tcontractorpaymentsummary;
          let accountType = '';
          let purchaseID = '';

          accountData.forEach((account) => {

            let recordObj = {
              Id : account.PaymentID,
              type : account.PaymentType,
              Company : account.SupplierPrintName,
              entries: account
            };

            records.push(recordObj);


          })



        //   for (let i = 0; i < accountData.length; i++) {

        //     let recordObj = {};
        //       recordObj.Id = data.tcontractorpaymentsummary[i].PaymentID;
        //       recordObj.type = data.tcontractorpaymentsummary[i].PaymentType;
        //       recordObj.Company = data.tcontractorpaymentsummary[i].SupplierPrintName;
        //       recordObj.dataArr = [
        //           '',
        //           data.tcontractorpaymentsummary[i].PaymentType,
        //           data.tcontractorpaymentsummary[i].PaymentID,
        //           // moment(data.tcontractorpaymentsummary[i].InvoiceDate).format("DD MMM YYYY") || '-',
        //           data.tcontractorpaymentsummary[i].PaymentDate !=''? moment(data.tcontractorpaymentsummary[i].PaymentDate).format("DD/MM/YYYY"): data.tcontractorpaymentsummary[i].PaymentDate,
        //           data.tcontractorpaymentsummary[i].PaymentMethod || '-',
        //           data.tcontractorpaymentsummary[i].BillStreet || '',
        //           data.tcontractorpaymentsummary[i].BillPlace || '',
        //           utilityService.modifynegativeCurrencyFormat(data.tcontractorpaymentsummary[i].CardAmount) || '0.00',
        //           utilityService.modifynegativeCurrencyFormat(data.tcontractorpaymentsummary[i].NonCardAmount) || '0.00'


        //           //
        //       ];

        // //   if((data.tcontractorpaymentsummary[i].AmountDue != 0) || (data.tcontractorpaymentsummary[i].Current != 0)
        // //   || (data.tcontractorpaymentsummary[i]["30Days"] != 0) || (data.tcontractorpaymentsummary[i]["60Days"] != 0)
        // // || (data.tcontractorpaymentsummary[i]["90Days"] != 0) || (data.tcontractorpaymentsummary[i]["120Days"] != 0)){
        // //
        // //   }

        //   records.push(recordObj);

        // }

        records = _.sortBy(records, 'Company');
        records = _.groupBy(records, 'Company');

        for (let key in records) {
            // let obj = [{key: key}, {data: records[key]}];

            let obj = {
              title: key,
              entries: records[key],
              total: {}
            }
            allRecords.push(obj);
        }

        allRecords.forEach((record) => {
          let totalAmountEx = 0;
          let totalTax = 0;
          let amountInc = 0;
          let balance = 0;
          let twoMonth = 0;
          let threeMonth = 0;
          let Older = 0;

          record.entries.forEach((entry) => {

              // totalAmountEx = totalAmountEx + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[5]);
            // totalTax = totalTax + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[6]);
            amountInc = amountInc + parseFloat(entry.CardAmount);
            balance = balance + parseFloat(entry.NonCardAmount);


          });

          record.total = { // new
            Title: 'Total ' + record.title,
            AmountInc: amountInc,
            Balance: balance,
          };

          current.push(record.total);

        })

      //   let iterator = 0;
      // for (let i = 0; i < allRecords.length; i++) {
      //     let totalAmountEx = 0;
      //     let totalTax = 0;
      //     let amountInc = 0;
      //     let balance = 0;
      //     let twoMonth = 0;
      //     let threeMonth = 0;
      //     let Older = 0;
      //     const currencyLength = Currency.length;
      //     for (let k = 0; k < allRecords[i][1].data.length; k++) {
      //         // totalAmountEx = totalAmountEx + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[5]);
      //         // totalTax = totalTax + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[6]);
      //         amountInc = amountInc + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[7]);
      //         balance = balance + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[8]);

      //     }
      //     let val = ['Total ' + allRecords[i][0].key+'', '', '', '','',
      //         '', '', utilityService.modifynegativeCurrencyFormat(amountInc), utilityService.modifynegativeCurrencyFormat(balance)];
      //     current.push(val);

      // }

      //grandtotalRecord
      let grandamountduetotal = 0;
      let grandtotalAmountEx = 0;
      let grandtotalTax = 0;
      let grandamountInc = 0;
      let grandbalance = 0;

      current.forEach((entry) => {


             // grandtotalAmountEx = grandtotalAmountEx + utilityService.convertSubstringParseFloat(current[n][5]);
             // grandtotalTax = grandtotalTax + utilityService.convertSubstringParseFloat(current[n][6]);
             grandamountInc = grandamountInc + parseFloat(entry.CardAmount);
             grandbalance = grandbalance + parseFloat(entry.NonCardAmount);


      })

    // for (let n = 0; n < current.length; n++) {

    //     const grandcurrencyLength = Currency.length;

    //          // grandtotalAmountEx = grandtotalAmountEx + utilityService.convertSubstringParseFloat(current[n][5]);
    //          // grandtotalTax = grandtotalTax + utilityService.convertSubstringParseFloat(current[n][6]);
    //          grandamountInc = grandamountInc + utilityService.convertSubstringParseFloat(current[n][7]);
    //          grandbalance = grandbalance + utilityService.convertSubstringParseFloat(current[n][8]);


    // }


    // let grandval = ['Grand Total ' +  '', '', '','','',
    // '',
    //   '',
    //     utilityService.modifynegativeCurrencyFormat(grandamountInc),
    //     utilityService.modifynegativeCurrencyFormat(grandbalance)];

    let grandValObj = {
      Title: 'Grand Total ',
      AmountInc: grandamountInc,
      Balance: grandbalance,
    
  };

      // for (let key in records) {
      //     let dataArr = current[iterator]
      //     let obj = [{key: key}, {data: records[key]},{total:[{dataArr:dataArr}]}];
      //     totalRecord.push(obj);
      //     iterator += 1;
      // }

        // templateObject.records.set(totalRecord);
        // templateObject.grandrecords.set(grandval);

        templateObject.records.set(allRecords);
        templateObject.grandrecords.set(grandValObj);


        if(templateObject.records.get()){
          setTimeout(function () {
            $('td a').each(function(){
              if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
               });
           $('td').each(function(){
             if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
            });

            $('td').each(function(){

              let lineValue = $(this).first().text()[0];
              if(lineValue != undefined){
                if(lineValue.indexOf(Currency) >= 0) $(this).addClass('text-right')
              }

             });

             $('td').each(function(){
               if($(this).first().text().indexOf('-'+Currency) >= 0) $(this).addClass('text-right')
              });

              $('.fullScreenSpin').css('display','none');
          }, 100);
        }

      }else{
        let records = [];
        let recordObj = {};
        recordObj.Id = '';
        recordObj.type = '';
        recordObj.SupplierName = ' ';
        recordObj.dataArr = [
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
           '-'
        ];

        records.push(recordObj);
        templateObject.records.set(records);
        templateObject.grandrecords.set('');
          $('.fullScreenSpin').css('display','none');
      }

        }).catch(function (err) {
          //Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $('.fullScreenSpin').css('display','none');
        });
      }else{
          let data = JSON.parse(localStorage.getItem('VS11099Contractor_Report'));
          let totalRecord = [];
          let grandtotalRecord = [];
        if(data.tcontractorpaymentsummary.length){
          let records = [];
          let allRecords = [];
          let current = [];

          let totalNetAssets = 0;
          let GrandTotalLiability = 0;
          let GrandTotalAsset = 0;
          let incArr = [];
          let cogsArr = [];
          let expArr = [];
          let accountData = data.tcontractorpaymentsummary;
          let accountType = '';
          let purchaseID = '';
          for (let i = 0; i < accountData.length; i++) {

            let recordObj = {};
          recordObj.Id = data.tcontractorpaymentsummary[i].PaymentID;
          recordObj.type = data.tcontractorpaymentsummary[i].PaymentType;
          recordObj.Company = data.tcontractorpaymentsummary[i].SupplierPrintName;
          recordObj.dataArr = [
              '',
              data.tcontractorpaymentsummary[i].PaymentType,
              data.tcontractorpaymentsummary[i].PaymentID,
              // moment(data.tcontractorpaymentsummary[i].InvoiceDate).format("DD MMM YYYY") || '-',
              data.tcontractorpaymentsummary[i].PaymentDate !=''? moment(data.tcontractorpaymentsummary[i].PaymentDate).format("DD/MM/YYYY"): data.tcontractorpaymentsummary[i].PaymentDate,
              data.tcontractorpaymentsummary[i].PaymentMethod || '-',
              data.tcontractorpaymentsummary[i].BillStreet || '',
              data.tcontractorpaymentsummary[i].BillPlace || '',
              utilityService.modifynegativeCurrencyFormat(data.tcontractorpaymentsummary[i].CardAmount) || '0.00',
              utilityService.modifynegativeCurrencyFormat(data.tcontractorpaymentsummary[i].NonCardAmount) || '0.00'


              //
          ];

        //   if((data.tcontractorpaymentsummary[i].AmountDue != 0) || (data.tcontractorpaymentsummary[i].Current != 0)
        //   || (data.tcontractorpaymentsummary[i]["30Days"] != 0) || (data.tcontractorpaymentsummary[i]["60Days"] != 0)
        // || (data.tcontractorpaymentsummary[i]["90Days"] != 0) || (data.tcontractorpaymentsummary[i]["120Days"] != 0)){
        //
        //   }

          records.push(recordObj);

        }

          records = _.sortBy(records, 'Company');
        records = _.groupBy(records, 'Company');
        for (let key in records) {
            let obj = [{key: key}, {data: records[key]}];
            allRecords.push(obj);
        }

        let iterator = 0;
      for (let i = 0; i < allRecords.length; i++) {
          let totalAmountEx = 0;
          let totalTax = 0;
          let amountInc = 0;
          let balance = 0;
          let twoMonth = 0;
          let threeMonth = 0;
          let Older = 0;
          const currencyLength = Currency.length;
          for (let k = 0; k < allRecords[i][1].data.length; k++) {
              // totalAmountEx = totalAmountEx + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[5]);
              // totalTax = totalTax + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[6]);
              amountInc = amountInc + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[7]);
              balance = balance + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[8]);

          }
          let val = ['Total ' + allRecords[i][0].key+'', '', '', '','',
              '', '', utilityService.modifynegativeCurrencyFormat(amountInc), utilityService.modifynegativeCurrencyFormat(balance)];
          current.push(val);

      }

//grandtotalRecord
let grandamountduetotal = 0;
let grandtotalAmountEx = 0;
let grandtotalTax = 0;
let grandamountInc = 0;
let grandbalance = 0;

    for (let n = 0; n < current.length; n++) {

        const grandcurrencyLength = Currency.length;

             // grandtotalAmountEx = grandtotalAmountEx + utilityService.convertSubstringParseFloat(current[n][5]);
             // grandtotalTax = grandtotalTax + utilityService.convertSubstringParseFloat(current[n][6]);
             grandamountInc = grandamountInc + utilityService.convertSubstringParseFloat(current[n][7]);
             grandbalance = grandbalance + utilityService.convertSubstringParseFloat(current[n][8]);


    }


    let grandval = ['Grand Total ' +  '', '', '','','',
    '',
      '',
        utilityService.modifynegativeCurrencyFormat(grandamountInc),
        utilityService.modifynegativeCurrencyFormat(grandbalance)];


      for (let key in records) {
          let dataArr = current[iterator]
          let obj = [{key: key}, {data: records[key]},{total:[{dataArr:dataArr}]}];
          totalRecord.push(obj);
          iterator += 1;
      }

        templateObject.records.set(totalRecord);
        templateObject.grandrecords.set(grandval);


        if(templateObject.records.get()){
          setTimeout(function () {
            $('td a').each(function(){
              if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
               });
           $('td').each(function(){
             if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
            });

            $('td').each(function(){

              let lineValue = $(this).first().text()[0];
              if(lineValue != undefined){
                if(lineValue.indexOf(Currency) >= 0) $(this).addClass('text-right')
              }

             });

             $('td').each(function(){
               if($(this).first().text().indexOf('-'+Currency) >= 0) $(this).addClass('text-right')
              });

              $('.fullScreenSpin').css('display','none');
          }, 100);
        }

      }else{
        let records = [];
        let recordObj = {};
        recordObj.Id = '';
        recordObj.type = '';
        recordObj.SupplierName = ' ';
        recordObj.dataArr = [
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
           '-'
        ];

        records.push(recordObj);
        templateObject.records.set(records);
        templateObject.grandrecords.set('');
          $('.fullScreenSpin').css('display','none');
      }
      }
    };

    var currentDate2 = new Date();
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    let getDateFrom = currentDate2.getFullYear() + "-" + (currentDate2.getMonth()) + "-" + currentDate2.getDate();
    templateObject.ContractorPaymentSummaryReports(getDateFrom,getLoadDate,false);

    templateObject.getDepartments = function(){
      reportService.getDepartment().then(function(data){
        for(let i in data.tdeptclass){

          let deptrecordObj = {
            id: data.tdeptclass[i].Id || ' ',
            department: data.tdeptclass[i].DeptClassName || ' ',
          };

          deptrecords.push(deptrecordObj);
          templateObject.deptrecords.set(deptrecords);

        }
    });

    }
    // templateObject.getAllProductData();
    templateObject.getDepartments();

      /**
   * Step 1 : We need to get currencies (TCurrency) so we show or hide sub collumns
   * So we have a showable list of currencies to toggle
   */

       templateObject.loadCurrency = async () => {
        await loadCurrency();
      };
  
    //templateObject.loadCurrency();
  
      templateObject.loadCurrencyHistory = async () => {
        await loadCurrencyHistory();
      };
  
    //templateObject.loadCurrencyHistory();
  });

  Template.report1099.events({
    'change #dateTo':function(){
        let templateObject = Template.instance();
          $('.fullScreenSpin').css('display','inline-block');
          $('#dateFrom').attr('readonly', false);
          $('#dateTo').attr('readonly', false);
        templateObject.records.set('');
        templateObject.grandrecords.set('');
        setTimeout(function(){
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();

        //templateObject.ContractorPaymentSummaryReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth()+1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if(($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")){
          templateObject.ContractorPaymentSummaryReports('','',true);
          templateObject.dateAsAt.set('Current Date');
        }else{
          templateObject.ContractorPaymentSummaryReports(formatDateFrom,formatDateTo,false);
          templateObject.dateAsAt.set(formatDate);
        }
        },500);
    },
    'change #dateFrom':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        templateObject.records.set('');
        templateObject.grandrecords.set('');
        setTimeout(function(){
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();

        //templateObject.ContractorPaymentSummaryReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth()+1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if(($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")){
          templateObject.ContractorPaymentSummaryReports('','',true);
          templateObject.dateAsAt.set('Current Date');
        }else{
          templateObject.ContractorPaymentSummaryReports(formatDateFrom,formatDateTo,false);
          templateObject.dateAsAt.set(formatDate);
        }
        },500);

    },
    'click .btnRefresh': function () {
      $('.fullScreenSpin').css('display','inline-block');
      localStorage.setItem('VS11099Contractor_Report', '');
      Meteor._reload.reload();
    },
    'click td a':function (event) {
        let redirectid = $(event.target).closest('tr').attr('id');

        let transactiontype = $(event.target).closest('tr').attr('class');;

        if(redirectid && transactiontype){
          if(transactiontype === 'Customer Payment' ){
            window.open('/paymentcard?id=' + redirectid,'_self');
          }else if(transactiontype === 'Purchase Order'){
            window.open('/purchaseordercard?id=' + redirectid,'_self');
          }else if(transactiontype === 'Credit'){
            window.open('/creditcard?id=' + redirectid,'_self');
          }else if(transactiontype === 'Supplier Payment'){
            window.open('/supplierpaymentcard?id=' + redirectid,'_self');
          }
        }
        // window.open('/balancetransactionlist?accountName=' + accountName+ '&toDate=' + toDate + '&fromDate=' + fromDate + '&isTabItem='+false,'_self');
    },
    'click .btnPrintReport':function (event) {
      document.title = '1099 Transactional Report';
      $(".printReport").print({
          title   :  document.title +" | 1099 Transactional | "+loggedCompany,
          noPrintSelector : ".addSummaryEditor",
      })
    },
    'click .btnExportReport':function() {
      $('.fullScreenSpin').css('display','inline-block');
        let utilityService = new UtilityService();
        let templateObject = Template.instance();
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();

        const filename = loggedCompany + '-1099 Transactional Detail' + '.csv';
        utilityService.exportReportToCsvTable('tableExport', filename, 'csv');
        let rows = [];
        let ingnoreDate = templateObject.isIgnoreDate.get();
        // reportService.getContractorPaymentSummaryData(formatDateFrom,formatDateTo,ingnoreDate).then(function (data) {
        //     if(data.tcontractorpaymentsummary){
        //         rows[0] = ['Company', 'Type', 'Payment #', 'Date', 'Method', 'Bill Street', 'Bill Place', 'Card Amount', 'Non Card Amount'];
        //         data.tcontractorpaymentsummary.forEach(function (e, i) {
        //             rows.push([
        //               data.tcontractorpaymentsummary[i].SupplierPrintName,
        //               data.tcontractorpaymentsummary[i].PaymentType,
        //               data.tcontractorpaymentsummary[i].PaymentID,
        //               data.tcontractorpaymentsummary[i].PaymentDate !=''? moment(data.tcontractorpaymentsummary[i].PaymentDate).format("DD/MM/YYYY"): data.tcontractorpaymentsummary[i].PaymentDate,
        //                data.tcontractorpaymentsummary[i].PaymentMethod || '',
        //                data.tcontractorpaymentsummary[i].BillStreet || '',
        //        data.tcontractorpaymentsummary[i].BillPlace || '',
        //        utilityService.modifynegativeCurrencyFormat(data.tcontractorpaymentsummary[i].CardAmount) || '0.00',
        //        utilityService.modifynegativeCurrencyFormat(data.tcontractorpaymentsummary[i].NonCardAmount) || '0.00']);
        //         });
        //         setTimeout(function () {
        //             utilityService.exportReportToCsv(rows, filename, 'xls');
        //             $('.fullScreenSpin').css('display','none');
        //         }, 1000);
        //     }
        //
        // });
    },
    'click #lastMonth':function(){
        let templateObject = Template.instance();
        localStorage.setItem('VS11099Contractor_Report', '');
        $('.fullScreenSpin').css('display','inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentDate = new Date();

        var prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        var prevMonthFirstDate = new Date(currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1), (currentDate.getMonth() - 1 + 12) % 12, 1);

        var formatDateComponent = function(dateComponent) {
          return (dateComponent < 10 ? '0' : '') + dateComponent;
        };

        var formatDate = function(date) {
          return  formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
        };

        var formatDateERP = function(date) {
          return  date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
        };


        var fromDate = formatDate(prevMonthFirstDate);
        var toDate = formatDate(prevMonthLastDate);

        $("#dateFrom").val(fromDate);
        $("#dateTo").val(toDate);

        var getLoadDate = formatDateERP(prevMonthLastDate);
        let getDateFrom = formatDateERP(prevMonthFirstDate);
        templateObject.ContractorPaymentSummaryReports(getDateFrom,getLoadDate,false);

    },
    'click #lastQuarter':function(){
      localStorage.setItem('VS11099Contractor_Report', '');
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        function getQuarter(d) {
          d = d || new Date();
          var m = Math.floor(d.getMonth()/3) + 2;
          return m > 4? m - 4 : m;
        }

        var quarterAdjustment= (moment().month() % 3) + 1;
        var lastQuarterEndDate = moment().subtract({ months: quarterAdjustment }).endOf('month');
        var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({ months: 2 }).startOf('month');

        var lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
        var lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");

        templateObject.dateAsAt.set(lastQuarterStartDateFormat);
        $("#dateFrom").val(lastQuarterStartDateFormat);
        $("#dateTo").val(lastQuarterEndDateFormat);


        let fromDateMonth = getQuarter(currentDate);
        var quarterMonth = getQuarter(currentDate);
        let fromDateDay = currentDate.getDate();

        var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
        let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
        templateObject.ContractorPaymentSummaryReports(getDateFrom,getLoadDate,false);

    },
    'click #last12Months':function(){
      localStorage.setItem('VS11099Contractor_Report', '');
      let templateObject = Template.instance();
      $('.fullScreenSpin').css('display','inline-block');
      $('#dateFrom').attr('readonly', false);
      $('#dateTo').attr('readonly', false);
      var currentDate = new Date();
      var begunDate = moment(currentDate).format("DD/MM/YYYY");

      let fromDateMonth = Math.floor(currentDate.getMonth()+1);
      let fromDateDay = currentDate.getDate();
      if((currentDate.getMonth()+1) < 10){
        fromDateMonth = "0" + (currentDate.getMonth()+1);
      }
      if(currentDate.getDate() < 10){
      fromDateDay = "0" + currentDate.getDate();
      }

      var fromDate =fromDateDay + "/" +(fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() -1);
      templateObject.dateAsAt.set(begunDate);
      $("#dateFrom").val(fromDate);
      $("#dateTo").val(begunDate);

      var currentDate2 = new Date();
      var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
      let getDateFrom = Math.floor(currentDate2.getFullYear()-1) + "-" + Math.floor(currentDate2.getMonth() +1) + "-" + currentDate2.getDate() ;
      templateObject.ContractorPaymentSummaryReports(getDateFrom,getLoadDate,false);


    },
    'click #ignoreDate':function(){
      localStorage.setItem('VS11099Contractor_Report', '');
      let templateObject = Template.instance();
      $('.fullScreenSpin').css('display','inline-block');
      $('#dateFrom').attr('readonly', true);
      $('#dateTo').attr('readonly', true);
      templateObject.dateAsAt.set('Current Date');
      templateObject.isIgnoreDate.set(true);
      templateObject.ContractorPaymentSummaryReports('','',true);

    },
    'keyup #myInputSearch':function(event){
      $('.table tbody tr').show();
      let searchItem = $(event.target).val();
      if(searchItem != ''){
        var value = searchItem.toLowerCase();
        $('.table tbody tr').each(function(){
         var found = 'false';
         $(this).each(function(){
              if($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0)
              {
                   found = 'true';
              }
         });
         if(found == 'true')
         {
              $(this).show();
         }
         else
         {
              $(this).hide();
         }
    });
      }else{
        $('.table tbody tr').show();
      }
    },
    'blur #myInputSearch':function(event){
      $('.table tbody tr').show();
      let searchItem = $(event.target).val();
      if(searchItem != ''){
        var value = searchItem.toLowerCase();
        $('.table tbody tr').each(function(){
         var found = 'false';
         $(this).each(function(){
              if($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0)
              {
                   found = 'true';
              }
         });
         if(found == 'true')
         {
              $(this).show();
         }
         else
         {
              $(this).hide();
         }
    });
      }else{
        $('.table tbody tr').show();
      }
    },


     // CURRENCY MODULE //
  "click .fx-rate-btn": async (e) => {
    await loadCurrency();
    //loadCurrencyHistory();
  },
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

  });
  Template.report1099.helpers({
    records : () => {
       return Template.instance().records.get();
     //   .sort(function(a, b){
     //     if (a.accounttype == 'NA') {
     //   return 1;
     //       }
     //   else if (b.accounttype == 'NA') {
     //     return -1;
     //   }
     // return (a.accounttype.toUpperCase() > b.accounttype.toUpperCase()) ? 1 : -1;
     // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
     // });
    },

    grandrecords: () => {
       return Template.instance().grandrecords.get();
   },
    dateAsAt: () =>{
        return Template.instance().dateAsAt.get() || '-';
    },
    companyname: () =>{
        return loggedCompany;
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b){
          if (a.department == 'NA') {
        return 1;
            }
        else if (b.department == 'NA') {
          return -1;
        }
      return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
      });
    },
     isIgnoreDate: () =>{
         return Template.instance().isIgnoreDate.get();
     },

     formatPrice( amount ){
      let utilityService = new UtilityService();
      if( isNaN( amount ) ){
          amount = ( amount === undefined || amount === null || amount.length === 0 ) ? 0 : amount;
          amount = ( amount )? Number(amount.replace(/[^0-9.-]+/g,"")): 0;
      }
        return utilityService.modifynegativeCurrencyFormat(amount)|| 0.00;
    },
    checkZero( value ){
       return ( value == 0 )? '': value;
    },
    formatDate: ( date ) => {
        return ( date )? moment(date).format("DD/MM/YYYY") : '';
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
    currencyList: () => {
      return Template.instance().currencyList.get();
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
  Template.registerHelper('equals', function (a, b) {
      return a === b;
  });

  Template.registerHelper('notEquals', function (a, b) {
      return a != b;
  });

  Template.registerHelper('containsequals', function (a, b) {
      return (a.indexOf(b) >= 0 );
  });



/**
 *
 */
async function loadCurrency() {
  let templateObject = Template.instance();

  if ((await templateObject.currencyList.get().length) == 0) {
    LoadingOverlay.show();

    let _currencyList = [];
    const result = await taxRateService.getCurrencies();

    //taxRateService.getCurrencies().then((result) => {

    const data = result.tcurrency;

    for (let i = 0; i < data.length; i++) {
      // let taxRate = (data.tcurrency[i].fields.Rate * 100).toFixed(2) + '%';
      var dataList = {
        id: data[i].Id || "",
        code: data[i].Code || "-",
        currency: data[i].Currency || "NA",
        symbol: data[i].CurrencySymbol || "NA",
        buyrate: data[i].BuyRate || "-",
        sellrate: data[i].SellRate || "-",
        country: data[i].Country || "NA",
        description: data[i].CurrencyDesc || "-",
        ratelastmodified: data[i].RateLastModified || "-",
        active: data[i].Code == defaultCurrencyCode ? true : false, // By default if AUD then true
        //active: false,
        // createdAt: new Date(data[i].MsTimeStamp) || "-",
        // formatedCreatedAt: formatDateToString(new Date(data[i].MsTimeStamp))
      };

      _currencyList.push(dataList);
      //}
    }
    _currencyList = _currencyList.sort((a, b) => {
      return a.currency
        .split("")[0]
        .toLowerCase()
        .localeCompare(b.currency.split("")[0].toLowerCase());
    });

    templateObject.currencyList.set(_currencyList);

    await loadCurrencyHistory(templateObject);
    LoadingOverlay.hide();
    //});
  }
}

async function loadCurrencyHistory(templateObject) {
  let result = await taxRateService.getCurrencyHistory();
  const data = result.tcurrencyratehistory;
  templateObject.tcurrencyratehistory.set(data);
  LoadingOverlay.hide();
}
