import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import { TaxRateService } from "../settings-service";
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
Template.subTaxesSettings.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.subTaxesSettings.onRendered(function () {
  // $('.fullScreenSpin').css('display', 'inline-block');
  let templateObject = Template.instance();
  let taxRateService = new TaxRateService();
  const dataTableList = [];
  const tableHeaderList = [];

  templateObject.getSubTaxes = function () {
    getVS1Data('TSubTaxVS1').then(function (dataObject) {
      if (dataObject.length == 0) {
        taxRateService.getSubTaxVS1().then(function (data) {
          for (let i = 0; i < data.tsubtaxvs1.length; i++) {
            var dataList = {
              id: data.tsubtaxvs1[i].Id || '',
              codename: data.tsubtaxvs1[i].CodeName || '-',
              description: data.tsubtaxvs1[i].Description || '-',
              category: data.tsubtaxvs1[i].Category || '-'
            };

            dataTableList.push(dataList);
          }

          templateObject.datatablerecords.set(dataTableList);

          if (templateObject.datatablerecords.get()) {
            Meteor.call(
              "readPrefMethod",
              Session.get("mycloudLogonID"),
              "subTaxList",
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
            $("#subTaxList")
              .DataTable({
                columnDefs: [
                  { type: "date", targets: 0 },
                  { orderable: false, targets: -1 },
                ],
                sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [
                  {
                    extend: 'excelHtml5',
                    text: '',
                    download: 'open',
                    className: "btntabletocsv hiddenColumn",
                    filename: "taxratelist_" + moment().format(),
                    orientation: 'portrait',
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
                    // bStateSave: true,
                    // rowId: 0,
                    // pageLength: 25,
                    paging: false,
                    //                      "scrollY": "400px",
                    //                      "scrollCollapse": true,
                    info: true,
                    responsive: true,
                    "order": [[0, "asc"]],
                    action: function () {
                      $('#subTaxList').DataTable().ajax.reload();
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
                  $("#subTaxList").DataTable().ajax.reload();
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
                let draftRecord = templateObject.datatablerecords.get();
                templateObject.datatablerecords.set(draftRecord);
              })
              .on("column-reorder", function () { })
              .on("length.dt", function (e, settings, len) {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
              });

            $(".fullScreenSpin").css("display", "none");
          }, 0);

          var columns = $("#subTaxList th");
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
          $('div.dataTables_filter input').addClass('form-control form-control-sm');

        }).catch(function (err) {
          $(".fullScreenSpin").css("display", "none");
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.ttaxcodevs1;
        for (let i = 0; i < useData.length; i++) {
          var dataList = {
            id: useData[i].Id || '',
            codename: useData[i].CodeName || '-',
            description: useData[i].Description || '-',
            category: useData[i].Category || '-'
          };

          dataTableList.push(dataList);
        }

        templateObject.datatablerecords.set(dataTableList);

        if (templateObject.datatablerecords.get()) {

          Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'subTaxList', function (error, result) {
            if (error) {

            } else {
              if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                  let hiddenColumn = customcolumn[i].hidden;
                  let columnClass = columHeaderUpdate.split('.')[1];
                  let columnWidth = customcolumn[i].width;
                  let columnindex = customcolumn[i].index + 1;

                  if (hiddenColumn == true) {

                    $("." + columnClass + "").addClass('hiddenColumn');
                    $("." + columnClass + "").removeClass('showColumn');
                  } else if (hiddenColumn == false) {
                    $("." + columnClass + "").removeClass('hiddenColumn');
                    $("." + columnClass + "").addClass('showColumn');
                  }

                }
              }

            }
          });


          setTimeout(function () {
            MakeNegative();
          }, 100);
        }

        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function () {
          $('#subTaxList').DataTable({
            columnDefs: [
              { type: 'date', targets: 0 },
              { "orderable": false, "targets": -1 }
            ],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [
              {
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "taxratelist_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                  columns: ':visible'
                }
              }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Tax Rate List',
                filename: "taxratelist_" + moment().format(),
                exportOptions: {
                  columns: ':visible'
                }
              }],
            select: true,
            destroy: true,
            // colReorder: true,
            colReorder: {
              fixedColumnsRight: 1
            },
            // bStateSave: true,
            // rowId: 0,
            // pageLength: 25,
            paging: false,
            //          "scrollY": "400px",
            //          "scrollCollapse": true,
            info: true,
            responsive: true,
            "order": [[0, "asc"]],
            action: function () {
              $('#subTaxList').DataTable().ajax.reload();
            },
            "fnDrawCallback": function (oSettings) {
              setTimeout(function () {
                MakeNegative();
              }, 100);
            },

          }).on('page', function () {
            setTimeout(function () {
              MakeNegative();
            }, 100);
            let draftRecord = templateObject.datatablerecords.get();
            templateObject.datatablerecords.set(draftRecord);
          }).on('column-reorder', function () {

          }).on('length.dt', function (e, settings, len) {
            setTimeout(function () {
              MakeNegative();
            }, 100);
          });

          // $('#subTaxList').DataTable().column( 0 ).visible( true );
          $('.fullScreenSpin').css('display', 'none');
        }, 0);

        var columns = $('#subTaxList th');
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
          if ((v.className.includes("hiddenColumn"))) {
            columVisible = false;
          }
          sWidth = v.style.width.replace('px', "");

          let datatablerecordObj = {
            sTitle: v.innerText || '',
            sWidth: sWidth || '',
            sIndex: v.cellIndex || '',
            sVisible: columVisible || false,
            sClass: v.className || ''
          };
          tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
        $('div.dataTables_filter input').addClass('form-control form-control-sm');

      }
    }).catch(function (err) {
      taxRateService.getSubTaxVS1().then(function (data) {
        for (let i = 0; i < data.tsubtaxvs1.length; i++) {
          var dataList = {
            id: data.tsubtaxvs1[i].Id || '',
            codename: data.tsubtaxvs1[i].CodeName || '-',
            description: data.tsubtaxvs1[i].Description || '-',
            region: data.tsubtaxvs1[i].Category || '-'
          };

          dataTableList.push(dataList);
        }

        templateObject.datatablerecords.set(dataTableList);

        if (templateObject.datatablerecords.get()) {

          Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'subTaxList', function (error, result) {
            if (error) {

            } else {
              if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                  let customcolumn = result.customFields;
                  let columData = customcolumn[i].label;
                  let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                  let hiddenColumn = customcolumn[i].hidden;
                  let columnClass = columHeaderUpdate.split('.')[1];
                  let columnWidth = customcolumn[i].width;
                  let columnindex = customcolumn[i].index + 1;

                  if (hiddenColumn == true) {

                    $("." + columnClass + "").addClass('hiddenColumn');
                    $("." + columnClass + "").removeClass('showColumn');
                  } else if (hiddenColumn == false) {
                    $("." + columnClass + "").removeClass('hiddenColumn');
                    $("." + columnClass + "").addClass('showColumn');
                  }

                }
              }

            }
          });


          setTimeout(function () {
            MakeNegative();
          }, 100);
        }

        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function () {
          $('#subTaxList').DataTable({
            columnDefs: [
              { type: 'date', targets: 0 },
              { "orderable": false, "targets": -1 }
            ],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [
              {
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "taxratelist_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                  columns: ':visible'
                }
              }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Tax Rate List',
                filename: "taxratelist_" + moment().format(),
                exportOptions: {
                  columns: ':visible'
                }
              }],
            select: true,
            destroy: true,
            // colReorder: true,
            colReorder: {
              fixedColumnsRight: 1
            },
            // bStateSave: true,
            // rowId: 0,
            // pageLength: 25,
            paging: false,
            //                    "scrollY": "400px",
            //                    "scrollCollapse": true,
            info: true,
            responsive: true,
            "order": [[0, "asc"]],
            action: function () {
              $('#subTaxList').DataTable().ajax.reload();
            },
            "fnDrawCallback": function (oSettings) {
              setTimeout(function () {
                MakeNegative();
              }, 100);
            },

          }).on('page', function () {
            setTimeout(function () {
              MakeNegative();
            }, 100);
            let draftRecord = templateObject.datatablerecords.get();
            templateObject.datatablerecords.set(draftRecord);
          }).on('column-reorder', function () {

          }).on('length.dt', function (e, settings, len) {
            setTimeout(function () {
              MakeNegative();
            }, 100);
          });

          // $('#subTaxList').DataTable().column( 0 ).visible( true );
          $('.fullScreenSpin').css('display', 'none');
        }, 0);

        var columns = $('#subTaxList th');
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
          if ((v.className.includes("hiddenColumn"))) {
            columVisible = false;
          }
          sWidth = v.style.width.replace('px', "");

          let datatablerecordObj = {
            sTitle: v.innerText || '',
            sWidth: sWidth || '',
            sIndex: v.cellIndex || '',
            sVisible: columVisible || false,
            sClass: v.className || ''
          };
          tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
        $('div.dataTables_filter input').addClass('form-control form-control-sm');

      }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
      });
    });

  }
});


Template.subTaxesSettings.events({
  'click #btnNewInvoice': function (event) {
    // FlowRouter.go('/invoicecard');
  },
  'click .chkDatatable': function (event) {
    var columns = $('#subTaxList th');
    let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

    $.each(columns, function (i, v) {
      let className = v.classList;
      let replaceClass = className[1];

      if (v.innerText == columnDataValue) {
        if ($(event.target).is(':checked')) {
          $("." + replaceClass + "").css('display', 'table-cell');
          $("." + replaceClass + "").css('padding', '.75rem');
          $("." + replaceClass + "").css('vertical-align', 'top');
        } else {
          $("." + replaceClass + "").css('display', 'none');
        }
      }
    });
  },
  'click .resetTable': function (event) {
    var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'subTaxList' });
        if (checkPrefDetails) {
          CloudPreference.remove({ _id: checkPrefDetails._id }, function (err, idTag) {
            if (err) {

            } else {
              Meteor._reload.reload();
            }
          });

        }
      }
    }
  },
  'click .saveTable': function (event) {
    let lineItems = [];
    $('.columnSettings').each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumn").text() || '';
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
      var colHidden = false;
      if ($tblrow.find(".custom-control-input").is(':checked')) {
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
      }

      lineItems.push(lineItemObj);
    });

    var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'subTaxList' });
        if (checkPrefDetails) {
          CloudPreference.update({ _id: checkPrefDetails._id }, {
            $set: {
              userid: clientID, username: clientUsername, useremail: clientEmail,
              PrefGroup: 'salesform', PrefName: 'subTaxList', published: true,
              customFields: lineItems,
              updatedAt: new Date()
            }
          }, function (err, idTag) {
            if (err) {
              $('#myModal2').modal('toggle');
            } else {
              $('#myModal2').modal('toggle');
            }
          });

        } else {
          CloudPreference.insert({
            userid: clientID, username: clientUsername, useremail: clientEmail,
            PrefGroup: 'salesform', PrefName: 'subTaxList', published: true,
            customFields: lineItems,
            createdAt: new Date()
          }, function (err, idTag) {
            if (err) {
              $('#myModal2').modal('toggle');
            } else {
              $('#myModal2').modal('toggle');

            }
          });
        }
      }
    }

  },
  'blur .divcolumn': function (event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
    var datable = $('#subTaxList').DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);

  },
  'change .rngRange': function (event) {
    let range = $(event.target).val();
    $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

    let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
    let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    var datable = $('#subTaxList th');
    $.each(datable, function (i, v) {

      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css('width', range + 'px');

      }
    });

  },
  'click .btnOpenSettings': function (event) {
    let templateObject = Template.instance();
    var columns = $('#subTaxList th');

    const tableHeaderList = [];
    let sWidth = "";
    let columVisible = false;
    $.each(columns, function (i, v) {
      if (v.hidden == false) {
        columVisible = true;
      }
      if ((v.className.includes("hiddenColumn"))) {
        columVisible = false;
      }
      sWidth = v.style.width.replace('px', "");

      let datatablerecordObj = {
        sTitle: v.innerText || '',
        sWidth: sWidth || '',
        sIndex: v.cellIndex || '',
        sVisible: columVisible || false,
        sClass: v.className || ''
      };
      tableHeaderList.push(datatablerecordObj);
    });
    templateObject.tableheaderrecords.set(tableHeaderList);
  },
  'click .btnRefresh': function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    sideBarService.getTaxRateVS1().then(function (dataReload) {
      addVS1Data('TTaxcodeVS1', JSON.stringify(dataReload)).then(function (datareturn) {
        location.reload(true);
      }).catch(function (err) {
        location.reload(true);
      });
    }).catch(function (err) {
      location.reload(true);
    });
  },
  'click .btnSaveSubTax': function () {
    $('.fullScreenSpin').css('display', 'inline-block');
  },
  'click .btnAddSubTax': function () {
    $('#add-tax-title').text('Add New Sub Tax');
    $('#edtTaxID').val('');
    $('#edtTaxCode').val('');
    $('#edtTaxCode').prop('readonly', false);
    $('#edtTaxDesc').val('');
  },
  'click .btnDeleteSubTax': function () {
    // add actions
  },
  'click .btnBack': function (event) {
    event.preventDefault();
    history.back(1);
  }
});

Template.subTaxesSettings.helpers({
  datatablerecords: () => {
    return Template.instance().datatablerecords.get().sort(function (a, b) {
      if (a.codename == 'NA') {
        return 1;
      }
      else if (b.codename == 'NA') {
        return -1;
      }
      return (a.codename.toUpperCase() > b.codename.toUpperCase()) ? 1 : -1;
    });
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
});

Template.registerHelper('equals', function (a, b) {
  return a === b;
});
