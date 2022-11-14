import { ReactiveVar } from 'meteor/reactive-var';
Template.export_import_print_display_button.inheritsHelpersFrom('non_transactional_list');
Template.export_import_print_display_button.onCreated(function(){

});

Template.export_import_print_display_button.events({
    'click .btnOpenSettings': async function (event, template) {

        var url = FlowRouter.current().path;
        //let tableName = await template.tablename.get()||'';
        let currenttablename = "";
        if (url.includes("/contactoverview")) {
          currenttablename = "tblcontactoverview";
        }else if (url.includes("/employeelist")) {
          currenttablename = "tblEmployeelist";
        }else if (url.includes("/accountsoverview")) {
          currenttablename = "tblAccountOverview";
        }else if (url.includes("/clienttypesettings")) {
          currenttablename = "tblClienttypeList";
        }else if (url.includes("/leadstatussettings")) {
          currenttablename = "tblLeadStatusList";
        }else if (url.includes("/departmentSettings")) {
          currenttablename = "tblDepartmentList";
        }else if (url.includes("/paymentmethodSettings")) {
          currenttablename = "tblPaymentMethodList";
        }else if (url.includes("/termsettings")) {
          currenttablename = "tblTermsList";
        }else if (url.includes("/uomSettings")) {
          currenttablename = "tblUOMList";
        }else if (url.includes('/bomlist')) {
          currenttablename = "tblBOMList";
        }else if (url.includes("/supplierlist")) {
          currenttablename = "tblSupplierlist";
        }else if (url.includes("/leadlist")) {
          currenttablename = "tblLeadlist";
        };

        let getTableName = currenttablename||'';
        $(`#${getTableName} thead tr th`).each(function (index) {
          var $tblrow = $(this);
          var colWidth = $tblrow.width() || 0;
          var colthClass = $tblrow.attr('data-class') || "";
          $('.rngRange' + colthClass).val(colWidth);
        });
       $('.'+getTableName+'_Modal').modal('toggle');
    },
    'click .btnImportModal': async function (event, template) {
       $('.importTemplateModal').modal('toggle');
    }
});

Template.export_import_print_display_button.helpers({

});
