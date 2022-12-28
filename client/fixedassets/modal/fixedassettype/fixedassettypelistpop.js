import { FixedAssetService } from '../../fixedasset-service'
let fixedAssetService = new FixedAssetService();

Template.fixedassettypelistpop.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);
});

Template.fixedassettypelistpop.onRendered(function () {
  let templateObject = Template.instance();
  // set initial table rest_data
  templateObject.init_reset_data = function () {
    let reset_data = [
      { index: 0, label: 'ID', class: 'fixedID', active: false, display: false, width: "0" },
      { index: 1, label: 'Asset Type Name', class: 'assetTypeName', active: true, display: true, width: "" },
      { index: 2, label: 'Asset Type Code', class: 'assetTypeCode', active: true, display: true, width: "" },
      { index: 3, label: 'Notes', class: 'notes', active: true, display: true, width: "" },
    ];
    templateObject.reset_data.set(reset_data);
    showCustomFieldDisplaySettings(reset_data);
  }
  templateObject.init_reset_data();

  templateObject.getAllFixedAssetTypeList = function () {
    getVS1Data("TFixedAssetType").then(function (dataObject) {
      if (dataObject.length === 0) {
        fixedAssetService.getFixedAssetTypes().then(function (data) {
          initFixedAssetTypeTable(data);
          return data;
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tfixedassettype;
        initFixedAssetTypeTable(useData);
      }
    }).catch(function (err) {
      fixedAssetService.getFixedAssetTypes().then(function (data) {
        initFixedAssetTypeTable(data);
        return data;
      });
    });
  }
  templateObject.getAllFixedAssetTypeList();

  function initFixedAssetTypeTable(data) {
    addVS1Data('TFixedAssetType', JSON.stringify(data));
    const dataTableList = [];
    // console.log('TFixedAssetType', data.tfixedassettype);
    for (const assetType of data.tfixedassettype) {
      const dataList = {
        id: assetType.Id || "",
        assetTypeCode: assetType.AssetTypeCode || "",
        assetTypeName: assetType.AssetTypeName || "",
        notes: assetType.Notes || "",
        active: assetType.Active || "",
      };
      dataTableList.push(dataList);
    }
    console.log(dataTableList);
    templateObject.datatablerecords.set(dataTableList);

    $(".fullScreenSpin").css("display", "none");

    setTimeout(function () {
      $("#tblFixedassettypelist").DataTable({
        columnDefs: [
        ],
        select: true,
        destroy: false,
        colReorder: true,
        sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
        buttons: [
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
            "<button class='btn btn-primary btnSearchFixedAssetType' type='button' id='btnSearchFixedAssetType' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
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
  
  tableResize();
});
