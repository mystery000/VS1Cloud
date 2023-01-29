import "../../lib/global/indexdbstorage.js";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Template } from "meteor/templating";
import "./inventorySettings.html";
import _ from "lodash";
import { EditableService } from "../../editable-service";
//

let editableService = new EditableService();

const successSaveCb = () => {
  // LoadingOverlay.hide();
  playSaveAudio();
  swal({
    title: "Inventory Settings Successfully Saved",
    text: "",
    type: "success",
    showCancelButton: false,
    confirmButtonText: "OK",
  });

  if (localStorage.getItem("enteredURL") != null) {
    FlowRouter.go(localStorage.getItem("enteredURL"));
    localStorage.removeItem("enteredURL");
    return;
  }
};

const errorSaveCb = (err) => {
  // LoadingOverlay.hide();
  swal("Something went wrong", "", "error");
};



Template.inventorySettings.onCreated(() => {
  const templateObject = Template.instance();
});

Template.inventorySettings.onRendered(function () {
  const templateObject = Template.instance();
  $(function () {
    $("#salesacount").editableSelect();
    $("#salesacount").editableSelect().on("click.editable-select", editableService.clickSalesAccount);
    $("#salestaxcode").editableSelect();
    $("#salestaxcode").editableSelect().on("click.editable-select", editableService.clickTaxCodeSales);
    $("#cogsaccount").editableSelect();
    $("#cogsaccount").editableSelect().on("click.editable-select", editableService.clickCogsAccount);
    $("#purchasetaxcode").editableSelect();
    $("#purchasetaxcode").editableSelect().on("click.editable-select", editableService.clickTaxCodePurchase);
    $("#inventoryaccount").editableSelect();
    $("#inventoryaccount").editableSelect().on("click.editable-select", editableService.clickInventoryAccount);
    $("#defaultdepartment").editableSelect();
    $("#defaultdepartment").editableSelect().on("click.editable-select", editableService.clickTaxCodeSales);
    $("#defaultuom").editableSelect();
    $("#defaultuom").editableSelect().on("click.editable-select", editableService.clickUomSales);
    getVS1Data("TInventorySettings")
      .then(function (dataObject) {
        if (dataObject.length) {
          let data = JSON.parse(dataObject[0].data).TInventorySettings;
          if (data) {
            $("#salesacount").val(data.salesacount)
            $("#salestaxcode").val(data.salestaxcode)
            $("#cogsaccount").val(data.cogsaccount)
            $("#purchasetaxcode").val(data.purchasetaxcode)
            $("#inventoryaccount").val(data.inventoryaccount)
            $("#defaultdepartment").val(data.defaultdepartment)
            $("#defaultuom").val(data.defaultuom)
            $("#defaultmarkup").val(data.defaultmarkup)
          }
        }
      })
      .catch(function (err) {
        errorSaveCb(err);
      });


    $(document).on("click", "#tblTaxRate tbody tr", function (e) {
      var table = $(this);
      let lineTaxCode = table.find(".taxName").text();
      taxSelected = $("#taxSelected").val();
      if (taxSelected == "sales") {
        $("#salestaxcode").val(lineTaxCode);
      } else if (taxSelected == "purchase") {
        $("#purchasetaxcode").val(lineTaxCode);
      }
      $("#taxRateListModal").modal("toggle");
    });

    $(document).on("click", "#tblAccount tbody tr", function (e) {
      var table = $(this);
      let accountsName = table.find(".productName").text();
      accSelected = $("#accSelected").val();
      if (accSelected == "cogs") {
        $("#cogsaccount").val(accountsName);
      } else if (accSelected == "sales") {
        $("#salesacount").val(accountsName);
      } else if (accSelected == "inventory") {
        $("#inventoryacount").val(accountsName);
      }
      $("#accountListModal").modal("toggle");
    });
  });
});

Template.inventorySettings.events({
  "click #saveCompanyInfo": function (event) {
    // if (tmp.length === 0) {
    //   swal("Please add columns", "", "error");
    // } else if ($("#bankAccountName").val() === "") {
    //   swal("Please select bank account", "", "error");
    // } else {
      let saveData = {
        TInventorySettings: {
          salesacount: $("#salesacount").val(),
          salestaxcode: $("#salestaxcode").val(),
          cogsaccount: $("#cogsaccount").val(),
          purchasetaxcode: $("#purchasetaxcode").val(),
          inventoryaccount: $("#inventoryaccount").val(),
          defaultdepartment: $("#defaultdepartment").val(),
          defaultuom: $("#defaultuom").val(),
          defaultmarkup: $("#defaultmarkup").val(),
        },
      };
      addVS1Data("TInventorySettings", JSON.stringify(saveData))
      .then(function (datareturn) {
        successSaveCb();
      })
      .catch(function (err) {
        errorSaveCb(err);
      });
    // }
  },
  "click .btnBack": function (event) {
    playCancelAudio();
    event.preventDefault();
    setTimeout(function () {
      history.back(1);
    }, delayTimeAfterSound);
    //FlowRouter.go('/settings');
    //window.open('/invoicelist','_self');
  },
});

Template.inventorySettings.helpers({});
