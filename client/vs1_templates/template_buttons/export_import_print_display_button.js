import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import './export_import_print_display_button.html';
Template.export_import_print_display_button.inheritsHelpersFrom('non_transactional_list');
Template.export_import_print_display_button.onCreated(function(){

});

Template.export_import_print_display_button.events({
    'click .btnOpenSettings': async function (event, template) {
      let templateObject = Template.instance();
        // var url = FlowRouter.current().path;
        //let tableName = await template.tablename.get()||'';
        let currenttablename = templateObject.data.tablename||"";
        let getTableName = currenttablename||'';
        if(currenttablename != ''){
        // $(`#${getTableName} thead tr th`).each(function (index) {
        //   var $tblrow = $(this);
        //   var colWidth = $tblrow.width() || 0;
        //   var colthClass = $tblrow.attr('data-class') || "";
        //   $('.rngRange' + colthClass).val(colWidth);
        // });
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
      //event.preventDefault();
      //event.stopPropagation();
      let templateObject = Template.instance();
      let tablename = templateObject.data.tablename || '';
      if(tablename != '') {
        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#' + tablename + '_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display','none');
      }
    }
});

Template.export_import_print_display_button.helpers({

});
