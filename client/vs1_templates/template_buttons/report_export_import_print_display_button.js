import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import './report_export_import_print_display_button.html';
Template.report_export_import_print_display_button.inheritsHelpersFrom('non_transactional_list');
Template.report_export_import_print_display_button.onCreated(function(){

});

Template.report_export_import_print_display_button.events({
    'click .btnOpenSettings': async function (event, template) {
      let templateObject = Template.instance();
        // var url = FlowRouter.current().path;
        //let tableName = await template.tablename.get()||'';
        let currenttablename = templateObject.data.tablename||"";
        let getTableName = currenttablename||'';
        if(currenttablename != ''){
        $(`#${getTableName} thead tr th`).each(function (index) {
          var $tblrow = $(this);
          var colWidth = $tblrow.width() || 0;
          var colthClass = $tblrow.attr('data-class') || "";
          $('.rngRange' + colthClass).val(colWidth);
        });
       $('.'+getTableName+'_Modal').modal('toggle');
      }
    },
    'click .btnImportModal': async function (event, template) {
       $('.importTemplateModal').modal('toggle');
    },

    'click .exportbtn': function(event) {
      let templateObject = Template.instance();
      //event.preventDefault();
      //event.stopPropagation();
      if(templateObject.data.tablename) {
        let tablename = templateObject.data.tablename;
        $('.fullScreenSpin').css('display','inline-block');
        // jQuery('#'+tablename+'_wrapper .dt-buttons .btntabletocsv').trigger('click');
        jQuery('#'+tablename+'_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display','none');
      }
    },

    'click .printConfirm': function(event) {
        let templateObject = Template.instance();
        playPrintAudio();
        setTimeout(function () {
            $(".dataTables_length").hide();
            $(".dataTables_info").hide();
            $(".dataTables_paginate").hide();


            $("a").attr("href", "/");
            document.title = templateObject.data.tablename;
            $(".printReport").print({
                title: document.title + ` | ${templateObject.data.tablename} | ` + loggedCompany,
                noPrintSelector: ".addSummaryEditor",
                mediaPrint: false,
            });

            setTimeout(function () {
                $(".dataTables_length").show();
                $(".dataTables_info").show();
                $(".dataTables_paginate").show();
                $("a").attr("href", "#");
            }, 100);
        }, delayTimeAfterSound);
    }
});

Template.report_export_import_print_display_button.helpers({

});
