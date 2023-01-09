import { ReactiveVar } from "meteor/reactive-var";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ServiceLogService } from "../../servicelog-service";
import { FixedAssetService } from "../../fixedasset-service";
import { SideBarService } from "../../../js/sidebar-service";
import { UtilityService } from "../../../utility-service";
import "../../../lib/global/indexdbstorage.js";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let fixedAssetService = new FixedAssetService();
let serviceLogService = new ServiceLogService();

Template.serviceloglisttable.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);
});

Template.serviceloglisttable.onRendered(function () {
  // $(".fullScreenSpin").css("display", "inline-block");
  let templateObject = Template.instance();

  // set initial table rest_data
  templateObject.init_reset_data = function () {
    let reset_data = [
      { index: 0, label: 'ID', class: 'LogId', active: false, display: false, width: "0" },
      { index: 1, label: 'Asset Code', class: 'AssetCode', active: true, display: true, width: "" },
      { index: 2, label: 'Asset Name', class: 'AssetName', active: true, display: true, width: "" },
      { index: 3, label: 'Service Type', class: 'ServiceType', active: true, display: true, width: "" },
      { index: 4, label: 'Service Date', class: 'ServiceDate', active: true, display: true, width: "" },
      { index: 5, label: 'Service Provider', class: 'ServiceProvider', active: true, display: true, width: "" },
      { index: 6, label: 'Next Service Due Date', class: 'ServiceDueDate', active: true, display: true, width: "" },
      { index: 7, label: 'Status', class: 'ServiceStatus', active: true, display: true, width: "" },
    ];

    let templateObject = Template.instance();
    templateObject.reset_data.set(reset_data);
  }
  templateObject.init_reset_data();
  // set initial table rest_data

  // custom field displaysettings
  templateObject.initCustomFieldDisplaySettings = function (listType) {
    let reset_data = templateObject.reset_data.get();
    showCustomFieldDisplaySettings(reset_data);

    try {
      getVS1Data("VS1_Customize").then(function (dataObject) {
        if (dataObject.length == 0) {
          sideBarService.getNewCustomFieldsWithQuery(parseInt(localStorage.getItem('mySessionEmployeeLoggedID')), listType).then(function (data) {
            reset_data = data.ProcessLog.Obj.CustomLayout[0].Columns;
            showCustomFieldDisplaySettings(reset_data);
          }).catch(function (err) {
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          if(data.ProcessLog.Obj.CustomLayout.length > 0){
           for (let i = 0; i < data.ProcessLog.Obj.CustomLayout.length; i++) {
             if(data.ProcessLog.Obj.CustomLayout[i].TableName == listType){
               reset_data = data.ProcessLog.Obj.CustomLayout[i].Columns;
               showCustomFieldDisplaySettings(reset_data);
             }
           }
         };
          // handle process here
        }
      });
    } catch (error) {
    }
    return;
  }

  function showCustomFieldDisplaySettings(reset_data) {
    let custFields = [];
    let customData = {};
    let customFieldCount = reset_data.length;

    for (let r = 0; r < customFieldCount; r++) {
      customData = {
        active: reset_data[r].active,
        id: reset_data[r].index,
        custfieldlabel: reset_data[r].label,
        class: reset_data[r].class,
        display: reset_data[r].display,
        width: reset_data[r].width ? reset_data[r].width : ''
      };
      custFields.push(customData);
    }
    templateObject.displayfields.set(custFields);
  }

  templateObject.initCustomFieldDisplaySettings("tblServiceLogList");
  // set initial table rest_data  //
  templateObject.getServiceLogList = function () {
    getVS1Data("getServiceLogList").then(function (dataObject) {
      if (dataObject.length == 0) {
        serviceLogService.getServiceLogList().then(function (data) {
          setServiceLogList(data);
        }).catch(function (err) {
          $(".fullScreenSpin").css("display", "none");
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        setServiceLogList(data);
      }
    }).catch(function (err) {
      serviceLogService.getServiceLogList().then(function (data) {
        setServiceLogList(data);
      }).catch(function (err) {
        $(".fullScreenSpin").css("display", "none");
      });
    });
  };

  $(".fullScreenSpin").css("display", "inline-block");
  templateObject.getServiceLogList();

  function setServiceLogList(data) {
    addVS1Data('TServiceLogList', JSON.stringify(data));
    console.log("Tserviceloglist", data);
    const dataTableList = [];

    for (const log of data.tserviceloglist) {
      const dataList = {
        id: log.fields.ServiceID || "",
        assetCode: log.AssetCode || "",
        assetName: log.AssetName || "",
        serviceType: log.serviceType || "",
        serviceDate: log.ServiceDate || "",
        serviceProvider: log.ServiceProvider || "",
        nextServiceDate: log.NextServiceDate || "",
        // serviceNotes: log.ServiceNotes || "",
        status: log.Done || "",
      };
      dataTableList.push(dataList);
    }

    templateObject.datatablerecords.set(dataTableList);

    $(".fullScreenSpin").css("display", "none");
    setTimeout(function () {
      $("#tblServiceLogList").DataTable({
        columnDefs: [
        ],
        select: true,
        destroy: true,
        colReorder: true,
        sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
        buttons: [{
          extend: "csvHtml5",
          text: "",
          download: "open",
          className: "btntabletocsv hiddenColumn",
          filename: "FixedAssetsOverview__" + moment().format(),
          orientation: "portrait",
          exportOptions: {
            columns: ":visible",
          },
        },
        {
          extend: "print",
          download: "open",
          className: "btntabletopdf hiddenColumn",
          text: "",
          title: "Accounts Overview",
          filename: "Accounts Overview_" + moment().format(),
          exportOptions: {
            columns: ":visible",
          },
        },
        {
          extend: "excelHtml5",
          title: "",
          download: "open",
          className: "btntabletoexcel hiddenColumn",
          filename: "FixedAssetsOverview__" + moment().format(),
          orientation: "portrait",
          exportOptions: {
            columns: ":visible",
          },
        },
        ],
        pageLength: initialDatatableLoad,
        lengthMenu: [
          [initialDatatableLoad, -1],
          [initialDatatableLoad, "All"],
        ],
        info: true,
        responsive: true,
        order: [
          [0, "asc"]
        ],
        // "aaSorting": [[1,'desc']],
        action: function () {
          $("#tblServiceLogList").DataTable().ajax.reload();
        },
        language: { search: "", searchPlaceholder: "Search List..." },
        fnDrawCallback: function (oSettings) {
        },
        fnInitComplete: function () {
          $(
            "<button class='btn btn-primary btnSearchFixedAccount' type='button' id='btnSearchFixedAccount' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
          ).insertAfter("#tblServiceLogList_filter");
        },
      })
        .on("page", function () {
          let draftRecord = templateObject.datatablerecords.get();
          templateObject.datatablerecords.set(draftRecord);
        })
        .on("column-reorder", function () { })
        .on("length.dt", function (e, settings, len) {
        });
    }, 10);
  }

});

Template.serviceloglisttable.events({
  "mouseover .card-header": (e) => {
    $(e.currentTarget).parent(".card").addClass("hovered");
  },
  "mouseleave .card-header": (e) => {
    $(e.currentTarget).parent(".card").removeClass("hovered");
  },
  // custom field displaysettings
  "click .resetTable": async function (event) {
    let templateObject = Template.instance();
    let reset_data = templateObject.reset_data.get();
    reset_data = reset_data.filter(redata => redata.display);

    $(".customDisplaySettings").each(function (index) {
      let $tblrow = $(this);
      $tblrow.find(".divcolumn").text(reset_data[index].label);
      $tblrow
        .find(".custom-control-input")
        .prop("checked", reset_data[index].active);

      let title = $("#tblQuoteLine").find("th").eq(index);
      if (reset_data[index].class === 'AmountEx' || reset_data[index].class === 'UnitPriceEx') {
        $(title).html(reset_data[index].label + `<i class="fas fa-random fa-trans"></i>`);
      } else if (reset_data[index].class === 'AmountInc' || reset_data[index].class === 'UnitPriceInc') {
        $(title).html(reset_data[index].label + `<i class="fas fa-random"></i>`);
      } else {
        $(title).html(reset_data[index].label);
      }


      if (reset_data[index].active) {
        $('.col' + reset_data[index].class).addClass('showColumn');
        $('.col' + reset_data[index].class).removeClass('hiddenColumn');
      } else {
        $('.col' + reset_data[index].class).addClass('hiddenColumn');
        $('.col' + reset_data[index].class).removeClass('showColumn');
      }
      $(".rngRange" + reset_data[index].class).val(reset_data[index].width);
    });
  },
  "click .saveTable": async function (event) {
    let lineItems = [];
    $(".fullScreenSpin").css("display", "inline-block");

    $(".customDisplaySettings").each(function (index) {
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
    lineItems.sort((a, b) => a.index - b.index);

    try {
      let erpGet = erpDb();
      let tableName = "tblServiceLogList";
      let employeeId = parseInt(localStorage.getItem('mySessionEmployeeLoggedID')) || 0;
      let added = await sideBarService.saveNewCustomFields(erpGet, tableName, employeeId, lineItems);
      $(".fullScreenSpin").css("display", "none");
      if (added) {
        sideBarService.getNewCustomFieldsWithQuery(parseInt(localStorage.getItem('mySessionEmployeeLoggedID')),'').then(function (dataCustomize) {
            addVS1Data('VS1_Customize', JSON.stringify(dataCustomize));
        });
        swal({
          title: 'SUCCESS',
          text: "Display settings is updated!",
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $('#myModal2').modal('hide');
          }
        });
      } else {
        swal("Something went wrong!", "", "error");
      }
    } catch (error) {
      $(".fullScreenSpin").css("display", "none");
      swal("Something went wrong!", "", "error");
    }
  },

  'change .custom-range': function (event) {
    let range = $(event.target).val();
    let colClassName = $(event.target).attr("valueclass");
    $('.col' + colClassName).css('width', range);
  },
  'click .custom-control-input': function (event) {
    let colClassName = $(event.target).attr("id");
    if ($(event.target).is(':checked')) {
      $('.col' + colClassName).addClass('showColumn');
      $('.col' + colClassName).removeClass('hiddenColumn');
    } else {
      $('.col' + colClassName).addClass('hiddenColumn');
      $('.col' + colClassName).removeClass('showColumn');
    }
  },
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    fixedAssetService.getTFixedAssetsList().then(function (data) {
      addVS1Data("TFixedAssets", JSON.stringify(data))
        .then(function (datareturn) {
          Meteor._reload.reload();
        })
        .catch(function (err) {
          Meteor._reload.reload();
        });
    }).catch(function (err) {
      Meteor._reload.reload();
    });
  },

  "click #btnNewServiceLog": function() {
    FlowRouter.go('/servicelogcard');
  }

});

Template.serviceloglisttable.helpers({
  datatablerecords: () => {
    return Template.instance().datatablerecords.get().sort(function (a, b) {
      if (a.assetname === "NA") {
        return 1;
      } else if (b.assetname === "NA") {
        return -1;
      }
      return a.assetname.toUpperCase() > b.assetname.toUpperCase() ? 1 : -1;
    });
  },
  // custom fields displaysettings
  displayfields: () => {
    return Template.instance().displayfields.get();
  },
});
