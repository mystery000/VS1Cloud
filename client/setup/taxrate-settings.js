import './taxrate-settings.html';
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import LoadingOverlay from "../LoadingOverlay";
import { SideBarService } from '../js/sidebar-service';
import { OrganisationService } from "../js/organisation-service";
import { TaxRateService } from "../settings/settings-service";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "../lib/global/indexdbstorage.js";

let sideBarService = new SideBarService();
let organisationService = new OrganisationService();
let taxRateService = new TaxRateService();

const numberInputValidate = (event) => {
  if (
    $.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
    // Allow: Ctrl+A, Command+A
    (event.keyCode === 65 &&
      (event.ctrlKey === true || event.metaKey === true)) ||
    // Allow: home, end, left, right, down, up
    (event.keyCode >= 35 && event.keyCode <= 40)
  ) {
    // let it happen, don't do anything
    return;
  }

  if ((event.keyCode >= 48 && event.keyCode <= 57) ||
    (event.keyCode >= 96 && event.keyCode <= 105) ||
    event.keyCode == 8 || event.keyCode == 9 ||
    event.keyCode == 37 || event.keyCode == 39 ||
    event.keyCode == 46 || event.keyCode == 190) { } else {
    event.preventDefault();
  }
}


Template.wizard_taxrate.onCreated(() => {
  this.defaultpurchasetaxcode = new ReactiveVar()
  this.defaultsaletaxcode = new ReactiveVar()
})

Template.wizard_taxrate.onRendered(() => {

  $(document).on('click', '.table-remove', function (event) {
    event.stopPropagation();
    var targetID = $(event.target).closest('tr').attr('id'); // table row ID
    $('#selectDeleteLineID').val(targetID);
    $('#deleteLineModal').modal('toggle');
  });

  $('#taxRatesList tbody').on('click', 'tr .colName, tr .colDescription, tr .colRate', function () {
    var listData = $(this).closest('tr').attr('id');

    if (listData) {
      $('#add-tax-title').text('Edit Tax Rate');
      $('#edtTaxName').prop('readonly', true);
      if (listData !== '') {
        listData = Number(listData);

        var taxid = listData || '';
        let tax = templateObject.datatablerecords.get().find((v) => String(v.id) === String(taxid));

        $("#edtTaxID").val(tax.id);
        $("#edtTaxName").val(tax.codename);

        $("#edtTaxRate").val(String(tax.rate).replace("%", ""));
        $("#edtTaxDesc").val(tax.description);

        let subTaxLines = tax.lines.map((v, index) => ({
          RowId: `subtax_${index}`,
          SubTaxCode: v.SubTaxCode,
          Percentage: v.Percentage,
          PercentageOn: v.PercentageOn,
          CapAmount: v.CapAmount,
          ThresholdAmount: v.ThresholdAmount,
          Description: v.Description
        }));
        templateObject.subtaxlines.set(subTaxLines);

        $("#addNewTaxRate").modal("toggle");
      }
    }
  });

})


Template.wizard_taxrate.events({
  "click .chkDatatable": function (event) {
    var columns = $("#taxRatesList th");
    let columnDataValue = $(event.target)
      .closest("div")
      .find(".divcolumn")
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
  "click .resetTable": function (event) {
    var getcurrentCloudDetails = CloudUser.findOne({
      _id: localStorage.getItem("mycloudLogonID"),
      clouddatabaseID: localStorage.getItem("mycloudLogonDBID"),
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: "taxRatesList",
        });
        if (checkPrefDetails) {
          CloudPreference.remove({ _id: checkPrefDetails._id },
            function (err, idTag) {
              if (err) { } else {
                Meteor._reload.reload();
              }
            }
          );
        }
      }
    }
  },
  "click .saveTable": function (event) {
    let lineItems = [];
    $(".columnSettings").each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumn").text() || "";
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || "";
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
          PrefName: "taxRatesList",
        });
        if (checkPrefDetails) {
          CloudPreference.update({ _id: checkPrefDetails._id }, {
            $set: {
              userid: clientID,
              username: clientUsername,
              useremail: clientEmail,
              PrefGroup: "salesform",
              PrefName: "taxRatesList",
              published: true,
              customFields: lineItems,
              updatedAt: new Date(),
            },
          },
            function (err, idTag) {
              if (err) {
                $("#myModal2").modal("toggle");
              } else {
                $("#myModal2").modal("toggle");
              }
            }
          );
        } else {
          CloudPreference.insert({
            userid: clientID,
            username: clientUsername,
            useremail: clientEmail,
            PrefGroup: "salesform",
            PrefName: "taxRatesList",
            published: true,
            customFields: lineItems,
            createdAt: new Date(),
          },
            function (err, idTag) {
              if (err) {
                $("#myModal2").modal("toggle");
              } else {
                $("#myModal2").modal("toggle");
              }
            }
          );
        }
      }
    }
  },
  "blur .divcolumn": function (event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target)
      .closest("div.columnSettings")
      .attr("id");
    var datable = $("#taxRatesList").DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  "change .rngRange": function (event) {
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
      .find(".divcolumn")
      .text();
    var datable = $("#taxRatesList th");
    $.each(datable, function (i, v) {
      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css("width", range + "px");
      }
    });
  },
  "click .btnOpenSettings": function (event) {
    let templateObject = Template.instance();
    var columns = $("#taxRatesList th");

    const tableHeaderList = [];
    let sTible = "";
    let sWidth = "";
    let sIndex = "";
    let sVisible = "";
    let columVisible = false;
    let sClass = "";
    $.each(columns, function (i, v) {
      if (v.hidden == false) {
        columVisible = true;
      }
      if (v.className.includes("hiddenColumn")) {
        columVisible = false;
      }
      sWidth = v.style.width.replace("px", "");

      let datatablerecordObj = {
        sTitle: v.innerText || "",
        sWidth: sWidth || "",
        sIndex: v.cellIndex || "",
        sVisible: columVisible || false,
        sClass: v.className || "",
      };
      tableHeaderList.push(datatablerecordObj);
    });
    templateObject.tableheaderrecords.set(tableHeaderList);
  },
  "click #exportbtn": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#taxRatesList_wrapper .dt-buttons .btntabletocsv").click();
    $(".fullScreenSpin").css("display", "none");
  },
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    sideBarService
      .getTaxRateVS1()
      .then(function (dataReload) {
        addVS1Data("TTaxcodeVS1", JSON.stringify(dataReload))
          .then(function (datareturn) {
            location.reload(true);
          })
          .catch(function (err) {
            location.reload(true);
          });
      })
      .catch(function (err) {
        location.reload(true);
      });
  },
  "click .btnSaveDefaultTax": function () {
    playSaveAudio();
    setTimeout(function () {
      let purchasetaxcode = $("input[name=optradioP]:checked").val() || "";
      let salestaxcode = $("input[name=optradioS]:checked").val() || "";

      localStorage.setItem("ERPTaxCodePurchaseInc", purchasetaxcode || "");
      localStorage.setItem("ERPTaxCodeSalesInc", salestaxcode || "");
      getVS1Data("vscloudlogininfo").then(function (dataObject) {
        if (dataObject.length == 0) {
          swal({
            title: "Default Tax Rate Successfully Changed",
            text: "",
            type: "success",
            showCancelButton: false,
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.value) {
              Meteor._reload.reload();
            } else {
              Meteor._reload.reload();
            }
          });
        } else {
          let loginDataArray = [];
          if (
            dataObject[0].EmployeeEmail === localStorage.getItem("mySession")
          ) {
            loginDataArray = dataObject[0].data;

            loginDataArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc = purchasetaxcode;
            loginDataArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc = salestaxcode;
            addLoginData(loginDataArray).then(function (datareturnCheck) {
              swal({
                title: "Default Tax Rate Successfully Changed",
                text: "",
                type: "success",
                showCancelButton: false,
                confirmButtonText: "OK",
              }).then((result) => {
                if (result.value) {
                  Meteor._reload.reload();
                } else {
                  Meteor._reload.reload();
                }
              });
            })
              .catch(function (err) {
                swal({
                  title: "Default Tax Rate Successfully Changed",
                  text: "",
                  type: "success",
                  showCancelButton: false,
                  confirmButtonText: "OK",
                }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else {
                    Meteor._reload.reload();
                  }
                });
              });
          } else {
            swal({
              title: "Default Tax Rate Successfully Changed",
              text: "",
              type: "success",
              showCancelButton: false,
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.value) {
                Meteor._reload.reload();
              } else {
                Meteor._reload.reload();
              }
            });
          }
        }
      }).catch(function (err) {
        swal({
          title: "Default Tax Rate Successfully Changed",
          text: "",
          type: "success",
          showCancelButton: false,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.value) {
            Meteor._reload.reload();
          } else {
            Meteor._reload.reload();
          }
        });
      });
    }, delayTimeAfterSound);
  },
  "keydown #edtTaxRate": numberInputValidate,
  "keydown #subTaxPercent": numberInputValidate,
  "keydown #subTaxCapAmt": numberInputValidate,
  "keydown #subTaxThresholdAmt": numberInputValidate,
  "click .btnNewSubTax": function () {
    $("#edtSubTaxLineId").val('');
    $('#subTaxCode').val('');
    $('#subTaxPercent').val('');
    $('#subTaxPercentageOn').prop('readonly', false);
    $('#subTaxCapAmt').val('0');
    $('#subTaxThresholdAmt').val('0');
    $('#add-subtax-title').text('Add Sub Tax');
  },
  'click .btnSaveTaxRate': function () {
    let templateObject = Template.instance();
    playSaveAudio();
    setTimeout(function () {
      $('.fullScreenSpin').css('display', 'inline-block');
      let taxtID = $('#edtTaxID').val();
      let taxName = $('#edtTaxName').val();
      let taxDesc = $('#edtTaxDesc').val();
      let taxRate = parseFloat($('#edtTaxRate').val() / 100);
      let objDetails = '';
      if (taxName === '') {
        Bert.alert('<strong>WARNING:</strong> Tax Rate cannot be blank!', 'warning');
        $('.fullScreenSpin').css('display', 'none');
        e.preventDefault();
      }

      let lines = templateObject.subtaxlines.get().map((v) => {
        return {
          type: "TTaxCodeLines",
          fields: {
            ID: v.ID,
            Id: v.Id,
            SubTaxCode: v.SubTaxCode,
            Percentage: v.Percentage,
            PercentageOn: v.PercentageOn,
            CapAmount: v.CapAmount,
            ThresholdAmount: v.ThresholdAmount,
          }
        }
      });
      if (taxtID == "") {
        taxRateService.checkTaxRateByName(taxName).then(function (data) {
          taxtID = data.ttaxcode[0].Id;
          let objDetails = {
            type: "TTaxcode",
            fields: {
              ID: parseInt(taxtID),
              Active: true,
              Description: taxDesc,
              Rate: taxRate,
              PublishOnVS1: true,
            },
          };
          if (templateObject.isChkUSRegionTax.get()) {
            objDetails.fields.Lines = lines;
          }
          taxRateService
            .saveTaxRate(objDetails)
            .then(function (objDetails) {
              sideBarService
                .getTaxRateVS1()
                .then(function (dataReload) {
                  addVS1Data("TTaxcodeVS1", JSON.stringify(dataReload))
                    .then(function (datareturn) {
                      Meteor._reload.reload();
                    })
                    .catch(function (err) {
                      Meteor._reload.reload();
                    });
                })
                .catch(function (err) {
                  Meteor._reload.reload();
                });
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
                  Meteor._reload.reload();
                } else if (result.dismiss === "cancel") { }
              });
              $(".fullScreenSpin").css("display", "none");
            });
        })
          .catch(function (err) {
            let objDetails = {
              type: "TTaxcode",
              fields: {
                Active: true,
                CodeName: taxName,
                Description: taxDesc,
                Rate: taxRate,
                PublishOnVS1: true,
              },
            };
            if (templateObject.isChkUSRegionTax.get()) {
              objDetails.fields.Lines = lines;
            }

            taxRateService
              .saveTaxRate(objDetails)
              .then(function (objDetails) {
                sideBarService
                  .getTaxRateVS1()
                  .then(function (dataReload) {
                    addVS1Data("TTaxcodeVS1", JSON.stringify(dataReload))
                      .then(function (datareturn) {
                        Meteor._reload.reload();
                      })
                      .catch(function (err) {
                        Meteor._reload.reload();
                      });
                  })
                  .catch(function (err) {
                    Meteor._reload.reload();
                  });
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
                    Meteor._reload.reload();
                  } else if (result.dismiss === "cancel") { }
                });
                $(".fullScreenSpin").css("display", "none");
              });
          });
      } else {
        let objDetails = {
          type: "TTaxcode",
          fields: {
            ID: parseInt(taxtID),
            Active: true,
            CodeName: taxName,
            Description: taxDesc,
            Rate: taxRate,
            PublishOnVS1: true,
          },
        };
        if (templateObject.isChkUSRegionTax.get()) {
          objDetails.fields.Lines = lines;
        }

        taxRateService
          .saveTaxRate(objDetails)
          .then(function (objDetails) {
            sideBarService
              .getTaxRateVS1()
              .then(function (dataReload) {
                addVS1Data("TTaxcodeVS1", JSON.stringify(dataReload))
                  .then(function (datareturn) {
                    Meteor._reload.reload();
                  })
                  .catch(function (err) {
                    Meteor._reload.reload();
                  });
              })
              .catch(function (err) {
                Meteor._reload.reload();
              });
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
                Meteor._reload.reload();
              } else if (result.dismiss === "cancel") { }
            });
            $(".fullScreenSpin").css("display", "none");
          });
        $('.fullScreenSpin').css('display', 'none');

      }
    }, delayTimeAfterSound);
  },
  'click .btnAddTaxRate': function () {
    $('#add-tax-title').text('Add New Tax Rate');
    $('#edtTaxID').val('');
    $('#edtTaxName').val('S');
    $('#edtTaxName').prop('readonly', false);
    $('#edtTaxRate').val('4');
    $('#edtTaxDesc').val('Sales Tax Default');
    let templateObject = Template.instance();

    if (templateObject.isChkUSRegionTax.get()) {
      let newSubTaxLines = [{
        RowId: `subtax_0`,
        SubTaxCode: 'STRT',
        Percentage: 1,
        PercentageOn: 'Selling Price',
        CapAmount: 0,
        ThresholdAmount: 0,
        Description: ''
      }, {
        RowId: `subtax_1`,
        SubTaxCode: 'CTRT',
        Percentage: 1,
        PercentageOn: 'Selling Price',
        CapAmount: 0,
        ThresholdAmount: 0,
        Description: ''
      }, {
        RowId: `subtax_2`,
        SubTaxCode: 'SPRT',
        Percentage: 1,
        PercentageOn: 'Selling Price',
        CapAmount: 0,
        ThresholdAmount: 0,
        Description: ''
      }, {
        RowId: `subtax_3`,
        SubTaxCode: 'CONRT',
        Percentage: 1,
        PercentageOn: 'Selling Price',
        CapAmount: 0,
        ThresholdAmount: 0,
        Description: ''
      }];
      templateObject.subtaxlines.set(newSubTaxLines);
    } else {
      templateObject.subtaxlines.set([]);
    }

  },
  "click #subTaxList td.clickable": (e) => SubTaxEditListener(e),
  "click #subTaxList .table-remove": (e) => {
    e.stopPropagation();
    const targetID = $(e.target).closest("tr").attr("id"); // table row ID
    let templateObject = Template.instance();
    let subTaxLines = templateObject.subtaxlines.get();
    subTaxLines = subTaxLines.filter((v) => v.RowId !== targetID);
    templateObject.subtaxlines.set(subTaxLines);
    let taxPercent = 0;
    subTaxLines.map((v) => taxPercent += v.Percentage);
    $('#edtTaxRate').val(Math.min(taxPercent, 100));
  },
  'click .btnSubTaxes': function () {
    FlowRouter.go('/subtaxsettings');
  },
  'click .btnTaxSummary': function () {
    FlowRouter.go('/taxsummaryreport');
  },
  'click .btnInactiveTax': function () {
    let requestFlag = true;
    let btnStr = $(".btnInactiveTax").text();
    if (btnStr == "Inactive Tax Codes") {
      $(".btnInactiveTax").text("Active Tax Codes");
      requestFlag = false;
      localStorage.setItem("inactiveFlag", false);
    } else if (btnStr == "Active Tax Codes") {
      $(".btnInactiveTax").text("Inactive Tax Codes");
      requestFlag = true;
      localStorage.setItem("inactiveFlag", true);
    }

    let taxRateService = new TaxRateService();
    taxRateService.getTaxRateVS1("", requestFlag)
      .then(function (dataReload) {
        addVS1Data("TTaxcodeVS1", JSON.stringify(dataReload))
          .then(function (datareturn) {
            location.reload(true);
          })
          .catch(function (err) {
            location.reload(true);
          });
      })
      .catch(function (err) {
        console.error("err", err);
      });
  },
  'click .btnDeleteTaxRate': function () {
    playDeleteAudio();
    let taxRateService = new TaxRateService();
    setTimeout(function () {
      let taxCodeId = $('#selectDeleteLineID').val();

      let objDetails = {
        type: "TTaxcode",
        fields: {
          Id: parseInt(taxCodeId),
          Active: false
        }
      };

      taxRateService
        .saveTaxRate(objDetails)
        .then(function (objDetails) {
          sideBarService
            .getTaxRateVS1()
            .then(function (dataReload) {
              addVS1Data("TTaxcodeVS1", JSON.stringify(dataReload))
                .then(function (datareturn) {
                  Meteor._reload.reload();
                })
                .catch(function (err) {
                  Meteor._reload.reload();
                });
            })
            .catch(function (err) {
              Meteor._reload.reload();
            });
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
              Meteor._reload.reload();
            } else if (result.dismiss === "cancel") { }
          });
          $(".fullScreenSpin").css("display", "none");
        });
    }, delayTimeAfterSound);
  },
  "click .btnBack": function (event) {
    playCancelAudio();
    event.preventDefault();
    setTimeout(function () {
      history.back(1);
    }, delayTimeAfterSound);
  },
  "click #taxRatesList td.clickable": (e) => TaxRatesEditListener(e),
  "click #taxRatesList .table-remove": (e) => {
    e.stopPropagation();
    const targetID = $(e.target).closest("tr").attr("id"); // table row ID
    $("#selectDeleteLineID").val(targetID);
    $("#deleteLineModal").modal("toggle");
  },
  'click .btnBack': function (event) {
    playCancelAudio();
    event.preventDefault();
    setTimeout(function () {
      history.back(1);
    }, delayTimeAfterSound);
  }
});

Template.wizard_taxrate.helpers({
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "taxRatesList",
    });
  },
  defaultpurchasetaxcode: () => {
    return Template.instance().defaultpurchasetaxcode.get();
  },
  defaultsaletaxcode: () => {
    return Template.instance().defaultsaletaxcode.get();
  },
})

export const TaxRatesEditListener = (e) => {
  if (!e) return false;

  const templateObject = Template.instance();

  const tr = $(e.currentTarget).parent();
  var listData = tr.attr("id");
  if (listData) {
    $("#add-tax-title").text("Edit Tax Rate");
    $("#edtTaxName").prop("readonly", true);
    if (listData !== "") {
      listData = Number(listData);

      var taxid = listData || "";
      let tax = templateObject.datatablerecords.get().find((v) => String(v.id) === String(taxid));

      $("#edtTaxID").val(tax.id);
      $("#edtTaxName").val(tax.codename);

      $("#edtTaxRate").val(String(tax.rate).replace("%", ""));
      $("#edtTaxDesc").val(tax.description);

      let subTaxLines = tax.lines.map((v, index) => ({
        RowId: `subtax_${index}`,
        ID: v.ID,
        SubTaxCode: v.SubTaxCode,
        Percentage: v.Percentage,
        PercentageOn: v.PercentageOn,
        CapAmount: v.CapAmount,
        ThresholdAmount: v.ThresholdAmount,
        Description: v.Description
      }));
      templateObject.subtaxlines.set(subTaxLines);

      $("#addNewTaxRate").modal("toggle");
    }
  }
};