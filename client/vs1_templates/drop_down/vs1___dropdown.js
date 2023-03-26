
import '../../lib/global/indexdbstorage.js';
import { Template } from 'meteor/templating';
import './vs1___dropdown.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { cloneDeep } from "lodash";
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
    templateObject.targetEle = new ReactiveVar();
    
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
        // $('#'+id).editableSelect();
        $('.'+id).each(function(i, obj) {
            $(obj).editableSelect();
        })
    }
    await setEditableSelect();
    setTimeout(()=>{
        if(templateObject.data.data) {
            $('#'+id+"[custid='"+templateObject.data.custid+"']").val(templateObject.data.data);
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
    }, 1000)
    // $('#'+id).editableSelect().on('click', function(event) {
    $(document).on('click', '#'+id, function(event, li) {
        event.preventDefault();
        event.stopPropagation();
        templateObject.targetEle.set($(event.target));
        var $earch = $(this);
        var offset = $earch.offset();
        // $("#"+popupid).val("");
        let parent = $(event.target).parent();
        let edtModalId = templateObject.data.target_modal_id;
        let popupmodal = $(parent).find("> .vs1_dropdown_modal");
        let edtmodal = $(parent).find('> .'+ edtModalId);
        if (event.pageX > offset.left + $earch.width() - 8) {
            // X button 16px wide?
            templateObject.targetTemp.set('');
            $(popupmodal).modal('show');
            
        } else {
            setTimeout(()=>{
                let value = event.target.value;
                if (value.replace(/\s/g, '') == '') {
                    templateObject.targetTemp.set('');
                    $(popupmodal).modal('show');
                } else {
                    
                    if(templateObject.data.is_editable == true) {
                        
                        let params = templateObject.edtParam.get();
                        if(!params.name || params.name == '' ) {
                            params.name = value;
                        }
                        templateObject.edtParam.set(params)
                        $(edtmodal).modal('show');
                    } else {
                        $(popupmodal).modal('show');
                    }
                }
            }, 1000)
        }
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
        return listempname
    }
})


Template.vs1___dropdown.events({
    'click .vs1_dropdown_modal tbody tr': function(event) {
        let templateObject = Template.instance();
        let id = templateObject.data.id;
        let colName = templateObject.data.colNameForValue;
        let modalId = templateObject.data.modalId;
        let modal = $(event.target).closest('.modal.fade.show')
        let label = templateObject.data.label;
        let value = $(event.target).closest('tr').find('.'+colName).text();
        let objectId = $(event.target).closest('tr').find('.colID')?.text();

        let email = $(event.target).closest('tr').find('.colEmail')?.text();
       
        templateObject.edtParam.set({name: value, id: objectId, email: email })
        
        templateObject.targetTemp.set(templateObject.data.target_template_id)
        
        // $('#'+id).val(value)
        let target = templateObject.targetEle.get();
        $(target).val(value)
        // $(target).val("test")
        $(modal).modal('hide');    
        // $(modal).find('> .modal-content > .modal-body >.table-responsive >.datatables-wrapper .dataTables_filter input').val('');
        // setTimeout(function() {
        //     $(modal).find('> .modal-content > .modal-body >.table-responsive >.datatables-wrapper .btnRefreshTable').trigger('click')
            
        // }, 100)
        
    },

})
