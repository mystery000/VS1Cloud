import {TaxRateService} from "../settings-service";
import {ReactiveVar} from "meteor/reactive-var";
import {CoreService} from "../../js/core-service";
import {CountryService} from "../../js/country-service";
import {SideBarService} from "../../js/sidebar-service";
// import { HTTP } from "meteor/http";
import "../../lib/global/indexdbstorage.js";
import FxApi from "./FxApi";
import LoadingOverlay from "../../LoadingOverlay";
import CachedHttp from "../../lib/global/CachedHttp";
import erpObject from "../../lib/global/erp-objects";
import TableHandler from "../../js/Table/TableHandler";

let sideBarService = new SideBarService();

let defaultCurrencyCode = CountryAbbr; // global variable "AUD"

Template.currenciessettings.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.currencies = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.countryData = new ReactiveVar();
});

Template.currenciessettings.onRendered(function () {
  LoadingOverlay.show();
  let templateObject = Template.instance();
  let taxRateService = new TaxRateService();
  const dataTableList = [];
  const tableHeaderList = [];
  var countryService = new CountryService();
  let countries = [];

  Meteor.call("readPrefMethod", Session.get("mycloudLogonID"), "currencyLists", function (error, result) {
    if (error) {} else {
      if (result) {
        for (let i = 0; i < result.customFields.length; i++) {
          let customcolumn = result.customFields;
          let columData = customcolumn[i].label;
          let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
          let hiddenColumn = customcolumn[i].hidden;
          let columnClass = columHeaderUpdate.split(".")[1];
          let columnWidth = customcolumn[i].width;

          $("th." + columnClass + "").html(columData);
          $("th." + columnClass + "").css("width", "" + columnWidth + "px");
        }
      }
    }
  });

  function MakeNegative() {
    $("td").each(function () {
      if ($(this).text().indexOf("-" + Currency) >= 0) 
        $(this).addClass("text-danger");
      }
    );
  }

  templateObject.getCurrencies = async (fromRemote = false, refresh = false) => {
    LoadingOverlay.show();

    let data = await CachedHttp.get(erpObject.TCurrency, async () => {
      return await taxRateService.getCurrencies();
    }, {
      useIndexDb: true,
      useLocalStorage: false,
      forceOverride: refresh,
      validate: (cachedResponse) => {
        if(fromRemote == true || refresh == true) {
          return false;
        }
        return true;
      }
    });


    data = data.response;

    let currencies = data.tcurrency[0].fields ? data.tcurrency.map(c => c.fields) : data.tcurrency;

    // if (fromRemote == true) {
    //   data = await taxRateService.getCurrencies();
    //   // TO DO: We should save these locally too
    //   // await addVS1Data("TCurrency", data);
    // } else {
    //   let dataObject = await getVS1Data("TCurrency");
    //   data = ((dataObject.length == 0) == refresh) == true
    //     ? await taxRateService.getCurrencies()
    //     : JSON.parse(dataObject[0].data);
    // }
    currencies = currencies.map(_currency => {
      return {
        id: _currency.Id || "",
        code: _currency.Code || "N/A",
        currency: _currency.Currency || "N/A",
        symbol: _currency.CurrencySymbol || "N/A",
        buyrate: _currency.BuyRate || "N/A",
        sellrate: _currency.SellRate || "N/A",
        country: _currency.Country || "N/A",
        description: _currency.CurrencyDesc || "N/A",
        ratelastmodified: _currency.RateLastModified || "N/A"
      }
    });

    await templateObject.currencies.set(currencies);

    if (await templateObject.currencies.get()) {
      Meteor.call("readPrefMethod", Session.get("mycloudLogonID"), "currencyLists", function (error, result) {
        if (error) {} else {
          if (result) {
            for (let i = 0; i < result.customFields.length; i++) {
              let customcolumn = result.customFields;
              let columData = customcolumn[i].label;
              let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
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
      });

      setTimeout(function () {
        MakeNegative();
      }, 100);

      if(refresh == true) $("#currencyLists").DataTable().destroy();

      setTimeout(() => {
        $("#currencyLists").DataTable({
          ...TableHandler.getDefaultTableConfiguration('currencyLists', {showPlusButton: false, showSearchButton: true}),
          columnDefs: [
            {
              type: "date",
              targets: 0
            }, {
              orderable: false,
              targets: -1
            }
          ],
          
          //sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
          buttons: [
            {
              extend: "excelHtml5",
              text: "",
              download: "open",
              className: "btntabletocsv hiddenColumn",
              filename: "currencylist_" + moment().format(),
              orientation: "portrait",
              exportOptions: {
                columns: ":visible"
              }
            }, {
              extend: "print",
              download: "open",
              className: "btntabletopdf hiddenColumn",
              text: "",
              title: "Currency List",
              filename: "currencylist_" + moment().format(),
              exportOptions: {
                columns: ":visible"
              }
            }
          ],
          // select: true,
          // destroy: true,
          // colReorder: true,
          // colReorder: {
          //   fixedColumnsRight: 1
          // },
          // info: true,
          // responsive: true,
          order: [
            [0, "asc"]
          ],
          action: function () {
            $("#currencyLists").DataTable().ajax.reload();
          },
          fnDrawCallback: function (oSettings) {
            setTimeout(function () {
              MakeNegative();
            }, 100);
          }
        }).on("page", function () {
          setTimeout(function () {
            MakeNegative();
          }, 100);
          let draftRecord = templateObject.currencies.get();
          templateObject.currencies.set(draftRecord);
        }).on("column-reorder", function () {}).on("length.dt", function (e, settings, len) {
          setTimeout(function () {
            MakeNegative();
          }, 100);
        });
      }, 300);
    }

    // $('#currencyLists').DataTable().column( 0 ).visible( true );
    LoadingOverlay.hide();

    var columns = $("#currencyLists th");
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
        sClass: v.className || ""
      };
      tableHeaderList.push(datatablerecordObj);
    });
    templateObject.tableheaderrecords.set(tableHeaderList);
    $("div.dataTables_filter input").addClass("form-control form-control-sm");
  };

  /**
   * @deprecated
   */
  templateObject.loadCurrencies = function () {
    getVS1Data("TCurrency").then(function (dataObject) {
      if (dataObject.length == 0) {
        taxRateService.getCurrencies().then(function (data) {
          let lineItems = [];
          let lineItemObj = {};
          for (let i = 0; i < data.tcurrency.length; i++) {
            // let taxRate = (data.tcurrency[i].fields.Rate * 100).toFixed(2) + '%';
            var dataList = {
              id: data.tcurrency[i].fields.Id || "",
              code: data.tcurrency[i].fields.Code || "-",
              currency: data.tcurrency[i].fields.Currency || "-",
              symbol: data.tcurrency[i].fields.CurrencySymbol || "-",
              buyrate: data.tcurrency[i].fields.BuyRate || "-",
              sellrate: data.tcurrency[i].fields.SellRate || "-",
              country: data.tcurrency[i].fields.Country || "-",
              description: data.tcurrency[i].fields.CurrencyDesc || "-",
              ratelastmodified: data.tcurrency[i].fields.RateLastModified || "-"
            };

            dataTableList.push(dataList);
            //}
          }

          templateObject.currencies.set(dataTableList);

          if (templateObject.currencies.get()) {
            Meteor.call("readPrefMethod", Session.get("mycloudLogonID"), "currencyLists", function (error, result) {
              if (error) {} else {
                if (result) {
                  for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
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
            });

            setTimeout(function () {
              MakeNegative();
            }, 100);
          }

          LoadingOverlay.hide();
          setTimeout(function () {
            $("#currencyLists").DataTable({
              columnDefs: [
                {
                  type: "date",
                  targets: 0
                }, {
                  orderable: false,
                  targets: -1
                }
              ],
              sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
              buttons: [
                {
                  extend: "excelHtml5",
                  text: "",
                  download: "open",
                  className: "btntabletocsv hiddenColumn",
                  filename: "currencylist_" + moment().format(),
                  orientation: "portrait",
                  exportOptions: {
                    columns: ":visible"
                  }
                }, {
                  extend: "print",
                  download: "open",
                  className: "btntabletopdf hiddenColumn",
                  text: "",
                  title: "Currency List",
                  filename: "currencylist_" + moment().format(),
                  exportOptions: {
                    columns: ":visible"
                  }
                }
              ],
              select: true,
              destroy: true,
              colReorder: true,
              length: 25,
              colReorder: {
                fixedColumnsRight: 1
              },
              // bStateSave: true,
              // rowId: 0,
              paging: true,
              //                      "scrollY": "400px",
              //                      "scrollCollapse": true,
              info: true,
              responsive: true,
              order: [
                [0, "asc"]
              ],
              action: function () {
                $("#currencyLists").DataTable().ajax.reload();
              },
              fnDrawCallback: function (oSettings) {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
              }
            }).on("page", function () {
              setTimeout(function () {
                MakeNegative();
              }, 100);
              let draftRecord = templateObject.currencies.get();
              templateObject.currencies.set(draftRecord);
            }).on("column-reorder", function () {}).on("length.dt", function (e, settings, len) {
              setTimeout(function () {
                MakeNegative();
              }, 100);
            });

            // $('#currencyLists').DataTable().column( 0 ).visible( true );
            LoadingOverlay.hide();
          }, 300);

          var columns = $("#currencyLists th");
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
              sClass: v.className || ""
            };
            tableHeaderList.push(datatablerecordObj);
          });
          templateObject.tableheaderrecords.set(tableHeaderList);
          $("div.dataTables_filter input").addClass("form-control form-control-sm");
        }).catch(function (err) {
          // Bert.alert('<strong>' + err + '</strong>!', 'danger');
          LoadingOverlay.hide();
          // Meteor._reload.reload();
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tcurrency;
        let lineItems = [];
        let lineItemObj = {};

        for (let i = 0; i < useData.length; i++) {
          // let taxRate = (useData[i].fields.Rate * 100).toFixed(2) + '%';

          var dataList = {
            id: data.tcurrency[i].fields.ID || "",
            code: data.tcurrency[i].fields.Code || "-",
            currency: data.tcurrency[i].fields.Currency || "-",
            symbol: data.tcurrency[i].fields.CurrencySymbol || "-",
            buyrate: data.tcurrency[i].fields.BuyRate || "-",
            sellrate: data.tcurrency[i].fields.SellRate || "-",
            country: data.tcurrency[i].fields.Country || "-",
            description: data.tcurrency[i].fields.CurrencyDesc || "-",
            ratelastmodified: data.tcurrency[i].fields.RateLastModified || "-"
          };

          dataTableList.push(dataList);
          //}
        }

        templateObject.currencies.set(dataTableList);

        if (templateObject.currencies.get()) {
          Meteor.call("readPrefMethod", Session.get("mycloudLogonID"), "currencyLists", function (error, result) {
            if (error) {} else {
              if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
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
          });

          setTimeout(function () {
            MakeNegative();
          }, 100);
        }

        LoadingOverlay.hide();
        setTimeout(function () {
          $("#currencyLists").DataTable({
            columnDefs: [
              {
                type: "date",
                targets: 0
              }, {
                orderable: false,
                targets: -1
              }
            ],
            sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [
              {
                extend: "excelHtml5",
                text: "",
                download: "open",
                className: "btntabletocsv hiddenColumn",
                filename: "currencylist_" + moment().format(),
                orientation: "portrait",
                exportOptions: {
                  columns: ":visible"
                }
              }, {
                extend: "print",
                download: "open",
                className: "btntabletopdf hiddenColumn",
                text: "",
                title: "Currency List",
                filename: "currencylist_" + moment().format(),
                exportOptions: {
                  columns: ":visible"
                }
              }
            ],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
              fixedColumnsRight: 1
            },
            // bStateSave: true,
            // rowId: 0,
            paging: false,
            //              "scrollY": "400px",
            //              "scrollCollapse": true,
            lengthMenu: [
              [
                initialDatatableLoad, -1
              ],
              [
                initialDatatableLoad, "All"
              ]
            ],
            info: true,
            responsive: true,
            order: [
              [0, "asc"]
            ],
            action: function () {
              $("#currencyLists").DataTable().ajax.reload();
            },
            fnDrawCallback: function (oSettings) {
              setTimeout(function () {
                MakeNegative();
              }, 100);
            }
          }).on("page", function () {
            setTimeout(function () {
              MakeNegative();
            }, 100);
            let draftRecord = templateObject.currencies.get();
            templateObject.currencies.set(draftRecord);
          }).on("column-reorder", function () {}).on("length.dt", function (e, settings, len) {
            setTimeout(function () {
              MakeNegative();
            }, 100);
          });

          // $('#currencyLists').DataTable().column( 0 ).visible( true );
          LoadingOverlay.hide();
        }, 0);

        var columns = $("#currencyLists th");
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
            sClass: v.className || ""
          };
          tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
        $("div.dataTables_filter input").addClass("form-control form-control-sm");
      }
    }).catch(function (err) {
      taxRateService.getCurrencies().then(function (data) {
        let lineItems = [];
        let lineItemObj = {};
        for (let i = 0; i < data.tcurrency.length; i++) {
          // let taxRate = (data.tcurrency[i].fields.Rate * 100).toFixed(2) + '%';
          var dataList = {
            id: data.tcurrency[i].Id || "",
            code: data.tcurrency[i].Code || "-",
            currency: data.tcurrency[i].Currency || "-",
            symbol: data.tcurrency[i].CurrencySymbol || "-",
            buyrate: data.tcurrency[i].BuyRate || "-",
            sellrate: data.tcurrency[i].SellRate || "-",
            country: data.tcurrency[i].Country || "-",
            description: data.tcurrency[i].CurrencyDesc || "-",
            ratelastmodified: data.tcurrency[i].RateLastModified || "-"
          };

          dataTableList.push(dataList);
          //}
        }

        templateObject.currencies.set(dataTableList);

        if (templateObject.currencies.get()) {
          Meteor.call("readPrefMethod", Session.get("mycloudLogonID"), "currencyLists", function (error, result) {
            if (error) {} else {
              if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
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
          });

          setTimeout(function () {
            MakeNegative();
          }, 100);
        }

        LoadingOverlay.hide();
        setTimeout(function () {
          $("#currencyLists").DataTable({
            columnDefs: [
              {
                type: "date",
                targets: 0
              }, {
                orderable: false,
                targets: -1
              }
            ],
            sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [
              {
                extend: "excelHtml5",
                text: "",
                download: "open",
                className: "btntabletocsv hiddenColumn",
                filename: "currencylist_" + moment().format(),
                orientation: "portrait",
                exportOptions: {
                  columns: ":visible"
                }
              }, {
                extend: "print",
                download: "open",
                className: "btntabletopdf hiddenColumn",
                text: "",
                title: "Currency List",
                filename: "currencylist_" + moment().format(),
                exportOptions: {
                  columns: ":visible"
                }
              }
            ],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
              fixedColumnsRight: 1
            },
            // bStateSave: true,
            // rowId: 0,
            paging: false,
            //                    "scrollY": "400px",
            //                    "scrollCollapse": true,
            info: true,
            responsive: true,
            order: [
              [0, "asc"]
            ],
            action: function () {
              $("#currencyLists").DataTable().ajax.reload();
            },
            fnDrawCallback: function (oSettings) {
              setTimeout(function () {
                MakeNegative();
              }, 100);
            }
          }).on("page", function () {
            setTimeout(function () {
              MakeNegative();
            }, 100);
            let draftRecord = templateObject.currencies.get();
            templateObject.currencies.set(draftRecord);
          }).on("column-reorder", function () {}).on("length.dt", function (e, settings, len) {
            setTimeout(function () {
              MakeNegative();
            }, 100);
          });

          // $('#currencyLists').DataTable().column( 0 ).visible( true );
          LoadingOverlay.hide();
        }, 0);

        var columns = $("#currencyLists th");
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
            sClass: v.className || ""
          };
          tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
        $("div.dataTables_filter input").addClass("form-control form-control-sm");
      }).catch(function (err) {
        // Bert.alert('<strong>' + err + '</strong>!', 'danger');
        LoadingOverlay.hide();
        // Meteor._reload.reload();
      });
    });
  };

  //templateObject.loadCurrencies();

  templateObject.getCurrencies();

  templateObject.getCountryData = function () {
    getVS1Data("TCountries").then(function (dataObject) {
      if (dataObject.length == 0) {
        countryService.getCountry().then(data => {
          for (let i = 0; i < data.tcountries.length; i++) {
            countries.push(data.tcountries[i].Country);
          }
          countries.sort((a, b) => a.localeCompare(b));
          templateObject.countryData.set(countries);
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tcountries;
        for (let i = 0; i < useData.length; i++) {
          countries.push(useData[i].Country);
        }
        countries.sort((a, b) => a.localeCompare(b));
        templateObject.countryData.set(countries);
      }
    }).catch(function (err) {
      countryService.getCountry().then(data => {
        for (let i = 0; i < data.tcountries.length; i++) {
          countries.push(data.tcountries[i].Country);
        }
        countries.sort((a, b) => a.localeCompare(b));
        templateObject.countryData.set(countries);
      });
    });
  };
  templateObject.getCountryData();

  // $(document).on("click", ".table-remove", function () {
  //   event.stopPropagation();
  //   event.stopPropagation();
  //   var targetID = $(event.target).closest("tr").attr("id"); // table row ID
  //   $("#selectDeleteLineID").val(targetID);
  //   $("#deleteLineModal").modal("toggle");
  // });

  // $("#currencyLists tbody").on("click", "tr .colCode, tr .colCurrency, tr .colSymbol, tr .colBuyRate, tr .colSellRate, tr .colCountry, tr .colRateLastModified, tr .colDescription", function () {
  //   var listData = $(this).closest("tr").attr("id");
  //   if (listData) {
  //     $("#add-currency-title").text("Edit Currency");
  //     $("#sedtCountry").prop("readonly", true);
  //     if (listData !== "") {
  //       listData = Number(listData);
  //       //taxRateService.getOneCurrency(listData).then(function (data) {

  //       var currencyid = listData || "";
  //       var country = $(event.target).closest("tr").find(".colCountry").text() || "";
  //       var currencyCode = $(event.target).closest("tr").find(".colCode").text() || "";
  //       var currencySymbol = $(event.target).closest("tr").find(".colSymbol").text() || "";
  //       var currencyName = $(event.target).closest("tr").find(".colCurrency").text() || "";
  //       var currencyDesc = $(event.target).closest("tr").find(".colDescription").text() || "";
  //       var currencyBuyRate = $(event.target).closest("tr").find(".colBuyRate").text() || 0;
  //       var currencySellRate = $(event.target).closest("tr").find(".colSellRate").text() || 0;
  //       //data.fields.Rate || '';
  //       $("#edtCurrencyID").val(currencyid);
  //       $("#sedtCountry").val(country);
  //       $("#sedtCountry").attr("readonly", true);
  //       $("#sedtCountry").attr("disabled", "disabled");
  //       $("#currencyCode").val(currencyCode);
  //       $("#currencySymbol").val(currencySymbol);
  //       $("#edtCurrencyName").val(currencyName);
  //       $("#edtCurrencyDesc").val(currencyDesc);
  //       $("#edtBuyRate").val(currencyBuyRate);
  //       $("#edtSellRate").val(currencySellRate);

  //       //});

  //       $(this).closest("tr").attr("data-target", "#myModal");
  //       $(this).closest("tr").attr("data-toggle", "modal");
  //     }
  //   }
  // });
});

Template.currenciessettings.events({
  "click .btn-fx-history": e => {
    window.location.href = `/fx-currency-history`;
    // FlowRouter.go(`/fx-currency-history`);
    // Meteor._reload.reload();
  },
  "click #currencyLists tbody tr": e => {
    const currency = $(e.currentTarget).find(".colCode").text();

    // FlowRouter.go(`/fx-currency-history?currency=${currency}`);
    window.location.href = `/fx-currency-history?currency=${currency}`;
    // Meteor._reload.reload();
  },
  "click .btnFxupdate": function (event) {
    $("#frequencyModal").modal("toggle");
    // FlowRouter.go('/settings/fx-update'); old wrong code
  },
  "click #btnNewInvoice": function (event) {
    // FlowRouter.go('/invoicecard');
  },
  "click .chkDatatable": function (event) {
    var columns = $("#currencyLists th");
    let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

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
    var getcurrentCloudDetails = CloudUser.findOne({_id: Session.get("mycloudLogonID"), clouddatabaseID: Session.get("mycloudLogonDBID")});
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({userid: clientID, PrefName: "currencyLists"});
        if (checkPrefDetails) {
          CloudPreference.remove({
            _id: checkPrefDetails._id
          }, function (err, idTag) {
            if (err) {} else {
              Meteor._reload.reload();
            }
          });
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
        thclass: colthClass
      };

      lineItems.push(lineItemObj);
    });

    var getcurrentCloudDetails = CloudUser.findOne({_id: Session.get("mycloudLogonID"), clouddatabaseID: Session.get("mycloudLogonDBID")});
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({userid: clientID, PrefName: "currencyLists"});
        if (checkPrefDetails) {
          CloudPreference.update({
            _id: checkPrefDetails._id
          }, {
            $set: {
              userid: clientID,
              username: clientUsername,
              useremail: clientEmail,
              PrefGroup: "salesform",
              PrefName: "currencyLists",
              published: true,
              customFields: lineItems,
              updatedAt: new Date()
            }
          }, function (err, idTag) {
            if (err) {
              $("#myModal2").modal("toggle");
            } else {
              $("#myModal2").modal("toggle");
            }
          });
        } else {
          CloudPreference.insert({
            userid: clientID,
            username: clientUsername,
            useremail: clientEmail,
            PrefGroup: "salesform",
            PrefName: "currencyLists",
            published: true,
            customFields: lineItems,
            createdAt: new Date()
          }, function (err, idTag) {
            if (err) {
              $("#myModal2").modal("toggle");
            } else {
              $("#myModal2").modal("toggle");
            }
          });
        }
      }
    }
  },
  "blur .divcolumn": function (event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target).closest("div.columnSettings").attr("id");
    var datable = $("#currencyLists").DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  "change .rngRange": function (event) {
    let range = $(event.target).val();
    $(event.target).closest("div.divColWidth").find(".spWidth").html(range + "px");

    let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
    let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    var datable = $("#currencyLists th");
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
    var columns = $("#currencyLists th");

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
        sClass: v.className || ""
      };
      tableHeaderList.push(datatablerecordObj);
    });
    templateObject.tableheaderrecords.set(tableHeaderList);
  },
  "click #exportbtn": function () {
    LoadingOverlay.show();
    jQuery("#currencyLists_wrapper .dt-buttons .btntabletocsv").click();
    LoadingOverlay.hide();
  },
  'click .printConfirm': function(event) {
    LoadingOverlay.show();
    jQuery('#currencyLists_wrapper .dt-buttons .btntabletopdf').click();
    LoadingOverlay.hide();
  },
  "click .btnRefresh":  (e, ui) => {
    // LoadingOverlay.show();
    // sideBarService.getCurrencies().then(function (dataReload) {
    //   addVS1Data("TCurrency", JSON.stringify(dataReload)).then(function (datareturn) {
    //     location.reload(true);
    //   }).catch(function (err) {
    //     location.reload(true);
    //   });
    // }).catch(function (err) {
    //   location.reload(true);
    // });

    ui.getCurrencies(true, true);
  },
  "click .btnAddNewDepart": function () {
    $("#newTaxRate").css("display", "block");
  },
  "click .btnCloseAddNewDept": function () {
    playCancelAudio();
    setTimeout(function(){
    $("#newTaxRate").css("display", "none");
    }, delayTimeAfterSound);
  },

  "click .synbutton": function () {
    let taxRateService = new TaxRateService();
    HTTP.call("GET", "http://data.fixer.io/api/latest?access_key=d980fa1efb7dab62b2240c1f56606217", {
      options: ""
    }, function (error, response) {
      let data = response.data;
      let date = data.date;
      let rates = data.rates;

      let codearray = [
        "AED",
        "AFN",
        "ALL",
        "AMD",
        "ANG",
        "AOA",
        "ARS",
        "AUD",
        "AWG",
        "AZN",
        "BAM",
        "BBD",
        "BDT",
        "BGN",
        "BHD",
        "BIF",
        "BMD",
        "BND",
        "BOB",
        "BRL",
        "BSD",
        "BTC",
        "BTN",
        "BWP",
        "BYN",
        "BYR",
        "BZD",
        "CAD",
        "CDF",
        "CHF",
        "CLF",
        "CLP",
        "CNY",
        "COP",
        "CRC",
        "CUC",
        "CUP",
        "CVE",
        "CZK",
        "DJF",
        "DKK",
        "DOP",
        "DZD",
        "EGP",
        "ERN",
        "ETB",
        "EUR",
        "FJD",
        "FKP",
        "GBP",
        "GEL",
        "GGP",
        "GHS",
        "GIP",
        "GMD",
        "GNF",
        "GTQ",
        "GYD",
        "HKD",
        "HNL",
        "HRK",
        "HTG",
        "HUF",
        "IDR",
        "ILS",
        "IMP",
        "INR",
        "IQD",
        "IRR",
        "ISK",
        "JEP",
        "JMD",
        "JOD",
        "JPY",
        "KES",
        "KGS",
        "KHR",
        "KMF",
        "KPW",
        "KRW",
        "KWD",
        "KYD",
        "KZT",
        "LAK",
        "LBP",
        "LKR",
        "LRD",
        "LSL",
        "LTL",
        "LVL",
        "LYD",
        "MAD",
        "MDL",
        "MGA",
        "MKD",
        "MMK",
        "MNT",
        "MOP",
        "MRO",
        "MUR",
        "MVR",
        "MWK",
        "MXN",
        "MYR",
        "MZN",
        "NAD",
        "NGN",
        "NIO",
        "NOK",
        "NPR",
        "NZD",
        "OMR",
        "PAB",
        "PEN",
        "PGK",
        "PHP",
        "PKR",
        "PLN",
        "PYG",
        "QAR",
        "RON",
        "RSD",
        "RUB",
        "RWF",
        "SAR",
        "SBD",
        "SCR",
        "SDG",
        "SEK",
        "SGD",
        "SHP",
        "SLL",
        "SOS",
        "SRD",
        "STD",
        "SVC",
        "SYP",
        "SZL",
        "THB",
        "TJS",
        "TMT",
        "TND",
        "TOP",
        "TRY",
        "TTD",
        "TWD",
        "TZS",
        "UAH",
        "UGX",
        "USD",
        "UYU",
        "UZS",
        "VEF",
        "VND",
        "VUV",
        "WST",
        "XAF",
        "XAG",
        "XAU",
        "XCD",
        "XDR",
        "XOF",
        "XPF",
        "YER",
        "ZAR",
        "ZMK",
        "ZMW",
        "ZWL"
      ];

      for (let i = 0; i < codearray.length; i++) {
        let code = codearray[i];
        let value = rates[code];
      }
    });
  },
  "click .btnDeleteCurrency": function () {
    playDeleteAudio();
    let taxRateService = new TaxRateService();
    setTimeout(function(){
    let currencyId = $("#selectDeleteLineID").val();

    let objDetails = {
      type: "TCurrency",
      fields: {
        Id: currencyId,
        Active: false
      }
    };

    taxRateService.saveCurrency(objDetails).then(function (objDetails) {
      sideBarService.getCurrencies().then(function (dataReload) {
        addVS1Data("TCurrency", JSON.stringify(dataReload)).then(function (datareturn) {
          Meteor._reload.reload();
        }).catch(function (err) {
          Meteor._reload.reload();
        });
      }).catch(function (err) {
        Meteor._reload.reload();
      });
    }).catch(function (err) {
      swal({title: "Oooops...", text: err, type: "error", showCancelButton: false, confirmButtonText: "Try Again"}).then(result => {
        if (result.value) {
          Meteor._reload.reload();
        } else if (result.dismiss === "cancel") {}
      });
      LoadingOverlay.hide();
    });
  }, delayTimeAfterSound);
  },
  "click .btnAddCurrency": function () {
    $("#add-currency-title").text("Add New Currency");
    $("#sedtCountry").val("");
    $("#edtCurrencyID").val("");
    $("#sedtCountry").removeAttr("readonly", true);
    $("#sedtCountry").removeAttr("disabled", "disabled");
    $("#currencyCode").val("");
    $("#currencySymbol").val("");
    $("#edtCurrencyName").val("");
    $("#edtCurrencyName").val("");
    $("#edtBuyRate").val(1);
    $("#edtSellRate").val(1);
  },
  // "change #sedtCountry": async (e) => {
  //   LoadingOverlay.show();

  //   let taxRateService = new TaxRateService();
  //   let selectCountry = $("#sedtCountry").val();
  //   $("#edtCurrencyID").val("");

  //   $("#currencyCode").val("");
  //   $("#currencySymbol").val("");
  //   $("#edtCurrencyName").val("");
  //   $("#edtCurrencyDesc").val("");
  //   $("#edtBuyRate").val("");
  //   $("#edtSellRate").val("");

  //   if (selectCountry != "") {
  //     const data = await taxRateService.getOneCurrencyByCountry(selectCountry);

  //     if (data) {
  //       for (let i = 0; i < data.tcurrency.length; i++) {

  //         if (data.tcurrency[i].Country === selectCountry) {
  //           var currencyid = data.tcurrency[i].Id || "";
  //           var country = data.tcurrency[i].Country || "";
  //           var currencyCode = data.tcurrency[i].Code || "";
  //           var currencySymbol = data.tcurrency[i].CurrencySymbol || "";
  //           var currencyName = data.tcurrency[i].Currency || "";
  //           var currencyDesc = data.tcurrency[i].CurrencyDesc;
  //           var currencyBuyRate = data.tcurrency[i].BuyRate || 0;
  //           var currencySellRate = data.tcurrency[i].SellRate || 0;

  //           /**
  //            * Let's call the Fx APis here
  //            */
  //           const fxApi = new FxApi();
  //           let currencyRates = await fxApi.getExchangeRate(currencyCode);
  //           if (currencyRates) {
  //             currencyBuyRate = currencyRates.buy;
  //             currencySellRate = currencyRates.sell;
  //           }

  //           $("#edtCurrencyID").val(currencyid);
  //            $('#sedtCountry').val(country);

  //           $("#currencyCode").val(currencyCode);
  //           $("#currencySymbol").val(currencySymbol);
  //           $("#edtCurrencyName").val(currencyName);
  //           $("#edtCurrencyDesc").val(currencyDesc);
  //           $("#edtBuyRate").val(currencyBuyRate);
  //           $("#edtSellRate").val(currencySellRate);
  //         }
  //       }
  //     }
  //   }
  //   LoadingOverlay.hide();
  // },
  "click .btnSaveCurrency": e => {
    playSaveAudio();
    let taxRateService = new TaxRateService();
    setTimeout(function(){
    
    LoadingOverlay.show();
    var currencyid = $("#edtCurrencyID").val();
    var country = $("#sedtCountry").val();
    var currencyCode = $("#currencyCode").val();
    var currencySymbol = $("#currencySymbol").val();
    var currencyName = $("#edtCurrencyName").val();
    var currencyDesc = $("#edtCurrencyDesc").val();
    var currencyBuyRate = $("#edtBuyRate").val() || 0;
    var currencySellRate = $("#edtSellRate").val() || 0;

    let objDetails = "";
    if (currencyName === "") {
      Bert.alert("<strong>WARNING:</strong> Currency Name cannot be blank!", "warning");
      LoadingOverlay.hide();
      e.preventDefault();
    }

    if (currencyid == "") {
      objDetails = {
        type: "TCurrency",
        fields: {
          Active: true,
          Country: country,
          Code: currencyCode,
          CurrencySymbol: currencySymbol,
          Currency: currencyName,
          CurrencyDesc: currencyDesc,
          BuyRate: parseFloat(currencyBuyRate) || 1,
          SellRate: parseFloat(currencySellRate) || 1
        }
      };
    } else {
      objDetails = {
        type: "TCurrency",
        fields: {
          ID: parseInt(currencyid),
          Active: true,
          Country: country,
          Code: currencyCode,
          CurrencySymbol: currencySymbol,
          Currency: currencyName,
          CurrencyDesc: currencyDesc,
          BuyRate: parseFloat(currencyBuyRate) || 1,
          SellRate: parseFloat(currencySellRate) || 1
        }
      };
    }

    taxRateService.saveCurrency(objDetails).then(function (objDetails) {
      sideBarService.getCurrencies().then(function (dataReload) {
        addVS1Data("TCurrency", JSON.stringify(dataReload)).then(function (datareturn) {
          Meteor._reload.reload();
        }).catch(function (err) {
          Meteor._reload.reload();
        });
      }).catch(function (err) {
        Meteor._reload.reload();
      });
    }).catch(function (err) {
      swal({title: "Oooops...", text: err, type: "error", showCancelButton: false, confirmButtonText: "Try Again"}).then(result => {
        if (result.value) {
          Meteor._reload.reload();
        } else if (result.dismiss === "cancel") {}
      });
      LoadingOverlay.hide();
    });
  }, delayTimeAfterSound);
  },
  // "click .btnSaveFrequency": (e) => {
  //   updateAllCurrencies();
  // },

  "click .synbutton": e => {
    updateAllCurrencies();
  },

  "click .edit-currency": (event, ui) => {
    event.preventDefault();
    event.stopPropagation();
    const tr = $(event.currentTarget).parents("tr")[0];
    const id = Number($(tr).attr("id"));

    if (id) {
   
    
        var currencyid = id;
        var country = $(tr).find(".colCountry").text() || "N/A";
        var currencyCode = $(tr).find(".colCode").text() || "N/A";
        var currencySymbol = $(tr).find(".colSymbol").text() || "N/A";
        var currencyName = $(tr).find(".colCurrency").text() || "N/A";
        var currencyDesc = $(tr).find(".colDescription").text() || "N/A";
        var currencyBuyRate = $(tr).find(".colBuyRate").text() || 0;
        var currencySellRate = $(tr).find(".colSellRate").text() || 0;

        $(".btnAddCurrency").trigger('click');

       setTimeout(() => {
        $("#add-currency-title").text("Edit Currency");
        $("#sedtCountry").prop("readonly", true);

        $("#edtCurrencyID").val(currencyid);
        $("#sedtCountry").val(country);
        $("#sedtCountry").attr("readonly", true);
        $("#sedtCountry").attr("disabled", "disabled");
        $("#currencyCode").val(currencyCode);
        $("#currencySymbol").val(currencySymbol);
        
        $("#edtCurrencyName").val(currencyName);
        $("#edtCurrencyDesc").val(currencyDesc);
        $("#edtBuyRate").val(currencyBuyRate);
        $("#edtSellRate").val(currencySellRate);
       }, 100);
    }
  },
  "click .remove-currency": (e, ui) => {
    e.preventDefault();
    e.stopPropagation();
    var targetID = $(e.target).closest("tr").attr("id"); // table row ID
    $("#selectDeleteLineID").val(targetID);
    $("#deleteLineModal").modal("toggle");
  },
});

Template.currenciessettings.helpers({
  currencies: () => {
   
    return Template.instance().currencies.get().sort(function (a, b) {
      if (a.code == "NA") {
        return 1;
      } else if (b.code == "NA") {
        return -1;
      }
      return a.code.toUpperCase() > b.code.toUpperCase()
        ? 1
        : -1;
      // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
    });
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({userid: Session.get("mycloudLogonID"), PrefName: "currencyLists"});
  },
  countryList: () => {
    return Template.instance().countryData.get();
  },
  loggedCompany: () => {
    return localStorage.getItem("mySession") || "";
  }
});

/**
 * This function will update all currencies
 */
export const updateAllCurrencies = (employeeId, 
  onSuccess = async () => {
    const result = await swal({
      title: "Update completed",
      //text: "Do you wish to add an account ?",
      type: "success",
      showCancelButton: false,
      confirmButtonText: "Ok",
    });

    if(result.value) {

    }
  }, 
  onError = async () => {
    const result = await swal({
      title: "Oooops...",
      text: "Couldn't update currencies",
      type: "error", 
      showCancelButton: true, 
      confirmButtonText: "Try Again"
    });

    if (result.value) {
      $('.synbutton').trigger('click');
    } else if (result.dismiss === "cancel") {}
  }) => {
  // let completeCount = 0;
  // let completeCountEnd = 1;
  LoadingOverlay.show();
  // we need to get all currencies and update them all
  const taxRateService = new TaxRateService();
  // taxRateService.getCurrencies().then(data => {
  //   completeCountEnd = data.tcurrency.length;
  //   if (data.tcurrency.length > 0)
  //     data = data.tcurrency;

  //   data.forEach(currencyData => {
  //     updateCurrency(currencyData, () => {
  //       if (completeCount == 0) {
  //         LoadingOverlay.show();
  //       } else if (completeCount == completeCountEnd) {
  //         LoadingOverlay.hide();
  //       }
  //       completeCount++;
  //     });
  //   });
  // });

  // Get all currencies from remote database
  taxRateService.getCurrencies().then(result => {
    /**
     * Db currencies
     */
    let currencies = result.tcurrency;

    // get all rates from xe currency
    FxApi.getAllRates({
      from: defaultCurrencyCode,
      callback: async response => {
        /**
         * List of Xe currencies
         */
        const xeCurrencies = response.to;

        const result = await swal({
          title: "Update in progress",
         // text: "Do you wish to add an account ?",
          type: "success",
          showCancelButton: false,
          confirmButtonText: "Ok",
        });
    
        // if (result.value) {
        // } else if (result.dismiss === "cancel") {
        // }

        currencies.forEach((currency, index) => {
         currencies[index].BuyRate = FxApi.findBuyRate(currency.Code, xeCurrencies);
         currencies[index].SellRate = FxApi.findSellRate(currency.Code, xeCurrencies);
        });

        let formatedList = [];

        currencies.forEach((currency) => {
          formatedList.push({
            type: "TCurrency",
            fields: currency
          });
        });

        // Now we need to save this
        await FxApi.saveCurrencies(formatedList, async (response, error) => {
          if(response) {
            LoadingOverlay.hide();
            await onSuccess();
            $('.btnRefresh').trigger('click');
          } else if(error) {
            LoadingOverlay.hide();
            await onError();

          
          }
        });
      }
    });
  });
};

export const updateCurrency = async (currencyData, callback) => {
  let taxRateService = new TaxRateService();
  let sideBarService = new SideBarService();
  const fxApi = new FxApi();

  /**
     * Step 1: we need to hit the API
     */
  fxApi.getExchangeRate(currencyData.Currency, defaultCurrencyCode, 1).then(rates => {
    currencyData.BuyRate = parseFloat(rates.buy);
    currencyData.SellRate = parseFloat(rates.sell);

    taxRateService.saveCurrency({type: "TCurrency", fields: currencyData}).then(currencyData => {
      sideBarService.getCurrencies().then(dataReload => {
        addVS1Data("TCurrency", JSON.stringify(dataReload)).then(function (datareturn) {
          callback();
          // Meteor._reload.reload();
        }).catch(function (err) {});
      });
    });
  });
};
