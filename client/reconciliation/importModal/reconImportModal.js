import { Template } from 'meteor/templating';
import './reconImportModal.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let importRuleExist = false

Template.reconImportModal.onCreated(function () {});

Template.reconImportModal.onRendered(function () {
  $("#btnImportState").on("click", function (e) {
    let accountId = $("#bankAccountID").val();
    let accountName = $("#bankAccountName").val();
    if (accountName == "") swal("Please Select Bank Account!", "", "warning");
    else {
      getVS1Data("VS1_BankRule")
        .then(function (dataObject) {
          if (dataObject.length) {
            let data = JSON.parse(dataObject[0].data);
            if (data[accountName] && data[accountName].length) {
              importRuleExist = true
              $("#attachment-upload").val("");
              $("#attachment-upload").trigger("click");
              return;
            }
          }
          swal({
            text: `This will allow you to manually import a bank statement directly
                    from your Company Bank Account Into your VS1 Bank
                    Reconciliation from. You just need to map or create the rules for
                    the first time, for which column on your Company Bank Account
                    import match's the fields in VS1 and it will remember moving
                    forward.`,
            type: "info",
            showCancelButton: true,
            // confirmButtonText: 'Yes',
            // cancelButtonText: 'No'
          }).then((result) => {
            if (result && result.value) {
              $("#attachment-upload").val("");
              $("#attachment-upload").trigger("click");
            }
          });
        })
        .catch(function (err) {
          swal("Something went wrong", "", "error");
        });
    }
  });
});

Template.reconImportModal.events({
  "change #attachment-upload": function (e) {
    var filename = $("#attachment-upload")[0].files[0]["name"];
    var fileExtension = filename.split(".").pop().toLowerCase();
    var validExtensions = ["csv", "txt", "xlsx"];
    var validCSVExtensions = ["csv", "txt"];
    const importFile = (selectedFile) => {
      $(".fullScreenSpin").css("display", "inline-block");
      Papa.parse(selectedFile, {
        complete: function (results) {
          // if (FlowRouter.current().route.path === "/bankrecon")
          // $(".fullScreenSpin").css("display", "none");
          if (results.data.length > 0) {
            localStorage.setItem("BankStatement", JSON.stringify(results.data));
            if (importRuleExist && FlowRouter.current().route.path === "/newbankrecon") {
              return window.open(
                `/newbankrecon?preview=1&bankaccountid=${$(
                  "#bankAccountID"
                ).val()}&bankaccountname=${$("#bankAccountName").val()}`,
                "_self"
              );
            }
            window.open(
              `/newbankrule?preview=1&bankaccountid=${$(
                "#bankAccountID"
              ).val()}&bankaccountname=${$("#bankAccountName").val()}`,
              "_self"
            );
          } else {
            swal(
              "Invalid Data Mapping fields ",
              "Please check that you are importing the correct file with the correct column headers.",
              "error"
            );
          }
        },
      });
    };
    if (validExtensions.indexOf(fileExtension) == -1) {
      swal(
        "Invalid Format",
        "formats allowed are :" + validExtensions.join(", "),
        "error"
      );
    } else if (validCSVExtensions.indexOf(fileExtension) != -1) {
      let selectedFile = event.target.files[0];
      importFile(selectedFile);
    } else if (fileExtension == "xlsx") {
      let selectedFile = event.target.files[0];
      var oFile = selectedFile;
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
          importFile(sCSV);
          if (roa.length) result[sheetName] = roa;
        });
        // see the result, caution: it works after reader event is done.
      };
      reader.readAsArrayBuffer(oFile);
    }
  },
});

Template.reconImportModal.helpers({});
