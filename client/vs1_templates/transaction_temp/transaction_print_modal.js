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
        name: "Sales Orders",
        title: "Sales Orders",
        key: "sales_order",
        active: true,
      },
      {
        name: "Delivery Docket",
        title: "Delivery Docket",
        key: "delivery_docket",
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
        name: "Sales Orders",
        title: "Sales Orders",
        key: "sales_order",
        active: true,
      },
      {
        name: "Delivery Docket",
        title: "Delivery Docket",
        key: "delivery_docket",
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
  stocktransfer: {
    templates: [
      {
        name: "Stock Transfer",
        title: "Stock Transfer",
        key: 'stocktransfer',
        active: true
      },
    ],
  },
  stockadjustment: {
    templates: [
      {
        name: "Stock Adjustment",
        title: "Stock Adjustment",
        key: 'stockadjustment',
        active: true
      },
    ],
  }
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
  this.templates = new ReactiveVar([]);


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
              // Alex: add for print options {
              Active: item == "1" ? true : false,
              // @}
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
            .filter((item) => item.fields.SettingName == template.name && item.fields.GlobalRef == template.name)
            .map((item) => ({
              fields: {
                SettingName: item.fields.SettingName,
                Template: item.fields.Template,
                Description: item.fields.Description === "" ? `Template ${item.fields.Template}` : item.fields.Description,
                // Alex: add for print options {
                Active: item.fields.Active,
                // @}
              },
              type: "TTemplateSettings",
            }))
            .sort((a, b) => a.fields.Template - b.fields.Template);

          if (templateList.length === 0) {
            templateList = ["1", "2", "3"].map((item) => ({
              fields: {
                SettingName: template.name,
                Template: item,
                Description: `Template ${item}`,
                // Alex: add for print options {
                Active: item == "1" ? true : false,
                // @}
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
  this.templates.set(templates)
  getSMSSettings();

  this.fnSendSMS = async function(isForced = false){
    const isCheckedSms = $("#printModal #sms").is(":checked");
    const customerId = $("#__customer_id").val();
    const contactService = new ContactService();
    let contactServiceData = null;
    if(isForced){
      LoadingOverlay.show();
    }
    if(customerId){
      contactServiceData = await contactService.getOneCustomerDataEx(
        customerId
      );
    }

    // Send SMS
    if ((isCheckedSms || isForced) && contactServiceData) {
      let phoneNumber = contactServiceData.fields.Mobile;
      // const phoneNumber = "+13374761311"
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
      // phoneNumber = "+13374761311";
      // Send SMS function here!

      // const companyName = Session.get("vs1companyName");
      const customerName = $("#edtCustomerName").val();
      const smsSettings = templateObject.smsSettings.get();
      let message = smsSettings.headerAppointmentSMSMessage.replace(
        "[Company Name]",
        customerName
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
            if (error || !result.success) {
              swal({
                title: "Oops...",
                text: result.message,
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
      swal({
        title: "Oops...",
        text: "We can not get Customer data to send SMS!",
        type: "error",
        showCancelButton: false,
        confirmButtonText: "Try again",
      });
    }
    LoadingOverlay.hide();
  }
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
  "click #printModal #btnSendSMS": function(event) {
    const templateObject = Template.instance();
    templateObject.fnSendSMS(true)
  },
  "click #printModal .printConfirm": async function (event) {
    const checkedPrintOptions = Template.instance().findAll('.chooseTemplateBtn:checked');
    // if(checkedPrintOptions.length == 0){
    //   swal({
    //     title: 'Oooops....',
    //     text: 'You must select one print option at least!',
    //     type: 'error',
    //     showCancelButton: false,
    //     confirmButtonText: 'Cancel'
    //   })
    //   return;
    // }
    const templateObject = Template.instance();
    templateObject.fnSendSMS()

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
  "click #printModal #choosePrintTemplate": function(event) {
    const $selectedPrintOption = $(".chooseTemplateBtn:checked").first()
    const dataKey = $selectedPrintOption.data('id')
    $(`#${dataKey}-modal`).modal("hide");
    $(`#${dataKey}-modal`).modal("show");
    modalDraggable();
  },
  "click #printModal #previewTemplate": function (event) {
    let checkedTemplate = $("#printModal.show .chooseTemplateBtn:checked").first();
    if (checkedTemplate.length > 0) {
      let defaultTemplates = $('.chooseTemplateModal .chkGlobalSettings:checked');
      for (let i = 0; i < defaultTemplates.length; i++) {
        let template_name = defaultTemplates[i].id.substr(0, defaultTemplates[i].id.lastIndexOf('_'));
        if ($(checkedTemplate[0]).data('id') == template_name) {
          let previewButton = $(defaultTemplates[i]).parents('.templateItem').children('.btnPreviewTemplate');
          previewButton.trigger('click');
          break;
        }
      }
    }
  },
  "click .chooseTemplateOk": function(event) {
    let currentModal = $('.chooseTemplateModal.show');
    $('.chooseTemplateModal.show').modal('hide');
    if (currentModal.length > 0) {
      let currentTemplate = currentModal[0].id.split('-')[0];
      let startChecking = false;
      let checkedInputs = $("#printModal.show .chooseTemplateBtn:checked");
      for (let i = 0;i < checkedInputs.length; i++) {
        if ($(checkedInputs[i]).data('id') == currentTemplate) {
          startChecking = true;
          continue;
        }
        if (startChecking && $(checkedInputs[i]).is(':checked')) {
          let nextTemplate = $(checkedInputs[i]).data('id');
          $(`#${nextTemplate}-modal`).modal("hide");
          $(`#${nextTemplate}-modal`).modal("show");
          modalDraggable();
          break;
        }
      }
    }
  },
});
