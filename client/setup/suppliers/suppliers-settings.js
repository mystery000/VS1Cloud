import './suppliers-settings.html'
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import "../../lib/global/indexdbstorage.js";
import LoadingOverlay from "../../LoadingOverlay";
import { UtilityService } from "../../utility-service";
import { ContactService } from "../../contacts/contact-service";
import moment from "moment";
import {SideBarService} from "../../js/sidebar-service";

const utilityService = new UtilityService();
const contactService = new ContactService();


Template.wizard_suppliers.onCreated(() => {
  Template.wizard_suppliers.inheritsEventsFrom('non_transactional_list');
  Template.wizard_suppliers.inheritsHelpersFrom('non_transactional_list');

  let templateObject = Template.instance();
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.getDataTableList = function(data) {

    let arBalance = utilityService.modifynegativeCurrencyFormat(data.ARBalance) || 0.00;
    let creditBalance = utilityService.modifynegativeCurrencyFormat(data.ExcessAmount) || 0.00;
    let balance = utilityService.modifynegativeCurrencyFormat(data.Balance) || 0.00;
    let creditLimit = utilityService.modifynegativeCurrencyFormat(data.SupplierCreditLimit) || 0.00;
    let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.Balance) || 0.00;

    var dataList = [
      data.ClientID || '',
      data.Company || '',
      data.Phone || '',
      arBalance || 0.00,
      creditBalance || 0.00,
      balance || 0.00,
      creditLimit || 0.00,
      salesOrderBalance || 0.00,
      data.Suburb || '',
      data.Country || '',
      data.Notes || '',
      data.Active ? "" : "In-Active",
      //
      // data.Email || '',
      // data.AccountNo || '',
      // data.ClientNo || '',
      // data.JobTitle || '',
      // data.CUSTFLD1 || '',
      // data.CUSTFLD2 || '',
      // data.POState || '',
      // data.Postcode || '',
      // linestatus,
    ];
    return dataList;
  }
  let headerStructure = [
    { index: 0, label: 'ID', class: 'colSupplierID colID', active: false, display: true, width: "10" },
    { index: 1, label: 'Company', class: 'colCompany', active: true, display: true, width: "200" },
    { index: 2, label: 'Phone', class: 'colPhone', active: true, display: true, width: "110" },
    { index: 3, label: 'AR Balance', class: 'colARBalance', active: true, display: true, width: "110" },
    { index: 4, label: 'Credit Balance', class: 'colCreditBalance', active: true, display: true, width: "110" },
    { index: 5, label: 'Balance', class: 'colBalance', active: true, display: true, width: "110" },
    { index: 6, label: 'Credit Limit', class: 'colCreditLimit', active: true, display: true, width: "110" },
    { index: 7, label: 'Order Balance', class: 'colSalesOrderBalance', active: true, display: true, width: "110" },
    { index: 8, label: 'City/Suburb', class: 'colSuburb', active: true, display: true, width: "110" },
    { index: 9, label: 'Country', class: 'colCountry', active: true, display: true, width: "110" },
    { index: 10, label: 'Comments', class: 'colNotes', active: true, display: true, width: "110" },
    { index: 11, label: 'Status', class: 'colStatus', active: true, display: true, width: "120" },
  ];
  templateObject.tableheaderrecords.set(headerStructure);
})

Template.wizard_suppliers.onRendered(() => {

})

Template.wizard_suppliers.helpers({
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  apiFunction:function() {
    let sideBarService = new SideBarService();
    return sideBarService.getAllSuppliersDataVS1List;
  },

  searchAPI: function() {
    let sideBarService = new SideBarService();
    return sideBarService.getOneSupplierDataExByName;
  },

  service: ()=>{
    let sideBarService = new SideBarService();
    return sideBarService;

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

  apiParams: function() {
    return ['limitCount', 'limitFrom', 'deleteFilter'];
  },
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
      var oFile = selectedFile;
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
          var sCSV = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
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
  'click .btnSupplierImport': function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let objDetails;
    Papa.parse(templateObject.selectedFile.get(), {
      complete: function (results) {
        if (results.data.length > 0) {
          if ((results.data[0][0] == "Company") && (results.data[0][1] == "Phone") &&
            (results.data[0][2] == "AR Balance") && (results.data[0][3] == "Credit balance") &&
            (results.data[0][4] == "Balance") && (results.data[0][5] == "Credit limit") &&
            (results.data[0][6] == "Order balance") && (results.data[0][7] == "Country") &&
            (results.data[0][8] == "Notes")) {
            let dataLength = results.data.length * 500;
            setTimeout(function () {
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
                  contactService.saveSupplier(objDetails).then(function (data) {
                  }).catch(function (err) {
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
  "click #tblSetupSupplierlist tbody tr": (e) => { },

  "click #btn-supplier-refresh"(e){
    $('.fullScreenSpin').css('display', 'inline-block');
    location.reload()
    $(".modal.show").modal("hide");
  },
})