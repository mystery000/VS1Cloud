// import { ContactService } from "../../contacts/contact-service";
// import { ReactiveVar } from 'meteor/reactive-var';
// import { CoreService } from '../../js/core-service';
// import { UtilityService } from "../../utility-service";
// import { TaxRateService } from "../../settings/settings-service.js";
// import XLSX from 'xlsx';
// import { SideBarService } from '../../js/sidebar-service';
// import { ProductService } from '../../product/product-service';
// import { ManufacturingService } from "../../manufacture/manufacturing-service";
// import { CRMService } from "../../crm/crm-service";
// import { ReportService } from "../../reports/report-service";
// import { FixedAssetService } from "../../fixedassets/fixedasset-service";
// import { StockTransferService } from '../../inventory/stockadjust-service';
import '../../lib/global/indexdbstorage.js';
// import TableHandler from '../../js/Table/TableHandler';
import { Template } from 'meteor/templating';
import './vs1___dropdown.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { cloneDeep, reject } from "lodash";
import 'datatables.net';
import 'datatables.net-buttons';
import 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.print';
import 'jszip';

Template.vs1___dropdown.onCreated(function(){
    let templateObject = Template.instance();
    templateObject.edtParam = new ReactiveVar();
    templateObject.targetTemp = new ReactiveVar();
    templateObject.listTemp = new ReactiveVar();
    let keyword = templateObject.data.data
    let idVal = templateObject.data.value
    let email = templateObject.data.email
    let listtemplatename = templateObject.data.list_template_name;
    if(listtemplatename) {
        templateObject.listTemp.set(listtemplatename)
    }
    let obj = {name: keyword, id: idVal, email: email }
    templateObject.edtParam.set(obj);
    let target = templateObject.data.target_template_id;
    templateObject.targetTemp.set(target);
})

Template.vs1___dropdown.onRendered(async function(){
    let templateObject = Template.instance();
    let id= templateObject.data.id;
    let popupid = templateObject.data.modalId;
    
    async function setEditableSelect() {
        $('#'+id).editableSelect();
    }
    await setEditableSelect();
    if(templateObject.data.data) {
        $('#'+id).val(templateObject.data.data);
    }
    if(templateObject.data.email) {
        let label = templateObject.data.label;
        let clientEmailInput = 'edtCustomerEmail';
        if(label == 'Supplier') {
            clientEmailInput = 'edtSupplierEmail';
        }
        let email = templateObject.data.email;
        $('#'+clientEmailInput).val(email)
     
    }
    // $('#'+id).editableSelect().on('click', function(event) {
        $(document).on('click', '#'+id, function(event, li) {
            // event.preventDefault();
            // event.stopPropagation();
            setTimeout(()=>{
                let value = event.target.value;
                if (value.replace(/\s/g, '') == '') {
                // if($(event.target).val() == '') {
                    templateObject.targetTemp.set('')
                    $('#'+popupid).modal('toggle');
                } else {

                    if(templateObject.data.is_editable == true) {
                        let edtModalId = templateObject.data.target_modal_id;
                        $('#'+ edtModalId).modal('toggle');
                    } else {
                        $('#'+popupid).modal('toggle');
                    }
                }
            }, 1000)
        })

    // })
})

Template.vs1___dropdown.helpers({
    edtTemplateParams: () => {
        return Template.instance().edtParam.get();
    },
    targetTemp: () => {
        return Template.instance().targetTemp.get();
    },
    listTemp: ()=>{
        let templateObject = Template.instance();
        let listempname = templateObject.data.list_template_name;
        if(!listempname) {
            if(templateObject.data.label == 'Terms') {
                return Template.termlistpop
            }
        } else {
            return listempname
        }
    }
})


Template.vs1___dropdown.events({
    'click .vs1_dropdown_modal tbody tr': function(event) {
        let templateObject = Template.instance();
        let id = templateObject.data.id;
        let colName = templateObject.data.colNameForValue;
        let modalId = templateObject.data.modalId;
        let label = templateObject.data.label;
        let value = $(event.target).closest('tr').find('.'+colName).text();
        let objectId = $(event.target).closest('tr').find('.colID').text();
        let email = $(event.target).closest('tr').find('.colEmail')?.text();
        templateObject.edtParam.set({name: value, id: objectId, email: email })
        templateObject.targetTemp.set(templateObject.data.target_template_id)
        $('#'+id).val(value)
        if(label == 'Customer' || label == 'Supplier') {
            let address = '';
            let billingAddressField = $('#txabillingAddress');
            if(billingAddressField && billingAddressField.length > 0) {
                let street = $(event.target).closest('tr').find('.colStreetAddress')?.text()
                let city = $(event.target).closest('tr').find('.colCity')?.text()
                let state = $(event.target).closest('tr').find('.colState')?.text()
                let postCode = $(event.target).closest('tr').find('.colZipCode')?.text()
                let country = $(event.target).closest('tr').find('.colCountry')?.text()

                address = value + '\n' + street+" "+ city + '\n'+ state+'\n' + postCode + ' ' + country 
                $(billingAddressField).val(address)
            }
            let clientEmailInput = 'edtCustomerEmail';
            if(label == 'Supplier') {
                clientEmailInput = 'edtSupplierEmail';
            }
            let email = $(event.target).closest('tr').find('.colEmail').text();
            setTimeout(()=>{
                document.getElementById(clientEmailInput).value = email 
            },500)

        } 
        $('#'+modalId).modal('toggle');
    },
})