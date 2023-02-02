import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import './spreadsheet_link.html';
import { UtilityService } from "../../utility-service";

let utilityService = new UtilityService();

Template.spreadsheet_link.inheritsHelpersFrom('non_transactional_list');
Template.spreadsheet_link.onCreated(function(){

});
Template.spreadsheet_link.events({
    'click .btnSpreadSheetLink': async function (event, template) {
        let templateObject = Template.instance();
        const filename = templateObject.data.templateName + ".xlsx";
        utilityService.exportReportToSpreadSheet("tableExport", filename, "xlsx");
    }
});