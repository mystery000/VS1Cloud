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
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);
  templateObject.selectedFile = new ReactiveVar();
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

  templateObject.getDateStr = function (dateVal) {
    if (!dateVal) return "";
    const dateObj = new Date(dateVal);
    var hh = dateObj.getHours() < 10 ? "0" + dateObj.getHours() : dateObj.getHours();
    var min = dateObj.getMinutes() < 10   ? "0" + dateObj.getMinutes()   : dateObj.getMinutes();
    var ss = dateObj.getSeconds() < 10   ? "0" + dateObj.getSeconds()   : dateObj.getSeconds();
    var month = dateObj.getMonth() < 9   ? "0" + (dateObj.getMonth() + 1)   : dateObj.getMonth() + 1;
    var date = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
    return ( dateObj.getFullYear() + "-" + month + "-" + date + " " + hh + ":" + min + ":" + ss);
  };

  let headerStructure = [
    {
      index: 0,
      label: "ID",
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
      label: "Serial",
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
      label: "Notes",
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
      label: "Warranty Type",
      class: "colWarrantyType",
      active: false,
      display: true,
      width: "50",
    },
    {
      index: 23,
      label: "Warranty Expires Date",
      class: "colWarrantyExpiresDate",
      active: false,
      display: true,
      width: "100",
    },
    {
      index: 24,
      label: "Insured By",
      class: "colInsuredBy",
      active: false,
      display: true,
      width: "80",
    },
    {
      index: 25,
      label: "Insurance Policy",
      class: "colInsurancePolicy",
      active: false,
      display: true,
      width: "80",
    },
    {
      index: 26,
      label: "Insured Until",
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
  "click .btnRefresh": async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = new Template.instance();
    await clearData("TFixedAssetsList");
    fixedAssetService.getTFixedAssetsList().then(function (data) {
        addVS1Data("TFixedAssetsList", JSON.stringify(data)).then(function (datareturn) {
            // Meteor._reload.reload();
            window.open("/fixedassetlist", "_self");
          }).catch(function (err) {
            // Meteor._reload.reload();
            window.open("/fixedassetlist", "_self");
          });
      }).catch(function (err) {
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
    const filename = "SampleFixedAssets" + ".csv";
    rows[0] = [
      "Asset Name",
      "Asset Description",
      "Color",
      "Brand Name",
      "Manufacture",
      "Model",
      "Asset Code",
      "Asset Type",
      "Department",
      "Purch Date",
      "Depreciation Start Date",
      "Purch Cost",
      "Asset Condition",
      "Size",
      "Shape",
    ];
    rows[1] = [
      "Ford Pickup",
      "",
      "Blue",
      "Courier",
      "Ford",
      "HT",
      "6543",
      "Vehicles",
      "",
      "01/08/2008",
      "01/08/2008",
      "25",
      "Excellent",
      "Ute",
      "",
    ];
    utilityService.exportToCsv(rows, filename, "csv");
  },
  "click .templateDownloadXLSX": function (e) {
    e.preventDefault(); //stop the browser from following
    window.location.href = "sample_imports/SampleFixedAssets.xlsx";
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
    let fixedAssetService = new FixedAssetService();
    let objDetails;
    //let empStartDate = new Date().format("YYYY-MM-DD");
    Papa.parse(templateObject.selectedFile.get(), {
      complete: function (results) {
        if (results.data.length > 0) {
          if (
            results.data[0][0] == "Asset Name" &&
            results.data[0][1] == "Asset Description" &&
            results.data[0][2] == "Colour" &&
            results.data[0][3] == "Brand Name" &&
            results.data[0][4] == "Manufacture" &&
            results.data[0][5] == "Model" &&
            results.data[0][6] == "Asset Code" &&
            results.data[0][7] == "Asset Type" &&
            results.data[0][8] == "Department" &&
            results.data[0][9] == "Purch Date" &&
            results.data[0][10] == "Depreciation Start Date" &&
            results.data[0][11] == "Purch Cost" &&
            results.data[0][12] == "Asset Condition" &&
            results.data[0][13] == "Size" &&
            results.data[0][14] == "Shape"
          ) {
            let dataLength = results.data.length * 500;
            setTimeout(async function () {
              // $('#importModal').modal('toggle');
              //Meteor._reload.reload();
              $(".fullScreenSpin").css("display", "none");
              await clearData("TFixedAssets");
              window.open("/fixedassetlist?success=true", "_self");
            }, parseInt(dataLength));

            for (let i = 0; i < results.data.length - 1; i++) {
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
              let dop = templateObject.getDateStr(results.data[i + 1][9]);
              // dop = moment(dop).format("YYYY-MM-DD");

              objDetails = {
                Active: true,
                AssetCode: results.data[i + 1][6],
                AssetName: results.data[i + 1][0],
                Description: results.data[i + 1][1],
                AssetType: results.data[i + 1][7],
                PurchDate: dop,
                DepreciationStartDate: templateObject.getDateStr(results.data[i + 1][10]),
                PurchCost: parseFloat(results.data[i + 1][11].replace(/[^0-9.-]+/g, "")) || 0,
                SupplierName: "",
                Manufacture: results.data[i + 1][4],
                BrandName: results.data[i + 1][3],
                Model: results.data[i + 1][5],
                AssetCondition: results.data[i + 1][12],
                Colour: results.data[i + 1][2],
                Size: results.data[i + 1][13],
                Shape: results.data[i + 1][14],
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

                  fixedAssetService.saveTFixedAsset({  type: "TFixedAssets",  fields: objDetails,})
                    .then((data) => {
                      fixedAssetService.getTFixedAssetsList().then(function (data) {
                          addVS1Data("TFixedAssetsList", JSON.stringify(data));
                        }).catch(function (err) {
                          $(".fullScreenSpin").css("display", "none");
                        });
                      // FlowRouter.go('/fixedassetlist');
                    }).catch((err) => {
                      $(".fullScreenSpin").css("display", "none");
                      swal({
                        title: "Oooops...",
                        text: err,
                        type: "error",
                        showCancelButton: false,
                        confirmButtonText: "Try Again",
                      }).then((result) => {
                        if (result.value) {
                          // Meteor._reload.reload();
                        } else if (result.dismiss === "cancel") {
                        }
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
