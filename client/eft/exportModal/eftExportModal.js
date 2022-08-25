import { ReactiveVar } from "meteor/reactive-var";


Template.eftExportModal.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.eftOptionsList = new ReactiveVar([]);
  templateObject.accountTypes = new ReactiveVar([]);
});

Template.eftExportModal.onRendered(function () {
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

});

Template.eftExportModal.events({

  "click .btnOptionsEft": () => {
    $('#eftOptionsModal').modal();
  },

  "click .btnSelectAllEft": () => {
    $('.isApply').prop('checked', true);
  },

  "click .btnCancelEftExport": (e) => {
    $('#eftExportModal').modal('hide');
  },

  "click .addNewRow": (e) => {
    e.preventDefault();
    $('#eftExportTableBody').append(`
      <tr>
        <td class="colIdx" style="width: 2%;">
        </td>
        <td class="colApply">
          <input type="checkbox" class="isApply" />
        </td>
        <td class="colAccountName">
          <input type="text" class="form-control eftInput" />
        </td>
        <td class="colBsb">
          <input type="text" class="form-control eftInput" value="-" />
        </td>
        <td class="colAccountNo">
          <input type="text" class="form-control eftInput" />
        </td>
        <td class="colTransactionCode">
          <input type="text" class="form-control eftInput" />
        </td>
        <td class="colLodgement">
          <input type="text" class="form-control eftInput" />
        </td>
        <td class="colAmount">
          <input type="text" class="form-control eftInput text-right" />
        </td>
        <td class="colFromBsb">
          <input type="text" class="form-control eftInput" value="-" />
        </td>
        <td class="colFromAccountNo">
          <input type="text" class="form-control eftInput" />
        </td>
      </tr> 
    `)
  },

  "click .btnRemoveAll": (e) => {
    e.preventDefault();

    $('#eftExportTableBody').empty();

    $('#eftExportTableBody').append(`
      <tr>
        <td class="colIdx addNewRow" style="width: 2%;">
          <i class="fa fa-plus" aria-hidden="true"></i>
        </td>
        <td class="colApply">
          <input type="checkbox" class="isApply" />
        </td>
        <td class="colAccountName">
          <input type="text" class="form-control eftInput" />
        </td>
        <td class="colBsb">
          <input type="text" class="form-control eftInput" value="-" />
        </td>
        <td class="colAccountNo">
          <input type="text" class="form-control eftInput" />
        </td>
        <td class="colTransactionCode">
          <input type="text" class="form-control eftInput" />
        </td>
        <td class="colLodgement">
          <input type="text" class="form-control eftInput" />
        </td>
        <td class="colAmount">
          <input type="text" class="form-control eftInput text-right" />
        </td>
        <td class="colFromBsb">
          <input type="text" class="form-control eftInput" value="-" />
        </td>
        <td class="colFromAccountNo">
          <input type="text" class="form-control eftInput" />
        </td>
      </tr> 
    `)
  },
});

Template.eftExportModal.helpers({
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
});
