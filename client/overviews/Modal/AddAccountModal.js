import { ReactiveVar } from "meteor/reactive-var";
import { AccountService } from "../../accounts/account-service";
import { OrganisationService } from "../../js/organisation-service";
import { SideBarService } from "../../js/sidebar-service";
import { TaxRateService } from "../../settings/settings-service";
import { UtilityService } from "../../utility-service";

let utilityService = new UtilityService();
let sideBarService = new SideBarService();
let accountService = new AccountService();
let taxRateService = new TaxRateService();
let organisationService = new OrganisationService();

function generate() {
  let id = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return id;
}

Template.addAccountModal.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.accountList = new ReactiveVar([]);
  templateObject.accountTypes = new ReactiveVar([]);
  templateObject.taxRates = new ReactiveVar([]);
});

Template.addAccountModal.onRendered(function () {
  const generatedId = $(".generated-id").attr("id", generate());
  const currentElement = this;
  // console.log(this);
  $(".fullScreenSpin").css("display", "inline-block");
  let templateObject = Template.instance();

  templateObject.loadAccountTypes = () => {
    let accountTypeList = [];
    getVS1Data("TAccountType")
      .then(function (dataObject) {
        if (dataObject.length === 0) {
          accountService.getAccountTypeCheck().then(function (data) {
            for (let i = 0; i < data.taccounttype.length; i++) {
              let accounttyperecordObj = {
                accounttypename: data.taccounttype[i].AccountTypeName || " ",
                description: data.taccounttype[i].OriginalDescription || " ",
              };
              accountTypeList.push(accounttyperecordObj);
            }
            templateObject.accountTypes.set(accountTypeList);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.taccounttype;

          for (let i = 0; i < useData.length; i++) {
            let accounttyperecordObj = {
              accounttypename: useData[i].AccountTypeName || " ",
              description: useData[i].OriginalDescription || " ",
            };
            accountTypeList.push(accounttyperecordObj);
          }
          templateObject.accountTypes.set(accountTypeList);
        }
      })
      .catch(function (err) {
        accountService.getAccountTypeCheck().then(function (data) {
          for (let i = 0; i < data.taccounttype.length; i++) {
            let accounttyperecordObj = {
              accounttypename: data.taccounttype[i].AccountTypeName || " ",
              description: data.taccounttype[i].OriginalDescription || " ",
            };
            accountTypeList.push(accounttyperecordObj);
          }
          templateObject.accountTypes.set(accountTypeList);
        });
      });
  };

  templateObject.loadAccountTypes();

  templateObject.getTaxRates = function () {
    getVS1Data("TTaxcodeVS1")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          taxRateService
            .getTaxRateVS1()
            .then(function (data) {
              let lineItems = [];
              let lineItemObj = {};
              for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2) + "%";
                var dataList = {
                  id: data.ttaxcodevs1[i].Id || "",
                  codename: data.ttaxcodevs1[i].CodeName || "-",
                  description: data.ttaxcodevs1[i].Description || "-",
                  region: data.ttaxcodevs1[i].RegionName || "-",
                  rate: taxRate || "-",
                };

                dataTableList.push(dataList);
                //}
              }

              templateObject.taxRates.set(dataTableList);

              if (templateObject.taxRates.get()) {
                Meteor.call(
                  "readPrefMethod",
                  Session.get("mycloudLogonID"),
                  "taxRatesList",
                  function (error, result) {
                    if (error) {
                    } else {
                      if (result) {
                        for (let i = 0; i < result.customFields.length; i++) {
                          let customcolumn = result.customFields;
                          let columData = customcolumn[i].label;
                          let columHeaderUpdate = customcolumn[
                            i
                          ].thclass.replace(/ /g, ".");
                          let hiddenColumn = customcolumn[i].hidden;
                          let columnClass = columHeaderUpdate.split(".")[1];
                          let columnWidth = customcolumn[i].width;
                          let columnindex = customcolumn[i].index + 1;

                          if (hiddenColumn == true) {
                            $("." + columnClass + "").addClass("hiddenColumn");
                            $("." + columnClass + "").removeClass("showColumn");
                          } else if (hiddenColumn == false) {
                            $("." + columnClass + "").removeClass(
                              "hiddenColumn"
                            );
                            $("." + columnClass + "").addClass("showColumn");
                          }
                        }
                      }
                    }
                  }
                );

                setTimeout(function () {
                  MakeNegative();
                }, 100);
              }

              $(".fullScreenSpin").css("display", "none");
              setTimeout(function () {
                $("#taxRatesList")
                  .DataTable({
                    columnDefs: [
                      {
                        type: "date",
                        targets: 0,
                      },
                      {
                        orderable: false,
                        targets: -1,
                      },
                    ],
                    sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [
                      {
                        extend: "excelHtml5",
                        text: "",
                        download: "open",
                        className: "btntabletocsv hiddenColumn",
                        filename: "taxratelist_" + moment().format(),
                        orientation: "portrait",
                        exportOptions: {
                          columns: ":visible",
                        },
                      },
                      {
                        extend: "print",
                        download: "open",
                        className: "btntabletopdf hiddenColumn",
                        text: "",
                        title: "Tax Rate List",
                        filename: "taxratelist_" + moment().format(),
                        exportOptions: {
                          columns: ":visible",
                        },
                      },
                    ],
                    select: true,
                    destroy: true,
                    // colReorder: true,
                    colReorder: {
                      fixedColumnsRight: 1,
                    },
                    // bStateSave: true,
                    // rowId: 0,
                    // pageLength: 25,
                    paging: false,
                    //                      "scrollY": "400px",
                    //                      "scrollCollapse": true,
                    info: true,
                    responsive: true,
                    order: [[0, "asc"]],
                    action: function () {
                      $("#taxRatesList").DataTable().ajax.reload();
                    },
                    fnDrawCallback: function (oSettings) {
                      setTimeout(function () {
                        MakeNegative();
                      }, 100);
                    },
                  })
                  .on("page", function () {
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                    let draftRecord = templateObject.taxRates.get();
                    templateObject.taxRates.set(draftRecord);
                  })
                  .on("column-reorder", function () {})
                  .on("length.dt", function (e, settings, len) {
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                  });

                // $('#taxRatesList').DataTable().column( 0 ).visible( true );
                $(".fullScreenSpin").css("display", "none");
              }, 0);

              var columns = $("#taxRatesList th");
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
              $("div.dataTables_filter input").addClass(
                "form-control form-control-sm"
              );
            })
            .catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $(".fullScreenSpin").css("display", "none");
              // Meteor._reload.reload();
            });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.ttaxcodevs1;
          let lineItems = [];
          let lineItemObj = {};
          for (let i = 0; i < useData.length; i++) {
            let taxRate = (useData[i].Rate * 100).toFixed(2) + "%";
            var dataList = {
              id: useData[i].Id || "",
              codename: useData[i].CodeName || "-",
              description: useData[i].Description || "-",
              region: useData[i].RegionName || "-",
              rate: taxRate || "-",
            };

            dataTableList.push(dataList);
            //}
          }

          templateObject.taxRates.set(dataTableList);

          if (templateObject.taxRates.get()) {
            Meteor.call(
              "readPrefMethod",
              Session.get("mycloudLogonID"),
              "taxRatesList",
              function (error, result) {
                if (error) {
                } else {
                  if (result) {
                    for (let i = 0; i < result.customFields.length; i++) {
                      let customcolumn = result.customFields;
                      let columData = customcolumn[i].label;
                      let columHeaderUpdate = customcolumn[i].thclass.replace(
                        / /g,
                        "."
                      );
                      let hiddenColumn = customcolumn[i].hidden;
                      let columnClass = columHeaderUpdate.split(".")[1];
                      let columnWidth = customcolumn[i].width;
                      let columnindex = customcolumn[i].index + 1;

                      if (hiddenColumn == true) {
                        $("." + columnClass + "").addClass("hiddenColumn");
                        $("." + columnClass + "").removeClass("showColumn");
                      } else if (hiddenColumn == false) {
                        $("." + columnClass + "").removeClass("hiddenColumn");
                        $("." + columnClass + "").addClass("showColumn");
                      }
                    }
                  }
                }
              }
            );

            setTimeout(function () {
              MakeNegative();
            }, 100);
          }

          $(".fullScreenSpin").css("display", "none");
          setTimeout(function () {
            $("#taxRatesList")
              .DataTable({
                columnDefs: [
                  {
                    type: "date",
                    targets: 0,
                  },
                  {
                    orderable: false,
                    targets: -1,
                  },
                ],
                sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [
                  {
                    extend: "excelHtml5",
                    text: "",
                    download: "open",
                    className: "btntabletocsv hiddenColumn",
                    filename: "taxratelist_" + moment().format(),
                    orientation: "portrait",
                    exportOptions: {
                      columns: ":visible",
                    },
                  },
                  {
                    extend: "print",
                    download: "open",
                    className: "btntabletopdf hiddenColumn",
                    text: "",
                    title: "Tax Rate List",
                    filename: "taxratelist_" + moment().format(),
                    exportOptions: {
                      columns: ":visible",
                    },
                  },
                ],
                select: true,
                destroy: true,
                // colReorder: true,
                colReorder: {
                  fixedColumnsRight: 1,
                },
                // bStateSave: true,
                // rowId: 0,
                // pageLength: 25,
                paging: false,
                //          "scrollY": "400px",
                //          "scrollCollapse": true,
                info: true,
                responsive: true,
                order: [[0, "asc"]],
                action: function () {
                  $("#taxRatesList").DataTable().ajax.reload();
                },
                fnDrawCallback: function (oSettings) {
                  setTimeout(function () {
                    MakeNegative();
                  }, 100);
                },
              })
              .on("page", function () {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
                let draftRecord = templateObject.taxRates.get();
                templateObject.taxRates.set(draftRecord);
              })
              .on("column-reorder", function () {})
              .on("length.dt", function (e, settings, len) {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
              });

            // $('#taxRatesList').DataTable().column( 0 ).visible( true );
            $(".fullScreenSpin").css("display", "none");
          }, 0);

          var columns = $("#taxRatesList th");
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
          $("div.dataTables_filter input").addClass(
            "form-control form-control-sm"
          );
        }
      })
      .catch(function (err) {
        taxRateService
          .getTaxRateVS1()
          .then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            for (let i = 0; i < data.ttaxcodevs1.length; i++) {
              let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2) + "%";
              var dataList = {
                id: data.ttaxcodevs1[i].Id || "",
                codename: data.ttaxcodevs1[i].CodeName || "-",
                description: data.ttaxcodevs1[i].Description || "-",
                region: data.ttaxcodevs1[i].RegionName || "-",
                rate: taxRate || "-",
              };

              dataTableList.push(dataList);
              //}
            }

            templateObject.taxRates.set(dataTableList);

            if (templateObject.taxRates.get()) {
              Meteor.call(
                "readPrefMethod",
                Session.get("mycloudLogonID"),
                "taxRatesList",
                function (error, result) {
                  if (error) {
                  } else {
                    if (result) {
                      for (let i = 0; i < result.customFields.length; i++) {
                        let customcolumn = result.customFields;
                        let columData = customcolumn[i].label;
                        let columHeaderUpdate = customcolumn[i].thclass.replace(
                          / /g,
                          "."
                        );
                        let hiddenColumn = customcolumn[i].hidden;
                        let columnClass = columHeaderUpdate.split(".")[1];
                        let columnWidth = customcolumn[i].width;
                        let columnindex = customcolumn[i].index + 1;

                        if (hiddenColumn == true) {
                          $("." + columnClass + "").addClass("hiddenColumn");
                          $("." + columnClass + "").removeClass("showColumn");
                        } else if (hiddenColumn == false) {
                          $("." + columnClass + "").removeClass("hiddenColumn");
                          $("." + columnClass + "").addClass("showColumn");
                        }
                      }
                    }
                  }
                }
              );

              setTimeout(function () {
                MakeNegative();
              }, 100);
            }

            $(".fullScreenSpin").css("display", "none");
            setTimeout(function () {
              $("#taxRatesList")
                .DataTable({
                  columnDefs: [
                    {
                      type: "date",
                      targets: 0,
                    },
                    {
                      orderable: false,
                      targets: -1,
                    },
                  ],
                  sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                    {
                      extend: "excelHtml5",
                      text: "",
                      download: "open",
                      className: "btntabletocsv hiddenColumn",
                      filename: "taxratelist_" + moment().format(),
                      orientation: "portrait",
                      exportOptions: {
                        columns: ":visible",
                      },
                    },
                    {
                      extend: "print",
                      download: "open",
                      className: "btntabletopdf hiddenColumn",
                      text: "",
                      title: "Tax Rate List",
                      filename: "taxratelist_" + moment().format(),
                      exportOptions: {
                        columns: ":visible",
                      },
                    },
                  ],
                  select: true,
                  destroy: true,
                  // colReorder: true,
                  colReorder: {
                    fixedColumnsRight: 1,
                  },
                  // bStateSave: true,
                  // rowId: 0,
                  // pageLength: 25,
                  paging: false,
                  //                    "scrollY": "400px",
                  //                    "scrollCollapse": true,
                  info: true,
                  responsive: true,
                  order: [[0, "asc"]],
                  action: function () {
                    $("#taxRatesList").DataTable().ajax.reload();
                  },
                  fnDrawCallback: function (oSettings) {
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                  },
                })
                .on("page", function () {
                  setTimeout(function () {
                    MakeNegative();
                  }, 100);
                  let draftRecord = templateObject.taxRates.get();
                  templateObject.taxRates.set(draftRecord);
                })
                .on("column-reorder", function () {})
                .on("length.dt", function (e, settings, len) {
                  setTimeout(function () {
                    MakeNegative();
                  }, 100);
                });

              // $('#taxRatesList').DataTable().column( 0 ).visible( true );
              $(".fullScreenSpin").css("display", "none");
            }, 0);

            var columns = $("#taxRatesList th");
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
            $("div.dataTables_filter input").addClass(
              "form-control form-control-sm"
            );
          })
          .catch(function (err) {
            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $(".fullScreenSpin").css("display", "none");
            // Meteor._reload.reload();
          });
      });
  };
  templateObject.getTaxRates();

  $(document).ready(function () {
    setTimeout(function () {
      //console.log(this.$(".sltTaxCode"));
      this.$(".sltTaxCode").editableSelect();
      this.$(".sltTaxCode")
        .editableSelect()
        .on("click.editable-select", function (e, li) {
          // console.log(e, li, "hello");
          // return false;
          var $earch = $(this);
          var taxSelected = "sales";
          var offset = $earch.offset();
          var taxRateDataName = e.target.value || "";
          if (e.pageX > offset.left + $earch.width() - 8) {
            // X button 16px wide?
            $("#taxRateListModal").modal("toggle");
          } else {
            if (taxRateDataName.replace(/\s/g, "") !== "") {
              $(".taxcodepopheader").text("Edit Tax Rate");



              getVS1Data("TTaxcodeVS1")
                .then(function (dataObject) {
                  if (dataObject.length === 0) {
                    purchaseService
                      .getTaxCodesVS1()
                      .then(function (data) {
                        let lineItems = [];
                        let lineItemObj = {};
                        for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                          if (
                            data.ttaxcodevs1[i].CodeName === taxRateDataName
                          ) {
                            $("#edtTaxNamePop").attr("readonly", true);
                            let taxRate = (
                              data.ttaxcodevs1[i].Rate * 100
                            ).toFixed(2);
                            var taxRateID = data.ttaxcodevs1[i].Id || "";
                            var taxRateName =
                              data.ttaxcodevs1[i].CodeName || "";
                            var taxRateDesc =
                              data.ttaxcodevs1[i].Description || "";
                            $("#edtTaxID").val(taxRateID);
                            $("#edtTaxNamePop").val(taxRateName);
                            $("#edtTaxRatePop").val(taxRate);
                            $("#edtTaxDescPop").val(taxRateDesc);
                            setTimeout(function () {
                              $("#newTaxRateModal").modal("toggle");
                            }, 100);
                          }
                        }
                      })
                      .catch(function (err) {
                        // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                        $(".fullScreenSpin").css("display", "none");
                        // Meteor._reload.reload();
                      });
                  } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.ttaxcodevs1;
                    let lineItems = [];
                    let lineItemObj = {};
                    $(".taxcodepopheader").text("Edit Tax Rate");
                    for (let i = 0; i < useData.length; i++) {
                      if (useData[i].CodeName === taxRateDataName) {
                        $("#edtTaxNamePop").attr("readonly", true);
                        let taxRate = (useData[i].Rate * 100).toFixed(2);
                        var taxRateID = useData[i].Id || "";
                        var taxRateName = useData[i].CodeName || "";
                        var taxRateDesc = useData[i].Description || "";
                        $("#edtTaxID").val(taxRateID);
                        $("#edtTaxNamePop").val(taxRateName);
                        $("#edtTaxRatePop").val(taxRate);
                        $("#edtTaxDescPop").val(taxRateDesc);
                        //setTimeout(function() {
                        $("#newTaxRateModal").modal("toggle");
                        //}, 500);
                      }
                    }
                  }
                })
                .catch(function (err) {
                  purchaseService
                    .getTaxCodesVS1()
                    .then(function (data) {
                      let lineItems = [];
                      let lineItemObj = {};
                      for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                        if (data.ttaxcodevs1[i].CodeName === taxRateDataName) {
                          $("#edtTaxNamePop").attr("readonly", true);
                          let taxRate = (
                            data.ttaxcodevs1[i].Rate * 100
                          ).toFixed(2);
                          var taxRateID = data.ttaxcodevs1[i].Id || "";
                          var taxRateName = data.ttaxcodevs1[i].CodeName || "";
                          var taxRateDesc =
                            data.ttaxcodevs1[i].Description || "";
                          $("#edtTaxID").val(taxRateID);
                          $("#edtTaxNamePop").val(taxRateName);
                          $("#edtTaxRatePop").val(taxRate);
                          $("#edtTaxDescPop").val(taxRateDesc);
                          setTimeout(function () {
                            $("#newTaxRateModal").modal("toggle");
                          }, 100);
                        }
                      }
                    })
                    .catch(function (err) {
                      // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                      $(".fullScreenSpin").css("display", "none");
                      // Meteor._reload.reload();
                    });
                });
            } else {
              $("#taxRateListModal").modal("toggle");
            }
          }
        });
    }, 1000);

    $(document).on("click", "#tblTaxRate tbody tr", (e) => {
        // console.log("current event", e, e.currentTarget);
      var table = $(e.currentTarget);
      let lineTaxCode = table.find(".taxName").text();
      currentElement.$(".sltTaxCode").val(lineTaxCode);
      $("#taxRateListModal").modal("toggle");
    });
  });
});

Template.addAccountModal.events({
  "click .btnSaveAccount": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let accountService = new AccountService();
    let organisationService = new OrganisationService();
    let forTransaction = false;

    if ($("#showOnTransactions").is(":checked")) {
      forTransaction = true;
    }
    let accountID = $("#edtAccountID").val();
    var accounttype = $("#sltAccountType").val();
    var accountname = $("#edtAccountName").val();
    var accountno = $("#edtAccountNo").val();
    var taxcode = $("#sltTaxCode").val();
    var accountdesc = $("#txaAccountDescription").val();
    var swiftCode = $("#swiftCode").val();
    var routingNo = $("#routingNo").val();
    // var comments = $('#txaAccountComments').val();
    var bankname = $("#edtBankName").val();
    var bankaccountname = $("#edtBankAccountName").val();
    var bankbsb = $("#edtBSB").val();
    var bankacountno = $("#edtBankAccountNo").val();
    // let isBankAccount = templateObject.isBankAccount.get();

    var expirydateTime = new Date($("#edtExpiryDate").datepicker("getDate"));
    let cardnumber = $("#edtCardNumber").val();
    let cardcvc = $("#edtCvc").val();
    let expiryDate =
      expirydateTime.getFullYear() +
      "-" +
      (expirydateTime.getMonth() + 1) +
      "-" +
      expirydateTime.getDate();

    let companyID = 1;
    let data = "";
    if (accountID == "") {
      accountService
        .getCheckAccountData(accountname)
        .then(function (data) {
          accountID = parseInt(data.taccount[0].Id) || 0;
          data = {
            type: "TAccount",
            fields: {
              ID: accountID,
              // AccountName: accountname|| '',
              AccountNumber: accountno || "",
              // AccountTypeName: accounttype|| '',
              Active: true,
              BankAccountName: bankaccountname || "",
              BankAccountNumber: bankacountno || "",
              BSB: bankbsb || "",
              Description: accountdesc || "",
              TaxCode: taxcode || "",
              PublishOnVS1: true,
              Extra: swiftCode,
              BankNumber: routingNo,
              IsHeader: forTransaction,
              CarNumber: cardnumber || "",
              CVC: cardcvc || "",
              ExpiryDate: expiryDate || "",
            },
          };

          accountService
            .saveAccount(data)
            .then(function (data) {
              if ($("#showOnTransactions").is(":checked")) {
                var objDetails = {
                  type: "TCompanyInfo",
                  fields: {
                    Id: companyID,
                    AccountNo: bankacountno,
                    BankBranch: swiftCode,
                    BankAccountName: bankaccountname,
                    BankName: bankname,
                    Bsb: bankbsb,
                    SiteCode: routingNo,
                    FileReference: accountname,
                  },
                };
                organisationService
                  .saveOrganisationSetting(objDetails)
                  .then(function (data) {
                    var accNo = bankacountno || "";
                    var swiftCode1 = swiftCode || "";
                    var bankAccName = bankaccountname || "";
                    var accountName = accountname || "";
                    var bsb = bankbsb || "";
                    var routingNo = routingNo || "";

                    localStorage.setItem("vs1companyBankName", bankname);
                    localStorage.setItem(
                      "vs1companyBankAccountName",
                      bankAccName
                    );
                    localStorage.setItem("vs1companyBankAccountNo", accNo);
                    localStorage.setItem("vs1companyBankBSB", bsb);
                    localStorage.setItem("vs1companyBankSwiftCode", swiftCode1);
                    localStorage.setItem("vs1companyBankRoutingNo", routingNo);
                    sideBarService
                      .getAccountListVS1()
                      .then(function (dataReload) {
                        addVS1Data("TAccountVS1", JSON.stringify(dataReload))
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
                    sideBarService
                      .getAccountListVS1()
                      .then(function (dataReload) {
                        addVS1Data("TAccountVS1", JSON.stringify(dataReload))
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
                  });
              } else {
                sideBarService
                  .getAccountListVS1()
                  .then(function (dataReload) {
                    addVS1Data("TAccountVS1", JSON.stringify(dataReload))
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
              }
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
              $(".fullScreenSpin").css("display", "none");
            });
        })
        .catch(function (err) {
          data = {
            type: "TAccount",
            fields: {
              AccountName: accountname || "",
              AccountNumber: accountno || "",
              AccountTypeName: accounttype || "",
              Active: true,
              BankAccountName: bankaccountname || "",
              BankAccountNumber: bankacountno || "",
              BSB: bankbsb || "",
              Description: accountdesc || "",
              TaxCode: taxcode || "",
              Extra: swiftCode,
              BankNumber: routingNo,
              PublishOnVS1: true,
              IsHeader: forTransaction,
              CarNumber: cardnumber || "",
              CVC: cardcvc || "",
              ExpiryDate: expiryDate || "",
            },
          };

          accountService
            .saveAccount(data)
            .then(function (data) {
              if ($("#showOnTransactions").is(":checked")) {
                var objDetails = {
                  type: "TCompanyInfo",
                  fields: {
                    Id: companyID,
                    AccountNo: bankacountno,
                    BankBranch: swiftCode,
                    BankAccountName: bankaccountname,
                    BankName: bankname,
                    Bsb: bankbsb,
                    SiteCode: routingNo,
                    FileReference: accountname,
                  },
                };
                organisationService
                  .saveOrganisationSetting(objDetails)
                  .then(function (data) {
                    var accNo = bankacountno || "";
                    var swiftCode1 = swiftCode || "";
                    var bankName = bankaccountname || "";
                    var accountName = accountname || "";
                    var bsb = bankbsb || "";
                    var routingNo = routingNo || "";
                    localStorage.setItem("vs1companyBankName", bankname);
                    localStorage.setItem(
                      "vs1companyBankAccountName",
                      bankAccName
                    );
                    localStorage.setItem("vs1companyBankAccountNo", accNo);
                    localStorage.setItem("vs1companyBankBSB", bsb);
                    localStorage.setItem("vs1companyBankSwiftCode", swiftCode1);
                    localStorage.setItem("vs1companyBankRoutingNo", routingNo);
                    sideBarService
                      .getAccountListVS1()
                      .then(function (dataReload) {
                        addVS1Data("TAccountVS1", JSON.stringify(dataReload))
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
                    sideBarService
                      .getAccountListVS1()
                      .then(function (dataReload) {
                        addVS1Data("TAccountVS1", JSON.stringify(dataReload))
                          .then(function (datareturn) {
                            //window.open('/addAccountModal', '_self');
                          })
                          .catch(function (err) {
                            Meteor._reload.reload();
                          });
                      })
                      .catch(function (err) {
                        Meteor._reload.reload();
                      });
                  });
              } else {
                sideBarService
                  .getAccountListVS1()
                  .then(function (dataReload) {
                    addVS1Data("TAccountVS1", JSON.stringify(dataReload))
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
              }
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
              $(".fullScreenSpin").css("display", "none");
            });
        });
    } else {
      data = {
        type: "TAccount",
        fields: {
          ID: accountID,
          AccountName: accountname || "",
          AccountNumber: accountno || "",
          // AccountTypeName: accounttype || '',
          Active: true,
          BankAccountName: bankaccountname || "",
          BankAccountNumber: bankacountno || "",
          BSB: bankbsb || "",
          Description: accountdesc || "",
          TaxCode: taxcode || "",
          Extra: swiftCode,
          BankNumber: routingNo,
          //Level4: bankname,
          PublishOnVS1: true,
          IsHeader: forTransaction,
          CarNumber: cardnumber || "",
          CVC: cardcvc || "",
          ExpiryDate: expiryDate || "",
        },
      };

      accountService
        .saveAccount(data)
        .then(function (data) {
          if ($("#showOnTransactions").is(":checked")) {
            var objDetails = {
              type: "TCompanyInfo",
              fields: {
                Id: companyID,
                AccountNo: bankacountno,
                BankBranch: swiftCode,
                BankAccountName: bankaccountname,
                BankName: bankname,
                Bsb: bankbsb,
                SiteCode: routingNo,
                FileReference: accountname,
              },
            };
            organisationService
              .saveOrganisationSetting(objDetails)
              .then(function (data) {
                var accNo = bankacountno || "";
                var swiftCode1 = swiftCode || "";
                var bankAccName = bankaccountname || "";
                var accountName = accountname || "";
                var bsb = bankbsb || "";
                var routingNo = routingNo || "";
                localStorage.setItem("vs1companyBankName", bankname);
                localStorage.setItem("vs1companyBankAccountName", bankAccName);
                localStorage.setItem("vs1companyBankAccountNo", accNo);
                localStorage.setItem("vs1companyBankBSB", bsb);
                localStorage.setItem("vs1companyBankSwiftCode", swiftCode1);
                localStorage.setItem("vs1companyBankRoutingNo", routingNo);
                sideBarService
                  .getAccountListVS1()
                  .then(function (dataReload) {
                    addVS1Data("TAccountVS1", JSON.stringify(dataReload))
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
                sideBarService
                  .getAccountListVS1()
                  .then(function (dataReload) {
                    addVS1Data("TAccountVS1", JSON.stringify(dataReload))
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
              });
          } else {
            sideBarService
              .getAccountListVS1()
              .then(function (dataReload) {
                addVS1Data("TAccountVS1", JSON.stringify(dataReload))
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
          }
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
          $(".fullScreenSpin").css("display", "none");
        });
    }
  },
  "change #sltAccountType": function (e) {
    let templateObject = Template.instance();
    var accountTypeName = $("#sltAccountType").val();

    if (accountTypeName === "BANK") {
      $(".isBankAccount").removeClass("isNotBankAccount");
      $(".isCreditAccount").addClass("isNotCreditAccount");
    } else if (accountTypeName === "CCARD") {
      $(".isCreditAccount").removeClass("isNotCreditAccount");
      $(".isBankAccount").addClass("isNotBankAccount");
    } else {
      $(".isBankAccount").addClass("isNotBankAccount");
      $(".isCreditAccount").addClass("isNotCreditAccount");
    }
    // $('.file-name').text(filename);
    // let selectedFile = event.target.files[0];
    // templateObj.selectedFile.set(selectedFile);
    // if($('.file-name').text() != ""){
    //   $(".btnImport").removeAttr("disabled");
    // }else{
    //   $(".btnImport").Attr("disabled");
    // }
  },
});

Template.addAccountModal.helpers({
  accountTypes: () => {
    return Template.instance()
      .accountTypes.get()
      .sort(function (a, b) {
        if (a.description === "NA") {
          return 1;
        } else if (b.description === "NA") {
          return -1;
        }
        return a.description.toUpperCase() > b.description.toUpperCase()
          ? 1
          : -1;
      });
  },
  taxraterecords: () => {
    return Template.instance()
      .taxraterecords.get()
      .sort(function (a, b) {
        if (a.description === "NA") {
          return 1;
        } else if (b.description === "NA") {
          return -1;
        }
        return a.description.toUpperCase() > b.description.toUpperCase()
          ? 1
          : -1;
      });
  },
});
