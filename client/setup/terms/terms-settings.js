// @ts-nocheck
import './terms-settings.html'
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import "../../lib/global/indexdbstorage.js";
import { SideBarService } from "../../js/sidebar-service";
import { TaxRateService } from "../../settings/settings-service.js";
import LoadingOverlay from "../../LoadingOverlay";
import moment from 'moment';
import XLSX from "xlsx";
import { UtilityService } from "../../utility-service";

const sideBarService = new SideBarService()
const taxRateService = new TaxRateService();
const utilityService = new UtilityService();

Template.wizard_terms.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);

  templateObject.deptrecords = new ReactiveVar();
  templateObject.include7Days = new ReactiveVar(false);
  templateObject.include30Days = new ReactiveVar(false);
  templateObject.includeCOD = new ReactiveVar(false);
  templateObject.includeEOM = new ReactiveVar(false);
  templateObject.includeEOMPlus = new ReactiveVar(false);
  templateObject.includeSalesDefault = new ReactiveVar(false);
  templateObject.includePurchaseDefault = new ReactiveVar(false);
  templateObject.getDataTableList = function(data) {
    let linestatus = '';
    if (data.Active == true) {
      linestatus = "";
    } else if (data.Active == false) {
      linestatus = "In-Active";
    };
    let tdEOM = '';
    let tdEOMPlus = '';
    let tdCustomerDef = ''; //isSalesdefault
    let tdSupplierDef = ''; //isPurchasedefault
    let tdProgressPayment = ''; //isProgressPayment
    let tdRequired = ''; //Required

    //Check if EOM is checked
    if (data.IsEOM == true) {
      tdEOM = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseom-' + data.ID + '" checked><label class="custom-control-label chkBox" for="iseom-' + data.ID + '"></label></div>';
    } else {
      tdEOM = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseom-' + data.ID + '"><label class="custom-control-label chkBox" for="iseom-' + data.ID + '"></label></div>';
    }
    //Check if EOM Plus is checked
    if (data.IsEOMPlus == true) {
      tdEOMPlus = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseomplus-' + data.ID + '" checked><label class="custom-control-label chkBox" for="iseomplus-' + data.ID + '"></label></div>';
    } else {
      tdEOMPlus = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseomplus-' + data.ID + '"><label class="custom-control-label chkBox" for="iseomplus-' + data.ID + '"></label></div>';
    }
    //Check if Customer Default is checked // //isSalesdefault
    if (data.isSalesdefault == true) {
      tdCustomerDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="isSalesdefault-' + data.ID + '" checked><label class="custom-control-label chkBox" for="isSalesdefault-' + data.ID + '"></label></div>';
    } else {
      tdCustomerDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="isSalesdefault-' + data.ID + '"><label class="custom-control-label chkBox" for="isSalesdefault-' + data.ID + '"></label></div>';
    }
    //Check if Supplier Default is checked // isPurchasedefault
    if (data.isPurchasedefault == true) {
      tdSupplierDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="isPurchasedefault-' + data.ID + '" checked><label class="custom-control-label chkBox" for="isPurchasedefault-' + data.ID + '"></label></div>';
    } else {
      tdSupplierDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseomplus-' + data.ID + '"><label class="custom-control-label chkBox" for="isPurchasedefault-' + data.ID + '"></label></div>';
    }
    //Check if is progress payment is checked
    if (data.IsProgressPayment == true) {
      tdProgressPayment = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="IsProgressPayment-' + data.ID + '" checked><label class="custom-control-label chkBox" for="IsProgressPayment-' + data.ID + '"></label></div>';
    } else {
      tdProgressPayment = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="IsProgressPayment-' + data.ID + '"><label class="custom-control-label chkBox" for="IsProgressPayment-' + data.ID + '"></label></div>';
    }
    //Check if Required is checked
    if (data.Required == true) {
      tdRequired = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="Required-' + data.ID + '" checked><label class="custom-control-label chkBox" for="Required-' + data.ID + '"></label></div>';
    } else {
      tdRequired = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="Required-' + data.ID + '"><label class="custom-control-label chkBox" for="Required-' + data.ID + '"></label></div>';
    }

    var dataList = [
      data.ID || "",
      data.Terms || "",
      data.TermsAmount || "",
      tdEOM,
      tdEOMPlus,
      data.Description || "",
      tdCustomerDef,
      tdSupplierDef,
      linestatus,
      tdProgressPayment,
      tdRequired,
      data.EarlyPaymentDiscount || 0.00,
      data.EarlyPaymentDays || 0.00,
      data.ProgressPaymentType || "",
      data.ProgressPaymentDuration || 0.00,
      data.ProgressPaymentInstallments || 0.00,
      moment(data.ProgressPaymentfirstPayonSaleDate).format("DD/MM/YYYY") || 0.00,
    ];
    return dataList;
  }

  let headerStructure = [
    { index: 0, label: 'ID', class: 'colTermsID', active: false, display: true, width: "10" },
    { index: 1, label: 'Term Name', class: 'colName', active: true, display: true, width: "150" },
    { index: 2, label: 'Terms Amount', class: 'colTermsAmount', active: true, display: true, width: "120" },
    { index: 3, label: 'EOM', class: 'colIsEOM', active: true, display: true, width: "50" },
    { index: 4, label: 'EOM Plus', class: 'colIsEOMPlus', active: true, display: true, width: "80" },
    { index: 5, label: 'Description', class: 'colDescription', active: true, display: true, width: "100" },
    { index: 6, label: 'Customer Default', class: 'colCustomerDef', active: true, display: true, width: "155" },
    { index: 7, label: 'Supplier Default', class: 'colSupplierDef', active: true, display: true, width: "155" },
    { index: 8, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
    { index: 9, label: 'Is Progress Payment', class: 'colIsProgressPayment', active: false, display: true, width: "200" },
    { index: 10, label: 'Required', class: 'colRequired', active: false, display: true, width: "100" },
    { index: 11, label: 'Early Payment Discount', class: 'colEarlyPayDiscount', active: false, display: true, width: "200" },
    { index: 12, label: 'Early Payment Days', class: 'colEarlyPay', active: false, display: true, width: "150" },
    { index: 13, label: 'Payment Type', class: 'colProgressPayType', active: false, display: true, width: "150" },
    { index: 14, label: 'Payment Duration', class: 'colProgressPayDuration', active: false, display: true, width: "100" },
    { index: 15, label: 'Pay On Sale Date', class: 'colPayOnSale', active: false, display: true, width: "150" },
  ];
  templateObject.tableheaderrecords.set(headerStructure);
})

Template.wizard_terms.onRendered(() => {

})

Template.wizard_terms.helpers({
  datatablerecords: () => {
    return Template.instance()
      .datatablerecords.get()
      .sort(function (a, b) {
        if (a.termname == "NA") {
          return 1;
        } else if (b.termname == "NA") {
          return -1;
        }
        return a.termname.toUpperCase() > b.termname.toUpperCase() ? 1 : -1;
      });
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "tblTermsList",
    });
  },
  deptrecords: () => {
    return Template.instance()
      .deptrecords.get()
      .sort(function (a, b) {
        if (a.department == "NA") {
          return 1;
        } else if (b.department == "NA") {
          return -1;
        }
        return a.department.toUpperCase() > b.department.toUpperCase() ? 1 : -1;
      });
  },
  include7Days: () => {
    return Template.instance().include7Days.get();
  },
  include30Days: () => {
    return Template.instance().include30Days.get();
  },
  includeCOD: () => {
    return Template.instance().includeCOD.get();
  },
  includeEOM: () => {
    return Template.instance().includeEOM.get();
  },
  includeEOMPlus: () => {
    return Template.instance().includeEOMPlus.get();
  },
  includeSalesDefault: () => {
    return Template.instance().includeSalesDefault.get();
  },
  includePurchaseDefault: () => {
    return Template.instance().includePurchaseDefault.get();
  },
  loggedCompany: () => {
    return localStorage.getItem("mySession") || "";
  },

  apiFunction:function() {
    let sideBarService = new SideBarService();
    return sideBarService.getTermsDataList;
  },

  searchAPI: function() {
    return sideBarService.getTermsDataList;
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

Template.wizard_terms.events({
  "click .table-remove-term"(event) {
    event.stopPropagation();
    var targetID = $(event.target).closest("tr").attr("id"); // table row ID
    $("#selectDeleteLineID").val(targetID);
    $("#deleteTermLineModal").modal("toggle");
  },
  // "click .chkDatatableTerm": function (event) {
  //   var columns = $("#termsList th");
  //   let columnDataValue = $(event.target)
  //     .closest("div")
  //     .find(".divcolumnTerm")
  //     .text();
  //   $.each(columns, function (i, v) {
  //     let className = v.classList;
  //     let replaceClass = className[1];

  //     if (v.innerText == columnDataValue) {
  //       if ($(event.target).is(":checked")) {
  //         $("." + replaceClass + "").css("display", "table-cell");
  //         $("." + replaceClass + "").css("padding", ".75rem");
  //         $("." + replaceClass + "").css("vertical-align", "top");
  //       } else {
  //         $("." + replaceClass + "").css("display", "none");
  //       }
  //     }
  //   });
  // },
  // "click .resetTermTable": function (event) {
  //   var getcurrentCloudDetails = CloudUser.findOne({
  //     _id: localStorage.getItem("mycloudLogonID"),
  //     clouddatabaseID: localStorage.getItem("mycloudLogonDBID"),
  //   });
  //   if (getcurrentCloudDetails) {
  //     if (getcurrentCloudDetails._id.length > 0) {
  //       var clientID = getcurrentCloudDetails._id;
  //       var checkPrefDetails = CloudPreference.findOne({
  //         userid: clientID,
  //         PrefName: "termsList",
  //       });
  //       if (checkPrefDetails) {
  //         CloudPreference.remove(
  //           {
  //             _id: checkPrefDetails._id,
  //           },
  //           function (err, idTag) {
  //             if (err) {
  //             } else {
  //               Meteor._reload.reload();
  //             }
  //           }
  //         );
  //       }
  //     }
  //   }
  // },
  // "click .saveTermTable": function (event) {
  //   let lineItems = [];
  //   $(".columnSettings").each(function (index) {
  //     var $tblrow = $(this);
  //     var colTitle = $tblrow.find(".divcolumnTerm").text() || "";
  //     var colWidth = $tblrow.find(".custom-range").val() || 0;
  //     var colthClass = $tblrow.find(".divcolumnTerm").attr("valueupdate") || "";
  //     var colHidden = false;
  //     if ($tblrow.find(".custom-control-input").is(":checked")) {
  //       colHidden = false;
  //     } else {
  //       colHidden = true;
  //     }
  //     let lineItemObj = {
  //       index: index,
  //       label: colTitle,
  //       hidden: colHidden,
  //       width: colWidth,
  //       thclass: colthClass,
  //     };

  //     lineItems.push(lineItemObj);
  //   });

  //   var getcurrentCloudDetails = CloudUser.findOne({
  //     _id: localStorage.getItem("mycloudLogonID"),
  //     clouddatabaseID: localStorage.getItem("mycloudLogonDBID"),
  //   });
  //   if (getcurrentCloudDetails) {
  //     if (getcurrentCloudDetails._id.length > 0) {
  //       var clientID = getcurrentCloudDetails._id;
  //       var clientUsername = getcurrentCloudDetails.cloudUsername;
  //       var clientEmail = getcurrentCloudDetails.cloudEmail;
  //       var checkPrefDetails = CloudPreference.findOne({
  //         userid: clientID,
  //         PrefName: "termsList",
  //       });
  //       if (checkPrefDetails) {
  //         CloudPreference.update(
  //           {
  //             _id: checkPrefDetails._id,
  //           },
  //           {
  //             $set: {
  //               userid: clientID,
  //               username: clientUsername,
  //               useremail: clientEmail,
  //               PrefGroup: "salesform",
  //               PrefName: "termsList",
  //               published: true,
  //               customFields: lineItems,
  //               updatedAt: new Date(),
  //             },
  //           },
  //           function (err, idTag) {
  //             if (err) {
  //               $("#btnOpenSettingsTerm").modal("toggle");
  //             } else {
  //               $("#btnOpenSettingsTerm").modal("toggle");
  //             }
  //           }
  //         );
  //       } else {
  //         CloudPreference.insert(
  //           {
  //             userid: clientID,
  //             username: clientUsername,
  //             useremail: clientEmail,
  //             PrefGroup: "salesform",
  //             PrefName: "termsList",
  //             published: true,
  //             customFields: lineItems,
  //             createdAt: new Date(),
  //           },
  //           function (err, idTag) {
  //             if (err) {
  //               $("#btnOpenSettingsTerm").modal("toggle");
  //             } else {
  //               $("#btnOpenSettingsTerm").modal("toggle");
  //             }
  //           }
  //         );
  //       }
  //     }
  //   }
  // },
  // "blur .divcolumnTerm": function (event) {
  //   let columData = $(event.target).text();

  //   let columnDatanIndex = $(event.target)
  //     .closest("div.columnSettings")
  //     .attr("id");
  //   var datable = $("#termsList").DataTable();
  //   var title = datable.column(columnDatanIndex).header();
  //   $(title).html(columData);
  // },
  // "change .rngRangeTerm": function (event) {
  //   let range = $(event.target).val();
  //   $(event.target)
  //     .closest("div.divColWidth")
  //     .find(".spWidth")
  //     .html(range + "px");
  //   let columnDataValue = $(event.target)
  //     .closest("div")
  //     .prev()
  //     .find(".divcolumnTerm")
  //     .text();
  //   var datable = $("#termsList th");
  //   $.each(datable, function (i, v) {
  //     if (v.innerText == columnDataValue) {
  //       let className = v.className;
  //       let replaceClass = className.replace(/ /g, ".");
  //       $("." + replaceClass + "").css("width", range + "px");
  //     }
  //   });
  // },
  // "click .btnOpenSettingsTerm": function (event) {
  //   let templateObject = Template.instance();
  //   var columns = $("#termsList th");

  //   const tableHeaderList = [];
  //   let sWidth = "";
  //   let columVisible = false;
  //   $.each(columns, function (i, v) {
  //     if (v.hidden == false) {
  //       columVisible = true;
  //     }
  //     if (v.className.includes("hiddenColumn")) {
  //       columVisible = false;
  //     }
  //     sWidth = v.style.width.replace("px", "");

  //     let datatablerecordObj = {
  //       sTitle: v.innerText || "",
  //       sWidth: sWidth || "",
  //       sIndex: v.cellIndex || "",
  //       sVisible: columVisible || false,
  //       sClass: v.className || "",
  //     };
  //     tableHeaderList.push(datatablerecordObj);
  //   });
  //   templateObject.termtableheaderrecords.set(tableHeaderList);
  // },
  "click .btnRefreshTerm": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    sideBarService
      .getTermsVS1()
      .then(function (dataReload) {
        addVS1Data("TTermsVS1", JSON.stringify(dataReload))
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
  "click .btnDeleteTerms": function () {
    playDeleteAudio();
    setTimeout(function () {
      let termsId = $("#selectDeleteLineID").val();
      let objDetails = {
        type: "TTerms",
        fields: {
          Id: parseInt(termsId),
          Active: false,
        },
      };

      taxRateService
        .saveTerms(objDetails)
        .then(function (objDetails) {
          sideBarService
            .getTermsVS1()
            .then(function (dataReload) {
              addVS1Data("TTermsVS1", JSON.stringify(dataReload))
                .then(function (datareturn) {
                  // Meteor._reload.reload();
                })
                .catch(function (err) {
                  // Meteor._reload.reload();
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
            } else if (result.dismiss === "cancel") {
            }
          });
          LoadingOverlay.hide();
        });
    }, delayTimeAfterSound);
  },
  "click .btnSaveTerms": function () {
    playSaveAudio();
    setTimeout(function () {
      $(".fullScreenSpin").css("display", "inline-block");

      let termsID = $("#edtTermsID").val();
      let termsName = $("#edtName").val();
      let description = $("#edtDesc").val();
      let termdays = $("#edtDays").val();

      let isDays = false;
      let is30days = false;
      let isEOM = $("#addTermModal #isEOM").is(":checked");
      let isEOMPlus = $("#addTermModal #isEOMPlus").is(":checked");
      let days = 0;

      let isCustomerDefault = $("#addTermModal #chkCustomerDef").is(":checked");
      let isSupplierDefault = $("#addTermModal #chkSupplierDef").is(":checked");

      if (termdays.replace(/\s/g, "") != "") {
        isDays = true;
      } else {
        isDays = false;
      }

      let objDetails = "";
      if (termsName === "") {
        LoadingOverlay.hide();
        Bert.alert(
          "<strong>WARNING:</strong> Term Name cannot be blank!",
          "warning"
        );
        e.preventDefault();
      }

      if (termsID == "") {

        taxRateService
          .checkTermByName(termsName)
          .then(function (data) {
            termsID = data.tterms[0].Id;

            objDetails = {
              type: "TTerms",
              fields: {
                ID: parseInt(termsID),
                Active: true,
                Description: description,
                IsDays: isDays,
                IsEOM: isEOM,
                IsEOMPlus: isEOMPlus,
                isPurchasedefault: isSupplierDefault,
                isSalesdefault: isCustomerDefault,
                Days: termdays || 0,
                PublishOnVS1: true,
              },
            };

            taxRateService
              .saveTerms(objDetails)
              .then(function (objDetails) {
                sideBarService
                  .getTermsVS1()
                  .then(function (dataReload) {
                    addVS1Data("TTermsVS1", JSON.stringify(dataReload))
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
                  } else if (result.dismiss === "cancel") {
                  }
                });
                LoadingOverlay.hide();
              });
          })
          .catch(function (err) {
            objDetails = {
              type: "TTerms",
              fields: {
                Active: true,
                TermsName: termsName,
                Description: description,
                IsDays: isDays,
                IsEOM: isEOM,
                IsEOMPlus: isEOMPlus,
                isPurchasedefault: isSupplierDefault,
                isSalesdefault: isCustomerDefault,
                Days: termdays || 0,
                PublishOnVS1: true,
              },
            };

            taxRateService.saveTerms(objDetails).then(function (objResponse) {
              if (isSupplierDefault == true || isCustomerDefault == true) {
                updateObjDetails = {
                  type: "TTerms",
                  fields: {
                    ID: parseInt(objResponse.fields.ID),
                    isPurchasedefault: isSupplierDefault,
                    isSalesdefault: isCustomerDefault
                  },
                };
                taxRateService.saveTerms(updateObjDetails).then(function () {
                  sideBarService.getTermsVS1().then(function (dataReload) {
                    addVS1Data("TTermsVS1", JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function (err) {
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
                      } else if (result.dismiss === "cancel") {
                      }
                    });
                    LoadingOverlay.hide();
                  });
              }
              sideBarService.getTermsVS1().then(function (dataReload) {
                addVS1Data("TTermsVS1", JSON.stringify(dataReload)).then(function (datareturn) {
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
                  } else if (result.dismiss === "cancel") {
                  }
                });
                LoadingOverlay.hide();
              });
          });
      } else {

        objDetails = {
          type: "TTerms",
          fields: {
            ID: parseInt(termsID),
            TermsName: termsName,
            Description: description,
            IsDays: isDays,
            IsEOM: isEOM,
            IsEOMPlus: isEOMPlus,
            isPurchasedefault: isSupplierDefault,
            isSalesdefault: isCustomerDefault,
            Days: termdays || 0,
            PublishOnVS1: true,
          },
        };

        taxRateService
          .saveTerms(objDetails)
          .then(function (objDetails) {
            sideBarService
              .getTermsVS1()
              .then(function (dataReload) {
                addVS1Data("TTermsVS1", JSON.stringify(dataReload))
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
              } else if (result.dismiss === "cancel") {
              }
            });
            LoadingOverlay.hide();
          });
      }
    }, delayTimeAfterSound);
  },
  "click .btnAddTerms": (e, templateObject) => {
    $("#add-terms-title").text("Add New Term ");
    $("#edtTermsID").val("");
    $("#edtName").val("");
    $("#edtName").prop("readonly", false);
    $("#edtDesc").val("");
    $("#edtDays").val("");

    $('#addTermModal #isEOM').prop('checked', false);
    $('#addTermModal #isEOMPlus').prop('checked', false);

    $('#addTermModal #chkCustomerDef').prop('checked', false);
    $('#addTermModal #chkSupplierDef').prop('checked', false);

    templateObject.include7Days.set(false);
    templateObject.includeCOD.set(false);
    templateObject.include30Days.set(false);
    templateObject.includeEOM.set(false);
    templateObject.includeEOMPlus.set(false);
  },
  "click .chkTerms": function (event) {
    var $box = $(event.target);

    if ($box.is(":checked")) {
      var group = "input:checkbox[name='" + $box.attr("name") + "']";
      $(group).prop("checked", false);
      $box.prop("checked", true);
    } else {
      $box.prop("checked", false);
    }
  },
  "keydown #edtDays": function (event) {
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

    if (event.shiftKey == true) {
      event.preventDefault();
    }

    if (
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105) ||
      event.keyCode == 8 ||
      event.keyCode == 9 ||
      event.keyCode == 37 ||
      event.keyCode == 39 ||
      event.keyCode == 46 ||
      event.keyCode == 190
    ) {
    } else {
      event.preventDefault();
    }
  },
  "click #termsList tbody td.clickable": (event, templateObject) => {
    const tr = $(event.currentTarget).parent();
    var listData = tr.attr("id");
    var isEOM = false;
    var isEOMPlus = false;
    var isSalesDefault = false;
    var isPurchaseDefault = false;
    if (listData) {
      $("#add-terms-title").text("Edit Term ");
      if (listData !== "") {
        listData = Number(listData);

        var termsID = listData || "";
        var termsName = tr.find(".colName").text() || "";
        var description = tr.find(".colDescription").text() || "";
        var days = tr.find(".colIsDays").text() || 0;
        isEOM = tr.find(".colIsEOM .chkBox").is(":checked");
        isEOMPlus = tr.find(".colIsEOMPlus .chkBox").is(":checked");
        isSalesDefault = tr.find(".colCustomerDef .chkBox").is(":checked");
        isPurchaseDefault = tr.find(".colSupplierDef .chkBox").is(":checked");

        if (isEOM == true || isEOMPlus == true) {
          isDays = false;
        } else {
          isDays = true;
        }

        $("#edtTermsID").val(termsID);
        $("#edtName").val(termsName);
        $("#edtName").prop("readonly", true);
        $("#edtDesc").val(description);
        $("#edtDays").val(days);

        $('#addTermModal #isEOM').prop('checked', isEOM);
        $('#addTermModal #isEOMPlus').prop('checked', isEOMPlus);

        $('#addTermModal #chkCustomerDef').prop('checked', isSalesDefault);
        $('#addTermModal #chkSupplierDef').prop('checked', isPurchaseDefault);

        if (isDays == true && days == 0) {
          templateObject.includeCOD.set(true);
        } else {
          templateObject.includeCOD.set(false);
        }

        if (isDays == true && days == 30) {
          templateObject.include30Days.set(true);
        } else {
          templateObject.include30Days.set(false);
        }

        if (isEOM == true) {
          templateObject.includeEOM.set(true);
        } else {
          templateObject.includeEOM.set(false);
        }

        if (isEOMPlus == true) {
          templateObject.includeEOMPlus.set(true);
        } else {
          templateObject.includeEOMPlus.set(false);
        }

        if (isSalesDefault == true) {
          templateObject.includeSalesDefault.set(true);
        } else {
          templateObject.includeSalesDefault.set(false);
        }

        if (isPurchaseDefault == true) {
          templateObject.includePurchaseDefault.set(true);
        } else {
          templateObject.includePurchaseDefault.set(false);
        }
        $("#addTermModal").modal("toggle");
      }
    }
  },
  "click .templateDownload": function () {
    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleTermsSetting" + ".csv";
    rows[0] = [
      "Term Name",
      "Days",
      "EOM",
      "EOM+",
      "Description",
      "Customer",
      "Supplier",
    ];
    rows[1] = ["ABC", "7", "false", "false", "description", "false", "false"];
    utilityService.exportToCsv(rows, filename, "csv");
  },
  "click .templateDownloadXLSX": function (e) {
    e.preventDefault(); //stop the browser from following
    window.location.href = "sample_imports/SampleTermsSetting.xlsx";
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
    let taxRateService = new TaxRateService();
    let objDetails;
    let termDesc = "";
    let isEOM = false;
    let isEOMPlus = false;
    let days = 0;
    let isSalesdefault = false;
    let isPurchasedefault = false;

    Papa.parse(templateObject.selectedFile.get(), {
      complete: function (results) {
        if (results.data.length > 0) {
          if (
            results.data[0][0] == "Term Name" &&
            results.data[0][4] == "Description"
          ) {
            let dataLength = results.data.length * 500;
            setTimeout(function () {
              $(".importTemplateModal").hide();
              $(".modal-backdrop").hide();
              FlowRouter.go("/termsettings?success=true");
              $(".fullScreenSpin").css("display", "none");
            }, parseInt(dataLength));

            for (let i = 0; i < results.data.length - 1; i++) {
              days =
                results.data[i + 1][1] !== undefined
                  ? results.data[i + 1][1]
                  : 0;
              isEOM =
                results.data[i + 1][2] !== undefined
                  ? results.data[i + 1][2]
                  : false;
              isEOMPlus =
                results.data[i + 1][3] !== undefined
                  ? results.data[i + 1][3]
                  : false;
              termDesc =
                results.data[i + 1][4] !== undefined
                  ? results.data[i + 1][4]
                  : "";
              isPurchasedefault =
                results.data[i + 1][5] !== undefined
                  ? results.data[i + 1][5]
                  : false;
              isSalesdefault =
                results.data[i + 1][6] !== undefined
                  ? results.data[i + 1][6]
                  : false;
              objDetails = {
                type: "TTermsVS1",
                fields: {
                  TermsName: results.data[i + 1][0],
                  Days: days,
                  IsEOM: isEOM,
                  IsEOMPlus: isEOMPlus,
                  Description: termDesc,
                  isPurchasedefault: isPurchasedefault,
                  isSalesdefault: isSalesdefault,
                  Active: true,
                },
              };
              if (results.data[i + 1][1]) {
                if (results.data[i + 1][1] !== "") {
                  taxRateService
                    .saveTerms(objDetails)
                    .then(function (data) {
                      //$('.fullScreenSpin').css('display','none');
                      //  Meteor._reload.reload();
                    })
                    .catch(function (err) {
                      //$('.fullScreenSpin').css('display','none');
                      swal({
                        title: "Oooops...",
                        text: err,
                        type: "error",
                        showCancelButton: false,
                        confirmButtonText: "Try Again",
                      }).then((result) => {
                        if (result.value) {
                          window.open(
                            "/termsettings?success=true",
                            "_self"
                          );
                        } else if (result.dismiss === "cancel") {
                          window.open(
                            "/termsettings?success=false",
                            "_self"
                          );
                        }
                      });
                    });
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

})

Template.registerHelper("equals", function (a, b) {
  return a === b;
});
