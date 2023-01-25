import './suppliers-settings.html'
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import "../../lib/global/indexdbstorage.js";
import LoadingOverlay from "../../LoadingOverlay";
import { UtilityService } from "../../utility-service";
import { ContactService } from "../../contacts/contact-service";

const utilityService = new UtilityService();
const contactService = new ContactService();

Template.wizard_suppliers.onCreated(() => {
  
})  

Template.wizard_suppliers.onRendered(() => {

})

Template.wizard_suppliers.helpers({

})

Template.wizard_suppliers.events({
    "click .new_attachment_btn_supplier": function (event) {
        $("#attachment-upload-supplier").val("");
        $(".file-name").text("");
        $("#attachment-upload-supplier").trigger("click");
      },
    
      "change #attachment-upload-supplier": async function (e) {
        let templateObj = Template.instance();
        var filename = $("#attachment-upload-supplier")[0].files[0]["name"];
        var fileExtension = filename.split(".").pop().toLowerCase();
        var validExtensions = ["csv", "txt", "xlsx", "xls"];
        var validCSVExtensions = ["csv", "txt"];
        var validExcelExtensions = ["xlsx", "xls"];
    
        if (validExtensions.indexOf(fileExtension) == -1) {
          swal(
            "Invalid Format",
            "formats allowed are :" + validExtensions.join(", "),
            "error"
          );
          $(".file-name").text("");
          $(".btnSupplierImport").Attr("disabled");
        } else if (validCSVExtensions.indexOf(fileExtension) != -1) {
          $(".file-name").text(filename);
          let selectedFile = event.target.files[0];
          templateObj.selectedFile.set(selectedFile);
          if ($(".file-name").text() != "") {
            $(".btnSupplierImport").removeAttr("disabled");
          } else {
            $(".btnSupplierImport").Attr("disabled");
          }
        } else if (fileExtension == "xls") {
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
            var workbook = XLSX.read(data, {
              type: "array",
            });
    
            var result = {};
            workbook.SheetNames.forEach(function (sheetName) {
              var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                header: 1,
              });
              var sCSV = XLSX.utils.make_csv(workbook.Sheets[sheetName]);
              templateObj.selectedFile.set(sCSV);
    
              if (roa.length) result[sheetName] = roa;
            });
            // see the result, caution: it works after reader event is done.
          };
          reader.readAsArrayBuffer(oFile);
    
          if ($(".file-name").text() != "") {
            $(".btnSupplierImport").removeAttr("disabled");
          } else {
            $(".btnSupplierImport").Attr("disabled");
          }
        }
      },
      'click .btnSupplierImport': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let objDetails;
        let firstName = '';
        let lastName = '';
        let taxCode = '';
        Papa.parse(templateObject.selectedFile.get(), {
            complete: function(results) {
                if (results.data.length > 0) {
                    if ((results.data[0][0] == "Company") && (results.data[0][1] == "Phone") &&
                        (results.data[0][2] == "AR Balance") && (results.data[0][3] == "Credit balance") &&
                        (results.data[0][4] == "Balance") && (results.data[0][5] == "Credit limit") &&
                        (results.data[0][6] == "Order balance") && (results.data[0][7] == "Country") &&
                        (results.data[0][8] == "Notes")) {
    
                        let dataLength = results.data.length * 500;
                        setTimeout(function() {
                            window.open('/supplierlist?success=true', '_self');
                            $('.fullScreenSpin').css('display', 'none');
                        }, parseInt(dataLength));
    
                        for (let i = 0; i < results.data.length - 1; i++) {
    
                            objDetails = {
                                type: "TSupplier",
                                fields: {
                                    ClientName: results.data[i + 1][0],
                                    Phone: results.data[i + 1][1],
                                    APBalance: results.data[i + 1][2],
                                    ExcessAmount: results.data[i + 1][3],
                                    Balance: results.data[i + 1][4],
                                    SupplierCreditLimit: results.data[i + 1][4],
                                    Country: results.data[i + 1][6],
                                    Notes: results.data[i + 1][7],
                                    PublishOnVS1: true
                                }
                            };
                            if (results.data[i + 1][1]) {
                                if (results.data[i + 1][1] !== "") {
                                    contactService.saveSupplier(objDetails).then(function(data) {
                                        //$('.fullScreenSpin').css('display','none');
                                        //  Meteor._reload.reload();
                                    }).catch(function(err) {
                                        //$('.fullScreenSpin').css('display','none');
                                        swal({ title: 'Oooops...', text: err, type: 'error', showCancelButton: false, confirmButtonText: 'Try Again' }).then((result) => {
                                            if (result.value) {
                                                window.open('/supplierlist?success=true', '_self');
                                            } else if (result.dismiss === 'cancel') {
                                                window.open('/supplierlist?success=true', '_self');
                                            }
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
      },
      "click #btnNewSupplier": (e) => {
        $($(e.currentTarget).attr("data-toggle")).modal("toggle");
      },
      "click #tblSupplierlist tbody tr": (e) => {},
      "click .setup-step-8 .btnRefresh": (e) => {
        const templateObject = Template.instance();
        templateObject.loadSuppliers(true);
        $(".modal.show").modal("hide");
      },
    
      "click .setup-step-8 .templateDownload": (e, templateObject) => {
        let rows = [];
        const filename = "SampleSupplier" + ".csv";
    
        const customers = templateObject.supplierList.get();
    
        rows.push([
          "Company",
          "Phone",
          "AR Balance",
          "Credit balance",
          "Balance",
          "Credit limit",
          "Order balance",
          "Country",
          "Notes",
        ]);
    
        customers.forEach((customer) => {
          rows.push([
            customer.company,
            customer.phone,
            customer.arbalance,
            customer.creditbalance,
            customer.balance,
            customer.creditlimit,
            customer.salesorderbalance,
            customer.country,
            customer.notes
          ]);
        });
    
    
        utilityService.exportToCsv(rows, filename, "csv");
      },
      "click .setup-step-8 .templateDownloadXLSX": (e, templateObject) => {
        let rows = [];
        const filename = "SampleSupplier" + ".xls";
    
        const customers = templateObject.supplierList.get();
        rows.push([
          "Company",
          "Phone",
          "AR Balance",
          "Credit balance",
          "Balance",
          "Credit limit",
          "Order balance",
          "Country",
          "Notes",
        ]);
    
        customers.forEach((customer) => {
          rows.push([
            customer.company,
            customer.phone,
            customer.arbalance,
            customer.creditbalance,
            customer.balance,
            customer.creditlimit,
            customer.salesorderbalance,
            customer.country,
            customer.notes
          ]);
        });
        utilityService.exportToCsv(rows, filename, "xls");
      },
})