import './employment-settings.html'
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import "../../lib/global/indexdbstorage.js";
import LoadingOverlay from "../../LoadingOverlay";
import { UtilityService } from "../../utility-service";
import { ContactService } from "../../contacts/contact-service";

const utilityService = new UtilityService();
const contactService = new ContactService();


Template.wizard_employment.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.selectedFile = new ReactiveVar();
  templateObject.currentEmployees = new ReactiveVar([]);
  templateObject.editableEmployee = new ReactiveVar();
  templateObject.empuserrecord = new ReactiveVar();

  templateObject.getEmployeeProfileImageData = function (employeeName) {
    const contactService = new ContactService();
    contactService.getEmployeeProfileImageByName(employeeName).then((data) => {
      let employeeProfile = "";
      for (let i = 0; i < data.temployeepicture.length; i++) {
        if (data.temployeepicture[i].EmployeeName === employeeName) {
          employeeProfile = data.temployeepicture[i].EncodedPic;
          $(".imageUpload").attr(
            "src",
            "data:image/jpeg;base64," + employeeProfile
          );
          $(".cloudEmpImgID").val(data.temployeepicture[i].Id);
          break;
        }
      }
    });
  };

})

Template.wizard_employment.onRendered(() => [
  
])

Template.wizard_employment.helpers({
  currentEmployees: () => {
    return Template.instance().currentEmployees.get();
  },
  employeetableheaderrecords: () => {
    return Template.instance().employeetableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "tblEmployeelist",
    });
  },
  editableEmployee: () => {
    return Template.instance().editableEmployee.get();
  },
})
Template.wizard_employment.events({
  "click .btnSaveEmpPop"(e){
    playSaveAudio();
    setTimeout(function () {
      $("#addEmployeeModal").modal("toggle");
    }, delayTimeAfterSound);
  },
  "click .edit-employees-js"(e) {
    $("#addEmployeeModal").modal("toggle");
    let templateObject = Template.instance();
    LoadingOverlay.show();
    const employeeID = $(e.currentTarget).attr("id");
    if (!isNaN(employeeID)) {
      let employeeList = templateObject.currentEmployees.get();

      let data = employeeList.filter(
        (employee) => employee.fields.ID == employeeID
      );
      data = data[0];

      let editableEmployee = {
        id: data.fields.ID,
        lid: "Edit Employee",
        title: data.fields.Title || "",
        firstname: data.fields.FirstName || "",
        middlename: data.fields.MiddleName || "",
        lastname: data.fields.LastName || "",
        company: data.fields.EmployeeName || "",
        tfn: data.fields.TFN || "",
        priority: data.fields.CustFld5 || 0,
        color: data.fields.CustFld6 || "#00a3d3",
        email: data.fields.Email || "",
        phone: data.fields.Phone || "",
        mobile: data.fields.Mobile || "",
        fax: data.fields.FaxNumber || "",
        skype: data.fields.SkypeName || "",
        gender: data.fields.Sex || "",
        dob: data.fields.DOB
          ? moment(data.fields.DOB).format("DD/MM/YYYY")
          : "",
        startdate: data.fields.DateStarted
          ? moment(data.fields.DateStarted).format("DD/MM/YYYY")
          : "",
        datefinished: data.fields.DateFinished
          ? moment(data.fields.DateFinished).format("DD/MM/YYYY")
          : "",
        position: data.fields.Position || "",
        streetaddress: data.fields.Street || "",
        city: data.fields.Street2 || "",
        state: data.fields.State || "",
        postalcode: data.fields.PostCode || "",
        country: data.fields.Country || LoggedCountry,
        custfield1: data.fields.CustFld1 || "",
        custfield2: data.fields.CustFld2 || "",
        custfield3: data.fields.CustFld3 || "",
        custfield4: data.fields.CustFld4 || "",
        custfield14: data.fields.CustFld14 || "",
        website: "",
        notes: data.fields.Notes || "",
      };

      templateObject.editableEmployee.set(editableEmployee);
    }
    LoadingOverlay.hide();
  },
  "click #btnNewEmployee"(event){
    $("#addEmployeeModal").modal("toggle");

    let templateObject = Template.instance();
    LoadingOverlay.show();
    templateObject.editableEmployee.set(null);
    LoadingOverlay.hide();
  },
  "click .btnAddVS1User"(event) {
    swal({
      title: "Is this an existing Employee?",
      text: "",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        swal("Please select the employee from the list below.", "", "info");
        $("#employeeListModal").modal("toggle");
      } else if (result.dismiss === "cancel") {
        $("#addEmployeeModal").modal("toggle");
      }
    });
  },
  "click .chkDatatableEmployee"(event) {
    var columns = $("#tblEmployeelist th");
    let columnDataValue = $(event.target)
      .closest("div")
      .find(".divcolumnEmployee")
      .text();
    $.each(columns, function (i, v) {
      let className = v.classList;
      let replaceClass = className[1];

      if (v.innerText == columnDataValue) {
        if ($(event.target).is(":checked")) {
          $("." + replaceClass + "").css("display", "table-cell");
          $("." + replaceClass + "").css("padding", ".75rem");
          $("." + replaceClass + "").css("vertical-align", "top");
        } else {
          $("." + replaceClass + "").css("display", "none");
        }
      }
    });
  },
  "keyup #tblEmployeelist_filter input"(event) {
    if ($(event.target).val() != "") {
      $(".btnRefreshEmployees").addClass("btnSearchAlert");
    } else {
      $(".btnRefreshEmployees").removeClass("btnSearchAlert");
    }
    if (event.keyCode == 13) {
      $(".btnRefreshEmployees").trigger("click");
    }
  },
  "click .btnRefreshEmployee"(event) {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    location.reload();
    // templateObject.loadEmployees(true);
  },
  "click .resetEmployeeTable"(event) {
    var getcurrentCloudDetails = CloudUser.findOne({
      _id: localStorage.getItem("mycloudLogonID"),
      clouddatabaseID: localStorage.getItem("mycloudLogonDBID"),
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: "tblEmployeelist",
        });
        if (checkPrefDetails) {
          CloudPreference.remove(
            {
              _id: checkPrefDetails._id,
            },
            function (err, idTag) {
              if (err) {
              } else {
                // Meteor._reload.reload();
              }
            }
          );
        }
      }
    }
  },
  "click .saveEmployeeTable"(event) {
    let lineItems = [];
    $(".columnSettings").each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumnEmployee").text() || "";
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass =
        $tblrow.find(".divcolumnEmployee").attr("valueupdate") || "";
      var colHidden = false;
      if ($tblrow.find(".custom-control-input").is(":checked")) {
        colHidden = false;
      } else {
        colHidden = true;
      }
      let lineItemObj = {
        index: index,
        label: colTitle,
        hidden: colHidden,
        width: colWidth,
        thclass: colthClass,
      };

      lineItems.push(lineItemObj);
    });

    var getcurrentCloudDetails = CloudUser.findOne({
      _id: localStorage.getItem("mycloudLogonID"),
      clouddatabaseID: localStorage.getItem("mycloudLogonDBID"),
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: "tblEmployeelist",
        });
        if (checkPrefDetails) {
          CloudPreference.update(
            {
              _id: checkPrefDetails._id,
            },
            {
              $set: {
                userid: clientID,
                username: clientUsername,
                useremail: clientEmail,
                PrefGroup: "salesform",
                PrefName: "tblEmployeelist",
                published: true,
                customFields: lineItems,
                updatedAt: new Date(),
              },
            },
            function (err, idTag) {
              if (err) {
                $("#btnOpenSettingsEmployee").modal("toggle");
              } else {
                $("#btnOpenSettingsEmployee").modal("toggle");
              }
            }
          );
        } else {
          CloudPreference.insert(
            {
              userid: clientID,
              username: clientUsername,
              useremail: clientEmail,
              PrefGroup: "salesform",
              PrefName: "tblEmployeelist",
              published: true,
              customFields: lineItems,
              createdAt: new Date(),
            },
            function (err, idTag) {
              if (err) {
                $("#btnOpenSettingsEmployee").modal("toggle");
              } else {
                $("#btnOpenSettingsEmployee").modal("toggle");
              }
            }
          );
        }
      }
    }
    $("#btnOpenSettingsEmployee").modal("toggle");
  },
  "blur .divcolumnEmployee"(event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target)
      .closest("div.columnSettings")
      .attr("id");
    // var datable = $("#tblEmployeelist").DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  "change .rngRangeEmployee"(event) {
    let range = $(event.target).val();
    $(event.target)
      .closest("div.divColWidth")
      .find(".spWidth")
      .html(range + "px");

    let columData = $(event.target)
      .closest("div.divColWidth")
      .find(".spWidth")
      .attr("value");
    let columnDataValue = $(event.target)
      .closest("div")
      .prev()
      .find(".divcolumnEmployee")
      .text();
    var datable = $("#tblEmployeelist th");
    $.each(datable, function (i, v) {
      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css("width", range + "px");
      }
    });
  },
  "click .exportbtnEmployee"() {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblEmployeelist_wrapper .dt-buttons .btntabletocsv").click();
    LoadingOverlay.hide();
  },
  "click .exportbtnExcelEmployee"() {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblEmployeelist_wrapper .dt-buttons .btntabletoexcel").click();
    LoadingOverlay.hide();
  },
  "click .printConfirmEmployee"(event) {
    playPrintAudio();
    setTimeout(function () {
      $(".fullScreenSpin").css("display", "inline-block");
      jQuery("#tblEmployeelist_wrapper .dt-buttons .btntabletopdf").click();
      LoadingOverlay.hide();
    }, delayTimeAfterSound);
  },
  "click .templateDownload-employee"(e){
    let rows = [];
    const templateObject = Template.instance();
    const filename = "SampleEmployee" + ".csv";

    const employees = templateObject.currentEmployees.get();
    rows.push([
      "First Name",
      "Last Name",
      "Phone",
      "Mobile",
      "Email",
      "Skype",
      "Street",
      "City/Suburb",
      "State",
      "Post Code",
      "Country",
      "Gender",
    ]);

    employees.forEach((employee) => {
      rows.push([
        employee.fields.FirstName,
        employee.fields.LastName,
        employee.fields.Phone,
        employee.fields.Mobile,
        employee.fields.Email,
        employee.fields.SkypeName,
        employee.fields.Street,
        employee.fields.Suburb,
        employee.fields.State,
        employee.fields.PostCode,
        employee.fields.Country,
        employee.fields.Sex
      ]);
    });

    utilityService.exportToCsv(rows, filename, "csv");
  },
  "click .templateDownloadXLSX-employee"(e) {
    let rows = [];
    const templateObject = Template.instance();
    const filename = "SampleEmployee" + ".xls";

    const employees = templateObject.currentEmployees.get();
    rows.push([
      "First Name",
      "Last Name",
      "Phone",
      "Mobile",
      "Email",
      "Skype",
      "Street",
      "City/Suburb",
      "State",
      "Post Code",
      "Country",
      "Gender",
    ]);

    employees.forEach((employee) => {
      rows.push([
        employee.fields.FirstName,
        employee.fields.LastName,
        employee.fields.Phone,
        employee.fields.Mobile,
        employee.fields.Email,
        employee.fields.SkypeName,
        employee.fields.Street,
        employee.fields.Suburb,
        employee.fields.State,
        employee.fields.PostCode,
        employee.fields.Country,
        employee.fields.Sex
      ]);
    });
    utilityService.exportToCsv(rows, filename, "xls");
  },

  "click .btnUploadFile-employee"(event) {
    $("#attachment-upload-employee").val("");
    $(".file-name").text("");
    $("#attachment-upload-employee").trigger("click");
  },
  "change #attachment-upload-employee"(event) {
    let templateObj = Template.instance();
    var filename = $("#attachment-upload-employee")[0].files[0]["name"];
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
      $(".btnImportEmployee").Attr("disabled");
    } else if (validCSVExtensions.indexOf(fileExtension) != -1) {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];
      templateObj.selectedFile.set(selectedFile);
      if ($(".file-name").text() != "") {
        $(".btnImportEmployee").removeAttr("disabled");
      } else {
        $(".btnImportEmployee").Attr("disabled");
      }
    } else if (fileExtension == "xls") {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];
      var oFile = selectedFile;
      var reader = new FileReader();
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
      };
      reader.readAsArrayBuffer(oFile);
      if ($(".file-name").text() != "") {
        $(".btnImportEmployee").removeAttr("disabled");
      } else {
        $(".btnImportEmployee").Attr("disabled");
      }
    }
  },
  "click .btnImportEmployee"() {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let objDetails;
    var saledateTime = new Date();
    var empStartDate = moment(saledateTime).format("YYYY-MM-DD");
    Papa.parse(templateObject.selectedFile.get(), {
      complete: function (results) {
        if (results.data.length > 0) {
          if (
            results.data[0][0] == "First Name" &&
            results.data[0][1] == "Last Name" &&
            results.data[0][2] == "Phone" &&
            results.data[0][3] == "Mobile" &&
            results.data[0][4] == "Email" &&
            results.data[0][5] == "Skype" &&
            results.data[0][6] == "Street" &&
            (results.data[0][7] == "Street2" ||
              results.data[0][7] == "City/Suburb") &&
            results.data[0][8] == "State" &&
            results.data[0][9] == "Post Code" &&
            results.data[0][10] == "Country" &&
            results.data[0][11] == "Gender"
          ) {
            let dataLength = results.data.length * 500;
            setTimeout(function () {
              window.open("/employeelist?success=true", "_self");
            }, parseInt(dataLength));

            for (let i = 0; i < results.data.length - 1; i++) {
              objDetails = {
                type: "TEmployee",
                fields: {
                  FirstName: results.data[i + 1][0],
                  LastName: results.data[i + 1][1],
                  Phone: results.data[i + 1][2],
                  Mobile: results.data[i + 1][3],
                  DateStarted: empStartDate,
                  DOB: empStartDate,
                  Sex: results.data[i + 1][11] || "F",
                  Email: results.data[i + 1][4],
                  SkypeName: results.data[i + 1][5],
                  Street: results.data[i + 1][6],
                  Street2: results.data[i + 1][7],
                  Suburb: results.data[i + 1][7],
                  State: results.data[i + 1][8],
                  PostCode: results.data[i + 1][9],
                  Country: results.data[i + 1][10],
                },
              };
              if (results.data[i + 1][1]) { 
                if (results.data[i + 1][1] !== "") {
                  contactService
                    .saveEmployee(objDetails)
                    .then(function (data) {
                    })
                    .catch(function (err) {
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
                }
              }
            }
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
  "click #tblEmployeelistpop tr td"(e) {
    $(e).preventDefault();
  },

})