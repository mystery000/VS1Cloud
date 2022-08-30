import { ReactiveVar } from "meteor/reactive-var";
// import { isNumber } from "underscore";
import { Random } from "meteor/random";


Template.eftExportModal.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.eftOptionsList = new ReactiveVar([]);
  templateObject.accountTypes = new ReactiveVar([]);
  templateObject.transactionDescriptions = new ReactiveVar([]);
  templateObject.bankNames = new ReactiveVar([]);
  templateObject.eftRowId = new ReactiveVar(null);
});

Template.eftExportModal.onRendered(function () {
  let templateObject = Template.instance();

  // tempcode
  templateObject.eftRowId.set(Random.id());

  templateObject.transactionDescriptions.set([
    {
      value: 'payroll',
      label: 'Payroll'
    }, {
      value: 'supplier',
      label: 'Supplier'
    }, {
      value: 'insurance',
      label: 'Insurance'
    }
  ]);

  templateObject.bankNames.set([
    {
      value: 'None',
      label: ''
    }
  ]);

  setTimeout(() => {
    $(".eftProcessingDate").datepicker({
      showOn: "button",
      buttonText: "Show Date",
      buttonImageOnly: true,
      buttonImage: "/img/imgCal2.png",
      constrainInput: false,
      dateFormat: "yy/mm/dd",
      showOtherMonths: true,
      selectOtherMonths: true,
      changeMonth: true,
      changeYear: true,
      yearRange: "-90:+10",
      onSelect: function (dateText, inst) {
        // $(".lblAddTaskSchedule").html(moment(dateText).format("YYYY-MM-DD"));
      },
    });
  }, 100);

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

  "click .addNewEftRow": (e) => {
    e.preventDefault();
    let tokenid = Random.id();

    let transactionCodes = `
      <select class="form-control pointer sltTranslactionCode">
        <option value=""></option> 
        <option value="">Debit Items</option> 
        <option value="">Credit Items</option> 
      </select>
    `;
    $('#eftExportTableBody').append(`
      <tr id="${tokenid}">
        <td class="colApply">
          <input type="checkbox" class="isApply" />
        </td>
        <td class="colAccountName">
          <input type="text" class="form-control eftInput eftInputAccountName" />
        </td>
        <td class="colBsb">
          <input type="text" class="form-control eftInput eftInputBsb" placeholder="___-___" />
        </td>
        <td class="colAccountNo">
          <input type="text" class="form-control eftInput eftInputAccountNo" />
        </td>
        <td class="colTransactionCode">
          ${transactionCodes}
        </td>
        <td class="colLodgement">
          <input type="text" class="form-control eftInput eftInputTransactionCode" />
        </td>
        <td class="colAmount">
          <input type="text" class="form-control eftInput eftInputAmount text-right" />
        </td>
        <td class="colFromBsb">
          <input type="text" class="form-control eftInput eftInputFromBsb" placeholder="___-___" />
        </td>
        <td class="colFromAccountNo">
          <input type="text" class="form-control eftInput eftInputFromAccountNo" />
        </td>
        <td class="colIdx addNewRow" style="width: 25px">
          <span class="table-remove btnEftRemove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>
        </td>
      </tr> 
    `);
  },


  "click .btnEftRemove": function (event) {

    try {

      var targetID = $(event.target).closest("tr").attr("id");
      $(event.target).closest("tr").remove();
      $("#eftExportTable #" + targetID).remove();
    } catch (error) {

    }

  },

  "keypress .eftInputAmount": (e) => {
    if (e.which === 13) {
      // console.log('enter pressed', e.target.value)
    }
  },

  "change .eftInputAmount": function (e) {
    let sum = 0;
    $('.eftInputAmount').each(function () {
      let val = parseFloat($(this).val())
      if (isNaN(val)) {
        $(this).val('');
        val = 0;
      }
      sum += val;
    });
    $('#totalAmount').html(sum.toFixed(2))
  },

  "click .btnDoEftExport": (e) => {
    let sltAccountType = $('#sltAccountType').val();
    let sltBankName = $('#sltBankName').val();
    let eftProcessingDate = $('#eftProcessingDate').val();
    let eftUserName = $('#eftUserName').val();
    let eftNumberUser = $('#eftNumberUser').val();
    let sltTransactionDescription = $('#sltTransactionDescription').val();
    // console.log(sltAccountType, sltBankName, eftProcessingDate, eftUserName, eftNumberUser, sltTransactionDescription)

    if (!sltAccountType) {
      swal("Please input Account Name", "", "error");
      return false;
    } else if (!sltBankName) {
      swal("Please input Bank Name", "", "error");
      return false;
    } else if (!eftProcessingDate) {
      swal("Please input Processing Date", "", "error");
      return false;
    }

    return true;
  }
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

  transactionDescriptions: () => {
    return Template.instance().transactionDescriptions.get();
  },

  eftRowId: () => {
    return Template.instance().eftRowId.get();
  },

});
