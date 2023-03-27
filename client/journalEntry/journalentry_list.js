import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
import LoadingOverlay from '../LoadingOverlay';
import GlobalFunctions from '../GlobalFunctions';
import { TaxRateService } from '../settings/settings-service';
import FxGlobalFunctions from '../packages/currency/FxGlobalFunctions';
import CachedHttp from '../lib/global/CachedHttp';
import erpObject from '../lib/global/erp-objects';
import { Template } from 'meteor/templating';
import './journalentry_list.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
let utilityService = new UtilityService();
let sideBarService = new SideBarService();
let taxRateService = new TaxRateService();

let defaultCurrencyCode = CountryAbbr;

Template.journalentrylist.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.tableheaderrecords = new ReactiveVar([]);

  templateObject.getDataTableList = function(data){
    let totalDebitAmount = utilityService.modifynegativeCurrencyFormat(data.DebitAmount) || 0.0;
    let totalCreditAmount = utilityService.modifynegativeCurrencyFormat(data.CreditAmount) || 0.0;
    let totalTaxAmount = utilityService.modifynegativeCurrencyFormat(data.TaxAmount) || 0.0;
    let orderstatus = data.Deleted || "";
    if (data.Deleted == true) {
      orderstatus = "Deleted";
    } else if (data.IsOnHOLD == true) {
      orderstatus = "On Hold";
    } else if (data.Reconciled == true) {
      orderstatus = "Rec";
    }

    let dataList = [
      moment(data.TransactionDate).format("DD/MM/YYYY") || data.TransactionDate,
      data.GJID || "",
      data.AccountName || "",
      data.ClassName || "",
      totalDebitAmount || 0.0,
      totalCreditAmount || 0.0,
      totalTaxAmount || 0.0,
      orderstatus || "",
      data.Memo || ""
    ];
    return dataList;
  }

  let headerStructure = [
    { index: 0, label: 'Transaction Date', class:'colTransactionDate', active: true, display: true, width: "135" },
    { index: 1, label: 'Entry No', class:'colEntryNo text-right', active: true, display: true, width: "100" },
    { index: 2, label: 'Account Name', class:'colAccountName', active: true, display: true, width: "170" },
    { index: 3, label: 'Department', class:'colDepartmentName', active: true, display: true, width: "180" },
    { index: 4, label: 'Debit Amount', class:'colDebitAmount text-right', active: true, display: true, width: "150" },
    { index: 5, label: 'Credit Amount', class:'colCreditAmount text-right', active: true, display: true, width: "150" },
    { index: 6, label: 'Tax Amount', class:'colTaxAmount text-right', active: true, display: true, width: "150" },
    { index: 7, label: 'Status', class:'colStatus', active: true, display: true, width: "100" },
    { index: 8, label: 'Memo', class:'colMemo', active: true, display: true, width: "200" },
  ];
  templateObject.tableheaderrecords.set(headerStructure);

  // Currency related vars //
  FxGlobalFunctions.initVars(templateObject);

});

Template.journalentrylist.onRendered(function() {
  $('.fullScreenSpin').css('display','inline-block');
  let templateObject = Template.instance();
  let accountService = new AccountService();
  const customerList = [];
  let salesOrderTable;
  var splashArray = new Array();
  const dataTableList = [];
  const tableHeaderList = [];
  if(FlowRouter.current().queryParams.success){
    $('.btnRefresh').addClass('btnRefreshAlert');
  }

  var today = moment().format('DD/MM/YYYY');
  var currentDate = new Date();
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  let fromDateMonth = (currentDate.getMonth() + 1);
  let fromDateDay = currentDate.getDate();
  if ((currentDate.getMonth() + 1) < 10) {
      fromDateMonth = "0" + (currentDate.getMonth() + 1);
  }

  if (currentDate.getDate() < 10) {
      fromDateDay = "0" + currentDate.getDate();
  }
  var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();

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

  function MakeNegative() {

        $('td').each(function(){
          if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
         });
         $('td.colStatus').each(function(){
             if($(this).text() == "Deleted") $(this).addClass('text-deleted');
             if ($(this).text() == "Full") $(this).addClass('text-fullyPaid');
             if ($(this).text() == "Part") $(this).addClass('text-partialPaid');
             if ($(this).text() == "Rec") $(this).addClass('text-reconciled');
         });
  };

  templateObject.resetData = function (dataVal) {
      window.open('/journalentrylist?page=last', '_self');
  }

  $("#tblJournalList tbody").on("click", "tr", function () {
    var listData = $(this).closest("tr").find('.colEntryNo').text();
    var checkDeleted = $(this).closest("tr").find(".colStatus").text() || "";

    if (listData) {
      if (checkDeleted == "Deleted") {
        swal("You Cannot View This Transaction", "Because It Has Been Deleted", "info");
      } else {
        FlowRouter.go("/journalentrycard?id=" + listData);
      }
    }
  });
  
  templateObject.getAllFilterJournalEntryData = function(fromDate, toDate, ignoreDate) {
      sideBarService.getTJournalEntryListData(fromDate, toDate, ignoreDate,initialReportLoad,0).then(function(data) {
          addVS1Data('TJournalEntryList', JSON.stringify(data)).then(function(datareturn) {
            location.reload();
          }).catch(function(err) {
              location.reload();
          });
      }).catch(function(err) {
          $('.fullScreenSpin').css('display', 'none');
      });
  }

  let urlParametersDateFrom = FlowRouter.current().queryParams.fromDate;
  let urlParametersDateTo = FlowRouter.current().queryParams.toDate;
  let urlParametersIgnoreDate = FlowRouter.current().queryParams.ignoredate;
  if (urlParametersDateFrom) {
      if (urlParametersIgnoreDate == true) {
          $('#dateFrom').attr('readonly', true);
          $('#dateTo').attr('readonly', true);
      } else {
          $('#dateFrom').attr('readonly', false);
          $('#dateTo').attr('readonly', false);
          $("#dateFrom").val(urlParametersDateFrom != '' ? moment(urlParametersDateFrom).format("DD/MM/YYYY") : urlParametersDateFrom);
          $("#dateTo").val(urlParametersDateTo != '' ? moment(urlParametersDateTo).format("DD/MM/YYYY") : urlParametersDateTo);
      }
  }
  tableResize();





});

Template.journalentrylist.events({

  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();

    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = currentBeginDate.getMonth() + 1;
    let fromDateDay = currentBeginDate.getDate();
    if (currentBeginDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (
      currentBeginDate.getMonth() + 1);
    } else {
      fromDateMonth = currentBeginDate.getMonth() + 1;
    }

    if (currentBeginDate.getDate() < 10) {
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDate = currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;
    let prevMonth11Date = moment().subtract(reportsloadMonths, "months").format("YYYY-MM-DD");

    sideBarService.getAllPurchasesList(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      addVS1Data("TPurchasesList", JSON.stringify(data)).then(function (datareturn) {}).catch(function (err) {});
    }).catch(function (err) {});

    sideBarService.getTJournalEntryListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (dataJournal) {
      addVS1Data("TJournalEntryList", JSON.stringify(dataJournal)).then(function (datareturn) {
        sideBarService.getAllJournalEnrtryLinesList(initialDataLoad, 0).then(function (data) {
          addVS1Data("TJournalEntryLines", JSON.stringify(data)).then(function (datareturn) {
            window.open("/journalentrylist", "_self");
          }).catch(function (err) {
            window.open("/journalentrylist", "_self");
          });
        }).catch(function (err) {
          window.open("/journalentrylist", "_self");
        });
      }).catch(function (err) {
        sideBarService.getAllJournalEnrtryLinesList(initialDataLoad, 0).then(function (data) {
          addVS1Data("TJournalEntryLines", JSON.stringify(data)).then(function (datareturn) {
            window.open("/journalentrylist", "_self");
          }).catch(function (err) {
            window.open("/journalentrylist", "_self");
          });
        }).catch(function (err) {
          window.open("/journalentrylist", "_self");
        });
      });
    }).catch(function (err) {
      window.open("/journalentrylist", "_self");
    });
  },
  "change #dateTo": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    setTimeout(function () {
      var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
      var dateTo = new Date($("#dateTo").datepicker("getDate"));

      let formatDateFrom = dateFrom.getFullYear() + "-" + (
      dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
      let formatDateTo = dateTo.getFullYear() + "-" + (
      dateTo.getMonth() + 1) + "-" + dateTo.getDate();

      //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
      var formatDate = dateTo.getDate() + "/" + (
      dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
      //templateObject.dateAsAt.set(formatDate);
      if ($("#dateFrom").val().replace(/\s/g, "") == "" && $("#dateFrom").val().replace(/\s/g, "") == "") {} else {
        templateObject.getAllFilterJournalEntryData(formatDateFrom, formatDateTo, false);
      }
    }, 500);
  },
  "change #dateFrom": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    setTimeout(function () {
      var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
      var dateTo = new Date($("#dateTo").datepicker("getDate"));

      let formatDateFrom = dateFrom.getFullYear() + "-" + (
      dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
      let formatDateTo = dateTo.getFullYear() + "-" + (
      dateTo.getMonth() + 1) + "-" + dateTo.getDate();

      //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
      var formatDate = dateTo.getDate() + "/" + (
      dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
      //templateObject.dateAsAt.set(formatDate);
      if ($("#dateFrom").val().replace(/\s/g, "") == "" && $("#dateFrom").val().replace(/\s/g, "") == "") {} else {
        templateObject.getAllFilterJournalEntryData(formatDateFrom, formatDateTo, false);
      }
    }, 500);
  },
  "click #today": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = currentBeginDate.getMonth() + 1;
    let fromDateDay = currentBeginDate.getDate();
    if (currentBeginDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (
      currentBeginDate.getMonth() + 1);
    } else {
      fromDateMonth = currentBeginDate.getMonth() + 1;
    }

    if (currentBeginDate.getDate() < 10) {
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDateERPFrom = currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;
    var toDateERPTo = currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;

    var toDateDisplayFrom = fromDateDay + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();
    var toDateDisplayTo = fromDateDay + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();

    $("#dateFrom").val(toDateDisplayFrom);
    $("#dateTo").val(toDateDisplayTo);
    templateObject.getAllFilterJournalEntryData(toDateERPFrom, toDateERPTo, false);
  },
  "click #lastweek": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = currentBeginDate.getMonth() + 1;
    let fromDateDay = currentBeginDate.getDate();
    if (currentBeginDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (
      currentBeginDate.getMonth() + 1);
    } else {
      fromDateMonth = currentBeginDate.getMonth() + 1;
    }

    if (currentBeginDate.getDate() < 10) {
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDateERPFrom = currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + (
    fromDateDay - 7);
    var toDateERPTo = currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;

    var toDateDisplayFrom = fromDateDay - 7 + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();
    var toDateDisplayTo = fromDateDay + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();

    $("#dateFrom").val(toDateDisplayFrom);
    $("#dateTo").val(toDateDisplayTo);
    templateObject.getAllFilterJournalEntryData(toDateERPFrom, toDateERPTo, false);
  },
  "click #lastMonth": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();

    var prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    var prevMonthFirstDate = new Date(currentDate.getFullYear() - (
      currentDate.getMonth() > 0
      ? 0
      : 1), (currentDate.getMonth() - 1 + 12) % 12, 1);

    var formatDateComponent = function (dateComponent) {
      return (
        dateComponent < 10
        ? "0"
        : "") + dateComponent;
    };

    var formatDate = function (date) {
      return (formatDateComponent(date.getDate()) + "/" + formatDateComponent(date.getMonth() + 1) + "/" + date.getFullYear());
    };

    var formatDateERP = function (date) {
      return (date.getFullYear() + "-" + formatDateComponent(date.getMonth() + 1) + "-" + formatDateComponent(date.getDate()));
    };

    var fromDate = formatDate(prevMonthFirstDate);
    var toDate = formatDate(prevMonthLastDate);

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(toDate);

    var getLoadDate = formatDateERP(prevMonthLastDate);
    let getDateFrom = formatDateERP(prevMonthFirstDate);
    templateObject.getAllFilterJournalEntryData(getDateFrom, getLoadDate, false);
  },
  "click #lastQuarter": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");

    var begunDate = moment(currentDate).format("DD/MM/YYYY");

    function getQuarter(d) {
      d = d || new Date();
      var m = Math.floor(d.getMonth() / 3) + 2;
      return m > 4
        ? m - 4
        : m;
    }

    var quarterAdjustment = (moment().month() % 3) + 1;
    var lastQuarterEndDate = moment().subtract({months: quarterAdjustment}).endOf("month");
    var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({months: 2}).startOf("month");

    var lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
    var lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");

    $("#dateFrom").val(lastQuarterStartDateFormat);
    $("#dateTo").val(lastQuarterEndDateFormat);

    let fromDateMonth = getQuarter(currentDate);
    var quarterMonth = getQuarter(currentDate);
    let fromDateDay = currentDate.getDate();

    var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
    let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
    templateObject.getAllFilterJournalEntryData(getDateFrom, getLoadDate, false);
  },
  "click #last12Months": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");

    let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if (currentDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (
      currentDate.getMonth() + 1);
    }
    if (currentDate.getDate() < 10) {
      fromDateDay = "0" + currentDate.getDate();
    }

    var fromDate = fromDateDay + "/" + fromDateMonth + "/" + Math.floor(currentDate.getFullYear() - 1);
    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);

    var currentDate2 = new Date();
    if (currentDate2.getMonth() + 1 < 10) {
      fromDateMonth2 = "0" + Math.floor(currentDate2.getMonth() + 1);
    }
    if (currentDate2.getDate() < 10) {
      fromDateDay2 = "0" + currentDate2.getDate();
    }
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + fromDateMonth2 + "-" + currentDate2.getDate();
    templateObject.getAllFilterJournalEntryData(getDateFrom, getLoadDate, false);
  },
  "click #ignoreDate": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", true);
    $("#dateTo").attr("readonly", true);
    templateObject.getAllFilterJournalEntryData("", "", true);
  },
  "click #btnNewJournalEntry": function (event) {
    FlowRouter.go("/journalentrycard");
  },
  "click .chkDatatable": function (event) {
    var columns = $("#tblJournalList th");
    let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

    $.each(columns, function (i, v) {
      let className = v.classList;
      let replaceClass = className[1];

      if (v.innerText.trim() == columnDataValue) {

        if ($(event.target).is(":checked")) {
          $("." + replaceClass + "").css("display", "table-cell");
          $("." + replaceClass + "").css("padding", ".75rem");
          $("." + replaceClass + "").css("vertical-align", "top");
        } else {
          $("." + replaceClass + "").css("display", "none");
        }
      }
    });
  },
//   'click .chkDatatable': function(event) {
//     let columnDataValue = $(event.target).closest("div").find(".divcolumn").attr('valueupdate');
//     if ($(event.target).is(':checked')) {
//       $('.'+columnDataValue).addClass('showColumn');
//       $('.'+columnDataValue).removeClass('hiddenColumn');
//     } else {
//       $('.'+columnDataValue).addClass('hiddenColumn');
//       $('.'+columnDataValue).removeClass('showColumn');
//     }
// },

  "keyup #tblJournalList_filter input": function (event) {
    if ($(event.target).val() != "") {
      $(".btnRefreshJournalEntry").addClass("btnSearchAlert");
    } else {
      $(".btnRefreshJournalEntry").removeClass("btnSearchAlert");
    }
    if (event.keyCode == 13) {
      $(".btnRefreshJournalEntry").trigger("click");
    }
  },
  "click .btnRefreshJournalEntry": function (event) {
    $(".btnRefresh").trigger("click");
  },
  "click .resetTable": function (event) {
    var getcurrentCloudDetails = CloudUser.findOne({_id: localStorage.getItem("mycloudLogonID"), clouddatabaseID: localStorage.getItem("mycloudLogonDBID")});
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({userid: clientID, PrefName: "tblJournalList"});
        if (checkPrefDetails) {
          CloudPreference.remove({
            _id: checkPrefDetails._id
          }, function (err, idTag) {
            if (err) {} else {
              Meteor._reload.reload();
            }
          });
        }
      }
    }
  },
  "click .saveTable": function (event) {
    let lineItems = [];
    //let datatable =$('#tblJournalList').DataTable();
    $(".columnSettings").each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumn").text() || "";
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || "";
      var colHidden = false;
      if ($tblrow.find(".custom-control-input").is(":checked")) {
        colHidden = false;
      } else {
        colHidden = true;
      }
      let lineItemObj = {
        index: index,
        label: colTitle,
        hidden: colHidden,
        width: colWidth,
        thclass: colthClass
      };

      lineItems.push(lineItemObj);
    });
    //datatable.state.save();
    var getcurrentCloudDetails = CloudUser.findOne({_id: localStorage.getItem("mycloudLogonID"), clouddatabaseID: localStorage.getItem("mycloudLogonDBID")});
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({userid: clientID, PrefName: "tblJournalList"});
        if (checkPrefDetails) {
          CloudPreference.update({
            _id: checkPrefDetails._id
          }, {
            $set: {
              userid: clientID,
              username: clientUsername,
              useremail: clientEmail,
              PrefGroup: "salesform",
              PrefName: "tblJournalList",
              published: true,
              customFields: lineItems,
              updatedAt: new Date()
            }
          }, function (err, idTag) {
            if (err) {
              $("#myModal2").modal("toggle");
            } else {
              $("#myModal2").modal("toggle");
            }
          });
        } else {
          CloudPreference.insert({
            userid: clientID,
            username: clientUsername,
            useremail: clientEmail,
            PrefGroup: "salesform",
            PrefName: "tblJournalList",
            published: true,
            customFields: lineItems,
            createdAt: new Date()
          }, function (err, idTag) {
            if (err) {
              $("#myModal2").modal("toggle");
            } else {
              $("#myModal2").modal("toggle");
            }
          });
        }
      }
    }
    $("#myModal2").modal("toggle");
    //Meteor._reload.reload();
  },
  "blur .divcolumn": function (event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target).closest("div.columnSettings").attr("id");

    var datable = $("#tblJournalList").DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  "change .rngRange": function (event) {
    let range = $(event.target).val();
    // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

    // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
    let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    var datable = $("#tblJournalList th");
    $.each(datable, function (i, v) {
      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css("width", range + "px");
      }
    });
  },
  "click .btnOpenSettings": function (event) {
    let templateObject = Template.instance();
    var columns = $("#tblJournalList th");

    const tableHeaderList = [];
    let sTible = "";
    let sWidth = "";
    let sIndex = "";
    let sVisible = "";
    let columVisible = false;
    let sClass = "";
    $.each(columns, function (i, v) {
      if (v.hidden == false) {
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
        sClass: v.className || ""
      };
      tableHeaderList.push(datatablerecordObj);
    });

    templateObject.tableheaderrecords.set(tableHeaderList);
  },
  "click #exportbtn": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblJournalList_wrapper .dt-buttons .btntabletocsv").click();
    LoadingOverlay.hide();
  },
  "click .printConfirm": function (event) {
    playPrintAudio();
    setTimeout(function(){
      $(".fullScreenSpin").css("display", "inline-block");
      jQuery("#tblJournalList_wrapper .dt-buttons .btntabletopdf").click();
      LoadingOverlay.hide();
      }, delayTimeAfterSound);
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
});
Template.journalentrylist.helpers({
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  currencyList: () => {
    return Template.instance().currencyList.get();
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
  apiFunction:function() { // do not use arrow function
    return sideBarService.getTJournalEntryListData
  },
  apiParams: function() {
    return ['dateFrom', 'dateTo', 'ignoredate', 'limitCount', 'limitFrom', 'deleteFilter'];
  },
  service: ()=>{
    return sideBarService;
  },
  datahandler: function () {
    let templateObject = Template.instance();
    return function(data) {
        let dataReturn =  templateObject.getDataTableList(data)
        return dataReturn
    }
  }
});
