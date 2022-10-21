import { ContactService } from "../contacts/contact-service";
import { ReactiveVar } from "meteor/reactive-var";
import { CoreService } from "../js/core-service";
import { AccountService } from "../accounts/account-service";
import { UtilityService } from "../utility-service";
import { SalesBoardService } from "../js/sales-service";
import { SideBarService } from "../js/sidebar-service";
import "../lib/global/indexdbstorage.js";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
// Template.contactoverview.inheritsHelpersFrom('non_transactional_list');
// Template.contactoverview.inheritsEventsFrom('alltaskdatatable');
Template.contactoverview.inheritsHooksFrom('non_transactional_list');

Template.contactoverview.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  //templateObject.topTenData = new ReactiveVar([]);
  //templateObject.loggeduserdata = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
    templateObject.reset_data = new ReactiveVar([]);
});

Template.contactoverview.onRendered(function () {

});

Template.contactoverview.events({
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    sideBarService.getAllContactCombineVS1(initialDataLoad, 0).then(function (data) {
        addVS1Data("TERPCombinedContactsVS1", JSON.stringify(data)).then(function (datareturn) {
          sideBarService.getCurrentLoggedUser().then(function (dataUsers) {
            addVS1Data('TAppUser', JSON.stringify(dataUsers)).then(function (datareturn) {
                window.open("/contactoverview", "_self");
              }).catch(function (err) {
                window.open("/contactoverview", "_self");
              });
          });
          }).catch(function (err) {
            window.open("/contactoverview", "_self");
          });
      }).catch(function (err) {
        sideBarService.getCurrentLoggedUser().then(function (dataUsers) {
          addVS1Data('TAppUser', JSON.stringify(dataUsers)).then(function (datareturn) {
              window.open("/contactoverview", "_self");
            }).catch(function (err) {
              window.open("/contactoverview", "_self");
            });
        });
      });
  },
  "click .allList": function (event) {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    sideBarService
      .getAllContactCombineVS1(initialDataLoad, 0)
      .then(function (data) {
        addVS1Data("TERPCombinedContactsVS1", JSON.stringify(data))
          .then(function (datareturn) {
            window.open("/contactoverview?ignoredate=true", "_self");
          })
          .catch(function (err) {
            location.reload();
          });
      })
      .catch(function (err) {
        $(".fullScreenSpin").css("display", "none");
        // Meteor._reload.reload();
      });
  },
  "change #dateTo": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
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

    //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
    var formatDate =
      dateTo.getDate() +
      "/" +
      (dateTo.getMonth() + 1) +
      "/" +
      dateTo.getFullYear();
    //templateObject.dateAsAt.set(formatDate);
    if (
      $("#dateFrom").val().replace(/\s/g, "") == "" &&
      $("#dateFrom").val().replace(/\s/g, "") == ""
    ) {
    } else {
      templateObject.getAllFilterCombinedContactsData(
        formatDateFrom,
        formatDateTo,
        false
      );
    }
  },
  "change #dateFrom": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
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

    //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
    var formatDate =
      dateTo.getDate() +
      "/" +
      (dateTo.getMonth() + 1) +
      "/" +
      dateTo.getFullYear();
    //templateObject.dateAsAt.set(formatDate);
    if (
      $("#dateFrom").val().replace(/\s/g, "") == "" &&
      $("#dateFrom").val().replace(/\s/g, "") == ""
    ) {
    } else {
      templateObject.getAllFilterCombinedContactsData(
        formatDateFrom,
        formatDateTo,
        false
      );
    }
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
      fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
      fromDateMonth = currentBeginDate.getMonth() + 1;
    }

    if (currentBeginDate.getDate() < 10) {
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDateERPFrom =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;
    var toDateERPTo =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;

    var toDateDisplayFrom =
      fromDateDay + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();
    var toDateDisplayTo =
      fromDateDay + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();

    $("#dateFrom").val(toDateDisplayFrom);
    $("#dateTo").val(toDateDisplayTo);
    templateObject.getAllFilterCombinedContactsData(
      toDateERPFrom,
      toDateERPTo,
      false
    );
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
      fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
      fromDateMonth = currentBeginDate.getMonth() + 1;
    }

    if (currentBeginDate.getDate() < 10) {
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDateERPFrom =
      currentBeginDate.getFullYear() +
      "-" +
      fromDateMonth +
      "-" +
      (fromDateDay - 7);
    var toDateERPTo =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;

    var toDateDisplayFrom =
      fromDateDay -
      7 +
      "/" +
      fromDateMonth +
      "/" +
      currentBeginDate.getFullYear();
    var toDateDisplayTo =
      fromDateDay + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();

    $("#dateFrom").val(toDateDisplayFrom);
    $("#dateTo").val(toDateDisplayTo);
    templateObject.getAllFilterCombinedContactsData(
      toDateERPFrom,
      toDateERPTo,
      false
    );
  },
  "click #lastMonth": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();

    var prevMonthLastDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    var prevMonthFirstDate = new Date(
      currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1),
      (currentDate.getMonth() - 1 + 12) % 12,
      1
    );

    var formatDateComponent = function (dateComponent) {
      return (dateComponent < 10 ? "0" : "") + dateComponent;
    };

    var formatDate = function (date) {
      return (
        formatDateComponent(date.getDate()) +
        "/" +
        formatDateComponent(date.getMonth() + 1) +
        "/" +
        date.getFullYear()
      );
    };

    var formatDateERP = function (date) {
      return (
        date.getFullYear() +
        "-" +
        formatDateComponent(date.getMonth() + 1) +
        "-" +
        formatDateComponent(date.getDate())
      );
    };

    var fromDate = formatDate(prevMonthFirstDate);
    var toDate = formatDate(prevMonthLastDate);

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(toDate);

    var getLoadDate = formatDateERP(prevMonthLastDate);
    let getDateFrom = formatDateERP(prevMonthFirstDate);
    templateObject.getAllFilterCombinedContactsData(
      getDateFrom,
      getLoadDate,
      false
    );
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
      return m > 4 ? m - 4 : m;
    }

    var quarterAdjustment = (moment().month() % 3) + 1;
    var lastQuarterEndDate = moment()
      .subtract({
        months: quarterAdjustment,
      })
      .endOf("month");
    var lastQuarterStartDate = lastQuarterEndDate
      .clone()
      .subtract({
        months: 2,
      })
      .startOf("month");

    var lastQuarterStartDateFormat =
      moment(lastQuarterStartDate).format("DD/MM/YYYY");
    var lastQuarterEndDateFormat =
      moment(lastQuarterEndDate).format("DD/MM/YYYY");

    $("#dateFrom").val(lastQuarterStartDateFormat);
    $("#dateTo").val(lastQuarterEndDateFormat);

    let fromDateMonth = getQuarter(currentDate);
    var quarterMonth = getQuarter(currentDate);
    let fromDateDay = currentDate.getDate();

    var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
    let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
    templateObject.getAllFilterCombinedContactsData(
      getDateFrom,
      getLoadDate,
      false
    );
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
    let getDateFrom =
      Math.floor(currentDate2.getFullYear() - 1) +
      "-" +
      fromDateMonth2 +
      "-" +
      currentDate2.getDate();
    templateObject.getAllFilterCombinedContactsData(
      getDateFrom,
      getLoadDate,
      false
    );
  },
  "click #ignoreDate": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", true);
    $("#dateTo").attr("readonly", true);
    templateObject.getAllFilterCombinedContactsData("", "", true);
  },
  "click .chkDatatable": function (event) {
    var columns = $("#tblcontactoverview th");
    let columnDataValue = $(event.target)
      .closest("div")
      .find(".divcolumn")
      .text();

    $.each(columns, function (i, v) {
      let className = v.classList;
      let replaceClass = className[1];

      if (v.innerText == columnDataValue) {
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
  "keyup #tblcontactoverview_filter input": function (event) {
    if ($(event.target).val() != "") {
      $(".btnRefreshContactOverview").addClass("btnSearchAlert");
    } else {
      $(".btnRefreshContactOverview").removeClass("btnSearchAlert");
    }
    if (event.keyCode == 13) {
      $(".btnRefreshContactOverview").trigger("click");
    }
  },
  "click .btnRefreshContactOverview": function (event) {
    let templateObject = Template.instance();
    $('.fullScreenSpin').css('display', 'inline-block');
    const contactList = [];
    const clientList = [];
    let salesOrderTable;
    var splashArray = new Array();
    var splashArrayContactOverviewSearch = new Array();
    var splashArrayContactOverview = new Array();
    const dataTableList = [];
    const tableHeaderList = [];
    let dataSearchName = $('#tblcontactoverview_filter input').val()||'';
    if (dataSearchName.replace(/\s/g, '') != '') {
        sideBarService.getAllContactOverviewVS1ByName(dataSearchName.toLowerCase()).then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            let clienttype = '';
            let isprospect = false;
            let iscustomer = false;
            let isEmployee = false;
            let issupplier = false;
            $(".btnRefreshContactOverview").removeClass('btnSearchAlert');
            if (data.terpcombinedcontactsvs1.length > 0) {
              $("#tblcontactoverview > tbody").empty();

                for (let i = 0; i < data.terpcombinedcontactsvs1.length; i++) {

                        isprospect = data.terpcombinedcontactsvs1[i].isprospect;
                        iscustomer = data.terpcombinedcontactsvs1[i].iscustomer;
                        isEmployee = data.terpcombinedcontactsvs1[i].isEmployee;
                        issupplier = data.terpcombinedcontactsvs1[i].issupplier;

                        if((isprospect == true) && (iscustomer == true) && (isEmployee == true) && (issupplier == true)){
                            clienttype = "Customer / Employee / Supplier";
                        }else if((isprospect == true) && (iscustomer ==true) && (issupplier ==true)){
                            clienttype = "Customer / Supplier";
                        }else if((iscustomer ==true) && (issupplier ==true)){
                            clienttype = "Customer / Supplier";
                        }else if((iscustomer ==true)){

                            if (data.terpcombinedcontactsvs1[i].name.toLowerCase().indexOf("^") >= 0){
                                clienttype = "Job";
                            }else{
                                clienttype = "Customer";
                            }
                            // clienttype = "Customer";
                        }else if((isEmployee ==true)){
                            clienttype = "Employee";
                        }else if((issupplier ==true)){
                            clienttype = "Supplier";
                        }else if((isprospect ==true)){
                            clienttype = "Lead";
                        }else{
                            clienttype = " ";
                        }

                            let arBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].ARBalance)|| 0.00;
                            let creditBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditBalance) || 0.00;
                            let balance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].Balance)|| 0.00;
                            let creditLimit = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditLimit)|| 0.00;
                            let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].SalesOrderBalance)|| 0.00;
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
                              splashArrayContactOverviewSearch.push(dataList);
                            }
                        // $("#tblcontactoverview > tbody").append(
                        //     ' <tr class="dnd-moved" id="' + data.terpcombinedcontactsvs1[i].ID + '" style="cursor: pointer;">' +
                        //     '<td contenteditable="false" class="colClientName">' + data.terpcombinedcontactsvs1[i].name + '</td>' +
                        //     '<td contenteditable="false" class="colType">' + clienttype + '</td>' +
                        //     '<td contenteditable="false" class="colPhone" >' + data.terpcombinedcontactsvs1[i].phone + '</td>' +
                        //     '<td contenteditable="false" class="colMobile hiddenColumn">' + data.terpcombinedcontactsvs1[i].mobile + '</td>' +
                        //     '<td contenteditable="false" class="colARBalance" style="text-align: right!important;">' + arBalance + '</td>' +
                        //     '<td contenteditable="false" class="colCreditBalance" style="text-align: right!important;">' + creditBalance + '</td>' +
                        //     '<td contenteditable="false" class="colBalance" style="text-align: right!important;">' + balance + '</td>' +
                        //     '<td contenteditable="false" class="colCreditLimit" style="text-align: right!important;">' + creditLimit + '</td>' +
                        //     '<td contenteditable="false" class="colSalesOrderBalance" style="text-align: right!important;">' + salesOrderBalance + '</td>' +
                        //     '<td contenteditable="false" class="colEmail hiddenColumn">' + data.terpcombinedcontactsvs1[i].email + '</td>' +
                        //     '<td contenteditable="false" class="colCustFld1 hiddenColumn">' + data.terpcombinedcontactsvs1[i].CUSTFLD1 + '</td>' +
                        //     '<td contenteditable="false" class="colCustFld2 hiddenColumn">' + data.terpcombinedcontactsvs1[i].CUSTFLD2 + '</td>' +
                        //     '<td contenteditable="false" class="colAddress">' + data.terpcombinedcontactsvs1[i].street + '</td>' +
                        //     '</tr>');


                    // var dataListContact = [
                    //     '<div class="custom-control custom-checkbox chkBox chkBoxContact pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.terpcombinedcontactsvs1[i].ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.terpcombinedcontactsvs1[i].ID+'"></label></div>',
                    //     data.terpcombinedcontactsvs1[i].name || '-',
                    //     clienttype || '',
                    //     data.terpcombinedcontactsvs1[i].Phone || '',
                    //     data.terpcombinedcontactsvs1[i].mobile || '',
                    //     arBalance || 0.00,
                    //     creditBalance || 0.00,
                    //     balance || 0.00,
                    //     creditLimit || 0.00,
                    //     salesOrderBalance || 0.00,
                    //     data.terpcombinedcontactsvs1[i].email || '',
                    //     data.terpcombinedcontactsvs1[i].CUSTFLD1 || '',
                    //     data.terpcombinedcontactsvs1[i].CUSTFLD2 || '',
                    //     data.terpcombinedcontactsvs1[i].street || '',
                    //     data.terpcombinedcontactsvs1[i].ID || ''
                    //
                    // ];
                    // splashArrayContactList.push(dataListContact);
                    //}
                }
                var datatable = $('#tblcontactoverview').DataTable();
                datatable.clear();
                datatable.rows.add(splashArrayContactOverviewSearch);
                datatable.draw(false);
                $('.dataTables_info').html('Showing 1 to ' + data.terpcombinedcontactsvs1.length + ' of ' + data.terpcombinedcontactsvs1.length + ' entries');
                let reset_data = templateObject.reset_data.get();
                let customFieldCount = reset_data.length;

                for (let r = 0; r < customFieldCount; r++) {
                  if(reset_data[r].active == true){
                    $('#tblcontactoverview_wrapper .'+reset_data[r].class).removeClass('hiddenColumn');
                  }else if(reset_data[r].active == false){
                    $('#tblcontactoverview_wrapper .'+reset_data[r].class).addClass('hiddenColumn');
                  };
                };

                // var datatable = $('#tblcontactoverview').DataTable();
                // datatable.clear();
                // datatable.rows.add(splashArrayContactList);
                // datatable.draw(false);

                $('.fullScreenSpin').css('display', 'none');
            } else {

                $('.fullScreenSpin').css('display', 'none');
                $('#contactListModal').modal('toggle');
                swal({
                    title: 'Question',
                    text: "Contact does not exist, would you like to create it?",
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No'
                }).then((result) => {
                    if (result.value) {

                    } else if (result.dismiss === 'cancel') {
                        $('#contactListModal').modal('toggle');
                    }
                });

            }

        }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'none');
        });
    } else {
      sideBarService.getAllContactCombineVS1(initialBaseDataLoad, 0,deleteFilter).then(function (dataObjectnew) {

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

      var datatable = $('#tblcontactoverview').DataTable();
      datatable.clear();
      datatable.rows.add(uniqueChars);
      datatable.draw(false);

      $('.fullScreenSpin').css('display', 'none');

      }).catch(function (err) {
          $('.fullScreenSpin').css('display', 'none');
      });
      //$('.fullScreenSpin').css('display', 'none');
    }
  },
  'click .resetTable' : function(event){
    let templateObject = Template.instance();
    let reset_data = templateObject.reset_data.get();
      //reset_data[9].display = false;
      reset_data = reset_data.filter(redata => redata.display);

    $(".displaySettings").each(function (index) {
      let $tblrow = $(this);
      $tblrow.find(".divcolumn").text(reset_data[index].label);
      $tblrow.find(".custom-control-input").prop("checked", reset_data[index].active);

      let title = $("#tblcontactoverview").find("th").eq(index);
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
      let tableName = "tblcontactoverview";
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
                $('#tblcontactoverview_Modal').modal('hide');
            }
        });
      }else{
        $(".fullScreenSpin").css("display", "none");
      }

    },
  'click .chkDatatable7777': function(event) {
      let columnDataValue = $(event.target).closest("div").find(".divcolumn").attr('valueupdate');
      if ($(event.target).is(':checked')) {
        $('.'+columnDataValue).addClass('showColumn');
        $('.'+columnDataValue).removeClass('hiddenColumn');
      } else {
        $('.'+columnDataValue).addClass('hiddenColumn');
        $('.'+columnDataValue).removeClass('showColumn');
      }
  },
  "blur .divcolumn": function (event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target).closest("div.columnSettings").attr("id");

    var datable = $("#tblcontactoverview").DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  "change .rngRange": function (event) {
    let range = $(event.target).val();
    // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

    // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
    let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    var datable = $("#tblcontactoverview th");
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
    var columns = $("#tblcontactoverview th");

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
        sIndex: v.cellIndex || 0,
        sVisible: columVisible || false,
        sClass: v.className || "",
      };
      tableHeaderList.push(datatablerecordObj);
    });
    templateObject.tableheaderrecords.set(tableHeaderList);
  },
  "click #exportbtn": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblcontactoverview_wrapper .dt-buttons .btntabletocsv").click();
    $(".fullScreenSpin").css("display", "none");
  },
  "click .printConfirm": function (event) {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblcontactoverview_wrapper .dt-buttons .btntabletopdf").click();
    $(".fullScreenSpin").css("display", "none");
  },
  'click .templateDownload': function() {
        let utilityService = new UtilityService();
        let rows = [];
        const filename = 'SampleEmployee' + '.csv';
        rows[0] = ['First Name', 'Last Name', 'Phone', 'Mobile', 'Email', 'Skype', 'Street', 'City/Suburb', 'State', 'Post Code', 'Country', 'Gender'];
        rows[1] = ['John', 'Smith', '9995551213', '9995551213', 'johnsmith@email.com', 'johnsmith', '123 Main Street', 'Brooklyn', 'New York', '1234', 'United States', 'M'];
        rows[1] = ['Jane', 'Smith', '9995551213', '9995551213', 'janesmith@email.com', 'janesmith', '123 Main Street', 'Brooklyn', 'New York', '1234', 'United States', 'F'];
        utilityService.exportToCsv(rows, filename, 'csv');
    },
    'click .templateDownloadXLSX': function(e) {

        e.preventDefault(); //stop the browser from following
        window.location.href = 'sample_imports/SampleEmployee.xlsx';
    },
    'click .btnUploadFile': function(event) {
        $('#attachment-upload').val('');
        $('.file-name').text('');
        //$(".btnImport").removeAttr("disabled");
        $('#attachment-upload').trigger('click');

    },
    'change #attachment-upload': function(e) {
        let templateObj = Template.instance();
        var filename = $('#attachment-upload')[0].files[0]['name'];
        var fileExtension = filename.split('.').pop().toLowerCase();
        var validExtensions = ["csv", "txt", "xlsx"];
        var validCSVExtensions = ["csv", "txt"];
        var validExcelExtensions = ["xlsx", "xls"];

        if (validExtensions.indexOf(fileExtension) == -1) {
            swal('Invalid Format', 'formats allowed are :' + validExtensions.join(', '), 'error');
            $('.file-name').text('');
            $(".btnImport").Attr("disabled");
        } else if (validCSVExtensions.indexOf(fileExtension) != -1) {

            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];
            templateObj.selectedFile.set(selectedFile);
            if ($('.file-name').text() != "") {
                $(".btnImport").removeAttr("disabled");
            } else {
                $(".btnImport").Attr("disabled");
            }
        } else if (fileExtension == 'xlsx') {
            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];
            var oFileIn;
            var oFile = selectedFile;
            var sFilename = oFile.name;
            // Create A File Reader HTML5
            var reader = new FileReader();

            // Ready The Event For When A File Gets Selected
            reader.onload = function(e) {
                var data = e.target.result;
                data = new Uint8Array(data);
                var workbook = XLSX.read(data, {
                    type: 'array'
                });

                var result = {};
                workbook.SheetNames.forEach(function(sheetName) {
                    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        header: 1
                    });
                    var sCSV = XLSX.utils.make_csv(workbook.Sheets[sheetName]);
                    templateObj.selectedFile.set(sCSV);

                    if (roa.length) result[sheetName] = roa;
                });
                // see the result, caution: it works after reader event is done.

            };
            reader.readAsArrayBuffer(oFile);

            if ($('.file-name').text() != "") {
                $(".btnImport").removeAttr("disabled");
            } else {
                $(".btnImport").Attr("disabled");
            }

        }



    },
    'click .btnImport': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let contactService = new ContactService();
        let objDetails;
        var saledateTime = new Date();
        //let empStartDate = new Date().format("YYYY-MM-DD");
        var empStartDate = moment(saledateTime).format("YYYY-MM-DD");
        Papa.parse(templateObject.selectedFile.get(), {
            complete: function(results) {

                if (results.data.length > 0) {
                    if ((results.data[0][0] == "First Name") &&
                        (results.data[0][1] == "Last Name") && (results.data[0][2] == "Phone") &&
                        (results.data[0][3] == "Mobile") && (results.data[0][4] == "Email") &&
                        (results.data[0][5] == "Skype") && (results.data[0][6] == "Street") &&
                        ((results.data[0][7] == "Street2") || (results.data[0][7] == "City/Suburb")) && (results.data[0][8] == "State") &&
                        (results.data[0][9] == "Post Code") && (results.data[0][10] == "Country") &&
                        (results.data[0][11] == "Gender")) {

                        let dataLength = results.data.length * 500;
                        setTimeout(function() {
                            // $('#importModal').modal('toggle');
                            //Meteor._reload.reload();
                            window.open('/employeelist?success=true', '_self');
                        }, parseInt(dataLength));

                        for (let i = 0; i < results.data.length - 1; i++) {
                            objDetails = {
                                type: "TEmployee",
                                fields: {
                                    FirstName: results.data[i + 1][0].trim(),
                                    LastName: results.data[i + 1][1].trim(),
                                    Phone: results.data[i + 1][2],
                                    Mobile: results.data[i + 1][3],
                                    DateStarted: empStartDate,
                                    DOB: empStartDate,
                                    Sex: results.data[i + 1][11] || "F",
                                    Email: results.data[i + 1][4],
                                    SkypeName: results.data[i + 1][5],
                                    Street: results.data[i + 1][6],
                                    Street2: results.data[i + 1][7],
                                    Suburb: results.data[i + 1][7],
                                    State: results.data[i + 1][8],
                                    PostCode: results.data[i + 1][9],
                                    Country: results.data[i + 1][10]

                                    // BillStreet: results.data[i+1][6],
                                    // BillStreet2: results.data[i+1][7],
                                    // BillState: results.data[i+1][8],
                                    // BillPostCode:results.data[i+1][9],
                                    // Billcountry:results.data[i+1][10]
                                }
                            };
                            if (results.data[i + 1][1]) {
                                if (results.data[i + 1][1] !== "") {
                                    contactService.saveEmployee(objDetails).then(function(data) {
                                        ///$('.fullScreenSpin').css('display','none');
                                        //Meteor._reload.reload();
                                    }).catch(function(err) {
                                        //$('.fullScreenSpin').css('display','none');
                                        swal({
                                            title: 'Oooops...',
                                            text: err,
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {
                                                Meteor._reload.reload();
                                            } else if (result.dismiss === 'cancel') {}
                                        });
                                    });
                                }
                            }
                        }
                    } else {
                        $('.fullScreenSpin').css('display', 'none');
                        swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                    }
                } else {
                    $('.fullScreenSpin').css('display', 'none');
                    swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                }

            }
        });
    }
});

Template.contactoverview.helpers({
  datatablerecords: () => {
    return Template.instance()
      .datatablerecords.get()
      .sort(function (a, b) {
        if (a.clientname == "NA") {
          return 1;
        } else if (b.clientname == "NA") {
          return -1;
        }
        return a.clientname.toUpperCase() > b.clientname.toUpperCase() ? 1 : -1;
      });
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  purchasesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: Session.get("mycloudLogonID"),
      PrefName: "tblcontactoverview",
    });
  },

  Currency: () => {
    return Currency;
  },

  loggedCompany: () => {
    return localStorage.getItem("mySession") || "";
  },

  // custom fields displaysettings
  displayfields: () => {
    return Template.instance().displayfields.get();
  },
});
