import { ReportService } from "../report-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import layoutEditor from "./layoutEditor";
import ApiService from "../../js/Api/Module/ApiService";
import { ProductService } from "../../product/product-service";
import ProfitLossLayout from "../../js/Api/Model/ProfitLossLayout"
import ProfitLossLayoutFields from "../../js/Api/Model/ProfitLossLayoutFields"
import ProfitLossLayoutApi from "../../js/Api/ProfitLossLayoutApi";
import { TaxRateService } from "../../settings/settings-service";
import LoadingOverlay from "../../LoadingOverlay";
import GlobalFunctions from "../../GlobalFunctions";
// import jqueryScrollable from "../../js/jquery-sortable"


let utilityService = new UtilityService();
let reportService = new ReportService();
let taxRateService = new TaxRateService();

const templateObject = Template.instance();
const productService = new ProductService();
const defaultPeriod = 3;
let defaultCurrencyCode = CountryAbbr; // global variable "AUD"

Template.newprofitandloss.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();
  templateObject.reportOptions = new ReactiveVar();
  templateObject.recordslayout = new ReactiveVar([]);
  templateObject.profitlosslayoutrecords = new ReactiveVar([]);
  templateObject.profitlosslayoutfields = new ReactiveVar([]);
  templateObject.currencyList = new ReactiveVar([]);
  templateObject.activeCurrencyList = new ReactiveVar([]);
  templateObject.tcurrencyratehistory = new ReactiveVar([]);
});

function formatFields( fields, searchkey ){
  const groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
        // If an array already present for key, push it to the array. Else create an array and push the object
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
        );
        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result;
    }, {}); // empty object is the initial value for result object
  };

  // Group by color as key to the person array
  return groupBy(fields, searchkey );
}

function buildPositions() {
  const sortfields = $(".pSortItems");
  // console.log('Sorting elements')
  // Level 0 Sorting
  let counter = 1;
  for (let i = 0; i <= sortfields.length; i++) {
    $(sortfields[i]).attr("position", counter * 10);
    counter++;
  }
  // Level 1 Sorting
  const cSortItems = $(".cSortItems");
  counter = 1;
  for (let i = 0; i <= cSortItems.length; i++) {
    $(cSortItems[i]).attr("position", counter * 10);
    counter++;
  }
  // Level 2 Sorting
  const scSortItems = $(".scSortItems");
  counter = 1;
  for (let i = 0; i <= scSortItems.length; i++) {
    $(scSortItems[i]).attr("position", counter * 10);
    counter++;
  }
}

Template.newprofitandloss.onRendered(function () {
  let taxRateService = new TaxRateService();
  LoadingOverlay.show();
  const templateObject = Template.instance();
  const deptrecords = [];

  templateObject.setReportOptions = async function( compPeriod = 0, formatDateFrom = new Date(),  formatDateTo = new Date() ) {
      // New Code Start here
    let fromYear = moment(formatDateFrom).format('YYYY');
    let toYear = moment(formatDateTo).format('YYYY');
    let dateRange = [];
    if( toYear === fromYear ){
      dateRange.push( moment(formatDateFrom).format('DD MMM') + '-' + moment(formatDateTo).format('DD MMM') + ' '+ toYear );
    }else{
      dateRange.push( moment(formatDateFrom).format('DD MMM YYYY') + '-' + moment(formatDateTo).format('DD MMM YYYY') );
    }

    let defaultOptions = templateObject.reportOptions.get()
    if( defaultOptions ){
      defaultOptions.fromDate = formatDateFrom;
      defaultOptions.toDate = formatDateTo;
      defaultOptions.threcords = dateRange;
    }else{
      defaultOptions = {
        compPeriod: compPeriod,
        fromDate: formatDateFrom,
        toDate: formatDateTo,
        threcords: dateRange,
        departments: [],
        showDecimal: true,
        showtotal: true
      }
    }
    await templateObject.reportOptions.set( defaultOptions );
    await templateObject.getProfitandLossReports();
  }

  let utilityService = new UtilityService();
  let salesOrderTable;
  var splashArray = new Array();
  var today = moment().format("DD/MM/YYYY");
  var currentDate = new Date();
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  let fromDateMonth = currentDate.getMonth() + 1;
  let fromDateDay = currentDate.getDate();
  if (currentDate.getMonth() + 1 < 10) {
    fromDateMonth = "0" + (currentDate.getMonth() + 1);
  }

  let imageData= (localStorage.getItem("Image"));
  if(imageData)
  {
      $('#uploadedImage').attr('src', imageData);
      $('#uploadedImage').attr('width','50%');
  }

  if (currentDate.getDate() < 10) {
    fromDateDay = "0" + currentDate.getDate();
  }
  var fromDate =
    fromDateDay + "/" + fromDateMonth + "/" + currentDate.getFullYear();
  var url = FlowRouter.current().path;
  //hiding Group selected accounts button
  $(".btnGroupAccounts").hide();

  templateObject.dateAsAt.set(begunDate);
  //    date picker initializer
  $("#date-input,#dateTo,#dateFrom").datepicker({
    showOn: "button",
    buttonText: "Show Date",
    buttonImageOnly: true,
    buttonImage: "/img/imgCal2.png",
    dateFormat: "dd/mm/yy",
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
  });
  // end of date picker
  // $("#dateFrom").val(fromDate);
  // $("#dateTo").val(begunDate);
  // let formatDateFrom = new Date();
  // let formatDateTo = new Date();
  // let fromYear = moment(formatDateFrom).format('YYYY');
  // let toYear = moment(formatDateTo).format('YYYY');
  // let dateRange = [];
  // if( toYear === fromYear ){
  //   dateRange.push( moment(formatDateFrom).format('DD MMM') + '-' + moment(formatDateTo).format('DD MMM') + ' '+ toYear );
  // }else{
  //   dateRange.push( moment(formatDateFrom).format('DD MMM YYYY') + '-' + moment(formatDateTo).format('DD MMM YYYY') );
  // }
  // templateObject.threcords.set( dateRange );

  // get 'this month' to appear in date range selector dropdown
  //    const monSml = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sepr","Oct","Nov","Dec"];
  //    var currMonth = monSml[currentDate.getMonth()] + " " + currentDate.getFullYear();

  let currMonth = moment().format("MMM") + " " + moment().format("YYYY");
  $("#dispCurrMonth").append(currMonth);

  // get 'this month' to appear in date range selector dropdown end

  // get 'last quarter' to appear in date range selector dropdown
  let lastQStartDispaly = moment()
    .subtract(1, "Q")
    .startOf("Q")
    .format("D" + " " + "MMM" + " " + "YYYY");
  let lastQEndDispaly = moment()
    .subtract(1, "Q")
    .endOf("Q")
    .format("D" + " " + "MMM" + " " + "YYYY");
  $("#dispLastQuarter").append(lastQStartDispaly + " - " + lastQEndDispaly);

  // get 'last quarter' to appear in date range selector dropdown end

  // get 'this quarter' to appear in date range selector dropdown

  let thisQStartDispaly = moment()
    .startOf("Q")
    .format("D" + " " + "MMM" + " " + "YYYY");
  let thisQEndDispaly = moment()
    .endOf("Q")
    .format("D" + " " + "MMM" + " " + "YYYY");
  $("#dispCurrQuarter").append(thisQStartDispaly + " - " + thisQEndDispaly);

  // get 'this quarter' to appear in date range selector dropdown end

  // get 'last month' to appear in date range selector dropdown

  let prevMonth = moment()
    .subtract(1, "M")
    .format("MMM" + " " + "YYYY");
  $("#dispPrevMonth").append(prevMonth);

  // get 'last month' to appear in date range selector dropdown end

  // get 'month to date' to appear in date range selector dropdown

  let monthStart = moment()
    .startOf("M")
    .format("D" + " " + "MMM");
  let monthCurr = moment().format("D" + " " + "MMM" + " " + "YYYY");
  $("#monthStartDisp").append(monthStart + " - " + monthCurr);

  // get 'month to date' to appear in date range selector dropdown end

  // get 'quarter to date' to appear in date range selector dropdown

  let currQStartDispaly = moment()
    .startOf("Q")
    .format("D" + " " + "MMM");
  $("#quarterToDateDisp").append(currQStartDispaly + " - " + monthCurr);

  // get 'quarter to date' to appear in date range selector dropdown
  // get 'financial year' to appear
  if (moment().quarter() == 4) {
    var current_fiscal_year_start = moment()
      .month("July")
      .startOf("month")
      .format("D" + " " + "MMM" + " " + "YYYY");
    var current_fiscal_year_end = moment()
      .add(1, "year")
      .month("June")
      .endOf("month")
      .format("D" + " " + "MMM" + " " + "YYYY");
    var last_fiscal_year_start = moment()
      .subtract(1, "year")
      .month("July")
      .startOf("month")
      .format("D" + " " + "MMM" + " " + "YYYY");
    var last_fiscal_year_end = moment()
      .month("June")
      .endOf("month")
      .format("D" + " " + "MMM" + " " + "YYYY");
  } else {
    var current_fiscal_year_start = moment()
      .subtract(1, "year")
      .month("July")
      .startOf("month")
      .format("D" + " " + "MMM" + " " + "YYYY");
    var current_fiscal_year_end = moment()
      .month("June")
      .endOf("month")
      .format("D" + " " + "MMM" + " " + "YYYY");

    var last_fiscal_year_start = moment()
      .subtract(2, "year")
      .month("July")
      .startOf("month")
      .format("D" + " " + "MMM" + " " + "YYYY");
    var last_fiscal_year_end = moment()
      .subtract(1, "year")
      .month("June")
      .endOf("month")
      .format("D" + " " + "MMM" + " " + "YYYY");
  }
  //display current financial year
  $("#dispCurrFiscYear").append(
    current_fiscal_year_start + " - " + current_fiscal_year_end
  );
  //display last financial year
  $("#dispPrevFiscYear").append(
    last_fiscal_year_start + " - " + last_fiscal_year_end
  );
  //display current financial year to current date;
  let yeartodate = moment().month("january").startOf("month").format("D" + " " + "MMM" + " " + "YYYY");
  $("#dispCurrFiscYearToDate").append(
    yeartodate + " - " + monthCurr
  );
  // get 'financial year' to appear end

  templateObject.getProfitandLossReports = async function () {
    const options = await templateObject.reportOptions.get();
    let dateFrom = moment(options.fromDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
    let dateTo = moment(options.toDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
    // Compare period    
    if ( options.compPeriod ) {
      try {
        let periodMonths = `${options.compPeriod} Month`
        let data = await reportService.getProfitandLossCompare(dateFrom, dateTo, false, periodMonths)
        let records = [];
        options.threcords = [];
        if (data.tprofitandlossperiodcomparereport) {
          let accountData = data.tprofitandlossperiodcomparereport;
          // console.log('accountData', dateFrom, dateTo, accountData)
          let accountType = "";
          var dataList = "";
          for (let i = 0; i < accountData.length; i++) {
            if (accountData[i]["AccountTypeDesc"].replace(/\s/g, "") == "") {
              accountType = "";
            } else {
              accountType = accountData[i]["AccountTypeDesc"];
            }
            let compPeriod = options.compPeriod  + 1;
            let periodAmounts = [];
            let totalAmount = 0;
            for (let counter = 1; counter <= compPeriod; counter++) { 
              if( i == 0 ){      
                options.threcords.push( accountData[i]["DateDesc_" + counter] );
              }
              totalAmount +=  accountData[i]["Amount_" + counter];
              let AmountEx = utilityService.modifynegativeCurrencyFormat( accountData[i]["Amount_" + counter] ) || 0.0;
              let RoundAmount = Math.round(accountData[i]["Amount_" + counter]) || 0;
              periodAmounts.push({
                decimalAmt: AmountEx,
                roundAmt: RoundAmount
              });
            }  
            let totalAmountEx = utilityService.modifynegativeCurrencyFormat( totalAmount ) || 0.0;
            let totalRoundAmount = Math.round(totalAmount) || 0;
            if ( accountData[i]["AccountHeaderOrder"].replace(/\s/g, "") == "" &&  accountType != "" ) {
              dataList = {
                id: accountData[i]["AccountID"] || "",
                accounttype: accountType || "",
                accounttypeshort: accountData[i]["AccountType"] || "",
                accountname: accountData[i]["AccountName"] || "",
                accountheaderorder: accountData[i]["AccountHeaderOrder"] || "",
                accountno: accountData[i]["AccountNo"] || "",
                totalamountex: "",
                totalroundamountex: "",
                periodAmounts: "",
                name: $.trim(accountData[i]["AccountName"])
                  .split(" ")
                  .join("_"),
              };
            } else {
              dataList = {
                id: accountData[i]["AccountID"] || "",
                accounttype: accountType || "",
                accounttypeshort: accountData[i]["AccountType"] || "",
                accountname: accountData[i]["AccountName"] || "",
                accountheaderorder: accountData[i]["AccountHeaderOrder"] || "",
                accountno: accountData[i]["AccountNo"] || "",
                totalamountex: totalAmountEx || 0.0,
                periodAmounts: periodAmounts,
                totalroundamountex: totalRoundAmount,
                name: $.trim(accountData[i]["AccountName"])
                  .split(" ")
                  .join("_"), 
                // totaltax: totalTax || 0.00
              };
            }

            if ( accountData[i]["AccountType"].replace(/\s/g, "") == "" && accountType == "" ) {
            } else {
              records.push(dataList);
            }
          }
          
          // Set Table Data          
          templateObject.reportOptions.set(options);
          templateObject.records.set(records);
          if (templateObject.records.get()) {
            setTimeout(function () {
              $("td a").each(function () {
                if (
                  $(this)
                    .text()
                    .indexOf("-" + Currency) >= 0
                ) {
                  $(this).addClass("text-danger");
                  $(this).removeClass("fgrblue");
                }
              });
              $("td").each(function () {
                if (
                  $(this)
                    .text()
                    .indexOf("-" + Currency) >= 0
                ) {
                  $(this).addClass("text-danger");
                  $(this).removeClass("fgrblue");
                }
              });
              $(".fullScreenSpin").css("display", "none");
            }, 100);
          }
        }
      }catch(err) {
        $(".fullScreenSpin").css("display", "none");
      }
    }else{
      try {
        options.threcords = [];
        let fromYear = moment(dateFrom).format('YYYY');
        let toYear = moment(dateTo).format('YYYY');
        let dateRange = [];
        if( toYear === fromYear ){
          dateRange.push( moment(dateFrom).format('DD MMM') + '-' + moment(dateTo).format('DD MMM') + ' '+ toYear );
        }else{
          dateRange.push( moment(dateFrom).format('DD MMM YYYY') + '-' + moment(dateTo).format('DD MMM YYYY') );
        }
        options.threcords = dateRange;
        let departments = ( options.departments.length )? options.departments.join(','): '';        
        let data = await reportService.getProfitandLoss(dateFrom, dateTo, false, departments)
        let records = [];        
        if (data.profitandlossreport) {
          let accountData = data.profitandlossreport;
          let accountType = "";
          var dataList = "";
          for (let i = 0; i < accountData.length; i++) {
            if (accountData[i]["Account Type"].replace(/\s/g, "") == "") {
              accountType = "";
            } else {
              accountType = accountData[i]["Account Type"];
            }
            let periodAmounts = []
            let totalAmountEx = utilityService.modifynegativeCurrencyFormat( accountData[i]["TotalAmountEx"] ) || 0.0;
            let totalRoundAmount = Math.round(accountData[i]["TotalAmountEx"]) || 0;
            periodAmounts.push({
              decimalAmt: totalAmountEx,
              roundAmt: totalRoundAmount
            });
            if( options.departments.length ){
              options.departments.forEach(dept => {
                let deptAmountEx = utilityService.modifynegativeCurrencyFormat( accountData[i][dept+"_AmountColumnInc"] ) || 0.0;
                let deptRoundAmount = Math.round(accountData[i][dept+"_AmountColumnInc"]) || 0;
                if( i == 0 ){      
                  options.threcords.push( dept );
                }
                periodAmounts.push({
                  decimalAmt: deptAmountEx,
                  roundAmt: deptRoundAmount
                });
              });
            } 
            if ( accountData[i]["AccountHeaderOrder"].replace(/\s/g, "") == "" &&  accountType != "" ) {
              dataList = {
                id: accountData[i]["AccountID"] || "",
                accounttype: accountType || "",
                accounttypeshort: accountData[i]["AccountType"] || "",
                accountname: accountData[i]["AccountName"] || "",
                accountheaderorder: accountData[i]["AccountHeaderOrder"] || "",
                accountno: accountData[i]["AccountNo"] || "",
                totalamountex: "",
                periodAmounts: "",
                totalroundamountex: "",
                name: $.trim(accountData[i]["AccountName"])
                  .split(" ")
                  .join("_"),
              };
            } else {
              dataList = {
                id: accountData[i]["AccountID"] || "",
                accounttype: accountType || "",
                accounttypeshort: accountData[i]["AccountType"] || "",
                accountname: accountData[i]["AccountName"] || "",
                accountheaderorder: accountData[i]["AccountHeaderOrder"] || "",
                accountno: accountData[i]["AccountNo"] || "",
                totalamountex: totalAmountEx || 0.0,
                totalroundamountex: totalRoundAmount,
                periodAmounts: periodAmounts,
                name: $.trim(accountData[i]["AccountName"])
                  .split(" ")
                  .join("_"), 
                // totaltax: totalTax || 0.00
              };
            }

            if ( accountData[i]["AccountType"].replace(/\s/g, "") == "" && accountType == "" ) {
            } else {
              records.push(dataList);
            }
          }
          
          // Set Table Data
          // console.log('records', records)
          templateObject.reportOptions.set(options);
          templateObject.records.set(records);
          if (templateObject.records.get()) {
            setTimeout(function () {
              $("td a").each(function () {
                if (
                  $(this)
                    .text()
                    .indexOf("-" + Currency) >= 0
                ) {
                  $(this).addClass("text-danger");
                  $(this).removeClass("fgrblue");
                }
              });
              $("td").each(function () {
                if (
                  $(this)
                    .text()
                    .indexOf("-" + Currency) >= 0
                ) {
                  $(this).addClass("text-danger");
                  $(this).removeClass("fgrblue");
                }
              });
              $(".fullScreenSpin").css("display", "none");              
            }, 500);
          }
        }
      }catch(error) {
        $(".fullScreenSpin").css("display", "none");
      }
    }
  };

  if (url.indexOf("?dateFrom") > 0) {
    localStorage.setItem("VS1ProfitandLoss_ReportCompare", "");
    url = new URL(window.location.href);
    var getDateFrom = url.searchParams.get("dateFrom");
    var getLoadDate = url.searchParams.get("dateTo");
    templateObject.setReportOptions(0, getDateFrom, getLoadDate);  
  } else if( url.indexOf("?daterange") > 0 ){
    let currentDate2 = new Date();
    let fromDate =  moment(currentDate2).subtract(3,'months').format('YYYY-MM-DD');
    let endDate = moment(currentDate2).format("YYYY-MM-DD");
    if( url.indexOf("?daterange=monthly") ){
      fromDate = moment().startOf('month').format('YYYY-MM-DD');
      endDate   = moment().endOf('month').format('YYYY-MM-DD');
    }
    if( url.indexOf("?daterange=quarterly") ){
      fromDate = moment().startOf("Q").format('YYYY-MM-DD');
      endDate = moment().endOf("Q").format('YYYY-MM-DD');      
    }
    if( url.indexOf("?daterange=yearly") ){
      if (moment().quarter() == 4) {
        fromDate = moment().month("July").startOf("month").format('YYYY-MM-DD');
        endDate = moment().add(1, "year").month("June").endOf("month").format('YYYY-MM-DD');
      }else{
        fromDate = moment().subtract(1, "year").month("July").startOf("month").format('YYYY-MM-DD');
        endDate = moment().month("June").endOf("month").format('YYYY-MM-DD');
      }
    }
    if( url.indexOf("?daterange=ytd") ){
      fromDate = moment().month("january").startOf("month").format("YYYY-MM-DD");
      endDate = moment().format("YYYY-MM-DD");
    }
    templateObject.setReportOptions(0, fromDate, endDate );
  } else {
    var currentDate2 = new Date();
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");

    // // last 2 months
    // for (i = 0; i <= 2; i++) {
    //   currentDate2.setMonth(currentDate2.getMonth() - 1);
    // }

    let getDateFrom =  moment(currentDate2).subtract(3,'months').format('YYYY-MM-DD');
    templateObject.setReportOptions(defaultPeriod, getDateFrom, getLoadDate);
  }

templateObject.getDepartments = function() {
    getVS1Data("TDeptClass")
        .then(function(dataObject) {
            if (dataObject.length == 0) {
                productService.getDepartment().then(function(data) {
                    //let deptArr = [];
                    for (let i in data.tdeptclass) {
                        let deptrecordObj = {
                            id: data.tdeptclass[i].Id || " ",
                            department: data.tdeptclass[i].DeptClassName || " ",
                        };
                        deptrecords.push(deptrecordObj);
                        templateObject.deptrecords.set(deptrecords);
                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tdeptclass;
                for (let i in useData) {
                    let deptrecordObj = {
                        id: useData[i].Id || " ",
                        department: useData[i].DeptClassName || " ",
                    };
                    //deptArr.push(data.tdeptclass[i].DeptClassName);
                    deptrecords.push(deptrecordObj);
                    templateObject.deptrecords.set(deptrecords);
                }
            }
        })
        .catch(function(err) {
            productService.getDepartment().then(function(data) {
                //let deptArr = [];
                for (let i in data.tdeptclass) {
                    let deptrecordObj = {
                        id: data.tdeptclass[i].Id || " ",
                        department: data.tdeptclass[i].DeptClassName || " ",
                    };
                    //deptArr.push(data.tdeptclass[i].DeptClassName);
                    deptrecords.push(deptrecordObj);
                    templateObject.deptrecords.set(deptrecords);
                }
            });
        });
};
// templateObject.getAllProductData();
templateObject.getDepartments();

templateObject.getProfitLossLayout = async function() {
  const profitLossLayoutApi = new ProfitLossLayoutApi();

  const profitLossLayoutEndpoint = profitLossLayoutApi.collection.findByName(
      profitLossLayoutApi.collectionNames.TProfitLossLayout
  );

  // Fetch list type details
  profitLossLayoutEndpoint.url.searchParams.append("ListType", "'Detail'");  

  const profitLossLayoutEndResponse =  await profitLossLayoutEndpoint.fetch();  
  if (profitLossLayoutEndResponse.ok == true) {
    let profitLossLayouts = [];
    let jsonResponse = await profitLossLayoutEndResponse.json();
    // handle API json reponse
    const profitLossLists = ProfitLossLayout.fromList(jsonResponse.tprofitlosslayout);
    // Save default list
    templateObject.profitlosslayoutfields.set( profitLossLists );
    
    profitLossLists.filter((item) => {
      if( item.fields.Level0Order != 0 && item.fields.Level1Order == 0 && item.fields.Level2Order == 0 && item.fields.Level3Order == 0 ){
        profitLossLayouts.push(item.fields)
      }
    });
    // console.log(profitLossLayouts, parentprofitLossLayouts);
    let newprofitLossLayouts = [];
    // Fetch Subchilds According to the Above grouping
    profitLossLayouts.forEach(function(item){
        let subAccounts = []
        let childAccounts = []
        let Level0Order =  item.Level0Order
        let ID =  item.ID
        profitLossLists.filter((subitem) => {
          let subLevel0Order =  subitem.fields.Level0Order
          let subID =  subitem.fields.ID
          if (subLevel0Order == Level0Order && ID != subID ) {
            subitem.subAccounts = [];
            subAccounts.push(subitem.fields);
          }
        });

        childAccounts = subAccounts.filter(( item ) => {
          let sLevel0Order =  item.Level0Order
          let sLevel1Order =  item.Level1Order
          let sLevel2Order =  item.Level2Order
          let sID =  item.ID
          if (sLevel1Order != 0 && sLevel0Order == Level0Order && sLevel2Order == 0 && sID != ID ) {
            let subSubAccounts = subAccounts.filter(( subitem ) => {
              let subID =  subitem.ID
              let subLevel0Order =  subitem.Level0Order
              let subLevel1Order =  subitem.Level1Order
              let subLevel2Order =  subitem.Level2Order
              if( sLevel1Order === subLevel1Order && subLevel0Order == sLevel0Order && sID != subID && subLevel2Order != 0){
                return subitem;
              }
            })
            item.subAccounts = subSubAccounts;
            return item;
          }
        });
        
        newprofitLossLayouts.push({
          ...item,
          subAccounts: childAccounts,
        });
      });
      templateObject.profitlosslayoutrecords.set(newprofitLossLayouts);

    // handle Dragging and sorting
    setTimeout(function () {
    
      var oldContainer;
      var group = $("ol.nested_with_switch").sortable({
          group: 'nested',
          exclude: '.noDrag',
          
          afterMove: function (placeholder, container) {
            if(oldContainer != container){
              if(oldContainer)
                oldContainer.el.removeClass("active");
                container.el.addClass("active");
              oldContainer = container;
            }
          },
          onDrop: function ($item, container, _super) {
            
            // On drag removing the dragged classs and colleps 
            if($item.parents().hasClass('groupedListNew')) {
            }else {
              $item.find('.mainHeadingDiv').removeClass('collapsTogls');
            }
            let siblingClass = $item.siblings().attr('class')
            $item.removeClass();
            $item.addClass(siblingClass);
            $item.addClass('selected');

            // for array
            // var data = group.sortable("serialize").get();
            // var jsonString = JSON.stringify(data, null, ' ');
            // console.log(jsonString);
            // container.el.removeClass("active");
            // _super($item, container);
          }
        });
       
        $('.collepsDiv').click(function(){
          $(this).parents('.mainHeadingDiv').toggleClass('collapsTogls');
        });
        $('.childInner, .mainHeadingDiv').mousedown(function(){
          $(this).parents('.vertical').find('.selected').removeClass('selected');
          $(this).parents('.vertical').find('.selected').removeClass('dragged');
          $(this).parent().addClass('selected');
        });
      
    }, 1000);    
    
  }
};
templateObject.getProfitLossLayout();

  // templateObject.getAllProductData();
  //templateObject.getDepartments();

  //Dragable items in edit layout screen
  //This works now: break at your own peril
  // setTimeout(function () {
  //   new layoutEditor(document.querySelector("#nplEditLayoutScreen"));
  // }, 1000);
  /*
  setTimeout(function(){

  $(".dragTable").sortable({
      revert: true,
       // cancel: ".tblAvoid"
  });
  $(".tblGroupAcc").sortable({
      revert: true,
     handle: ".tblAvoid"
  });
  $(".tblIndIvAcc").draggable({
      connectToSortable: ".tblGroupAcc",
      helper: "none",
      revert: "true"
  });
$('.tblAvoid').each(function(){
  $('.dragTable').append(<tbody class = "tblGroupAcc"></tbody>);
});
  $('.tblAvoid').nextAll('.tblIndIvAcc').css('background', 'red');
},3500);
*/

  //    $( "ul, li" ).disableSelection();
  //Dragable items in edit layout screen end
  /*Visually hide additional periods so that custom selection handles it*/

  setTimeout(function () {
    $(".pnlTable").show();
  }, 6000);
  /*Visual hide end*/
  // var eLayScreenArr = [];
  // var pnlTblArr = [];
  // var tbv1 = $('.fgrtotalName').length;
  // var tbv2 = $('.avoid').length;
  // for (let i = 0; i < tbv1; i++) {
  //     eLayScreenArr.push(i);
  // }
  // for (let k = 0; k < tbv2; k++) {
  //
  //     pnlTblArr.push(k);
  // }

  //            const sortArray = (eLayScreenArr, pnlTblArr) => {
  //                pnlTblArr.sort((a, b) => {
  //                    const aKey = Object.keys(a)[0];
  //                    const bKey = Object.keys(b)[0];
  //                    return eLayScreenArr.indexOf(aKey) - eLayScreenArr.indexOf(bKey);
  //                });
  //            };
  //            sortArray(eLayScreenArr, pnlTblArr);
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
  }

  //templateObject.loadCurrencyHistory();


  LoadingOverlay.hide();
});

Template.newprofitandloss.events({
  "click .pnlReportAccount": async function(e){
    let templateObject = Template.instance();    
    let accountName = $(e.target).data('account');
    const options = await templateObject.reportOptions.get();
    let dateFrom = moment(options.fromDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
    let dateTo = moment(options.toDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
    FlowRouter.go(`balancetransactionlist?accountName=${accountName}&toDate=${dateFrom}&fromDate=${dateTo}`);
  },
  "change input[type='checkbox']": (event) => {
    // This should be global
    $(event.currentTarget).attr(
      "checked",
      $(event.currentTarget).prop("checked")
    );
  },
  "click .currency-modal-save": (e) => {
    //$(e.currentTarget).parentsUntil(".modal").modal("hide");
    LoadingOverlay.show();
   // loadCurrencyHistory();
    

    let templateObject = Template.instance();

    // Get all currency list
    let _currencyList = templateObject.currencyList.get();

    // Get all selected currencies
    const currencySelected = $(".currency-selector-js:checked");
    let _currencySelectedList = [];
    if(currencySelected.length > 0) {
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
      let _currency = _currencyList.find((c) => c.currency == defaultCurrencyCode);
      _currency.active = true;
      _currencySelectedList.push(_currency);
    }
    
    
    //console.log("Selected currency list", _currencySelectedList);

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
      if (a.currency == defaultCurrencyCode) {
        return -1;
      }
      return 1;
    });

    // templateObject.activeCurrencyList.set(_activeCurrencyList);
    templateObject.currencyList.set(_currencyList);
    
    LoadingOverlay.hide();
  },
  "click #dropdownDateRang": function (e) {
    let dateRangeID = e.target.id;
    $("#btnSltDateRange").addClass("selectedDateRangeBtnMod");
    $("#selectedDateRange").show();
    if (dateRangeID == "thisMonth") {
      document.getElementById("selectedDateRange").value = "This Month";
    } else if (dateRangeID == "thisQuarter") {
      document.getElementById("selectedDateRange").value = "This Quarter";
    } else if (dateRangeID == "thisFinYear") {
      document.getElementById("selectedDateRange").value =
        "This Financial Year";
    } else if (dateRangeID == "lastMonth") {
      document.getElementById("selectedDateRange").value = "Last Month";
    } else if (dateRangeID == "lastQuarter") {
      document.getElementById("selectedDateRange").value = "Last Quarter";
    } else if (dateRangeID == "lastFinYear") {
      document.getElementById("selectedDateRange").value =
        "Last Financial Year";
    } else if (dateRangeID == "monthToDate") {
      document.getElementById("selectedDateRange").value = "Month to Date";
    } else if (dateRangeID == "quarterToDate") {
      document.getElementById("selectedDateRange").value = "Quarter to Date";
    } else if (dateRangeID == "finYearToDate") {
      document.getElementById("selectedDateRange").value = "Year to Date";
    }
  },
  "click .accountingBasisDropdown": function (e) {
    e.stopPropagation();
  },
  "click td a": function (event) {
    let id = $(event.target).closest("tr").attr("id").split("item-value-");
    var accountName = id[1].split("_").join(" ");
    let toDate = moment($("#dateTo").val())
      .clone()
      .endOf("month")
      .format("YYYY-MM-DD");
    let fromDate = moment($("#dateFrom").val())
      .clone()
      .startOf("year")
      .format("YYYY-MM-DD");
    //Session.setPersistent('showHeader',true);
    window.open(
      "/balancetransactionlist?accountName=" +
        accountName +
        "&toDate=" +
        toDate +
        "&fromDate=" +
        fromDate +
        "&isTabItem=" +
        false,
      "_self"
    );
  },
  "change .edtReportDates": function () {
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    var dateTo = new Date($("#dateTo").datepicker("getDate"));
    templateObject.setReportOptions(0, dateFrom, dateTo );
  },

  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    localStorage.setItem("VS1ProfitandLoss_ReportCompare", "");
    Meteor._reload.reload();
  },
  "click .btnPrintReport": function (event) {

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
                if (formIds.includes("129")) {
                    reportData.FormID = 129;
                    Meteor.call('sendNormalEmail', reportData);
                }
            } else {
                if (reportData.FormID == 129)
                    Meteor.call('sendNormalEmail', reportData);
            }
        }
    });

    document.title = 'Profit and Loss Report';
    $(".printReport").print({
      title: document.title + " | Profit and Loss | " + loggedCompany,
      noPrintSelector: ".addSummaryEditor, .excludeButton",
      exportOptions: {
        stripHtml: false,
      },
    });
  },
  "click .btnExportReportProfit": function () {
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

    const filename = loggedCompany + "-Profit and Loss" + ".csv";
    utilityService.exportReportToCsvTable("tableExport", filename, "csv");
    let rows = [];
    // reportService.getProfitandLoss(formatDateFrom,formatDateTo,false).then(function (data) {
    //     if(data.profitandlossreport){
    //         rows[0] = ['Account Type','Account Name', 'Account Number', 'Total Amount(EX)'];
    //         data.profitandlossreport.forEach(function (e, i) {
    //             rows.push([
    //               data.profitandlossreport[i]['AccountTypeDesc'],
    //               data.profitandlossreport[i].AccountName,
    //               data.profitandlossreport[i].AccountNo,
    //               // utilityService.modifynegativeCurrencyFormat(data.profitandlossreport[i]['Sub Account Total']),
    //               utilityService.modifynegativeCurrencyFormat(data.profitandlossreport[i].TotalAmount)]);
    //         });
    //         setTimeout(function () {
    //             utilityService.exportReportToCsv(rows, filename, 'xls');
    //             $('.fullScreenSpin').css('display','none');
    //         }, 1000);
    //     }
    //
    // });
  },

  "click .selPeriod": async function(e){
    let periods = $(e.target).data('period');
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    let defaultOptions = await templateObject.reportOptions.get();
    if( defaultOptions ){
      defaultOptions.compPeriod = periods;
      defaultOptions.departments = [];
    }
    await templateObject.reportOptions.set( defaultOptions );
    await templateObject.getProfitandLossReports();
  },

  //custom selection period number
  "click .btnSaveComparisonPeriods": async function (event) {
      let periods = $("#comparisonPeriodNum").val();
      $(".fullScreenSpin").css("display", "block");
      let templateObject = Template.instance();
      let defaultOptions = await templateObject.reportOptions.get();
      if( defaultOptions ){
        defaultOptions.compPeriod = periods;
        defaultOptions.departments = [];
      }
      await templateObject.reportOptions.set( defaultOptions );
      await templateObject.getProfitandLossReports();
  },

  // Current Month
  "click #thisMonth": function(){
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    let fromDate = moment().startOf('month').format('YYYY-MM-DD');
    let endDate   = moment().endOf('month').format('YYYY-MM-DD');
    templateObject.setReportOptions(0, fromDate, endDate );
  },

  "click #thisQuarter": function(){
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    let fromDate = moment().startOf("Q").format('YYYY-MM-DD');
    let endDate = moment().endOf("Q").format('YYYY-MM-DD');
    templateObject.setReportOptions(0, fromDate, endDate );
  },

  "click #thisFinYear": function(){
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    let fromDate = null;
    let endDate = null;    
    if (moment().quarter() == 4) {
      fromDate = moment().month("July").startOf("month").format('YYYY-MM-DD');
      endDate = moment().add(1, "year").month("June").endOf("month").format('YYYY-MM-DD');
    }else{
      fromDate = moment().subtract(1, "year").month("July").startOf("month").format('YYYY-MM-DD');
      endDate = moment().month("June").endOf("month").format('YYYY-MM-DD');
    }
    templateObject.setReportOptions(0, fromDate, endDate );
  },

  "click #lastMonth": function(){
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    let fromDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD')
    let endDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD')
    templateObject.setReportOptions(0, fromDate, endDate );
  },
  
  "click #lastQuarter": function () {
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    let fromDate = moment().subtract(1, "Q").startOf("Q").format("YYYY-MM-DD");
    let endDate = moment().subtract(1, "Q").endOf("Q").format("YYYY-MM-DD");
    templateObject.setReportOptions(0, fromDate, endDate );
  },

  "click #lastFinYear": function () {
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    let fromDate = null;
    let endDate = null;    
    if (moment().quarter() == 4) {
      fromDate = moment().subtract(1, "year").month("July").startOf("month").format("YYYY-MM-DD");
      endDate = moment().month("June").endOf("month").format("YYYY-MM-DD");
    } else {
      fromDate = moment().subtract(2, "year").month("July").startOf("month").format("YYYY-MM-DD");
      endDate = moment().subtract(1, "year").month("June").endOf("month").format("YYYY-MM-DD");
    }
    templateObject.setReportOptions(0, fromDate, endDate );
  },

  "click #monthToDate": function () {
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    let fromDate = moment().startOf("M").format("YYYY-MM-DD");
    let endDate = moment().format("YYYY-MM-DD");
    templateObject.setReportOptions(0, fromDate, endDate );
  },

  "click #quarterToDate": function () {
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    let fromDate = moment().startOf("Q").format("YYYY-MM-DD");
    let endDate = moment().format("YYYY-MM-DD");
    templateObject.setReportOptions(0, fromDate, endDate );
  },

  "click #finYearToDate": function () {
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    let fromDate = moment().month("january").startOf("month").format("YYYY-MM-DD");
    let endDate = moment().format("YYYY-MM-DD");
    templateObject.setReportOptions(0, fromDate, endDate );
  },

  "click .btnDepartmentSelect": async function(){
    let departments = []
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    $('.chkDepartment').each(function(){
      if( $(this).is(":checked") ){
        let dpt = $(this).val();
        departments.push(dpt)
      }
    });
    let defaultOptions = await templateObject.reportOptions.get();
    if( defaultOptions ){
      defaultOptions.compPeriod = 0;
      defaultOptions.departments = departments;
    }
    await templateObject.reportOptions.set( defaultOptions );
    await templateObject.getProfitandLossReports();
    $('#myModalDepartment').modal('hide');
  },

  "click #last12Months": function () {
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    localStorage.setItem("VS1ProfitandLoss_ReportCompare", "");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");

    let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if (currentDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentDate.getMonth() + 1);
    }
    if (currentDate.getDate() < 10) {
      fromDateDay = "0" + currentDate.getDate();
    }

    var fromDate =
      fromDateDay +
      "/" +
      fromDateMonth +
      "/" +
      Math.floor(currentDate.getFullYear() - 1);
    templateObject.dateAsAt.set(begunDate);
    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);

    var currentDate2 = new Date();
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    let getDateFrom =
      Math.floor(currentDate2.getFullYear() - 1) +
      "-" +
      Math.floor(currentDate2.getMonth() + 1) +
      "-" +
      currentDate2.getDate();
    templateObject.getProfitandLossReports(getDateFrom, getLoadDate, false);
  },
  "click #ignoreDate": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    localStorage.setItem("VS1ProfitandLoss_ReportCompare", "");
    $("#dateFrom").attr("readonly", true);
    $("#dateTo").attr("readonly", true);
    templateObject.dateAsAt.set("Current Date");
    templateObject.getProfitandLossReports("", "", true);
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

  "click .btnCloseCustomComparison": function (event) {},

  "click .lytAccountToggle": function (event) {
    $(".lytAccountToggle").each(function () {
      if ($(".lytAccountToggle").is(":checked")) {
        $(".btnAddGroup").hide();
        $(".btnGroupAccounts").show();
      } else {
        $(".btnAddGroup").show();
        $(".btnGroupAccounts").hide();
      }
    });
  },
  "click .btnMoveAccount": function (event) {
    $(".lytAccountToggle").each(function () {
      if ($(".lytAccountToggle").is(":checked")) {
        $("#nplMoveAccountScreen").modal("show");
      } else if ($(".lytAccountToggle").not(":checked")) {
        $("#nplNoSelection").modal("show");
      }
    });
  },
  "click .avoid": function (event) {
    $(".avoid").each(function () {
      $(this).click(function () {
        var el = $(this).attr("id");
        if (el === "gP") {
          $(this).addClass("currSelectedItem");
          $(".edlayCalculator").show();
          $(".editGroup").hide();
          $(".editDefault").hide();
          $(".groupRow").hide();
          $(".totalSelctor").hide();
          $(".pgbSideText").hide();
          $(".dateColumnTab").hide();
          $(".textBlockColumn").hide();
          $(".notesColumn").hide();
          $(".scheduleColumn").hide();
          $(".editRowGroup").hide();
          $(".rowEdLayCalculator").hide();
          $(".columnEdLayCalculator").hide();
          $(".budgetColumnTab").hide();
          $(".varianceColumnTab").hide();
          $(".percentageColumnTab").hide();
          $(".newDateColumnTab").hide();
          //                            $('.btnRowAccounts,.btnRowCustom').hide();
        } else if (el === "nP") {
          $(this).addClass("currSelectedItem");
          $(".edlayCalculator").show();
          $(".editGroup").hide();
          $(".editDefault").hide();
          $(".groupRow").hide();
          $(".totalSelctor").hide();
          $(".pgbSideText").hide();
          $(".dateColumnTab").hide();
          $(".textBlockColumn").hide();
          $(".notesColumn").hide();
          $(".scheduleColumn").hide();
          $(".editRowGroup").hide();
          $(".rowEdLayCalculator").hide();
          $(".columnEdLayCalculator").hide();
          $(".budgetColumnTab").hide();
          $(".varianceColumnTab").hide();
          $(".percentageColumnTab").hide();
          $(".newDateColumnTab").hide();
          $(".btnRowAccounts,.btnRowCustom").hide();
        } else {
          $(this).addClass("currSelectedItem");
          $(".editGroup").show();
          $(".edlayCalculator").hide();
          $(".editDefault").hide();
          $(".groupRow").hide();
          $(".totalSelctor").hide();
          $(".pgbSideText").hide();
          $(".dateColumnTab").hide();
          $(".textBlockColumn").hide();
          $(".notesColumn").hide();
          $(".scheduleColumn").hide();
          $(".editRowGroup").hide();
          $(".rowEdLayCalculator").hide();
          $(".columnEdLayCalculator").hide();
          $(".budgetColumnTab").hide();
          $(".varianceColumnTab").hide();
          $(".percentageColumnTab").hide();
          $(".newDateColumnTab").hide();
          $(".btnRowAccounts,.btnRowCustom").hide();
        }
      });
    });
  },

  /*Page break section display start*/
  "click .sortableAccount .draggable": function (event) {
    $(this).each(function () {
      $(this).click(function () {
        var el = $(this).attr("id");
        if (el === "pgBreak1") {
          $(this).addClass("currSelectedItem");
          $(".edlayCalculator").hide();
          $(".editGroup").hide();
          $(".editDefault").hide();
          $(".groupRow").hide();
          $(".pgbSideText").show();
          $(".totalSelctor").hide();
          $(".dateColumnTab").hide();
          $(".textBlockColumn").hide();
          $(".notesColumn").hide();
          $(".scheduleColumn").hide();
          $(".editRowGroup").hide();
          $(".rowEdLayCalculator").hide();
          $(".columnEdLayCalculator").hide();
          $(".budgetColumnTab").hide();
          $(".varianceColumnTab").hide();
          $(".percentageColumnTab").hide();
          $(".newDateColumnTab").hide();
          $(".btnRowAccounts,.btnRowCustom").hide();
        } else {
          $(".editGroup").show();
          $(".edlayCalculator").hide();
          $(".editDefault").hide();
          $(".groupRow").hide();
          $(".totalSelctor").hide();
          $(".pgbSideText").hide();
          $(".dateColumnTab").hide();
          $(".textBlockColumn").hide();
          $(".notesColumn").hide();
          $(".scheduleColumn").hide();
          $(".editRowGroup").hide();
          $(".rowEdLayCalculator").hide();
          $(".columnEdLayCalculator").hide();
          $(".budgetColumnTab").hide();
          $(".varianceColumnTab").hide();
          $(".percentageColumnTab").hide();
          $(".newDateColumnTab").hide();
          $(".btnRowAccounts,.btnRowCustom").hide();
        }
      });
    });
  },
  /*Page break section display end*/
  /*Total row display section start */
  "click .tot": function (event) {
    $(".edlayCalculator").hide();
    $(".editGroup").hide();
    $(".editDefault").hide();
    $(".groupRow").hide();
    $(".pgbSideText").hide();
    $(".totalSelctor").show();
    $(".dateColumnTab").hide();
    $(".textBlockColumn").hide();
    $(".notesColumn").hide();
    $(".scheduleColumn").hide();
    $(".editRowGroup").hide();
    $(".rowEdLayCalculator").hide();
    $(".columnEdLayCalculator").hide();
    $(".budgetColumnTab").hide();
    $(".varianceColumnTab").hide();
    $(".percentageColumnTab").hide();
    $(".newDateColumnTab").hide();
    $(".btnRowAccounts,.btnRowCustom").hide();
  },
  /*Total row display section end */
  /*edit layout button start*/
  "click .nplLayoutEditorBtn": function (event) {
    $(".editGroup").hide();
    $(".edlayCalculator").hide();
    $(".groupRow").hide();
    $(".editDefault").show();
    $(".totalSelctor").hide();
    $(".pgbSideText").hide();
    $(".dateColumnTab").hide();
    $(".textBlockColumn").hide();
    $(".notesColumn").hide();
    $(".scheduleColumn").hide();
    $(".editRowGroup").hide();
    $(".rowEdLayCalculator").hide();
    $(".columnEdLayCalculator").hide();
    $(".budgetColumnTab").hide();
    $(".varianceColumnTab").hide();
    $(".percentageColumnTab").hide();
    $(".newDateColumnTab").hide();
    $(".btnRowAccounts,.btnRowCustom").hide();
  },
  /*edit layout button end*/
  //calculator account selector
  "click .accValSelect": function (event) {
    var optSelectCheck = $(".accValSelect").val();
    if (optSelectCheck === null) {
      $(".nonOption").hide();
    } else {
      $(".nonOption").hide();

      //            var calcOptSelected = $('.accValSelect').val();
      //            var calcFieldContent = $('.calcField').val();

      //            var insblock = $('<input type="button" disabled class="calcVarBlock" data-formula-value="something1>');
      $(".calcField")
        .append(
          '<input type="button" disabled class="calcVarBlock" value="' +
            optSelectCheck +
            '">'
        )
        .val(optSelectCheck);
      optSelectCheck = null;
    }
  },
  //calculator account selector end

  //adding blocks
  //    'click .calcOption':function(event){
  //
  //            var calcOptSelected = $('.accValSelect').val();
  //            var calcFieldContent = $('.calcField').val();
  //
  //            var addCalcVarBlock = $('<input type="button" disabled class="calcVarBlock" data-formula-value="something1">').attr('value',calcOptSelected);
  //             $('.calcField').append(calcFieldContent+addCalcVarBlock);
  //    },
  //end adding blocks
  //calculator buttons
  /*    'click .opBtn':function (event){
        $('.opBtn').each(function () {
                var valEntry1 = $('.opBtn').val();
                var valEntry2 = $('.calcField').val();
                $('.calcField').val(valEntry2 + valEntry1);
                });
            }*/
  //calculator buttons currently
  "click .addition": function (event) {
    var valEntry1 = $(".addition").val();
    var valEntry2 = $(".calcField").val();
    //        $('.calcField').append(valEntry2 + valEntry1);
    $(".calcField").append(valEntry1);
  },
  "click .minus": function (event) {
    var valEntry1 = $(".minus").val();
    var valEntry2 = $(".calcField").val();
    //        $('.calcField').append(valEntry2 + valEntry1);
    $(".calcField").append(valEntry1);
  },
  "click .multi": function (event) {
    var valEntry1 = $(".multi").val();
    var valEntry2 = $(".calcField").val();
    //        $('.calcField').append(valEntry2 + valEntry1);
    $(".calcField").append(valEntry1);
  },
  "click .divide": function (event) {
    var valEntry1 = $(".divide").val();
    var valEntry2 = $(".calcField").val();
    //        $('.calcField').append(valEntry2 + valEntry1);
    $(".calcField").append(valEntry1);
  },
  "click .ifBlock": function (event) {
    var valEntry1 = $(".ifBlock").val();
    var valEntry2 = $(".calcField").val();
    //        $('.calcField').append(valEntry2 + valEntry1);
    $(".calcField").append(valEntry1);
  },
  //end calculator buttons

  //show group row section
  "click .sortableAccount .draggable": function (event) {
    $(".editGroup").hide();
    $(".edlayCalculator").hide();
    $(".groupRow").show();
    $(".editDefault").hide();
    $(".totalSelctor").hide();
    $(".pgbSideText").hide();
    $(".dateColumnTab").hide();
    $(".textBlockColumn").hide();
    $(".notesColumn").hide();
    $(".scheduleColumn").hide();
    $(".editRowGroup").hide();
    $(".rowEdLayCalculator").hide();
    $(".columnEdLayCalculator").hide();
    $(".budgetColumnTab").hide();
    $(".varianceColumnTab").hide();
    $(".percentageColumnTab").hide();
    $(".newDateColumnTab").hide();
    $(".btnRowAccounts,.btnRowCustom").hide();
  },
  //end group row section
  "click #pgBreak1,.pageBreakBar ": function (event) {
    $(this).addClass("currSelectedItem");
    $(".edlayCalculator").hide();
    $(".editGroup").hide();
    $(".editDefault").hide();
    $(".groupRow").hide();
    $(".pgbSideText").show();
    $(".totalSelctor").hide();
    $(".dateColumnTab").hide();
    $(".textBlockColumn").hide();
    $(".notesColumn").hide();
    $(".scheduleColumn").hide();
    $(".editRowGroup").hide();
    $(".rowEdLayCalculator").hide();
    $(".columnEdLayCalculator").hide();
    $(".budgetColumnTab").hide();
    $(".varianceColumnTab").hide();
    $(".percentageColumnTab").hide();
    $(".newDateColumnTab").hide();
    $(".btnRowAccounts,.btnRowCustom").hide();
  },
  "click .accdate": function (event) {
    $(".edlayCalculator").hide();
    $(".editGroup").hide();
    $(".editDefault").hide();
    $(".groupRow").hide();
    $(".pgbSideText").hide();
    $(".totalSelctor").hide();
    $(".dateColumnTab").show();
    $(".textBlockColumn").hide();
    $(".notesColumn").hide();
    $(".scheduleColumn").hide();
    $(".editRowGroup").hide();
    $(".rowEdLayCalculator").hide();
    $(".columnEdLayCalculator").hide();
    $(".budgetColumnTab").hide();
    $(".varianceColumnTab").hide();
    $(".percentageColumnTab").hide();
    $(".newDateColumnTab").hide();
    $(".btnRowAccounts,.btnRowCustom").hide();
  },

  //top row icon events
  "click .btnTextBlockColumn": function (event) {
    $(".edlayCalculator").hide();
    $(".editGroup").hide();
    $(".editDefault").hide();
    $(".groupRow").hide();
    $(".pgbSideText").hide();
    $(".totalSelctor").hide();
    $(".dateColumnTab").hide();
    $(".textBlockColumn").show();
    $(".notesColumn").hide();
    $(".scheduleColumn").hide();
    $(".editRowGroup").hide();
    $(".rowEdLayCalculator").hide();
    $(".columnEdLayCalculator").hide();
    $(".budgetColumnTab").hide();
    $(".varianceColumnTab").hide();
    $(".percentageColumnTab").hide();
    $(".newDateColumnTab").hide();
    $(".btnRowAccounts,.btnRowCustom").hide();
  },
  "click .btnNotes": function (event) {
    $(".edlayCalculator").hide();
    $(".editGroup").hide();
    $(".editDefault").hide();
    $(".groupRow").hide();
    $(".pgbSideText").hide();
    $(".totalSelctor").hide();
    $(".dateColumnTab").hide();
    $(".textBlockColumn").hide();
    $(".notesColumn").show();
    $(".scheduleColumn").hide();
    $(".editRowGroup").hide();
    $(".rowEdLayCalculator").hide();
    $(".columnEdLayCalculator").hide();
    $(".budgetColumnTab").hide();
    $(".varianceColumnTab").hide();
    $(".percentageColumnTab").hide();
    $(".newDateColumnTab").hide();
    $(".btnRowAccounts,.btnRowCustom").hide();
  },
  "click .btnscheduleColumn": function (event) {
    $(".edlayCalculator").hide();
    $(".editGroup").hide();
    $(".editDefault").hide();
    $(".groupRow").hide();
    $(".pgbSideText").hide();
    $(".totalSelctor").hide();
    $(".dateColumnTab").hide();
    $(".textBlockColumn").hide();
    $(".notesColumn").hide();
    $(".scheduleColumn").show();
    $(".editRowGroup").hide();
    $(".rowEdLayCalculator").hide();
    $(".columnEdLayCalculator").hide();
    $(".budgetColumnTab").hide();
    $(".varianceColumnTab").hide();
    $(".percentageColumnTab").hide();
    $(".newDateColumnTab").hide();
    $(".btnRowAccounts,.btnRowCustom").show();
  },
  "click .btnRowGroupColumn": function (event) {
    $(".edlayCalculator").hide();
    $(".editGroup").hide();
    $(".editDefault").hide();
    $(".groupRow").hide();
    $(".pgbSideText").hide();
    $(".totalSelctor").hide();
    $(".dateColumnTab").hide();
    $(".textBlockColumn").hide();
    $(".notesColumn").hide();
    $(".scheduleColumn").hide();
    $(".editRowGroup").show();
    $(".rowEdLayCalculator").hide();
    $(".columnEdLayCalculator").hide();
    $(".budgetColumnTab").hide();
    $(".varianceColumnTab").hide();
    $(".percentageColumnTab").hide();
    $(".newDateColumnTab").hide();
    $(".btnRowAccounts,.btnRowCustom").hide();
  },
  "click .btnRowFormulaColumn": function (event) {
    $(".edlayCalculator").hide();
    $(".editGroup").hide();
    $(".editDefault").hide();
    $(".groupRow").hide();
    $(".pgbSideText").hide();
    $(".totalSelctor").hide();
    $(".dateColumnTab").hide();
    $(".textBlockColumn").hide();
    $(".notesColumn").hide();
    $(".scheduleColumn").hide();
    $(".editRowGroup").hide();
    $(".rowEdLayCalculator").show();
    $(".columnEdLayCalculator").hide();
    $(".budgetColumnTab").hide();
    $(".varianceColumnTab").hide();
    $(".percentageColumnTab").hide();
    $(".newDateColumnTab").hide();
    $(".btnRowAccounts,.btnRowCustom").hide();
  },
  "click .btnColFormulaColumn": function (event) {
    $(".edlayCalculator").hide();
    $(".editGroup").hide();
    $(".editDefault").hide();
    $(".groupRow").hide();
    $(".pgbSideText").hide();
    $(".totalSelctor").hide();
    $(".dateColumnTab").hide();
    $(".textBlockColumn").hide();
    $(".notesColumn").hide();
    $(".scheduleColumn").hide();
    $(".editRowGroup").hide();
    $(".rowEdLayCalculator").hide();
    $(".columnEdLayCalculator").show();
    $(".budgetColumnTab").hide();
    $(".varianceColumnTab").hide();
    $(".percentageColumnTab").hide();
    $(".newDateColumnTab").hide();
    $(".btnRowAccounts,.btnRowCustom").hide();
  },
  "click .btnBudgetColumn": function (event) {
    $(".edlayCalculator").hide();
    $(".editGroup").hide();
    $(".editDefault").hide();
    $(".groupRow").hide();
    $(".pgbSideText").hide();
    $(".totalSelctor").hide();
    $(".dateColumnTab").hide();
    $(".textBlockColumn").hide();
    $(".notesColumn").hide();
    $(".scheduleColumn").hide();
    $(".editRowGroup").hide();
    $(".rowEdLayCalculator").hide();
    $(".columnEdLayCalculator").hide();
    $(".budgetColumnTab").show();
    $(".varianceColumnTab").hide();
    $(".percentageColumnTab").hide();
    $(".newDateColumnTab").hide();
    $(".btnRowAccounts,.btnRowCustom").hide();
  },
  "click .btnVarianceColumn": function (event) {
    $(".edlayCalculator").hide();
    $(".editGroup").hide();
    $(".editDefault").hide();
    $(".groupRow").hide();
    $(".pgbSideText").hide();
    $(".totalSelctor").hide();
    $(".dateColumnTab").hide();
    $(".textBlockColumn").hide();
    $(".notesColumn").hide();
    $(".scheduleColumn").hide();
    $(".editRowGroup").hide();
    $(".rowEdLayCalculator").hide();
    $(".columnEdLayCalculator").hide();
    $(".budgetColumnTab").hide();
    $(".varianceColumnTab").show();
    $(".percentageColumnTab").hide();
    $(".newDateColumnTab").hide();
    $(".btnRowAccounts,.btnRowCustom").hide();
  },
  "click .btnPercentageColumn": function (event) {
    $(".edlayCalculator").hide();
    $(".editGroup").hide();
    $(".editDefault").hide();
    $(".groupRow").hide();
    $(".pgbSideText").hide();
    $(".totalSelctor").hide();
    $(".dateColumnTab").hide();
    $(".textBlockColumn").hide();
    $(".notesColumn").hide();
    $(".scheduleColumn").hide();
    $(".editRowGroup").hide();
    $(".rowEdLayCalculator").hide();
    $(".columnEdLayCalculator").hide();
    $(".budgetColumnTab").hide();
    $(".varianceColumnTab").hide();
    $(".percentageColumnTab").show();
    $(".newDateColumnTab").hide();
    $(".btnRowAccounts,.btnRowCustom").hide();
  },
  "click .btnNewDateColumnTab": function (event) {
    $(".edlayCalculator").hide();
    $(".editGroup").hide();
    $(".editDefault").hide();
    $(".groupRow").hide();
    $(".pgbSideText").hide();
    $(".totalSelctor").hide();
    $(".dateColumnTab").hide();
    $(".textBlockColumn").hide();
    $(".notesColumn").hide();
    $(".scheduleColumn").hide();
    $(".editRowGroup").hide();
    $(".rowEdLayCalculator").hide();
    $(".columnEdLayCalculator").hide();
    $(".budgetColumnTab").hide();
    $(".varianceColumnTab").hide();
    $(".percentageColumnTab").hide();
    $(".newDateColumnTab").show();
    $(".btnRowAccounts,.btnRowCustom").hide();
  },
  //   'click .btnPageBreak':function(event){
  //       $('.sortableAccountParent').append('<div class="sortableAccount pageBreakBar"><div class="draggable" id="pgBreak1"><label class="col-12 dragAcc" style=" text-align: center; background-color:#00a3d3; border-color: #00a3d3;color:#fff;">Page break (row)</label></div></div>');
  // $(".sortableAccountParent").sortable({
  //     revert: true,
  //     cancel: ".undraggableDate,.accdate,.edtInfo"
  // });
  // $(".sortableAccount").sortable({
  //     revert: true,
  //     handle: ".avoid"
  // });
  // $(".draggable").draggable({
  //     connectToSortable: ".sortableAccount",
  //     helper: "none",
  //     revert: "true"
  // });
  //   },
  "click .btnDelSelected": function (event) {
    $(".currSelectedItem:nth-child(n)").remove();
  },
  "click .chkTotal": async function (event) {
    let templateObject = Template.instance();
    let options = await templateObject.reportOptions.get();
    if( $('.chkTotal').is(':checked') ){
      options.showtotal = true;
    }else{
      options.showtotal = false;
    }
    templateObject.reportOptions.set( options );
    setTimeout(function () {
      $("td a").each(function () {
        if (
          $(this)
            .text()
            .indexOf("-" + Currency) >= 0
        ) {
          $(this).addClass("text-danger");
          $(this).removeClass("fgrblue");
        }
      });
      $("td").each(function () {
        if (
          $(this)
            .text()
            .indexOf("-" + Currency) >= 0
        ) {
          $(this).addClass("text-danger");
          $(this).removeClass("fgrblue");
        }
      });
    }, 500);
  },
  "click .chkDecimals": async function (event) {
    let templateObject = Template.instance();
    let options = await templateObject.reportOptions.get();
    if( $('.chkDecimals').is(':checked') ){
      options.showDecimal = true;
    }else{
      options.showDecimal = false;
    }
    templateObject.reportOptions.set( options );
    setTimeout(function () {
      $("td a").each(function () {
        if (
          $(this)
            .text()
            .indexOf("-" + Currency) >= 0
        ) {
          $(this).addClass("text-danger");
          $(this).removeClass("fgrblue");
        }
      });
      $("td").each(function () {
        if (
          $(this)
            .text()
            .indexOf("-" + Currency) >= 0
        ) {
          $(this).addClass("text-danger");
          $(this).removeClass("fgrblue");
        }
      });
    }, 500);
  },
  
  "click .chkYTDate": function (event) {
    $(".tglYTD").toggle();
  },
  "click .chkAccBasis": function (event) {
    $(".tglAccBasis").toggle();
  },
  "click .chkAccCodes": function (event) {
    $(".tglAccCodes").toggle();
  },
  "click .rbAccrual": function (event) {
    $(".tglAccBasis").text("Accrual Basis");
    if ($(".chkAccBasis").is(":checked") ) {
      // $('.chkAccBasis').trigger('click');
      $(".tglAccBasis").text("Accrual Basis");

    } else if ($(".chkAccBasis").is(":not(:checked)")) {
      $(".tglAccBasis").text("Accrual Basis");
      $(".chkAccBasis").trigger("click");
      $(".chkAccBasis").prop("checked", true);

      // $('.chkAccBasis').trigger('click');
    }
  },
  "click .rbCash": function (event) {
    $(".tglAccBasis").text("Cash Basis");
    if ( $(".chkAccBasis").is(":checked") ) {
      $(".tglAccBasis").text("Cash Basis");
    } else if ($(".chkAccBasis").is(":not(:checked)")) {
      $(".tglAccBasis").text("Cash Basis");
      $(".chkAccBasis").trigger("click");
      $(".chkAccBasis").prop("checked", true);

      // $('.chkAccBasis').trigger('click');
    }
  },
  "click .chkDecimal": function (event) {
    // var takeIn;
    // $('.fgr.text-right').each(function () {
    //   takeIn = $(this).text().substring(1);
    //   takeIn = parseInt(takeIn);
    //   $('.fgr.text-right').text(takeIn);
    // })
    // var numVal = $('.fgr').html().parseInt();
  },
  "click #savePnLFieldsLayout": function(){
    let templateObject = Template.instance();
    let groupName = $('#newGroupName').val();
    if( groupName == '' ){
      swal({
        title: 'Please enter group name',
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Try Again'
      })
      return false;
    }
    let accountName = $('#nplPlaceInMoveSelection').val();
    let profitlosslayoutfields = templateObject.profitlosslayoutrecords.get();
    if (profitlosslayoutfields) {
      if( accountName == 'none' ){
        profitlosslayoutfields.push({
          Account: "",
          AccountID: 0,
          AccountLevel0GroupName: groupName,
          AccountLevel1GroupName: "",
          AccountLevel2GroupName: "",
          AccountName: groupName,
          Direction: "",
          GlobalRef: "DEF1",
          Group: "",
          ID: 0,
          ISEmpty: false,
          IsAccount: false,
          IsRoot: false,
          KeyStringFieldName: "",
          KeyValue: "",
          LayoutID: 1,
          LayoutToUse: "",
          Level: "",
          Level0Group: '',
          Level1Group: '',
          Level2Group: '',
          Level0Order: 1,
          Level1Order: 0,
          Level2Order: 0,
          Level3Order: 0,
          MsTimeStamp: "2022-04-06 16:00:23",
          MsUpdateSiteCode: "DEF",
          Parent: 0,
          Pos: "0",
          Position: 0,
          Recno: 3,
          Up: false,
          subAccounts: []
        });
        $("#newGroupName").val("");
        templateObject.profitlosslayoutrecords.set(profitlosslayoutfields);
      }else{
        let updateLayouts = profitlosslayoutfields.filter(function (item, index) {
          if (item.AccountName == accountName) {
            item.subAccounts.push({
              Account: "",
              AccountID: 0,
              AccountLevel0GroupName: item.AccountName,
              AccountLevel1GroupName: groupName,
              AccountLevel2GroupName: "",
              AccountName: groupName,
              Direction: "",
              GlobalRef: "DEF1",
              Group: "",
              ID: 0,
              ISEmpty: false,
              IsAccount: false,
              IsRoot: false,
              KeyStringFieldName: "",
              KeyValue: "",
              LayoutID: 1,
              LayoutToUse: "",
              Level: "",
              Level0Group: '',
              Level1Group: '',
              Level2Group: '',
              Level0Order: 0,
              Level1Order: 0,
              Level2Order: 0,
              Level3Order: 0,
              MsTimeStamp: "2022-04-06 16:00:23",
              MsUpdateSiteCode: "DEF",
              Parent: item.ID,
              Pos: "0",
              Position: 0,
              Recno: 3,
              Up: false,
            });
          }
          return item;
        });
        $("#newGroupName").val("");
        templateObject.profitlosslayoutrecords.set(updateLayouts);
      }
      
      $("#nplAddGroupScreen").modal("hide");
    }

  },
  "click .saveProfitLossLayouts": async function (){
    buildPositions();
    // Under progress
    const profitLossLayoutApis = new ProfitLossLayoutApi();

    // make post request to save layout data
    const apiEndpoint = profitLossLayoutApis.collection.findByName(
      profitLossLayoutApis.collectionNames.TProfitLossLayout
    );

    let templateObject = Template.instance();    

    /** Set layout positions */    
    buildPositions();
    
    let fieldsList = [];
    // Fetch default lists of layout
    let profitlosslayoutfields = await templateObject.profitlosslayoutfields.get();
    Array.prototype.forEach.call(profitlosslayoutfields, async (item) => {
      let Position = $(`[key='layoutFields-${item.fields.ID}']`).attr("position");
      if( Position != undefined ){
        if( $(`[key='layoutFields-${item.fields.ID}']`).hasClass('pSortItems') ){
          item.fields.Level0Order = parseInt(Position)
          item.fields.Level1Order = 0
          item.fields.Level2Order = 0
          item.fields.Level3Order = 0
        }

        if( $(`[key='layoutFields-${item.fields.ID}']`).hasClass('cSortItems') ){
          let level0OrderPos = $(`[key='layoutFields-${item.fields.ID}']`).parents(".pSortItems").attr('position');
          item.fields.Level0Order = parseInt(level0OrderPos)
          item.fields.Level1Order = parseInt(Position)
          item.fields.Level2Order = 0
          item.fields.Level3Order = 0
        }

        if( $(`[key='layoutFields-${item.fields.ID}']`).hasClass('scSortItems') ){
          let level0OrderPos = $(`[key='layoutFields-${item.fields.ID}']`).parents(".pSortItems").attr('position');
          let level1OrderPos = $(`[key='layoutFields-${item.fields.ID}']`).parents(".cSortItems").attr('position');
          item.fields.Level0Order = parseInt(level0OrderPos)
          item.fields.Level1Order = parseInt(level1OrderPos)
          item.fields.Level2Order = parseInt(Position)
          item.fields.Level3Order = 0
        }
        
      }
      const ApiResponse = await reportService.updateProfitandLossLayout(item.fields.ID, item.fields.Level0Order, item.fields.Level1Order, item.fields.Level2Order, item.fields.Level3Order);
      // console.log(ApiResponse)  
      return item;
      // fieldsList.push(item);
      /**
       * Update layout fields one by one API call
       */
      // const ApiResponse = await apiEndpoint.fetch(null, {
      //   method: "POST",
      //   headers: ApiService.getPostHeaders(),
      //   body: JSON.stringify(item),
      // });
      // if (ApiResponse.ok == true) {
      //   const jsonResponse = await ApiResponse.json();
      //   console.log(jsonResponse)
      // }
    });

    // console.log( 'profitlosslayoutfields', profitlosslayoutfields ) 

    /**
     * 
     * Update all layout fields index DB
     */
    let employeeID = Session.get("mySessionEmployeeLoggedID");
    let name = $('#nplLayoutName').val();
    let description = $('#nplLayoutDescr').val();
    let isdefault = ( $('#npldefaultSettting').is(':checked') )? true: false;
    let layoutLists = {
       Name: name,
       Description: description,
       Isdefault: isdefault,
       EmployeeID: employeeID,
       LayoutLists: profitlosslayoutfields
    }
    await addVS1Data('TProfitLossEditLayout', JSON.stringify(layoutLists));
  },
  "click .fx-rate-btn": (e) => {
    loadCurrency();
    //loadCurrencyHistory();
  }
});


Template.newprofitandloss.helpers({
  convertAmount: (amount, currencyData) => {
    let currencyList = Template.instance().tcurrencyratehistory.get(); // Get tCurrencyHistory

    // console.log("Amount to covert", amount);
    if(!amount) {
      return "";
    }
    if (currencyData.currency == defaultCurrencyCode) {
      // default currency
      return amount;
    }
    // Lets remove the minus character
    const isMinus = amount.indexOf('-') > -1;
    if(isMinus == true) amount = amount.replace('-', '');

    // get default currency symbol
    let _defaultCurrency = currencyList.filter(a => a.Code == defaultCurrencyCode)[0];
    //console.log("default: ",_defaultCurrency);
    amount = amount.replace(_defaultCurrency.symbol, '');
    // console.log("Is nan", amount, isNaN(amount));
    amount = isNaN(amount) == true ? parseFloat(amount.substring(1)) : parseFloat(amount);
    // console.log("Amount to convert", amount);
    // console.log("currency to convert to", currencyData);


    // Get the selected date
    let dateTo = $("#dateTo").val();
    const day = dateTo.split('/')[0];
    const m = dateTo.split('/')[1];
    const y = dateTo.split('/')[2];
    dateTo = new Date(y, m, day);
    dateTo.setMonth(dateTo.getMonth() - 1); // remove one month (because we added one before)
    // console.log('date to', dateTo);

    // Filter by currency code
    currencyList = currencyList.filter(a => a.Code == currencyData.currency);

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
    // console.log("Closests currency", firstElem);
    // console.log("Currency list: ", currencyList);

    let rate = firstElem.BuyRate; // Must used from tcurrecyhistory
    amount = parseFloat(amount * rate).toFixed(2); // Multiply by the rate
    //console.log("final amount", amount);
    let convertedAmount = isMinus == true ? `- ${currencyData.symbol} ${amount}` : `${currencyData.symbol} ${amount}`;
    //console.log(convertedAmount);

    return convertedAmount;
  },
  count: (array = []) => {
    return array.length;
  },
  countActive: (array = []) => {
    if(array.length == 0) {
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
    if(array.length == 0) {
      return false;
    }
    let activeArray = array.filter((c) => c.active == true);

    if(activeArray.length == 1) {
      //console.log(activeArray[0].currency);
      if(activeArray[0].currency == defaultCurrencyCode) {
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
  isAccount( layout ){
    if( layout.AccountID > 1 ){
      return true;
    }
    return false
  },
  loggedCompany: () => {
    return localStorage.getItem("mySession") || "";
  },
  reportOptions:() => {    
    return Template.instance().reportOptions.get();
  },
  formatDate( currentDate ){
    return moment(currentDate).format("DD/MM/YYYY");
  },
  profitlosslayoutrecords(){
    return Template.instance().profitlosslayoutrecords.get();
  },
  records: () => {
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
  recordslayout: () => {
    return Template.instance().recordslayout.get();
  },
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
  },
  companyname: () => {
    return loggedCompany;
  },
  
  deptrecords: () => {
    return Template.instance()
      .deptrecords.get()
      .sort(function (a, b) {
        if (a.department == "NA") {
          return 1;
        } else if (b.department == "NA") {
          return -1;
        }
        return a.department.toUpperCase() > b.department.toUpperCase() ? 1 : -1;
      });
  },
});

Template.registerHelper("equal", function (a, b) {
  return a == b;
});

Template.registerHelper("equals", function (a, b) {
  return a === b;
});

Template.registerHelper("notEquals", function (a, b) {
  return a != b;
});

Template.registerHelper("containsequals", function (a, b) {
  let chechTotal = false;
  if (a.toLowerCase().indexOf(b.toLowerCase()) >= 0) {
    chechTotal = true;
  }
  return chechTotal;
});

Template.registerHelper("shortDate", function (a) {
  let dateIn = a;
  let dateOut = moment(dateIn, "DD/MM/YYYY").format("MMM YYYY");
  return dateOut;
});

Template.registerHelper("noDecimal", function (a) {
  let numIn = a;
  // numIn= $(numIn).val().substring(1);
  // numIn= $(numIn).val().replace('$','');

  // numIn= $numIn.text().replace('-','');
  let numOut = parseInt(numIn);
  return numOut;
});


// /**
//  * This function will check each minus and add text-danger to that th
//  */
// function minusAmountsStyle() {
 
//   setTimeout(() => {
//     const elements = document.querySelectorAll(".fgr");

//     elements.forEach((element) => {
//       console.log(element.innerHTML);
//       if(element.innerHTML.includes('-')) {
//         element.classList.add('text-danger');
//       }
//     });

//   }, 3000);
  
// }


/**
 * 
 */
async function loadCurrency() {
  let templateObject = Template.instance();

  if(await templateObject.currencyList.get().length == 0) {
    LoadingOverlay.show();

    let _currencyList = [];
    const result = await taxRateService.getCurrencies();
  
    //taxRateService.getCurrencies().then((result) => {
      // console.log(result);
      const data = result.tcurrency;
      //console.log(data);
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
           active: data[i].Currency == defaultCurrencyCode ? true : false, // By default if AUD then true
          //active: false,
          // createdAt: new Date(data[i].MsTimeStamp) || "-",
          // formatedCreatedAt: formatDateToString(new Date(data[i].MsTimeStamp))
        };
    
        _currencyList.push(dataList);
        //}
      }
    
      // console.log(_currencyList);
    
      templateObject.currencyList.set(_currencyList);

      loadCurrencyHistory(templateObject);
      LoadingOverlay.hide();
    //});
  }
 
  
  
};

function loadCurrencyHistory(templateObject) {
  
  taxRateService
      .getCurrencyHistory()
      .then((result) => {
        //console.log(result);
        const data = result.tcurrencyratehistory;
        console.log('currencyratehistory', data);
        templateObject.tcurrencyratehistory.set(data);
      })
      .catch(function (err) {
        // Bert.alert('<strong>' + err + '</strong>!', 'danger');
        LoadingOverlay.hide();
        // Meteor._reload.reload();
      });
      LoadingOverlay.hide();
}