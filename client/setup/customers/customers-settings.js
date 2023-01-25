import './customers-settings.html';
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import "../../lib/global/indexdbstorage.js";
import LoadingOverlay from "../../LoadingOverlay";
import { UtilityService } from "../../utility-service";
import { ContactService } from "../../contacts/contact-service";

Template.wizard_customers.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.customerList = new ReactiveVar([]);
})

Template.wizard_customers.onRendered(() => {

})

Template.wizard_customers.helpers({})

Template.wizard_customers.events({
  "click #btnNewCustomer"(e) {
    const target = $(e.currentTarget).attr("data-toggle");
    $(target).modal("toggle");
  },
  "click #tblCustomerlist tbody tr"(e){
    const tr = $(e.currentTarget);
    var listData = tr.attr("id");
    var transactiontype = tr.attr("isjob");
    var url = FlowRouter.current().path;
  },
  "click .setup-step-7 .btnRefresh"(e) {
    const templateObject = Template.instance();
    templateObject.loadDefaultCustomer(true);
    $(".modal.show").modal("hide");
  },

  "click .setup-step-7 .templateDownload"(e){
    const templateObject = Template.instance();
    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleCustomers" + ".csv";

    const customers = templateObject.customerList.get();

    rows.push([
      "Company",
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
      "Tax Code"
    ]);

    customers.forEach((customer) => {
      rows.push([
        customer.company,
        customer.firstname,
        customer.lastname,
        customer.phone,
        customer.mobile,
        customer.skype,
        customer.street,
        customer.city,
        customer.state,
        customer.postcode,
        customer.country,
        customer.taxcode,
      ]);
    });
    utilityService.exportToCsv(rows, filename, "csv");
  },
  "click .setup-step-7 .templateDownloadXLSX"(e){
    const templateObject = Template.instance();
    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleCustomers" + ".xls";

    const customers = templateObject.customerList.get();
    rows.push([
      "Company",
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
      "Tax Code"
    ]);

    customers.forEach((customer) => {
      rows.push([
        customer.company,
        customer.firstname,
        customer.lastname,
        customer.phone,
        customer.mobile,
        customer.skype,
        customer.street,
        customer.city,
        customer.state,
        customer.postcode,
        customer.country,
        customer.taxcode,
      ]);
    });
    utilityService.exportToCsv(rows, filename, "xls");
  },
})

Template.registerHelper("equals", function (a, b) {
  return a === b;
});
