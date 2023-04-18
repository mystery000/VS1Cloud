import { ReactiveVar } from 'meteor/reactive-var';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-editable-select';
import { Template } from 'meteor/templating';
import './processList.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ManufacturingService } from './manufacturing-service';
import { UtilityService } from "../utility-service";
import XLSX from "xlsx";

Template.processList.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  // templateObject.selectedInventoryAssetAccount = new ReactiveVar('');
  templateObject.getDataTableList = function (data) {
    let linestatus = '';
    if(data.fields.Active == true){
      linestatus = "";
    }
    else if(data.fields.Active == false){
      linestatus = "In-Active";
    }
    let dataList = [
      data.fields.ID || "",
      data.fields.KeyValue || "",
      data.fields.Description || "",
      data.fields.DailyHours || "",
      Currency + data.fields.HourlyLabourCost || 0,
      data.fields.COGS || "",
      data.fields.ExpenseAccount || "",
      Currency + data.fields.OHourlyCost || 0,
      data.fields.OCOGS || "",
      data.fields.OExpense || "",
      Currency + data.fields.TotalHourlyCost || 0,
      data.fields.Wastage || "",
      linestatus
    ];
    // let dataList = [];
    return dataList;
  };

  let headerStructure = [
    {
      index: 0,
      label: "ID",
      class: "colProcessId",
      active: false,
      display: true,
      width: "30",
    },
    {
      index: 1,
      label: "Name",
      class: "colName",
      active: true,
      display: true,
      width: "100",
    },
    {
      index: 2,
      label: "Description",
      class: "colDescription",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 3,
      label: "Daily Hours",
      class: "colDailyHours",
      active: true,
      display: true,
      width: "100",
    },
    {
      index: 4,
      label: "Hourly Labour Cost",
      class: "colHourlyLabourCost",
      active: true,
      display: true,
      width: "100",
    },
    {
      index: 5,
      label: "Cost of Goods Sold",
      class: "colCOGS",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 6,
      label: "Expense Account",
      class: "colExpense",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 7,
      label: "Hourly Overhead Cost",
      class: "colHourlyOverheadCost",
      active: true,
      display: true,
      width: "100",
    },
    {
      index: 8,
      label: "Cost of Goods Sold(Overhead)",
      class: "colOverGOGS",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 9,
      label: "Expense Account(Overhead)",
      class: "colOverExpense",
      active: true,
      display: true,
      width: "120",
    },
    {
      index: 10,
      label: "Total Hourly Costs",
      class: "colTotalHourlyCosts",
      active: true,
      display: true,
      width: "100",
    },
    {
      index: 11,
      label: "Inventory Asset Wastage",
      class: "colWastage",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 12,
      label: "Status",
      class: "colStatus",
      active: true,
      display: true,
      width: "120",
    },
  ];

  templateObject.tableheaderrecords.set(headerStructure);
});

Template.processList.onRendered(function () {
  const templateObject = Template.instance();
});

Template.processList.helpers({
  datatablerecords: () => {
    return Template.instance().datatablerecords.get();
  },
  selectedInventoryAssetAccount: () => {
    return Template.instance().selectedInventoryAssetAccount.get();
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },

  apiFunction: function () {
    let manufacturingService = new ManufacturingService();
    return manufacturingService.getAllProcessData;
  },

  searchAPI: function () {
    let manufacturingService = new ManufacturingService();
    return manufacturingService.getProcessByName;
  },

  service: () => {
    let manufacturingService = new ManufacturingService();
    return manufacturingService;
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

    apiParams: ()=>{
        return ['limitCount', 'limitFrom', 'deleteFilter']
    }

})


Template.processList.events({
    
    'click .processList .btnRefresh': function(e) {
        let templateObject = Template.instance();
        let manufacturingService = new ManufacturingService();
        $('.fullScreenSpin').css('display', 'inline-block');
        setTimeout(function () {
            manufacturingService.getAllProcessData(initialBaseDataLoad, 0, false).then(function(data) {
                addVS1Data('TProcessStep', JSON.stringify(data)).then(function(){
                    window.open('/processlist', '_self');
                })
            })
        }, 3000);
    },

    'click .processList #btnNewProcess': function (e) {
        FlowRouter.go('/processcard');
    },

  "click #tblProcessList tbody tr": function (e) {
    var listData = $(e.target).closest("tr").find(".colProcessId").text();
    FlowRouter.go("/processcard?id=" + listData);
  },

  "click .templateDownload": function () {
    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleProcess" + ".csv";
    rows[0] = [
      "Name",
      "Description",
      "Daily Hours",
      "Hourly Labour Cost",
      "Expense Account",
      "Hourly Overhead Cost",
      "Cost of Goods Sold(Overhead)",
      "Expense Account(Overhead)",
    ];
    rows[1] = [
      "Assembly",
      "Assembly",
      "12",
      "12",
      "Admin Fee(Credit Card)",
      "",
      "12",
      "Admin Fee(Credit Card)",
      "Bank fees & charges",
    ];
    utilityService.exportToCsv(rows, filename, "csv");
  },
  "click .templateDownloadXLSX": function (e) {
    e.preventDefault(); //stop the browser from following
    window.location.href = "sample_imports/SampleProcess.xlsx";
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
            results.data[0][0] == "Name" &&
            results.data[0][1] == "Description" &&
            results.data[0][2] == "Daily Hours" &&
            results.data[0][3] == "Hourly Labour Cost" &&
            results.data[0][4] == "Cost of Goods Sold" &&
            results.data[0][5] == "Expense Account" &&
            results.data[0][6] == "Hourly Overhead Cost" &&
            results.data[0][7] == "Cost of Goods Sold(Overhead)" &&
            results.data[0][8] == "Expense Account(Overhead)"
          ) {
            let dataLength = results.data.length * 500;
            setTimeout(function () {
              // $('#importModal').modal('toggle');
              //Meteor._reload.reload();
              $(".fullScreenSpin").css("display", "none");
              window.open("/bomlist?success=true", "_self");
            }, parseInt(dataLength));

            for (let i = 0; i < results.data.length - 1; i++) {
              objDetails = {
                type: "TProcessStep",
                fields: {
                  KeyValue: results.data[i + 1][0].trim(),
                  Description: results.data[i + 1][0].trim(),
                  DailyHours: results.data[i + 1][0].trim(),
                  HourlyLabourCost: parseInt(
                    results.data[i + 1][0].trim().replace(Currency, "")
                  ),
                  COGS: results.data[i + 1][0].trim(),
                  ExpenseAccount: results.data[i + 1][0].trim(),
                  OHourlyCost: parseInt(
                    results.data[i + 1][0].trim().replace(Currency, "")
                  ),
                  OCogs: results.data[i + 1][0].trim(),
                  OExpense: results.data[i + 1][0].trim(),
                  TotalHourlyCost: "",
                  Wastage: "",
                },
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
                  manufacturingService
                    .saveProcessData(objDetails)
                    .then(function () {
                      if (localStorage.getItem("enteredURL") != null) {
                        FlowRouter.go(localStorage.getItem("enteredURL"));
                        localStorage.removeItem("enteredURL");
                        return;
                      }

                      manufacturingService
                        .getAllProcessData(initialBaseDataLoad, 0, false)
                        .then(function (datareturn) {
                          addVS1Data("TProcessStep", JSON.stringify(datareturn))
                            .then(function () {
                              // $('.fullScreenSpin').css('display', 'none');
                              // swal({
                              //     title: 'Success',
                              //     text: 'Process has been saved successfully',
                              //     type: 'success',
                              //     showCancelButton: false,
                              //     confirmButtonText: 'Continue',
                              // }).then ((result)=>{
                              //     FlowRouter.go('/processlist')
                              // })
                            })
                            .catch(function (err) {
                              swal(
                                "Ooops, Something went wrong",
                                "",
                                "warning"
                              );
                              $(".fullScreenSpin").css("display", "none");
                            });
                        });
                    })
                    .catch(function (err) {
                      swal("Something went wrong!", "", "error");
                      $(".fullScreenSpin").css("display", "none");
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
            $(".fullScreenSpin").css("display", "none");
            FlowRouter.go("/processlist");
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
