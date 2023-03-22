import { ReactiveVar } from "meteor/reactive-var";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import "../../../lib/global/indexdbstorage.js";
import { FixedAssetService } from "../../fixedasset-service.js";
let fixedAssetService = new FixedAssetService();

Template.serviceloglisttable.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.custfields = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);
  templateObject.convertedStatus = new ReactiveVar();

  templateObject.getDataTableList = function (data) {
    const dataList = [
      data.ServiceID || "",
      data.AssetCode || "",
      data.AssetName || "",
      data.ServiceType || "",
      data.ServiceDate || "",
      data.ServiceProvider || "",
      data.NextServiceDate || "",
      data.Done ? "Completed" : "Pending",
    ];
    return dataList;
  };

  templateObject.getExData = function (data) {
    const dataList = [
      data.ServiceID || "",
      data.AssetCode || "",
      data.AssetName || "",
      data.ServiceType || "",
      data.ServiceDate || "",
      data.ServiceProvider || "",
      data.NextServiceDate || "",
      data.Done ? "Completed" : "Pending",
    ];
    return dataList;
  };

  let headerStructure = [
    // { index: 0, label: '#Sort Date', class:'colSortDate', active: false, display: true, width: "20" },
    {
      index: 0,
      label: "#ID",
      class: "LogId",
      active: true,
      display: true,
      width: "150",
    },
    {
      index: 1,
      label: "Asset Code",
      class: "AssetCode",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 2,
      label: "Asset Name",
      class: "AssetName",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 3,
      label: "Service Type",
      class: "ServiceType",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 4,
      label: "Service Date",
      class: "ServiceDate",
      active: true,
      display: true,
      width: "350",
    },
    {
      index: 5,
      label: "Service Provider",
      class: "ServiceProvider",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 6,
      label: "Next Service Due Date",
      class: "ServiceDueDate",
      active: true,
      display: true,
      width: "350",
    },
    {
      index: 7,
      label: "Status",
      class: "ServiceStatus",
      active: true,
      display: true,
      width: "150",
    },
  ];
  templateObject.tableheaderrecords.set(headerStructure);
});
Template.serviceloglisttable.onRendered(function () {
  $("#tblServiceLogList tbody").on("click", "tr", function () {
    var ID = parseInt($(this).find(".LogId").html());
    FlowRouter.go("/servicelogcard?id=" + ID);
  });

  $(".fullScreenSpin").css("display", "inline-block");
  let templateObject = Template.instance();
  templateObject.convertedStatus.set(
    FlowRouter.current().queryParams.converted == "true"
      ? "Converted"
      : "Unconverted"
  );

  var today = moment().format("DD/MM/YYYY");
  var currentDate = new Date();
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  let fromDateMonth = currentDate.getMonth() + 1;
  let fromDateDay = currentDate.getDate();
  if (currentDate.getMonth() + 1 < 10) {
    fromDateMonth = "0" + (currentDate.getMonth() + 1);
  }

  if (currentDate.getDate() < 10) {
    fromDateDay = "0" + currentDate.getDate();
  }
  var fromDate =
    fromDateDay + "/" + fromDateMonth + "/" + currentDate.getFullYear();

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
    onChangeMonthYear: function (year, month, inst) {
      // Set date to picker
      $(this).datepicker(
        "setDate",
        new Date(year, inst.selectedMonth, inst.selectedDay)
      );
      // Hide (close) the picker
      // $(this).datepicker('hide');
      // // Change ttrigger the on change function
      // $(this).trigger('change');
    },
  });

  $("#dateFrom").val(fromDate);
  $("#dateTo").val(begunDate);

  templateObject.resetData = function (dataVal) {
    if (FlowRouter.current().queryParams.converted) {
      if (FlowRouter.current().queryParams.converted === true) {
        location.reload();
      } else {
        location.reload();
      }
    } else {
      location.reload();
    }
  };
});
Template.serviceloglisttable.events({
  "click #btnNewServiceLog": function () {
    FlowRouter.go("/servicelogcard");
  },

  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    fixedAssetService
      .getServiceLogList()
      .then(function (data) {
        addVS1Data("TServiceLogList", JSON.stringify(data))
          .then(function (datareturn) {
            window.open("/serviceloglist", "_self");
          })
          .catch(function (err) {
            window.open("/serviceloglist", "_self");
          });
      })
      .catch(function (err) {
        window.open("/serviceloglist", "_self");
      });
  },
});

Template.serviceloglisttable.helpers({
  datatablerecords: () => {
    return Template.instance().datatablerecords.get();
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "tblServiceLoglist",
    });
  },
  // custom fields displaysettings
  custfields: () => {
    return Template.instance().custfields.get();
  },

  // custom fields displaysettings
  displayfields: () => {
    return Template.instance().displayfields.get();
  },

  convertedStatus: () => {
    return Template.instance().convertedStatus.get();
  },

  apiFunction: function () {
    // do not use arrow function
    return fixedAssetService.getServiceLogList;
  },

  searchAPI: function () {
    return fixedAssetService.getServiceLogDetail;
  },

  apiParams: function () {
    return ["ID"];
  },

  service: () => {
    return fixedAssetService;
  },

  datahandler: function () {
    let templateObject = Template.instance();
    return function (data) {
      let dataReturn = templateObject.getDataTableList(data);
      return dataReturn;
    };
  },

  exDataHandler: function () {
    let templateObject = Template.instance();
    return function (data) {
      let dataReturn = templateObject.getExData(data);
      return dataReturn;
    };
  },
});
