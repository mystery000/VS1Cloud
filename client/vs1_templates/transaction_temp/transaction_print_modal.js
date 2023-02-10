// @ts-nocheck
import { SideBarService } from "../../js/sidebar-service";
import { ContactService } from "../../contacts/contact-service";
import LoadingOverlay from "../../LoadingOverlay";
import "jquery-ui-dist/external/jquery/jquery";
import "jquery-ui-dist/jquery-ui";
import "../../lib/global/indexdbstorage.js";
import { SessionContext } from "twilio/lib/rest/proxy/v1/service/session";
import { SMSService } from "../../js/sms-settings-service";
import { template } from "lodash";

import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './transaction_print_modal.html';

let sideBarService = new SideBarService();
let smsService = new SMSService();

const TransactionTypeData = {
  sales: {
    templates: [
      {
        name: "Delivery Docket",
        title: "Delivery Docket",
        key: "delivery_docket",
        active: true,
      },
      {
        name: "Sales Orders",
        title: "Sales Orders",
        key: "sales_order",
        active: true,
      },
    ],
  },
  bills: {
    templates: [
      {
        name: "bill",
        title: "Bills",
        key: "bill",
        active: true,
      },
    ],
  },
  cheques: {
    templates: [
      {
        name: "Cheques",
        title: "Cheques",
        key: "cheque",
        active: true,
      },
    ],
  },
  credits: {
    templates: [
      {
        name: "Credits",
        title: "Credits",
        key: "credit",
        active: true,
      },
    ],
  },
  invoices: {
    templates: [
      {
        name: "Invoices",
        title: "Invoices",
        key: "invoice",
        active: true,
      },
      {
        name: "Invoice Back Orders",
        title: "Invoice Back Orders",
        key: "invoice",
        active: false,
      },
      {
        name: "Delivery Docket",
        title: "Delivery Docket",
        key: "delivery_docket",
        active: true,
      },
    ],
  },
  refunds: {
    templates: [
      {
        name: "Refunds",
        title: "Refunds",
        key: "refund",
        active: true,
      },
    ],
  },
  workorders: {
    templates: [
      {
        name: "Delivery Docket",
        title: "Delivery Docket",
        key: "delivery_docket",
        active: true,
      },
      {
        name: "Sales Orders",
        title: "Sales Orders",
        key: "sales_order",
        active: true,
      },
    ],
  },
  supplierpayments: {
    templates: [
      {
        name: "Supplier Payments",
        title: "Supplier Payments",
        key: "supplier_payment",
        active: true,
      },
    ],
  },
  purchaseorders: {
    templates: [
      {
        name: "Purchase Orders",
        title: "Purchase Orders",
        key: "purchase_order",
        active: true,
      },
    ],
  },
  quotes: {
    templates: [
      {
        name: "Quotes",
        title: "Quotes",
        key: "quote",
        active: true,
      },
    ],
  },
};

Template.transaction_print_modal.onCreated(async function () {
  const templateObject = Template.instance();
  const transactionType = templateObject.data.TransactionType;
  this.smsSettings = new ReactiveVar({
    twilioAccountId: "",
    twilioAccountToken: "",
    twilioTelephoneNumber: "",
    twilioMessagingServiceSid: "MGc1d8e049d83e164a6f206fbe73ce0e2f",
    headerAppointmentSMSMessage: "Sent from [Company Name]",
    startAppointmentSMSMessage:
      "Hi [Customer Name], This is [Employee Name] from [Company Name] just letting you know that we are on site and doing the following service [Product/Service].",
    saveAppointmentSMSMessage:
      "Hi [Customer Name], This is [Employee Name] from [Company Name] confirming that we are booked in to be at [Full Address] at [Booked Time] to do the following service [Product/Service]. Please reply with Yes to confirm this booking or No if you wish to cancel it.",
    stopAppointmentSMSMessage:
      "Hi [Customer Name], This is [Employee Name] from [Company Name] just letting you know that we have finished doing the following service [Product/Service].",
  });

  const getTemplates = async () => {
    const vs1Data = await getVS1Data("TTemplateSettings");
    if (vs1Data.length == 0) {
      const templateInfomation = await sideBarService.getTemplateInformation(
        initialBaseDataLoad,
        0
      );

      addVS1Data("TTemplateSettings", JSON.stringify(templateInfomation));

      const templates = TransactionTypeData[transactionType].templates
        .filter((item) => item.active)
        .map((template) => {
          let templateList = templateInfomation.ttemplatesettings
            .filter((item) => item.fields.SettingName == template.name)
            .sort((a, b) => a.fields.Template - b.fields.Template);

          templateList = ["1", "2", "3"].map((item) => ({
            fields: {
              SettingName: template.name,
              Template: item,
              Description: `Template ${item}`,
            },
            type: "TTemplateSettings",
          }));
          return {
            templateName: template.name,
            templateList,
          };
        });

      return templates;
    } else {
      const vs1DataList = JSON.parse(vs1Data[0].data);
      const templates = TransactionTypeData[transactionType].templates
        .filter((item) => item.active)
        .map((template) => {
          let templateList = vs1DataList.ttemplatesettings
            .filter((item) => item.fields.SettingName == template.name)
            .sort((a, b) => a.fields.Template - b.fields.Template);

          if (templateList.length === 0) {
            templateList = ["1", "2", "3"].map((item) => ({
              fields: {
                SettingName: template.name,
                Template: item,
                Description: `Template ${item}`,
              },
              type: "TTemplateSettings",
            }));
          }
          return {
            templateName: template.name,
            templateList,
          };
        });

      return templates;
    }
  };

  const getSMSSettings = async () => {
    
    const smsSettings = this.smsSettings.get()

    const smsServiceSettings = await smsService.getSMSSettings();
    if (smsServiceSettings.terppreference.length > 0) {
      for (let i = 0; i < smsServiceSettings.terppreference.length; i++) {
        switch (smsServiceSettings.terppreference[i].PrefName) {
          case "VS1SMSID":
            smsSettings.twilioAccountId =
              smsServiceSettings.terppreference[i].Fieldvalue;
            break;
          case "VS1SMSToken":
            smsSettings.twilioAccountToken =
              smsServiceSettings.terppreference[i].Fieldvalue;
            break;
          case "VS1SMSPhone":
            smsSettings.twilioTelephoneNumber =
              smsServiceSettings.terppreference[i].Fieldvalue;
            break;
          case "VS1HEADERSMSMSG":
            smsSettings.headerAppointmentSMSMessage =
              smsServiceSettings.terppreference[i].Fieldvalue;
            break;
          case "VS1SAVESMSMSG":
            smsSettings.saveAppointmentSMSMessage =
              smsServiceSettings.terppreference[i].Fieldvalue;
            break;
          case "VS1STARTSMSMSG":
            smsSettings.startAppointmentSMSMessage =
              smsServiceSettings.terppreference[i].Fieldvalue;
            break;
          case "VS1STOPSMSMSG":
            smsSettings.stopAppointmentSMSMessage =
              smsServiceSettings.terppreference[i].Fieldvalue;
        }
      }
    }

    this.smsSettings.set(smsSettings);
  }

  const templates = await getTemplates();
  this.templates = new ReactiveVar(templates);
  getSMSSettings();
});

Template.transaction_print_modal.onRendered(function () {
  const templateObject = Template.instance();
  const transactionType = templateObject.data.TransactionType;

  $("#printModal").on("show.bs.modal", function (e) {
    $("#printModal").css("z-index", 1048);
    const templates = templateObject.templates.get();
    templates.forEach((templateType) => {
      templateType.templateList.forEach((template) => {
        const templateKey = TransactionTypeData[transactionType].templates.find(
          (transation) => transation.name === template.fields.SettingName
        ).key;
        if (template.fields.Active) {
          $(`#${templateKey}_${template.fields.Template}`).prop(
            "checked",
            true
          );
        }
      });
    });
  });
  $(".chooseTemplateModal").on("show.bs.modal", function (e) {
    // $(".chooseTemplateModal").css("z-index", 1047);
    $("#templatePreviewModal").css("z-index", 1050);
  });
  $("#templatePreviewModal").on("show.bs.modal", function (e) {
    $(".chooseTemplateModal").css("z-index", 1049);
  });
});

Template.transaction_print_modal.helpers({
  printTypeTemplates: () => {
    return Template.instance().templates
      ? Template.instance().templates.get()
      : null;
  },
  isChecked: (status) => {
    return status ? { checked: "checked" } : null;
  },
  getTemplate: (TransactionType, templateName) => {
    return TransactionTypeData[TransactionType].templates.find(
      (template) => template.name === templateName
    );
  },
  getTemplateTitle: (TransactionType, templateName) => {
    return TransactionTypeData[TransactionType].templates.find(
      (template) => template.name === templateName
    ).title;
  },
  getTemplateKey: (TransactionType, templateName) => {
    return TransactionTypeData[TransactionType].templates.find(
      (template) => template.name === templateName
    ).key;
  },
  chooseTemplateHandle: (event, key) => {
  },
});

Template.transaction_print_modal.events({
  "click #deliveryDocket": function (event) {
    const checked = event.currentTarget.checked;
  },
  "click #emailSend": function (event) {
    $('.chkEmailCopy').prop("checked", $("#emailSend").is(":checked"));
  },
  "click #printModal .printConfirm": async function (event) {
    LoadingOverlay.show();
    const templateObject = Template.instance();
    const transactionType = templateObject.data.TransactionType;
    const isCheckedEmail = $("#printModal #emailSend").is(":checked");
    const isCheckedSms = $("#printModal #sms").is(":checked");
    const customerElId = $("#customer_id").val();
    const customerId = $("#__customer_id").val();

    const contactService = new ContactService();

    const customData = await getVS1Data("TCustomerVS1");
    let contactServiceData = null;
    if(customerId){
      contactServiceData = await contactService.getOneCustomerDataEx(
        customerId
      );
    }

    console.log("Customer DATA:", contactServiceData);
    
    // if (customerId) {
    //   if (customData.length === 0) {
    //     contactServiceData = await contactService.getOneCustomerDataEx(
    //       customerId
    //     );
    //   } else {
    //     const data = JSON.parse(customData[0].data);
    //     contactServiceData = data.tcustomervs1.find(
    //       (customer) => parseInt(customer.fields.ID) === parseInt(customerId)
    //     );
    //   }
    // }

    // const data = await Template.new_salesorder.__helpers
    //   .get("saleOrder")
    //   .call();

    // Send Email with attachments
    // if (isCheckedEmail && validateEmail(data.checkEmailData)) {
    if (isCheckedEmail) {
      // $(".btnSave").trigger("click");
      // Meteor.call(
      //   "sendEmail",
      //   {
      //     from: "" + data.mailFromName + " <" + data.mailFrom + ">",
      //     to: data.checkEmailData,
      //     subject: data.mailSubject,
      //     text: "",
      //     html: data.htmlmailBody,
      //     attachments: data.attachment,
      //   },
      //   function (error, result) {
      //     if (error && error.error === "error") {
      //       if (FlowRouter.current().queryParams.trans) {
      //         // FlowRouter.go(
      //         //   "/customerscard?id=" +
      //         //     FlowRouter.current().queryParams.trans +
      //         //     "&transTab=active"
      //         // );
      //       } else {
      //         // FlowRouter.go("/salesorderslist?success=true");
      //       }
      //     } else {
      //     }
      //     LoadingOverlay.hide();
      //   }
      // );
    }
    // Send SMS
    if (isCheckedSms && contactServiceData) {
      const phoneNumber = contactServiceData.fields.Mobile;
      if (phoneNumber == '' || phoneNumber == null) {
        LoadingOverlay.hide();
        swal({
          title: "Oops...",
          text: "Customer does not have phone number!",
          type: "error",
          showCancelButton: false,
          confirmButtonText: "Try again",
        });

        return;
      }
      // const phoneNumber = "+13374761311";
      // Send SMS function here!

      const companyName = Session.get("vs1companyName");
      const smsSettings = templateObject.smsSettings.get();
      let message = smsSettings.headerAppointmentSMSMessage.replace(
        "[Company Name]",
        companyName
      );

      message = `${message} - Hi ${contactServiceData?.fields?.FirstName} ${contactServiceData?.fields?.LastName}`;

      if (phoneNumber) {
        Meteor.call(
          "sendSMS",
          smsSettings.twilioAccountId,
          smsSettings.twilioAccountToken,
          smsSettings.twilioTelephoneNumber,
          phoneNumber,
          message,
          function (error, result) {
            LoadingOverlay.hide();
            if (error) {
              swal({
                title: "Oops...",
                text: message,
                type: "error",
                showCancelButton: false,
                confirmButtonText: "Try again",
              });
            } else {
              swal({
                title: "SMS was sent successfully",
                text: "SMS was sent successfully",
                type: "success",
                showCancelButton: false,
                confirmButtonText: "Ok",
              });
              localStorage.setItem("smsId", result.sid);
            }
          }
        );
      }
    } else if ( isCheckedSms && !contactServiceData){
      LoadingOverlay.hide();
      swal({
        title: "Oops...",
        text: "We can not get Customer data to send SMS!",
        type: "error",
        showCancelButton: false,
        confirmButtonText: "Try again",
      });
    }
    LoadingOverlay.hide();
  },
  "click #printModal .chooseTemplateBtn": function (event, key, param) {
    const dataKey = $(event.target).attr("data-id");
    if ($(event.target).is(":checked")) {
      // $(`#${dataKey}-modal`).css("z-index", 1049);
      $(`#${dataKey}-modal`).modal("show");
    } else {
      $(`#${dataKey}-modal`).modal("hide");
    }
  },
  "click #printModal .btnPreview": function (event) {
    // const templateObject = Template.instance();
    // const transactionType = templateObject.data.TransactionType;
    // const component = templateObject.parent().parent();
    // const chooseTemplateCheckboxes = $("#printModal .chooseTemplateBtn:checked");
    // const chosenTemplates = [];
    // chooseTemplateCheckboxes.each((item) => {
    //   chosenTemplates.push(`#${$(chooseTemplateCheckboxes[item]).attr("data-id")}-modal .chkGlobalSettings:checked`)
    // })
    // component.generateInvoiceData('Sales Orders', '3')
  },
});
