import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar } from "meteor/reactive-var";
import { FixedAssetService } from "../../fixedasset-service";
import { SideBarService } from "../../../js/sidebar-service";
import "../../../lib/global/indexdbstorage.js";
let sideBarService = new SideBarService();
let fixedAssetService = new FixedAssetService();

Template.fixedassettypelistpop.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);
});

Template.fixedassettypelistpop.onRendered(function () {
  // $(".fullScreenSpin").css("display", "inline-block");
  let templateObject = Template.instance();

  // set initial table rest_data
  templateObject.init_reset_data = function () {
    let reset_data = [
      { index: 0, label: 'ID', class: 'FixedID', active: true, display: true, width: "" },
      { index: 1, label: 'Asset Type Code', class: 'AssetCode', active: true, display: true, width: "" },
      { index: 2, label: 'Asset Type Name', class: 'AssetName', active: true, display: true, width: "" },
      { index: 3, label: 'Notes', class: 'Notes', active: true, display: true, width: "" },
    ];
    templateObject.reset_data.set(reset_data);
  }
  templateObject.init_reset_data();
  // set initial table rest_data

  // custom field displaysettings
  templateObject.initCustomFieldDisplaySettings = function (listType) {
    let reset_data = templateObject.reset_data.get();
    showCustomFieldDisplaySettings(reset_data);

    try {
      // getVS1Data("TFixedAssetType").then(function (dataObject) {
      //   if (dataObject.length == 0) {
      //     sideBarService.getNewCustomFieldsWithQuery(parseInt(Session.get('mySessionEmployeeLoggedID')), listType).then(function (data) {
      //       reset_data = data.ProcessLog.Obj.CustomLayout[0].Columns;
      //       showCustomFieldDisplaySettings(reset_data);
      //     }).catch(function (err) {
      //     });
      //   } else {
      //     let data = JSON.parse(dataObject[0].data);
      //     if (data.ProcessLog.Obj.CustomLayout.length > 0) {
      //       for (let i = 0; i < data.ProcessLog.Obj.CustomLayout.length; i++) {
      //         if (data.ProcessLog.Obj.CustomLayout[i].TableName == listType) {
      //           reset_data = data.ProcessLog.Obj.CustomLayout[i].Columns;
      //           showCustomFieldDisplaySettings(reset_data);
      //         }
      //       }
      //     };
      //     // handle process here
      //   }
      // });
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

  templateObject.initCustomFieldDisplaySettings("tblFixedassettypelist");
  // set initial table rest_data  //

  templateObject.getFixedAssetsTypeList= function () {
    getVS1Data("TFixedAssetType").then(function (dataObject) {
      if (dataObject.length == 0) {
        fixedAssetService.getFixedAssetTypes().then(function (data) {
          setFixedAssetsTypeList(data);
        }).catch(function (err) {
          $(".fullScreenSpin").css("display", "none");
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        setFixedAssetsTypeList(data);
      }
    }).catch(function (err) {
      fixedAssetService.getFixedAssetTypes().then(function (data) {
        setFixedAssetsTypeList(data);
      }).catch(function (err) {
        $(".fullScreenSpin").css("display", "none");
      });
    });
  };

  $(".fullScreenSpin").css("display", "inline-block");
  templateObject.getFixedAssetsTypeList();

  function setFixedAssetsTypeList(data) {
    addVS1Data('TFixedAssetType', JSON.stringify(data));
    const dataTableList = [];
    for (const asset of data.tfixedassettype) {
      const dataList = {
        id: asset.Id || "",
        assetTypeCode: asset.AssetTypeCode || "",
        assetTypeName: asset.AssetTypeName || "",
        notes: asset.Notes || "",
        active: asset.Active || "",
      };
      dataTableList.push(dataList);
    }
    templateObject.datatablerecords.set(dataTableList);

    $(".fullScreenSpin").css("display", "none");
    setTimeout(function () {
      $("#tblFixedassettypelist").DataTable({
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
          $("#tblFixedassettypelist").DataTable().ajax.reload();
        },
        language: { search: "", searchPlaceholder: "Search List..." },
        fnDrawCallback: function (oSettings) {
        },
        fnInitComplete: function () {
          $(
            "<button class='btn btn-primary btnSearchFixedAccount' type='button' id='btnSearchFixedAccount' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
          ).insertAfter("#tblFixedAssetsOverview_filter");
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
  tableResize();
});

Template.fixedassettypelistpop.events({
  "mouseover .card-header": (e) => {
    $(e.currentTarget).parent(".card").addClass("hovered");
  },
  "mouseleave .card-header": (e) => {
    $(e.currentTarget).parent(".card").removeClass("hovered");
  },

});

Template.fixedassettypelistpop.helpers({
  datatablerecords: () => {
    return Template.instance().datatablerecords.get().sort(function (a, b) {
      if (a.assetTypeName === "NA") {
        return 1;
      } else if (b.assetTypeName === "NA") {
        return -1;
      }
      return a.assetTypeName.toUpperCase() > b.assetTypeName.toUpperCase() ? 1 : -1;
    });
  },
  // custom fields displaysettings
  displayfields: () => {
    return Template.instance().displayfields.get();
  },
});
