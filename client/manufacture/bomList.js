import { ReactiveVar } from "meteor/reactive-var";
import { ProductService } from "../product/product-service";
import { UtilityService } from "../utility-service";
import { Template } from 'meteor/templating';
import './bom_list.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import XLSX from "xlsx";
import { ManufacturingService } from "./manufacturing-service";

// Template.bom_list.inheritsHooksFrom('non_transactional_list');
Template.bom_list.onCreated(function(){
    const templateObject = Template.instance()
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.displayfields = new ReactiveVar([]);
    templateObject.reset_data = new ReactiveVar([]);
    templateObject.setupFinished = new ReactiveVar()
    templateObject.bomProducts = new ReactiveVar([]);
  templateObject.selectedFile = new ReactiveVar();

    templateObject.getDataTableList = function(data){
      let subs = data.Details != '' ?JSON.parse(data.Details)||[] : [];
      let rawName = "";
      if(subs.length > 0) {
          for (let j = 0; j < subs.length; j++) {
              if (j == 0) { rawName += subs[j].productName } else { rawName += ", " + subs[j].productName }
          }
      }
      var dataList = [
        data.ID || "1",
        data.Caption || "", //product name -- should be changed on TProcTree
        data.Description || "",
        data.Info || "",
        data.TotalQtyOriginal || 0,
        // data.subs || [],
        rawName || '',
        data.Value == '' ? 'No Attachment' : JSON.parse(data.Value).length.toString() + " attachments",
        data.ProcStepItemRef == 'vs1BOM'? '': 'Deleted'
      ];

      return dataList;
    }

  let headerStructure = [
    { index: 0, label: 'ID', class: 'colPayMethodID', active: false, display: true , width : "30"},
    { index: 1, label: 'Product Name', class: 'colName', active: true, display: true , width : "200"},
    { index: 2, label: 'Product Description', class: 'colDescription', active: true, display: true , width : "200"},
    { index: 3, label: 'Process', class: 'colProcess', active: true, display: true , width : "100"},
    { index: 4, label: 'Stock Count', class: 'colStockCount', active: true, display: true , width : "70"},
    { index: 5, label: 'Raws', class: 'colRaws', active: true, display: true , width : "70"},
    { index: 6, label: 'Attachments', class: 'colAttachments', active: true, display: true , width : "150"},
    { index: 7, label: 'Status', class: 'colStatus', active: true, display: true , width : "120"}
  ];
  templateObject.tableheaderrecords.set(headerStructure);
});

Template.bom_list.onRendered(function(){
  const templateObject  = Template.instance();
  const productService = new ProductService();
  if(FlowRouter.current().queryParams.success){
    $('.btnRefresh').addClass('btnRefreshAlert');
  }
  getVS1Data('TProcTree').then(function(dataObject) {
    if(dataObject.length == 0) {
      productService.getAllBOMProducts(initialBaseDataLoad, 0).then(function(data){
        templateObject.bomProducts.set(data.tproctree);
        addVS1Data('TProcTree', JSON.stringify(data)).then(function(){})
      })
    }else {
      let data = JSON.parse(dataObject[0].data);
      templateObject.bomProducts.set(data.tproctree);
    }
  }).catch(function(e){
    productService.getAllBOMProducts(initialBaseDataLoad, 0).then(function(data){
      templateObject.bomProducts.set(data.tproctree);
      addVS1Data('TProcTree', JSON.stringify(data)).then(function(){})
    })
  })
//   templateObject.checkSetupWizardFinished = async function () {
//     let setupFinished = localStorage.getItem("IS_SETUP_FINISHED") || "";
//     if( setupFinished === null || setupFinished ===  "" ){
//         let setupInfo = await organisationService.getSetupInfo();
//         if( setupInfo.tcompanyinfo.length > 0 ){
//             let data = setupInfo.tcompanyinfo[0];
//             localStorage.setItem("IS_SETUP_FINISHED", data.IsSetUpWizard)
//             templateObject.setupFinished.set(data.IsSetUpWizard)
//         }
//     }else{
//         templateObject.setupFinished.set(setupFinished)
//     }
// }
// templateObject.checkSetupWizardFinished();
  checkSetupFinished();
})
Template.bom_list.events({
  "click .tblBOMList tbody tr": async function (event) {
    // index = $(event.target).closest("tr").find(".colPayMethodID").html();
    // if (index) {
    //   FlowRouter.go("/bomsetupcard?id=" + index);
    // }
    let templateObject = Template.instance();
    let productService = new ProductService();
    let productName = $(event.target).closest("tr").find("td.colName").text();
    let bomProducts = templateObject.bomProducts.get();
    let index = bomProducts.findIndex((product) => {
      return product.Caption == productName;
    });
    if (index > -1) {
      FlowRouter.go("/bomsetupcard?id=" + bomProducts[index].Id);
    } else {
      productService.getOneBOMProductByName(productName).then(function (data) {
        if (data.tproctree.length > 0) {
          let id = data.tproctree[0].Id;
          FlowRouter.go("/bomsetupcard?id=" + id);
        }
      });
    }
  },

  'click #btnNewBOM': function(event) {
    FlowRouter.go('/bomsetupcard')
  },


  'click .btnRefresh':  (e, ui) => {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let productService = new ProductService();
    productService.getAllBOMProducts(initialBaseDataLoad, 0).then(function(data) {
      addVS1Data('TProcTree', JSON.stringify(data)).then(function() {
        window.open('/bomlist','_self');  
      })
    }).catch(function(err) {
      window.open('/bomlist','_self');
    })
    // setTimeout(()=>{
    //   window.open('/bomlist','_self');
    // }, 3000)
  },
'click .templateDownload': function () {
    let utilityService = new UtilityService();
    let rows =[];
    const filename = 'SampleBOM'+'.csv';
    rows[0]= ['Product Name', 'Product Description', 'Process Name','Stock Count', 'Sub products & raws','Attachments'];
    rows[1]= ['Bicycle', 'a toy', 'Assembly','1', 'handler, wheel','No attachment'];
    utilityService.exportToCsv(rows, filename, 'csv');
},
'click .templateDownloadXLSX': function (e) {

    e.preventDefault();  //stop the browser from following
    window.location.href = 'sample_imports/SampleBOM.xlsx';
},
'click .btnUploadFile':function(event){
    $('#attachment-upload').val('');
    $('.file-name').text('');
    //$(".btnImport").removeAttr("disabled");
    $('#attachment-upload').trigger('click');

},
'change #attachment-upload': function (e) {
    let templateObj = Template.instance();
    var filename = $('#attachment-upload')[0].files[0]['name'];
    var fileExtension = filename.split('.').pop().toLowerCase();
    var validExtensions = ["csv","txt","xlsx"];
    var validCSVExtensions = ["csv","txt"];
    var validExcelExtensions = ["xlsx","xls"];

    if (validExtensions.indexOf(fileExtension) == -1) {
        swal('Invalid Format', 'formats allowed are :' + validExtensions.join(', '), 'error');
        $('.file-name').text('');
        $(".btnImport").Attr("disabled");
    }else if(validCSVExtensions.indexOf(fileExtension) != -1){

        $('.file-name').text(filename);
        let selectedFile = event.target.files[0];
        templateObj.selectedFile.set(selectedFile);
        if($('.file-name').text() != ""){
            $(".btnImport").removeAttr("disabled");
        }else{
            $(".btnImport").Attr("disabled");
        }
    }else if(fileExtension == 'xlsx'){
        $('.file-name').text(filename);
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
            var workbook = XLSX.read(data, {type: 'array'});

            var result = {};
            workbook.SheetNames.forEach(function (sheetName) {
                var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
                var sCSV = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                templateObj.selectedFile.set(sCSV);

                if (roa.length) result[sheetName] = roa;
            });
            // see the result, caution: it works after reader event is done.

        };
        reader.readAsArrayBuffer(oFile);

        if($('.file-name').text() != ""){
            $(".btnImport").removeAttr("disabled");
        }else{
            $(".btnImport").Attr("disabled");
        }

    }



},
'click .btnImport' : function () {
    $('.fullScreenSpin').css('display','inline-block');
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
                  productService.saveBOMProduct({type: "TProcTree",fields: objDetails,})
                    .then(function () {
                      productService
                        .getAllBOMProducts(initialDataLoad, 0)
                        .then(function (dataReturn) {
                          addVS1Data("TProcTree",JSON.stringify(dataReturn)).then(function () {});
                          //FlowRouter.go("/bomlist?success=true");
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
}
  
})
Template.bom_list.helpers({
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({userid:localStorage.getItem('mycloudLogonID'),PrefName:'tblEmployeelist'});
  },
  loggedCompany: () => {
      return localStorage.getItem('mySession') || '';
  },
  isSetupFinished: () => {
      return Template.instance().setupFinished.get();
  },
  getSkippedSteps() {
    let setupUrl = localStorage.getItem("VS1Cloud_SETUP_SKIPPED_STEP") || JSON.stringify().split();
    return setupUrl[1];
  },
  apiFunction:function() {
    let productService = new ProductService();
    return productService.getAllBOMProducts;
  },
  service: function() {
    let productService = new ProductService();
    return productService;
  },

  datahandler: function () {
    let templateObject = Template.instance();
    return function(data) {
        let dataReturn =  templateObject.getDataTableList(data)
        return dataReturn
    }
  },
  
  exDataHandler: function() {
    let templateObject = Template.instance();
    return function(data) {
        let dataReturn =  templateObject.getDataTableList(data)
        return dataReturn
    }
  },

  apiParams: () => {
    return ["limitCount", "limitFrom","deleteFilter"];
  },

  searchAPI: function() {
    let productService = new ProductService();
    return productService.getBOMListByName;
  },

  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },

})