import './customers-settings.html';
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import "../../lib/global/indexdbstorage.js";
import LoadingOverlay from "../../LoadingOverlay";
import { UtilityService } from "../../utility-service";
import { ContactService } from "../../contacts/contact-service";

Template.wizard_customers.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.customerList = new ReactiveVar([]);
})

Template.wizard_customers.onRendered(() => {

})

Template.wizard_customers.helpers({})

Template.wizard_customers.events({
  "click #btnNewCustomer"(e) {
    const target = $(e.currentTarget).attr("data-toggle");
    $(target).modal("toggle");
  },
  "click #tblSetupCustomerlist tbody tr"(e){
    const tr = $(e.currentTarget);
    var listData = tr.attr("id");
    var transactiontype = tr.attr("isjob");
    var url = FlowRouter.current().path;
  },
  "click #btn-refresh-customers-table"(e) {
    $(".fullScreenSpin").css("display", "inline-block");
    const templateObject = Template.instance();
    location.reload();
    // templateObject.loadDefaultCustomer(true);
    $(".modal.show").modal("hide");
  },
  "change #attachment-upload-customer"(e) {
    let templateObj = Template.instance();
    var filename = $("#attachment-upload-customer")[0].files[0]["name"];
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
      $(".btnCustomerImport").Attr("disabled");
    } else if (validCSVExtensions.indexOf(fileExtension) != -1) {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];
      templateObj.selectedFile.set(selectedFile);
      if ($(".file-name").text() != "") {
        $(".btnCustomerImport").removeAttr("disabled");
      } else {
        $(".btnCustomerImport").Attr("disabled");
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
        $(".btnCustomerImport").removeAttr("disabled");
      } else {
        $(".btnCustomerImport").Attr("disabled");
      }
    }
  },
  "click .btnCustomerImport"() {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    Papa.parse(templateObject.selectedFile.get(), {
      complete: async function (results) {
        if (results.data.length > 0) {
          if (
            results.data[0][0] == "Company" &&
            results.data[0][1] == "First Name" &&
            results.data[0][2] == "Last Name" &&
            results.data[0][3] == "Phone" &&
            results.data[0][4] == "Mobile" &&
            results.data[0][5] == "Email" &&
            results.data[0][6] == "Skype" &&
            results.data[0][7] == "Street" &&
            results.data[0][8] == "City/Suburb" &&
            results.data[0][9] == "State" &&
            results.data[0][10] == "Post Code" &&
            results.data[0][11] == "Country" &&
            results.data[0][12] == "Tax Code"
          ) {
            let dataLength = results.data.length * 500;
            setTimeout(function(){
              Meteor._reload.reload();
              $('.fullScreenSpin').css('display','none');
            },parseInt(dataLength));
            for (let i = 0; i < results.data.length - 1; i++) {
              let objDetails = {
                type: "TCustomerEx",
                fields: {
                  ClientName: results.data[i + 1][0]|| '',
                  FirstName: results.data[i + 1][1] || "",
                  LastName: results.data[i + 1][2] || "",
                  Phone: results.data[i + 1][3] || '',
                  Mobile: results.data[i + 1][4] || '',
                  Email: results.data[i + 1][5] || "",
                  SkypeName: results.data[i + 1][6] || "",
                  Street2: results.data[i + 1][7] || "",
                  Street2: results.data[i + 1][8] || "",
                  Suburb: results.data[i + 1][8] || "",
                  State: results.data[i + 1][9] || "",
                  PostCode: results.data[i + 1][10] || "",
                  Country: results.data[i + 1][11] || "",
                  TaxCodeName: results.data[i + 1][12] || "",
                  PublishOnVS1: true,
                  Active: true,
                },
              };

              if(results.data[i+1][0]){
                if(results.data[i+1][0] !== "") {
                    contactService.saveCustomer(objDetails).then(function (data) {
                        //$('.fullScreenSpin').css('display','none');
                        //Meteor._reload.reload();
                    }).catch(function (err) {
                        //$('.fullScreenSpin').css('display','none');
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {
                              Meteor._reload.reload();
                            }
                        });
                    });
                }
              }
            }
            LoadingOverlay.hide();
          } else {
            LoadingOverlay.hide();
            swal(
              "Invalid Data Mapping fields ",
              "Please check that you are importing the correct file with the correct column headers.",
              "error"
            );
          }
        } else {
          LoadingOverlay.hide();
          swal(
            "Invalid Data Mapping fields ",
            "Please check that you are importing the correct file with the correct column headers.",
            "error"
          );
        }
      },
    });
  },
})

Template.registerHelper("equals", function (a, b) {
  return a === b;
});
