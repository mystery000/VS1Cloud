import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
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
  const dataTableList = [];
  const tableHeaderList = [];
});


Template.subTaxesSettings.events({
  'click #btnNewInvoice': function (event) {
    // FlowRouter.go('/invoicecard');
  },
  'click .chkDatatable': function (event) {
    var columns = $('#taxRatesList th');
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
        var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'taxRatesList' });
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
        var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'taxRatesList' });
        if (checkPrefDetails) {
          CloudPreference.update({ _id: checkPrefDetails._id }, {
            $set: {
              userid: clientID, username: clientUsername, useremail: clientEmail,
              PrefGroup: 'salesform', PrefName: 'taxRatesList', published: true,
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
            PrefGroup: 'salesform', PrefName: 'taxRatesList', published: true,
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
    var datable = $('#taxRatesList').DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);

  },
  'change .rngRange': function (event) {
    let range = $(event.target).val();
    $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

    let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
    let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    var datable = $('#taxRatesList th');
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
    var columns = $('#taxRatesList th');

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
