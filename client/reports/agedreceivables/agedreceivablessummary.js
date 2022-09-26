import {ReportService} from "../report-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
import { TaxRateService } from "../../settings/settings-service";
import LoadingOverlay from "../../LoadingOverlay";
import GlobalFunctions from "../../GlobalFunctions";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";

const reportService = new ReportService();
const utilityService = new UtilityService();
const taxRateService = new TaxRateService();

let defaultCurrencyCode = CountryAbbr;

Template.agedreceivablessummary.onCreated(()=>{
const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.reportrecords = new ReactiveVar([]);
  templateObject.grandrecords = new ReactiveVar();
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();

  // Currency related vars //
  FxGlobalFunctions.initVars(templateObject);
});

Template.agedreceivablessummary.onRendered(()=>{
  LoadingOverlay.show();
  const templateObject = Template.instance();

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
    let contactName = FlowRouter.current().queryParams.contact ||'';
    let contactID = FlowRouter.current().queryParams.contactid ||'';
    if(FlowRouter.current().queryParams.contact){
      localStorage.setItem('VS1AgedReceivableSummary_Report','');
    }

    templateObject.getAgedReceivableReports = (dateFrom, dateTo, ignoreDate) => {
     LoadingOverlay.show();
     if (!localStorage.getItem('VS1AgedReceivableSummary_Report')) {
      reportService.getAgedReceivableDetailsSummaryData(dateFrom, dateTo, ignoreDate, contactID)
      .then(function (data) {
        if (data.tarreport.length) {
          localStorage.setItem("VS1AgedReceivableSummary_Report", JSON.stringify(data) || "");
          if (data.Params.IgnoreDates == true) {
              $('#dateFrom').attr('readonly', true);
              $('#dateTo').attr('readonly', true);

          } else {
            $('#dateFrom').attr('readonly', false);
            $('#dateTo').attr('readonly', false);
              $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
              $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
          };
          let records = [];
          let reportrecords = [];
          let allRecords = [];
          let current = [];

          let totalNetAssets = 0;
          let GrandTotalLiability = 0;
          let GrandTotalAsset = 0;
          let incArr = [];
          let cogsArr = [];
          let expArr = [];
          let accountData = data.tarreport;
          let accountType = "";

          accountData.forEach(account => {
            let amountdue = utilityService.modifynegativeCurrencyFormat(account.AmountDue) || 0;
            let current = utilityService.modifynegativeCurrencyFormat(account.Current) || 0;
            let day30 = utilityService.modifynegativeCurrencyFormat(account["1-30Days"]) || 0;
            let day60 = utilityService.modifynegativeCurrencyFormat(account["30-60Days"]) || 0;
            let day90 = utilityService.modifynegativeCurrencyFormat(account["60-90Days"]) || 0;
            let dayabove90 = utilityService.modifynegativeCurrencyFormat(account[">90Days"]) || 0;
            var dataList = {
              id: account.SaleID || "",
              contact: account.Printname || "",
              clientid: account.ClientID || "",
              type: "",
              invoiceno: "",
              duedate: "",
              amountdue: amountdue || 0.0,
              current: current || 0.0,
              day30: day30 || 0.0,
              day60: day60 || 0.0,
              day90: day90 || 0.0,
              dayabove90: dayabove90 || 0.0
            };

            reportrecords.push(dataList);

            let recordObj = {
              Id: account.SaleID,
              Type: accountType,
              SupplierName: account.Printname,
              entries: account
            };

            records.push(recordObj);
          });

          //   for (let i = 0; i < accountData.length; i++) {
          //     let amountdue = utilityService.modifynegativeCurrencyFormat(data.tarreport[i].AmountDue) || 0;
          //     let current = utilityService.modifynegativeCurrencyFormat(data.tarreport[i].Current) || 0;
          //     let day30 = utilityService.modifynegativeCurrencyFormat(data.tarreport[i]["1-30Days"]) || 0;
          //     let day60 = utilityService.modifynegativeCurrencyFormat(data.tarreport[i]["30-60Days"]) || 0;
          //     let day90 = utilityService.modifynegativeCurrencyFormat(data.tarreport[i]["60-90Days"]) || 0;
          //     let dayabove90 = utilityService.modifynegativeCurrencyFormat(data.tarreport[i][">90Days"]) || 0;
          //     var dataList = {
          //       id: data.tarreport[i].SaleID || '',
          //       contact:data.tarreport[i].Printname || '',
          //       clientid:data.tarreport[i].ClientID || '',
          //       type: '',
          //       invoiceno: '',
          //       duedate:'',
          //       amountdue: amountdue || 0.00,
          //       current: current || 0.00,
          //       day30: day30 || 0.00,
          //       day60: day60 || 0.00,
          //       day90: day90 || 0.00,
          //       dayabove90: dayabove90 || 0.00
          //   };

          //   reportrecords.push(dataList);

          //     let recordObj = {};
          //   recordObj.Id = data.tarreport[i].SaleID;
          //   recordObj.type = data.tarreport[i].Type;
          //   recordObj.SupplierName = data.tarreport[i].Printname;
          //   recordObj.dataArr = [
          //       '',
          //       data.tarreport[i].Type,
          //       data.tarreport[i].InvoiceNumber,
          //        moment(data.tarreport[i].InvoiceDate).format("DD MMM YYYY") || '-',
          //       data.tarreport[i].DueDate !=''? moment(data.tarreport[i].DueDate).format("DD/MM/YYYY"): data.tarreport[i].DueDate,
          //        data.tarreport[i].InvoiceNumber || '-',
          //       utilityService.modifynegativeCurrencyFormat(data.tarreport[i].AmountDue) || '-',
          //       utilityService.modifynegativeCurrencyFormat(data.tarreport[i].Current) || '-',
          //       utilityService.modifynegativeCurrencyFormat(data.tarreport[i]["1-30Days"]) || '-',
          //       utilityService.modifynegativeCurrencyFormat(data.tarreport[i]["30-60Days"]) || '-',
          //       utilityService.modifynegativeCurrencyFormat(data.tarreport[i]["60-90Days"]) || '-',
          //       utilityService.modifynegativeCurrencyFormat(data.tarreport[i][">90Days"]) || '-',

          //
          //   ];

          //    if((data.tarreport[i].AmountDue != 0) || (data.tarreport[i].Current != 0)
          //    || (data.tarreport[i]["1-30Days"] != 0) || (data.tarreport[i]["30-60Days"] != 0)
          //  || (data.tarreport[i]["60-90Days"] != 0) || (data.tarreport[i][">90Days"] != 0)){
          //     records.push(recordObj);
          //    }

          // }

          reportrecords = _.sortBy(reportrecords, "contact");
          templateObject.reportrecords.set(reportrecords);

          records = _.sortBy(records, "SupplierName");
          records = _.groupBy(records, "SupplierName");

          for (let key in records) {
            //  let obj = [{key: key}, {data: records[key]}];
            let obj = {
              title: key,
              entries: records[key],
              total: {}
            };
            allRecords.push(obj);
          }

          allRecords.forEach(record => {
            let amountduetotal = 0;
            let Currenttotal = 0;
            let lessTnMonth = 0;
            let oneMonth = 0;
            let twoMonth = 0;
            let threeMonth = 0;
            let Older = 0;

            record.entries.forEach(entry => {
              amountduetotal = amountduetotal + parseFloat(entry.entries.AmountDue);
              Currenttotal = Currenttotal + parseFloat(entry.entries.Current);
              oneMonth = oneMonth + parseFloat(entry.entries["1-30Days"]);
              twoMonth = twoMonth + parseFloat(entry.entries["30-60Days"]);
              threeMonth = threeMonth + parseFloat(entry.entries["60-90Days"]);
              Older = Older + parseFloat(entry.entries[">90Days"]);
            });

            record.total = {
              // new
              Title: "Total " + record.title,
              TotalAmountDue: amountduetotal,
              TotalCurrent: Currenttotal,
              OneMonth: oneMonth,
              TwoMonth: twoMonth,
              ThreeMonth: threeMonth,
              OlderMonth: Older
            };

            // Used for grand total later
            current.push(record.total);
          });

          //   let iterator = 0;
          // for (let i = 0; i < allRecords.length; i++) {
          //     let amountduetotal = 0;
          //     let Currenttotal = 0;
          //     let lessTnMonth = 0;
          //     let oneMonth = 0;
          //     let twoMonth = 0;
          //     let threeMonth = 0;
          //     let Older = 0;
          //     const currencyLength = Currency.length;
          //     for (let k = 0; k < allRecords[i][1].data.length; k++) {
          //         amountduetotal = amountduetotal + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[4]);
          //         Currenttotal = Currenttotal + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[5]);
          //         oneMonth = oneMonth + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[6]);
          //         twoMonth = twoMonth + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[7]);
          //         threeMonth = threeMonth + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[8]);
          //         Older = Older + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[9]);
          //     }
          //     let val = [allRecords[i][0].key+'', '', '', '', utilityService.modifynegativeCurrencyFormat(amountduetotal), utilityService.modifynegativeCurrencyFormat(Currenttotal),
          //         utilityService.modifynegativeCurrencyFormat(oneMonth), utilityService.modifynegativeCurrencyFormat(twoMonth), utilityService.modifynegativeCurrencyFormat(threeMonth), utilityService.modifynegativeCurrencyFormat(Older)];
          //     current.push(val);

          // }

          //grandtotalRecord
          let grandamountduetotal = 0;
          let grandCurrenttotal = 0;
          let grandlessTnMonth = 0;
          let grandoneMonth = 0;
          let grandtwoMonth = 0;
          let grandthreeMonth = 0;
          let grandOlder = 0;

          current.forEach(total => {
            grandamountduetotal = grandamountduetotal + parseFloat(total.TotalAmountDue);
            grandCurrenttotal = grandCurrenttotal + parseFloat(total.TotalCurrent);
            // grandlessTnMonth = grandlessTnMonth + utilityService.convertSubstringParseFloat(current[n][5]);
            grandoneMonth = grandoneMonth + parseFloat(total.OneMonth);
            grandtwoMonth = grandtwoMonth + parseFloat(total.TwoMonth);
            grandthreeMonth = grandthreeMonth + parseFloat(total.ThreeMonth);
            grandOlder = grandOlder + parseFloat(total.OlderMonth);
          });

          // for (let n = 0; n < current.length; n++) {

          //     const grandcurrencyLength = Currency.length;

          //     for (let m = 0; m < current[n].data.length; m++) {
          //          grandamountduetotal = grandamountduetotal + utilityService.convertSubstringParseFloat(current[n][4]);
          //         grandCurrenttotal = grandCurrenttotal + utilityService.convertSubstringParseFloat(current[n][5]);
          //          grandoneMonth = grandoneMonth + utilityService.convertSubstringParseFloat(current[n][6]);
          //          grandtwoMonth = grandtwoMonth + utilityService.convertSubstringParseFloat(current[n][7]);
          //          grandthreeMonth = grandthreeMonth + utilityService.convertSubstringParseFloat(current[n][8]);
          //          grandOlder = grandOlder + utilityService.convertSubstringParseFloat(current[n][9]);
          //     }
          //      let val = ['Total ' + allRecords[i][0].key+'', '', '', '', utilityService.modifynegativeCurrencyFormat(Currenttotal), utilityService.modifynegativeCurrencyFormat(lessTnMonth),
          //          utilityService.modifynegativeCurrencyFormat(oneMonth), utilityService.modifynegativeCurrencyFormat(twoMonth), utilityService.modifynegativeCurrencyFormat(threeMonth), utilityService.modifynegativeCurrencyFormat(Older)];
          //      current.push(val);

          // }

          // let grandval = ['Grand Total ' +  '', '', '', '', utilityService.modifynegativeCurrencyFormat(grandamountduetotal), utilityService.modifynegativeCurrencyFormat(grandCurrenttotal),
          //     utilityService.modifynegativeCurrencyFormat(grandoneMonth), utilityService.modifynegativeCurrencyFormat(grandtwoMonth), utilityService.modifynegativeCurrencyFormat(grandthreeMonth), utilityService.modifynegativeCurrencyFormat(grandOlder)];

          // for (let key in records) {
          //     let dataArr = current[iterator]
          //     let obj = [{key: key}, {data: records[key]},{total:[{dataArr:dataArr}]}];
          //     totalRecord.push(obj);
          //     iterator += 1;
          // }

          let grandValObj = {
            Title: "Grand Total ",
            TotalAmountDue: grandamountduetotal,
            TotalCurrent: grandCurrenttotal,
            OneMonth: grandoneMonth,
            TwoMonth: grandtwoMonth,
            ThreeMonth: grandthreeMonth,
            OlderMonth: grandOlder
          };

          // templateObject.records.set(totalRecord);
          // templateObject.grandrecords.set(grandval);

          templateObject.records.set(allRecords);
          templateObject.grandrecords.set(grandValObj);

          if (templateObject.records.get()) {
            setTimeout(function () {
              $("td a").each(function () {
                if ($(this).text().indexOf("-" + Currency) >= 0)
                  $(this).addClass("text-danger");
                }
              );
              $("td").each(function () {
                if ($(this).text().indexOf("-" + Currency) >= 0)
                  $(this).addClass("text-danger");
                }
              );

              $("td").each(function () {
                let lineValue = $(this).first().text()[0];
                if (lineValue != undefined) {
                  if (lineValue.indexOf(Currency) >= 0)
                    $(this).addClass("text-right");
                  }
                });

              $("td").each(function () {
                if ($(this).first().text().indexOf("-" + Currency) >= 0)
                  $(this).addClass("text-right");
                }
              );

              $(".fullScreenSpin").css("display", "none");
            }, 100);
          }
        }
        LoadingOverlay.hide();
      }).catch(function (err) {
        //Bert.alert('<strong>' + err + '</strong>!', 'danger');

        LoadingOverlay.hide();
      });
    } else {
      let data = JSON.parse(localStorage.getItem('VS1AgedReceivableSummary_Report'));
      if (data.tarreport.length) {

        if (data.Params.IgnoreDates == true) {
            $('#dateFrom').attr('readonly', true);
            $('#dateTo').attr('readonly', true);

        } else {
          $('#dateFrom').attr('readonly', false);
          $('#dateTo').attr('readonly', false);
            $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
            $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
        }
        
        let records = [];
        let reportrecords = [];
        let allRecords = [];
        let current = [];

        let totalNetAssets = 0;
        let GrandTotalLiability = 0;
        let GrandTotalAsset = 0;
        let incArr = [];
        let cogsArr = [];
        let expArr = [];
        let accountData = data.tarreport;
        let accountType = "";

        accountData.forEach(account => {
          let amountdue = utilityService.modifynegativeCurrencyFormat(account.AmountDue) || 0;
          let current = utilityService.modifynegativeCurrencyFormat(account.Current) || 0;
          let day30 = utilityService.modifynegativeCurrencyFormat(account["1-30Days"]) || 0;
          let day60 = utilityService.modifynegativeCurrencyFormat(account["30-60Days"]) || 0;
          let day90 = utilityService.modifynegativeCurrencyFormat(account["60-90Days"]) || 0;
          let dayabove90 = utilityService.modifynegativeCurrencyFormat(account[">90Days"]) || 0;
          var dataList = {
            id: account.SaleID || "",
            contact: account.Printname || "",
            clientid: account.ClientID || "",
            type: "",
            invoiceno: "",
            duedate: "",
            amountdue: amountdue || 0.0,
            current: current || 0.0,
            day30: day30 || 0.0,
            day60: day60 || 0.0,
            day90: day90 || 0.0,
            dayabove90: dayabove90 || 0.0
          };

          reportrecords.push(dataList);

          let recordObj = {
            Id: account.SaleID,
            Type: accountType,
            SupplierName: account.Printname,
            entries: account
          };

          records.push(recordObj);
        });

        //   for (let i = 0; i < accountData.length; i++) {
        //     let amountdue = utilityService.modifynegativeCurrencyFormat(data.tarreport[i].AmountDue) || 0;
        //     let current = utilityService.modifynegativeCurrencyFormat(data.tarreport[i].Current) || 0;
        //     let day30 = utilityService.modifynegativeCurrencyFormat(data.tarreport[i]["1-30Days"]) || 0;
        //     let day60 = utilityService.modifynegativeCurrencyFormat(data.tarreport[i]["30-60Days"]) || 0;
        //     let day90 = utilityService.modifynegativeCurrencyFormat(data.tarreport[i]["60-90Days"]) || 0;
        //     let dayabove90 = utilityService.modifynegativeCurrencyFormat(data.tarreport[i][">90Days"]) || 0;
        //     var dataList = {
        //       id: data.tarreport[i].SaleID || '',
        //       contact:data.tarreport[i].Printname || '',
        //       clientid:data.tarreport[i].ClientID || '',
        //       type: '',
        //       invoiceno: '',
        //       duedate:'',
        //       amountdue: amountdue || 0.00,
        //       current: current || 0.00,
        //       day30: day30 || 0.00,
        //       day60: day60 || 0.00,
        //       day90: day90 || 0.00,
        //       dayabove90: dayabove90 || 0.00
        //   };

        //   reportrecords.push(dataList);

        //     let recordObj = {};
        //   recordObj.Id = data.tarreport[i].SaleID;
        //   recordObj.type = data.tarreport[i].Type;
        //   recordObj.SupplierName = data.tarreport[i].Printname;
        //   recordObj.dataArr = [
        //       '',
        //       data.tarreport[i].Type,
        //       data.tarreport[i].InvoiceNumber,
        //        moment(data.tarreport[i].InvoiceDate).format("DD MMM YYYY") || '-',
        //       data.tarreport[i].DueDate !=''? moment(data.tarreport[i].DueDate).format("DD/MM/YYYY"): data.tarreport[i].DueDate,
        //        data.tarreport[i].InvoiceNumber || '-',
        //       utilityService.modifynegativeCurrencyFormat(data.tarreport[i].AmountDue) || '-',
        //       utilityService.modifynegativeCurrencyFormat(data.tarreport[i].Current) || '-',
        //       utilityService.modifynegativeCurrencyFormat(data.tarreport[i]["1-30Days"]) || '-',
        //       utilityService.modifynegativeCurrencyFormat(data.tarreport[i]["30-60Days"]) || '-',
        //       utilityService.modifynegativeCurrencyFormat(data.tarreport[i]["60-90Days"]) || '-',
        //       utilityService.modifynegativeCurrencyFormat(data.tarreport[i][">90Days"]) || '-',

        //
        //   ];

        //    if((data.tarreport[i].AmountDue != 0) || (data.tarreport[i].Current != 0)
        //    || (data.tarreport[i]["1-30Days"] != 0) || (data.tarreport[i]["30-60Days"] != 0)
        //  || (data.tarreport[i]["60-90Days"] != 0) || (data.tarreport[i][">90Days"] != 0)){
        //     records.push(recordObj);
        //    }

        // }

        reportrecords = _.sortBy(reportrecords, "contact");
        templateObject.reportrecords.set(reportrecords);

        records = _.sortBy(records, "SupplierName");
        records = _.groupBy(records, "SupplierName");

        for (let key in records) {
          //  let obj = [{key: key}, {data: records[key]}];
          let obj = {
            title: key,
            entries: records[key],
            total: {}
          };
          allRecords.push(obj);
        }

        allRecords.forEach(record => {
          let amountduetotal = 0;
          let Currenttotal = 0;
          let lessTnMonth = 0;
          let oneMonth = 0;
          let twoMonth = 0;
          let threeMonth = 0;
          let Older = 0;

          record.entries.forEach(entry => {
            amountduetotal = amountduetotal + parseFloat(entry.entries.AmountDue);
            Currenttotal = Currenttotal + parseFloat(entry.entries.Current);
            oneMonth = oneMonth + parseFloat(entry.entries["1-30Days"]);
            twoMonth = twoMonth + parseFloat(entry.entries["30-60Days"]);
            threeMonth = threeMonth + parseFloat(entry.entries["60-90Days"]);
            Older = Older + parseFloat(entry.entries[">90Days"]);
          });

          record.total = {
            // new
            Title: "Total " + record.title,
            TotalAmountDue: amountduetotal,
            TotalCurrent: Currenttotal,
            OneMonth: oneMonth,
            TwoMonth: twoMonth,
            ThreeMonth: threeMonth,
            OlderMonth: Older
          };

          // Used for grand total later
          current.push(record.total);
        });

        //   let iterator = 0;
        // for (let i = 0; i < allRecords.length; i++) {
        //     let amountduetotal = 0;
        //     let Currenttotal = 0;
        //     let lessTnMonth = 0;
        //     let oneMonth = 0;
        //     let twoMonth = 0;
        //     let threeMonth = 0;
        //     let Older = 0;
        //     const currencyLength = Currency.length;
        //     for (let k = 0; k < allRecords[i][1].data.length; k++) {
        //         amountduetotal = amountduetotal + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[4]);
        //         Currenttotal = Currenttotal + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[5]);
        //         oneMonth = oneMonth + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[6]);
        //         twoMonth = twoMonth + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[7]);
        //         threeMonth = threeMonth + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[8]);
        //         Older = Older + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[9]);
        //     }
        //     let val = [allRecords[i][0].key+'', '', '', '', utilityService.modifynegativeCurrencyFormat(amountduetotal), utilityService.modifynegativeCurrencyFormat(Currenttotal),
        //         utilityService.modifynegativeCurrencyFormat(oneMonth), utilityService.modifynegativeCurrencyFormat(twoMonth), utilityService.modifynegativeCurrencyFormat(threeMonth), utilityService.modifynegativeCurrencyFormat(Older)];
        //     current.push(val);

        // }

        //grandtotalRecord
        let grandamountduetotal = 0;
        let grandCurrenttotal = 0;
        let grandlessTnMonth = 0;
        let grandoneMonth = 0;
        let grandtwoMonth = 0;
        let grandthreeMonth = 0;
        let grandOlder = 0;

        current.forEach(total => {
          grandamountduetotal = grandamountduetotal + parseFloat(total.TotalAmountDue);
          grandCurrenttotal = grandCurrenttotal + parseFloat(total.TotalCurrent);
          // grandlessTnMonth = grandlessTnMonth + utilityService.convertSubstringParseFloat(current[n][5]);
          grandoneMonth = grandoneMonth + parseFloat(total.OneMonth);
          grandtwoMonth = grandtwoMonth + parseFloat(total.TwoMonth);
          grandthreeMonth = grandthreeMonth + parseFloat(total.ThreeMonth);
          grandOlder = grandOlder + parseFloat(total.OlderMonth);
        });

        // for (let n = 0; n < current.length; n++) {

        //     const grandcurrencyLength = Currency.length;

        //     for (let m = 0; m < current[n].data.length; m++) {
        //          grandamountduetotal = grandamountduetotal + utilityService.convertSubstringParseFloat(current[n][4]);
        //         grandCurrenttotal = grandCurrenttotal + utilityService.convertSubstringParseFloat(current[n][5]);
        //          grandoneMonth = grandoneMonth + utilityService.convertSubstringParseFloat(current[n][6]);
        //          grandtwoMonth = grandtwoMonth + utilityService.convertSubstringParseFloat(current[n][7]);
        //          grandthreeMonth = grandthreeMonth + utilityService.convertSubstringParseFloat(current[n][8]);
        //          grandOlder = grandOlder + utilityService.convertSubstringParseFloat(current[n][9]);
        //     }
        //      let val = ['Total ' + allRecords[i][0].key+'', '', '', '', utilityService.modifynegativeCurrencyFormat(Currenttotal), utilityService.modifynegativeCurrencyFormat(lessTnMonth),
        //          utilityService.modifynegativeCurrencyFormat(oneMonth), utilityService.modifynegativeCurrencyFormat(twoMonth), utilityService.modifynegativeCurrencyFormat(threeMonth), utilityService.modifynegativeCurrencyFormat(Older)];
        //      current.push(val);

        // }

        // let grandval = ['Grand Total ' +  '', '', '', '', utilityService.modifynegativeCurrencyFormat(grandamountduetotal), utilityService.modifynegativeCurrencyFormat(grandCurrenttotal),
        //     utilityService.modifynegativeCurrencyFormat(grandoneMonth), utilityService.modifynegativeCurrencyFormat(grandtwoMonth), utilityService.modifynegativeCurrencyFormat(grandthreeMonth), utilityService.modifynegativeCurrencyFormat(grandOlder)];

        // for (let key in records) {
        //     let dataArr = current[iterator]
        //     let obj = [{key: key}, {data: records[key]},{total:[{dataArr:dataArr}]}];
        //     totalRecord.push(obj);
        //     iterator += 1;
        // }

        let grandValObj = {
          Title: "Grand Total ",
          TotalAmountDue: grandamountduetotal,
          TotalCurrent: grandCurrenttotal,
          OneMonth: grandoneMonth,
          TwoMonth: grandtwoMonth,
          ThreeMonth: grandthreeMonth,
          OlderMonth: grandOlder
        };

        // templateObject.records.set(totalRecord);
        // templateObject.grandrecords.set(grandval);

        templateObject.records.set(allRecords);
        templateObject.grandrecords.set(grandValObj);

        if (templateObject.records.get()) {
          setTimeout(function () {
            $("td a").each(function () {
              if ($(this).text().indexOf("-" + Currency) >= 0)
                $(this).addClass("text-danger");
              }
            );
            $("td").each(function () {
              if ($(this).text().indexOf("-" + Currency) >= 0)
                $(this).addClass("text-danger");
              }
            );

            $("td").each(function () {
              let lineValue = $(this).first().text()[0];
              if (lineValue != undefined) {
                if (lineValue.indexOf(Currency) >= 0)
                  $(this).addClass("text-right");
                }
              });

            $("td").each(function () {
              if ($(this).first().text().indexOf("-" + Currency) >= 0)
                $(this).addClass("text-right");
              }
            );

            $(".fullScreenSpin").css("display", "none");
          }, 100);
        }
      }
    }
    };

    let getDateFrom = moment().subtract(1, "months").format("YYYY-MM-DD");
    let getLoadDate = moment().format("YYYY-MM-DD");
    $("#dateFrom").val(moment(getDateFrom).format("DD/MM/YYYY"));
    $("#dateTo").val(moment(getLoadDate).format("DD/MM/YYYY"));
    templateObject.getAgedReceivableReports(getDateFrom,getLoadDate,false);
    // $('.ignoreDate').trigger('click');
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



  });

  Template.agedreceivablessummary.events({
    'click #btnDetails': function() {
        FlowRouter.go('/agedreceivables');
    },
    'click td a':async function (event) {
        let id= $(event.target).closest('tr').attr('id').split("item-value-");
        var accountName =id[1].split('_').join(' ');
        let toDate= moment($('#dateTo').val()).clone().endOf('month').format('YYYY-MM-DD');
        let fromDate= moment($('#dateFrom').val()).clone().startOf('year').format('YYYY-MM-DD');
        //Session.setPersistent('showHeader',true);
        await clearData('TAccountRunningBalanceReport');
        window.open('/balancetransactionlist?accountName=' + accountName+ '&toDate=' + toDate + '&fromDate=' + fromDate + '&isTabItem='+false,'_self');
    },
    'change #dateTo':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        templateObject.records.set('');
        templateObject.grandrecords.set('');
        setTimeout(function(){
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();

        //templateObject.getAgedReceivableReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth()+1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if(($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")){
          templateObject.getAgedReceivableReports('','',true);
          templateObject.dateAsAt.set('Current Date');
        }else{
          templateObject.getAgedReceivableReports(formatDateFrom,formatDateTo,false);
          templateObject.dateAsAt.set(formatDate);
        }
        },500);
    },
    'change #dateFrom':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        templateObject.records.set('');
        templateObject.grandrecords.set('');
        setTimeout(function(){
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();

        //templateObject.getAgedReceivableReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth()+1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if(($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")){
          templateObject.getAgedReceivableReports('','',true);
          templateObject.dateAsAt.set('Current Date');
        }else{
          templateObject.getAgedReceivableReports(formatDateFrom,formatDateTo,false);
          templateObject.dateAsAt.set(formatDate);
        }
        },500);
    },
    'click .btnRefresh': function () {
      $('.fullScreenSpin').css('display','inline-block');
      localStorage.setItem('VS1AgedReceivableSummary_Report', '');
      Meteor._reload.reload();
    },
    'click td a':function (event) {
        let redirectid = $(event.target).closest('tr').attr('id');

        let transactiontype = $(event.target).closest('tr').attr('class');

        if(redirectid && transactiontype){
          if(transactiontype === 'Quote' ){
            window.open('/quotecard?id=' + redirectid,'_self');
          }else if(transactiontype === 'Sales Order'){
            window.open('/salesordercard?id=' + redirectid,'_self');
          }else if(transactiontype === 'Invoice'){
            window.open('/invoicecard?id=' + redirectid,'_self');
          }else if(transactiontype === 'Customer Payment'){
            // window.open('/paymentcard?id=' + redirectid,'_self');
          }
        }
        // window.open('/balancetransactionlist?accountName=' + accountName+ '&toDate=' + toDate + '&fromDate=' + fromDate + '&isTabItem='+false,'_self');
    },
    'click .btnPrintReport':function (event) {

      let values = [];
      let basedOnTypeStorages = Object.keys(localStorage);
      basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
          let employeeId = storage.split('_')[2];
          return storage.includes('BasedOnType_') && employeeId == Session.get('mySessionEmployeeLoggedID')
      });
      let i = basedOnTypeStorages.length;
      if (i > 0) {
          while (i--) {
              values.push(localStorage.getItem(basedOnTypeStorages[i]));
          }
      }
      values.forEach(value => {
          let reportData = JSON.parse(value);
          reportData.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://' + $(location).attr('hostname');
          if (reportData.BasedOnType.includes("P")) {
              if (reportData.FormID == 1) {
                  let formIds = reportData.FormIDs.split(',');
                  if (formIds.includes("134")) {
                      reportData.FormID = 134;
                      Meteor.call('sendNormalEmail', reportData);
                  }
              } else {
                  if (reportData.FormID == 134)
                      Meteor.call('sendNormalEmail', reportData);
              }
          }
      });

      document.title = 'Aged Receivables Summary Report';
      $(".printReport").print({
          title   :  document.title +" | Aged Receivables | "+loggedCompany,
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

        const filename = loggedCompany + '-Aged Receivables Summary' + '.csv';
        utilityService.exportReportToCsvTable('tableExport', filename, 'csv');
        let rows = [];
        // reportService.getAgedReceivableDetailsSummaryData(formatDateFrom,formatDateTo,false).then(function (data) {
        //     if(data.tarreport){
        //         rows[0] = ['Contact','Type', 'Invoice No', 'Due Date', 'Amount Due', 'Currenct', '1 - 30 Days', '30 - 60 Days', '60 - 90 Days', '> 90 Days'];
        //         data.tarreport.forEach(function (e, i) {
        //             rows.push([
        //               data.tarreport[i].Printname,
        //               '',
        //               '',
        //               '',
        //               utilityService.modifynegativeCurrencyFormat(data.tarreport[i].AmountDue) || '-',
        //               utilityService.modifynegativeCurrencyFormat(data.tarreport[i].Current) || '0.00',
        //               utilityService.modifynegativeCurrencyFormat(data.tarreport[i]["1-30Days"]) || '0.00',
        //               utilityService.modifynegativeCurrencyFormat(data.tarreport[i]["30-60Days"]) || '0.00',
        //               utilityService.modifynegativeCurrencyFormat(data.tarreport[i]["60-90Days"]) || '0.00',
        //               utilityService.modifynegativeCurrencyFormat(data.tarreport[i][">90Days"]) || '0.00']);
        //               // rows = _.sortBy(rows, data.tarreport[i].Name);
        //         });
        //         setTimeout(function () {
        //
        //             utilityService.exportReportToCsv(rows, filename, 'xls');
        //             $('.fullScreenSpin').css('display','none');
        //         }, 1000);
        //     }
        //
        // });
    },
    'click #lastMonth':function(){
        let templateObject = Template.instance();
        localStorage.setItem('VS1AgedReceivableSummary_Report', '');
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
        templateObject.dateAsAt.set(fromDate);

        templateObject.getAgedReceivableReports(getDateFrom,getLoadDate,false);

    },
    'click #lastQuarter':function(){
        let templateObject = Template.instance();
        localStorage.setItem('VS1AgedReceivableSummary_Report', '');
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
        templateObject.getAgedReceivableReports(getDateFrom,getLoadDate,false);

    },
    'click #last12Months':function(){
      let templateObject = Template.instance();
      localStorage.setItem('VS1AgedReceivableSummary_Report', '');
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
      templateObject.getAgedReceivableReports(getDateFrom,getLoadDate,false);


    },
    'click #ignoreDate':function(){
      let templateObject = Template.instance();
      localStorage.setItem('VS1AgedReceivableSummary_Report', '');
      localStorage.setItem('VS1AgedReceivableSummary_Card', '');
      $('.fullScreenSpin').css('display','inline-block');
      $('#dateFrom').attr('readonly', true);
      $('#dateTo').attr('readonly', true);
      templateObject.dateAsAt.set('Current Date');
      templateObject.getAgedReceivableReports('','',true);

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


    // CURRENCY MODULE
    ...FxGlobalFunctions.getEvents(),
  "click .currency-modal-save": e => {
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
        let _currency = _currencyList.find(c => c.id == currencyId);
        _currency.active = true;
        _currencySelectedList.push(_currency);
      });
    } else {
      let _currency = _currencyList.find(c => c.code == defaultCurrencyCode);
      _currency.active = true;
      _currencySelectedList.push(_currency);
    }

    _currencyList.forEach((value, index) => {
      if (_currencySelectedList.some(c => c.id == _currencyList[index].id)) {
        _currencyList[index].active = _currencySelectedList.find(c => c.id == _currencyList[index].id).active;
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
  }

  });

  Template.agedreceivablessummary.helpers({
    records : () => {
       return Template.instance().records.get();
    },
    reportrecords : () => {
       return Template.instance().reportrecords.get();
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

    formatPrice(amount) {
      let utilityService = new UtilityService();
      if (isNaN(amount)) {
        amount = amount === undefined || amount === null || amount.length === 0
          ? 0
          : amount;
        amount = amount
          ? Number(amount.replace(/[^0-9.-]+/g, ""))
          : 0;
      }
      return utilityService.modifynegativeCurrencyFormat(amount) || 0.0;
    },
    formatDate: ( date ) => {
      return ( date )? moment(date).format("DD/MM/YYYY") : '';
    },


    // FX Module
  convertAmount: (amount = 0.00, currencyData, days = null) => {
    if(days != null) {
        amount = amount[days + 'Days'];
    }
    let currencyList = Template.instance().tcurrencyratehistory.get(); // Get tCurrencyHistory

    if (isNaN(amount)) {
      if (!amount || amount.trim() == "") {
        return '';
      }
      amount = utilityService.convertSubstringParseFloat(amount); // This will remove all currency symbol
    }
    // if (currencyData.code == defaultCurrencyCode) {
    //    default currency
    //   return amount;
    // }

    // Lets remove the minus character
    const isMinus = amount < 0;
    if (isMinus == true)
      amount = amount * -1; // make it positive for now

    //  get default currency symbol
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
    currencyList = currencyList.filter(a => a.Code == currencyData.code);

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

    let rate = currencyData.code == defaultCurrencyCode
      ? 1
      : firstElem.BuyRate; // Must used from tcurrecyhistory

    amount = parseFloat(amount * rate); // Multiply by the rate
    amount = Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }); // Add commas

    let convertedAmount = isMinus == true
      ? `- ${currencyData.symbol} ${amount}`
      : `${currencyData.symbol} ${amount}`;

    return convertedAmount;
  },
  count: array => {
    return array.length;
  },
  countActive: array => {
    if (array.length == 0) {
      return 0;
    }
    let activeArray = array.filter(c => c.active == true);
    return activeArray.length;
  },
  currencyList: () => {
    return Template.instance().currencyList.get();
  },
  isNegativeAmount(amount, days = null) {
    if(days != null) {
        amount = amount[days + 'Days'];
    }
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
    let activeArray = array.filter(c => c.active == true);

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
    let activeArray = array.filter(c => c.active == true);

    return activeArray.length > 0;
  },
  isObject(variable) {
    return typeof variable === "object" && variable !== null;
  },
  currency: () => {
    return Currency;
  },
  getDays: (object, number = 30) => {
    return object[number + 'Days'];
  }
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


