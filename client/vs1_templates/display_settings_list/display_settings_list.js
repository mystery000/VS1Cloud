import { ReactiveVar } from 'meteor/reactive-var';
Template.display_settings_list.inheritsHelpersFrom('non_transactional_list');
// Template.display_settings_list.inheritsEventsFrom('non_transactional_list');
// Template.display_settings_list.inheritsHooksFrom('non_transactional_list');
Template.display_settings_list.onCreated(function(){

});

Template.display_settings_list.events({
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
        };

        let getTableName = currenttablename||'';
        $(`#${getTableName} thead tr th`).each(function (index) {
          var $tblrow = $(this);
          var colWidth = $tblrow.width() || 0;
          var colthClass = $tblrow.attr('data-class') || "";
          $('.rngRange' + colthClass).val(colWidth);
        });
       $('.'+getTableName+'_Modal').modal('toggle');
    }
});

Template.display_settings_list.helpers({

});
