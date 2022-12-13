import { SideBarService } from "../../js/sidebar-service";
import LoadingOverlay from "../../LoadingOverlay";
import "jquery-ui-dist/external/jquery/jquery";
import "jquery-ui-dist/jquery-ui";
import '../../lib/global/indexdbstorage.js';

let sideBarService = new SideBarService();

Template.transaction_print_modal.onCreated(async function () {
  const getTemplates = async () => {
    const vs1Data = await getVS1Data("TTemplateSettings");

    if (vs1Data.length == 0) {
      const templateInfomation = await sideBarService.getTemplateInformation(
        initialBaseDataLoad,
        0
      );
      const templates = templateInfomation
        .filter((item) => item.fields.SettingName == "Sales Orders")
        .sort((a, b) => a.fields.Template - b.fields.Template);
      const deliveryDocket = templateInfomation
        .filter((item) => item.fields.SettingName == "Delivery Docket")
        .sort((a, b) => a.fields.Template - b.fields.Template);
      addVS1Data("TTemplateSettings", JSON.stringify(templateInfomation));
      return { templates, deliveryDocket };
    } else {
      const vs1DataList = JSON.parse(vs1Data[0].data);
      const templates = vs1DataList.ttemplatesettings
        .filter((item) => item.fields.SettingName == "Sales Orders")
        .sort((a, b) => a.fields.Template - b.fields.Template);
      const deliveryDocket = vs1DataList.ttemplatesettings
        .filter((item) => item.fields.SettingName == "Delivery Docket")
        .sort((a, b) => a.fields.Template - b.fields.Template);
      return { templates, deliveryDocket };
    }
  };

  const templates = await getTemplates();
  console.log({ templates });

  this.templates = new ReactiveVar(templates);
});

Template.transaction_print_modal.onRendered(function () {
  const templateObject = Template.instance();
  const templates = templateObject.templates.get();
  $('#printModal').on('show.bs.modal', function (e) {
    templates.templates.forEach(template => {
      if (template.fields.Active) {
        $(`#Template_${template.fields.Template}`).prop('checked', true);
      }
    })
    templates.deliveryDocket.forEach(docket => {
      if (docket.fields.Active) {
        $(`#Delivery_Docket_${docket.fields.Template}`).prop('checked', true);
      }
    })
  })
});

Template.transaction_print_modal.helpers({
  printTemplates: () => {
    return Template.instance().templates
      ? Template.instance().templates.get()
      : null;
  },
  isChecked: (status) => {
    return status ? {checked:"checked"} : null;
  }
});

Template.transaction_print_modal.events({
  "click #deliveryDocket": function (event) {
    const checked = event.currentTarget.checked;
  },
});
