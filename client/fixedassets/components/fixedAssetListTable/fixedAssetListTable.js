import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { ReactiveVar } from "meteor/reactive-var";
import { FixedAssetService } from "../../fixedasset-service";
import { SideBarService } from "../../../js/sidebar-service";
import { UtilityService } from "../../../utility-service";
import XLSX from "xlsx";
import "../../../lib/global/indexdbstorage.js";
import { Template } from "meteor/templating";

import "./fixedAssetListTable.html";
import moment from "moment";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let fixedAssetService = new FixedAssetService();

Template.fixedAssetListTable.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.tableheaderrecords = new ReactiveVar();
  templateObject.getDataTableList = function (data) {
    const dataList = [
      data.AssetID || "",
      data.AssetName || "",
      data.Colour || "",
      data.BrandName || "",
      data.Manufacture || "",
      data.Model || "",
      data.AssetCode || "",
      data.AssetType || "",
      data.Department || "", // tempcode how to get department
      data.PurchDate ? moment(data.PurchDate).format("DD/MM/YYYY") : "",
      utilityService.modifynegativeCurrencyFormat(data.PurchCost) || 0.0,
      data.Serial || "",
      data.Qty || 0,
      data.AssetCondition || "",
      data.LocationDescription || "",
      data.Notes || "",
      data.Size || "",
      data.Shape || "",
      //data.Status || "",
      data.Active ? "" : "In-Active",
      data.BusinessUsePercent || 0.0,
      utilityService.modifynegativeCurrencyFormat(data.EstimatedValue) || 0.0,
      utilityService.modifynegativeCurrencyFormat(data.ReplacementCost) || 0.0,
      data.WarrantyType || "",
      data.WarrantyExpiresDate
        ? moment(data.WarrantyExpiresDate).format("DD/MM/YYYY")
        : "",
      data.InsuredBy || "",
      data.InsurancePolicy || "",
      data.InsuredUntil ? moment(data.InsuredUntil).format("DD/MM/YYYY") : "",
      //data.Active ? "" : "In-Active",
    ];
    return dataList;
  };

  let headerStructure = [
    {
      index: 0,
      label: "#ID",
      class: "colFixedID",
      active: false,
      display: true,
      width: "30",
    },
    {
      index: 1,
      label: "Asset Name",
      class: "colAssetName",
      active: true,
      display: true,
      width: "80",
    },
    {
      index: 2,
      label: "Colour",
      class: "colColor",
      active: true,
      display: true,
      width: "40",
    },
    {
      index: 3,
      label: "Brand Name",
      class: "colBrandName",
      active: true,
      display: true,
      width: "40",
    },
    {
      index: 4,
      label: "Manufacture",
      class: "colManufacture",
      active: true,
      display: true,
      width: "40",
    },
    {
      index: 5,
      label: "Model",
      class: "colModel",
      active: true,
      display: true,
      width: "40",
    },
    {
      index: 6,
      label: "Asset Code",
      class: "colAssetCode",
      active: true,
      display: true,
      width: "50",
    },
    {
      index: 7,
      label: "Asset Type",
      class: "colAssetType",
      active: true,
      display: true,
      width: "50",
    },
    {
      index: 8,
      label: "Department",
      class: "colDepartment",
      active: true,
      display: true,
      width: "50",
    },
    {
      index: 9,
      label: "Purch Date",
      class: "colPurchDate",
      active: true,
      display: true,
      width: "80",
    },
    {
      index: 10,
      label: "Purch Cost",
      class: "colPurchCost",
      active: true,
      display: true,
      width: "80",
    },
    {
      index: 11,
      label: "#Serial",
      class: "colSerial",
      active: false,
      display: true,
      width: "60",
    },
    {
      index: 12,
      label: "Qty",
      class: "colQty",
      active: true,
      display: true,
      width: "30",
    },
    {
      index: 13,
      label: "Asset Condition",
      class: "colAssetCondition",
      active: true,
      display: true,
      width: "60",
    },
    {
      index: 14,
      label: "#Location Description",
      class: "colLocationDescription",
      active: false,
      display: true,
      width: "100",
    },
    {
      index: 15,
      label: "#Notes",
      class: "colNotes",
      active: false,
      display: true,
      width: "100",
    },
    {
      index: 16,
      label: "Size",
      class: "colSize",
      active: true,
      display: true,
      width: "50",
    },
    {
      index: 17,
      label: "Shape",
      class: "colShape",
      active: true,
      display: true,
      width: "60",
    },
    {
      index: 18,
      label: "Status",
      class: "colStatus",
      active: true,
      display: true,
      width: "60",
    },
    {
      index: 19,
      label: "Business Use(%)",
      class: "colBusinessUse",
      active: true,
      display: true,
      width: "60",
    },
    {
      index: 20,
      label: "Estimated Value",
      class: "colEstimatedValue",
      active: true,
      display: true,
      width: "60",
    },
    {
      index: 21,
      label: "Replacement Cost",
      class: "colReplacementCost",
      active: true,
      display: true,
      width: "50",
    },
    {
      index: 22,
      label: "#Warranty Type",
      class: "colWarrantyType",
      active: false,
      display: true,
      width: "50",
    },
    {
      index: 23,
      label: "#Warranty Expires Date",
      class: "colWarrantyExpiresDate",
      active: false,
      display: true,
      width: "100",
    },
    {
      index: 24,
      label: "#Insured By",
      class: "colInsuredBy",
      active: false,
      display: true,
      width: "80",
    },
    {
      index: 25,
      label: "#Insurance Policy",
      class: "colInsurancePolicy",
      active: false,
      display: true,
      width: "80",
    },
    {
      index: 26,
      label: "#Insured Until",
      class: "colInsuredUntil",
      active: false,
      display: true,
      width: "80",
    },
    //{ index: 27, label: 'Status', class: 'colStatus', active: true, display: true, width: "" },
  ];

  templateObject.tableheaderrecords.set(headerStructure);
});

Template.fixedAssetListTable.onRendered(function () {
  $("#tblFixedAssetList tbody").on("click", "tr", function () {
    var assetID = $(this).closest("tr").find(".colFixedID").text();
    FlowRouter.go("/fixedassetcard?assetId=" + assetID);
  });
});

Template.fixedAssetListTable.events({
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    fixedAssetService
      .getTFixedAssetsList()
      .then(function (data) {
        addVS1Data("TFixedAssets", JSON.stringify(data))
          .then(function (datareturn) {
            // Meteor._reload.reload();
            window.open("/fixedassetlist", "_self");
          })
          .catch(function (err) {
            // Meteor._reload.reload();
            window.open("/fixedassetlist", "_self");
          });
      })
      .catch(function (err) {
        // Meteor._reload.reload();
        window.open("/fixedassetlist", "_self");
      });
  },

  "click #btnNewFixedAsset": function () {
    FlowRouter.go("/fixedassetcard");
  },

  "click #btnAssetCostReport": function () {
    FlowRouter.go("/assetcostreport");
  },

  "click #btnAssetRegister": function () {
    FlowRouter.go("/assetregisteroverview");
  },

  "click #btnServiceLogs": function () {
    FlowRouter.go("/serviceloglist");
  },

  "click .templateDownload": function () {
    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleBOM" + ".csv";
    rows[0] = [
      "Product Name",
      "Product Description",
      "Process Name",
      "Stock Count",
      "Sub products & raws",
      "Attachments",
    ];
    rows[1] = [
      "Bicycle",
      "a toy",
      "Assembly",
      "1",
      "handler, wheel",
      "No attachment",
    ];
    utilityService.exportToCsv(rows, filename, "csv");
  },
  "click .templateDownloadXLSX": function (e) {
    e.preventDefault(); //stop the browser from following
    window.location.href = "sample_imports/SampleBOM.xlsx";
  },
  "click .btnUploadFile": function (event) {
    $("#attachment-upload").val("");
    $(".file-name").text("");
    //$(".btnImport").removeAttr("disabled");
    $("#attachment-upload").trigger("click");
  },
  "change #attachment-upload": function (e) {
    let templateObj = Template.instance();
    var filename = $("#attachment-upload")[0].files[0]["name"];
    var fileExtension = filename.split(".").pop().toLowerCase();
    var validExtensions = ["csv", "txt", "xlsx"];
    var validCSVExtensions = ["csv", "txt"];
    var validExcelExtensions = ["xlsx", "xls"];

    if (validExtensions.indexOf(fileExtension) == -1) {
      swal(
        "Invalid Format",
        "formats allowed are :" + validExtensions.join(", "),
        "error"
      );
      $(".file-name").text("");
      $(".btnImport").Attr("disabled");
    } else if (validCSVExtensions.indexOf(fileExtension) != -1) {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];
      templateObj.selectedFile.set(selectedFile);
      if ($(".file-name").text() != "") {
        $(".btnImport").removeAttr("disabled");
      } else {
        $(".btnImport").Attr("disabled");
      }
    } else if (fileExtension == "xlsx") {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];
      var oFileIn;
      var oFile = selectedFile;
      var sFilename = oFile.name;
      // Create A File Reader HTML5
      var reader = new FileReader();

      // Ready The Event For When A File Gets Selected
      reader.onload = function (e) {
        var data = e.target.result;
        data = new Uint8Array(data);
        var workbook = XLSX.read(data, { type: "array" });

        var result = {};
        workbook.SheetNames.forEach(function (sheetName) {
          var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
          });
          var sCSV = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
          templateObj.selectedFile.set(sCSV);

          if (roa.length) result[sheetName] = roa;
        });
        // see the result, caution: it works after reader event is done.
      };
      reader.readAsArrayBuffer(oFile);

      if ($(".file-name").text() != "") {
        $(".btnImport").removeAttr("disabled");
      } else {
        $(".btnImport").Attr("disabled");
      }
    }
  },
  "click .btnImport": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let productService = new ProductService();
    let objDetails;
    var saledateTime = new Date();
    //let empStartDate = new Date().format("YYYY-MM-DD");
    Papa.parse(templateObject.selectedFile.get(), {
      complete: function (results) {
        if (results.data.length > 0) {
          if (
            results.data[0][0] == "Product Name" &&
            results.data[0][1] == "Product Description" &&
            results.data[0][2] == "Process Name" &&
            results.data[0][3] == "Stock Count" &&
            results.data[0][4] == "Sub products & raws" &&
            results.data[0][5] == "Attachments"
          ) {
            let dataLength = results.data.length * 500;
            setTimeout(function () {
              // $('#importModal').modal('toggle');
              //Meteor._reload.reload();
              $(".fullScreenSpin").css("display", "none");
              window.open("/bomlist?success=true", "_self");
            }, parseInt(dataLength));

            for (let i = 0; i < results.data.length - 1; i++) {
              let subs = [];
              let subTitles = results.data[i + 1][4].split(",");
              for (let j = 0; j < subTitles.length; j++) {
                subs.push({
                  productName: subTitles[j],
                  process: "",
                  qty: 1,
                  attachments: [],
                });
              }
              // objDetails = {
              //   type: "TProcTree",
              //   fields: {
              //     productName: results.data[i + 1][0].trim(),
              //     productDescription: results.data[i + 1][1].trim(),
              //     process: results.data[i + 1][2],
              //     processNote: "",
              //     totalQtyInStock: results.data[i + 1][3],
              //     subs: subs,
              //     attachments: [],

              //     // BillStreet: results.data[i+1][6],
              //     // BillStreet2: results.data[i+1][7],
              //     // BillState: results.data[i+1][8],
              //     // BillPostCode:results.data[i+1][9],
              //     // Billcountry:results.data[i+1][10]
              //   },
              // };
              objDetails = {
                Caption: results.data[i + 1][0].trim(),
                Description: results.data[i + 1][1].trim(),
                CustomInputClass: "",
                Info: results.data[i + 1][2],
                ProcStepItemRef: "vs1BOM",
                QtyVariation: 1,
                TotalQtyOriginal: parseFloat(results.data[i + 1][3]),
                Details: JSON.stringify(subs),
                Value: "",

                // BillStreet: results.data[i+1][6],
                // BillStreet2: results.data[i+1][7],
                // BillState: results.data[i+1][8],
                // BillPostCode:results.data[i+1][9],
                // Billcountry:results.data[i+1][10]
              };
              if (results.data[i + 1][0]) {
                if (results.data[i + 1][0] !== "") {
                  // contactService.saveEmployee(objDetails).then(function (data) {
                  //     ///$('.fullScreenSpin').css('display','none');
                  //     //Meteor._reload.reload();
                  // }).catch(function (err) {
                  //     //$('.fullScreenSpin').css('display','none');
                  //     swal({ title: 'Oooops...', text: err, type: 'error', showCancelButton: false, confirmButtonText: 'Try Again' }).then((result) => { if (result.value) { Meteor._reload.reload(); } else if (result.dismiss === 'cancel') {}});
                  // });
                  productService
                    .saveBOMProduct({
                      type: "TProcTree",
                      fields: objDetails,
                    })
                    .then(function () {
                      productService
                        .getAllBOMProducts(initialDataLoad, 0)
                        .then(function (dataReturn) {
                          addVS1Data(
                            "TProcTree",
                            JSON.stringify(dataReturn)
                          ).then(function () {});
                          FlowRouter.go("/bomlist?success=true");
                        });
                    });

                  // let bomProducts = localStorage.getItem("TProcTree")
                  //   ? JSON.parse(localStorage.getItem("TProcTree"))
                  //   : [];
                  // let index = bomProducts.findIndex((product) => {
                  //   return product.productName == results.data[i + 1][0];
                  // });
                  // if (index == -1) {
                  //   bomProducts.push(objDetails);
                  // } else {
                  //   bomProducts.splice(index, 1, objDetails);
                  // }
                  // localStorage.setItem("TProcTree", bomProducts);
                  // Meteor._reload.reload();
                  // window.open("/bomlist?success=true", "_self");
                }
              }
            }
          } else {
            $(".fullScreenSpin").css("display", "none");
            swal(
              "Invalid Data Mapping fields ",
              "Please check that you are importing the correct file with the correct column headers.",
              "error"
            );
          }
        } else {
          $(".fullScreenSpin").css("display", "none");
          swal(
            "Invalid Data Mapping fields ",
            "Please check that you are importing the correct file with the correct column headers.",
            "error"
          );
        }
      },
    });
  },
});

Template.fixedAssetListTable.helpers({
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },

  apiFunction: function () {
    let fixedAssetService = new FixedAssetService();
    return fixedAssetService.getTFixedAssetsList;
  },

  searchAPI: function () {
    return fixedAssetService.getTFixedAssetByNameOrID;
  },

  service: () => {
    let fixedAssetService = new FixedAssetService();
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
      let dataReturn = templateObject.getDataTableList(data);
      return dataReturn;
    };
  },

  apiParams: function () {
    return ["limitCount", "limitFrom", "deleteFilter"];
  },
});
