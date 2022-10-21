Template.display_settings_list.inheritsHelpersFrom('non_transactional_list');
Template.display_settings_list.inheritsEventsFrom('non_transactional_list');
Template.display_settings_list.inheritsHooksFrom('non_transactional_list');

Template.display_settings_list.onCreated(function(){

});

Template.display_settings_list.events({
    'click .btnOpenSettings': async function(event) {
        var url = FlowRouter.current().path;
        let currenttablename = "";
        if (url.includes("/contactoverview")) {
          currenttablename = "tblcontactoverview";
        };
        let templateObject = Template.instance();
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
