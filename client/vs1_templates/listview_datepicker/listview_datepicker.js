import { ReactiveVar } from "meteor/reactive-var";
Template.listview_datepicker.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.expenseClaimList = new ReactiveVar([]);
  templateObject.listview_datepicker_displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);
});

// Template.internal_transaction_list_with_switchbox.onRendered(function () {
//   let templateObject = Template.instance();
//   $("#dateTo,#dateFrom").datepicker({
//     showOn: "button",
//     buttonText: "Show Date",
//     buttonImageOnly: true,
//     buttonImage: "/img/imgCal2.png",
//     dateFormat: "dd/mm/yy",
//     showOtherMonths: true,
//     selectOtherMonths: true,
//     changeMonth: true,
//     changeYear: true,
//     yearRange: "-90:+10",
//   });

//   templateObject.setTimeFilter = function (option) {
//     let startDate;
//     let endDate = moment().format("DD/MM/YYYY");
//     if (option == "lastMonth") {
//       startDate = moment().subtract(1, "months").format("DD/MM/YYYY");
//     } else if (option == "lastQuarter") {
//       startDate = moment().subtract(1, "quarter").format("DD/MM/YYYY");
//     } else if (option == "last12Months") {
//       startDate = moment().subtract(12, "months").format("DD/MM/YYYY");
//     } else if (option == "ignoreDate") {
//       startDate = "";
//       endDate = "";
//     }
//     $("#dateFrom").val(startDate);
//     $("#dateTo").val(endDate);
//     $("#dateFrom").trigger("change");
//   };

//   $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
//     let date;
//     let max;
//     let min;
//     min = $("#dateFrom").val();
//     max = $("#dateTo").val();
//     let startDate = moment(min, "DD/MM/YYYY");
//     let endDate = moment(max, "DD/MM/YYYY");
//     date = moment(data[1], "DD/MM/YYYY");
//     return (
//       (min === "" && max === "") ||
//       (min === "" && date <= endDate) ||
//       (startDate <= date && max === null) ||
//       (startDate <= date && date <= endDate)
//     );
//   });

//   jQuery.extend(jQuery.fn.dataTableExt.oSort, {
//     "extract-date-pre": function (date) {
//       date = date.split("/");
//       return Date.parse(date[1] + "/" + date[0] + "/" + date[2]);
//     },
//     "extract-date-asc": function (a, b) {
//       return a < b ? -1 : a > b ? 1 : 0;
//     },
//     "extract-date-desc": function (a, b) {
//       return a < b ? 1 : a > b ? -1 : 0;
//     },
//   });

//   let currenttablename = templateObject.data.tablename || "";

//   templateObject.tablename.set(currenttablename);

//   // set initial table rest_data
//   templateObject.init_reset_data = function () {
//     let reset_data = [];
//     reset_data = [
//       {
//         index: 1,
//         label: "Date",
//         class: "colReceiptDate",
//         active: true,
//         display: true,
//         width: "120px",
//       },
//       {
//         index: 2,
//         label: "Supplier",
//         class: "colReceiptSupplier",
//         active: true,
//         display: true,
//         width: "80px",
//       },
//       {
//         index: 3,
//         label: "Amount",
//         class: "colReceiptAmount",
//         active: true,
//         display: true,
//         width: "80px",
//       },
//       {
//         index: 4,
//         label: "Account",
//         class: "colReceiptAccount",
//         active: true,
//         display: true,
//       },
//       {
//         index: 5,
//         label: "Trip-Group",
//         class: "colReceiptTripGroup",
//         active: true,
//         display: true,
//       },
//       {
//         index: 6,
//         label: "Description",
//         class: "colReceiptDesc",
//         active: true,
//         display: true,
//         width: "30%",
//       },
//       {
//         index: 7,
//         label: "Reimbursement",
//         class: "colReimbursement",
//         active: false,
//         display: true,
//       },
//       {
//         index: 8,
//         label: "Supplier ID",
//         class: "colSupplierID",
//         active: false,
//         display: true,
//       },
//       {
//         index: 9,
//         label: "Account ID",
//         class: "colAccountID",
//         active: false,
//         display: true,
//       },
//       {
//         index: 10,
//         label: "Employee ID",
//         class: "colEmployeeID",
//         active: false,
//         display: true,
//       },
//       {
//         index: 11,
//         label: "Employee Name",
//         class: "colEmployeeName",
//         active: false,
//         display: true,
//       },
//       {
//         index: 12,
//         label: "TaxCode",
//         class: "colTaxCode",
//         active: false,
//         display: true,
//       },
//       {
//         index: 13,
//         label: "TaxAmount",
//         class: "colTaxAmount",
//         active: false,
//         display: true,
//       },
//       {
//         index: 14,
//         label: "AmountEx",
//         class: "colAmountEx",
//         active: false,
//         display: true,
//       },
//       {
//         index: 15,
//         label: "AmountInc",
//         class: "colAmountInc",
//         active: false,
//         display: true,
//       },
//       {
//         index: 16,
//         label: "LineID",
//         class: "colLineID",
//         active: false,
//         display: true,
//       },
//     ];

//     templateObject.reset_data.set(reset_data);
//   };
//   templateObject.init_reset_data();

//   templateObject.initCustomFieldDisplaySettings = function (data, listType) {
//     //function initCustomFieldDisplaySettings(data, listType) {
//     let templateObject = Template.instance();
//     let reset_data = templateObject.reset_data.get();
//     templateObject.showCustomFieldDisplaySettings(reset_data);

//     // try {
//     //   getVS1Data("VS1_Customize").then(function (dataObject) {
//     //     if (dataObject.length == 0) {
//     //       sideBarService
//     //         .getNewCustomFieldsWithQuery(
//     //           parseInt(localStorage.getItem("mySessionEmployeeLoggedID")),
//     //           listType
//     //         )
//     //         .then(function (data) {
//     //           reset_data = data.ProcessLog.Obj.CustomLayout[0].Columns;
//     //           templateObject.showCustomFieldDisplaySettings(reset_data);
//     //         })
//     //         .catch(function (err) {});
//     //     } else {
//     //       let data = JSON.parse(dataObject[0].data);
//     //       if (data.ProcessLog.Obj.CustomLayout.length > 0) {
//     //         for (let i = 0; i < data.ProcessLog.Obj.CustomLayout.length; i++) {
//     //           if (data.ProcessLog.Obj.CustomLayout[i].TableName == listType) {
//     //             reset_data = data.ProcessLog.Obj.CustomLayout[i].Columns;
//     //             templateObject.showCustomFieldDisplaySettings(reset_data);
//     //           }
//     //         }
//     //       }
//     //     }
//     //   });
//     // } catch (error) {}
//     return;
//   };

//   templateObject.showCustomFieldDisplaySettings = async function (reset_data) {
//     //function showCustomFieldDisplaySettings(reset_data) {
//     let custFields = [];
//     let customData = {};
//     let customFieldCount = reset_data.length;
//     for (let r = 0; r < customFieldCount; r++) {
//       customData = {
//         active: reset_data[r].active,
//         id: reset_data[r].index,
//         custfieldlabel: reset_data[r].label,
//         class: reset_data[r].class,
//         display: reset_data[r].display,
//         width: reset_data[r].width ? reset_data[r].width : "",
//       };

//       if (reset_data[r].active == true) {
//         $("#" + currenttablename + " ." + reset_data[r].class).removeClass(
//           "hiddenColumn"
//         );
//       } else if (reset_data[r].active == false) {
//         $("#" + currenttablename + " ." + reset_data[r].class).addClass(
//           "hiddenColumn"
//         );
//       }
//       // custpush(customData);
//     }
//     await templateObject.listview_datepicker_displayfields.set(custFields);
//     $(".dataTable").resizable();
    
//   };
//   templateObject.initCustomFieldDisplaySettings("", currenttablename);

//   templateObject.resetData = function (dataVal) {
//     location.reload();
//   };

// });

// Template.internal_transaction_list_with_switchbox.events({
//     listview_datepicker_displayfields: () => {
//         return Template.instance().listview_datepicker_displayfields.get();
//     },
// });

Template.receiptsoverview.helpers({});
