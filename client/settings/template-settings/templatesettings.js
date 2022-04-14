import {OrganisationService} from '../../js/organisation-service';
import {CountryService} from '../../js/country-service';
import {ReactiveVar} from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let organisationService = new OrganisationService();

var template_list = ["Bills","Credits","Customer Payments","Customer Statements","Invoices","Invoice Back Orders","Purchase Orders","Quotes","Refunds","Sales Orders","Supplier Payments"]
var modal_data = [];



Template.templatesettings.onCreated(() => {
    console.log("created template setting", template_list)
    let templateObject = Template.instance()
    templateObject.invoice_data = new ReactiveVar([]);
});

Template.templatesettings.onRendered(function () {
    let templateObject = Template.instance();
    document.querySelectorAll(".btnPreviewTemplate").forEach((el) => {
		el.addEventListener('click', function(){
            title = el.getAttribute("data-id")
            templateObject.generateInvoiceData(title)
        });
	});

    $("#templatePreviewModal").on("shown.bs.modal", function(){
        const data = templateObject.invoice_data.get();
        // Session.set("template",data)
    })

   

    templateObject.generateInvoiceData = function(template_title){       
        object_invoce = [];
        switch(template_title){
            case "Bills":
            object_invoce = [];
            var array_data = [];
            array_data.push(["Accumlated Depreciation", "Accumlated Depreciation", "$0.00","$900.00"]);          
            let item = {
                    o_url : "vs1cloud.com",
                    o_name : "Sample Company",
                    o_address : "123 street",
                    o_city : "Los Angeles",
                    o_state : "Califonia 12345",
                    o_reg : "",
                    o_abn : "5678905",
                    o_phone : "25151944",
                    title : template_title,
                    date : "30 / 03 / 2022",
                    invoicenumber : "789",
                    refnumber : "",
                    pqnumber : "",
                    duedate : "",
                    paylink : "dgsags",
                    supplier : "Car Wash Express",
                    fields : ["Account Name","Memo", "Tax", "Amount"],
                    data : array_data,
                }

                object_invoce.push(item)    
                break;
    
            case "Credits":
    
                object_invoce = [];
                var array_data = [];
                array_data.push(["Accumlated Depreciation", "Accumlated Depreciation", "$0.00","$900.00"]);          
                let item_credits = {
                        o_url : "vs1cloud.com",
                        o_name : "Sample Company",
                        o_address : "123 street",
                        o_city : "Los Angeles",
                        o_state : "Califonia 12345",
                        o_reg : "",
                        o_abn : "5678905",
                        o_phone : "25151944",
                        title : template_title,
                        date : "30 / 03 / 2022",
                        invoicenumber : "789",
                        refnumber : "",
                        pqnumber : "",
                        duedate : "",
                        paylink : "dgsags",
                        supplier : "Car Wash Express",
                        fields : ["Account Name","Memo", "Tax", "Amount"],
                        data : array_data,
                    }
    
                    object_invoce.push(item_credits) 
    
                break;  
    
            case "Customer Payments":
                object_invoce = [];
                console.log("clicked template button", template_title)
                break;  
            
            case "Invoices" :
                object_invoce = [];
                console.log("clicked template button", template_title)
                break;
            
            case "Invoice Back Orders" : 
                object_invoce = [];
                console.log("clicked template button", template_title)
                break;
            
            case "Purchase Orders" : 
                object_invoce = [];
                console.log("clicked template button", template_title)
                break;
    
            case "Quotes" : 
                object_invoce = [];
                console.log("clicked template button", template_title)
                break;    
            
            case "Refunds" : 
            object_invoce = [];    
                console.log("clicked template button", template_title)
                break;    
            
            case "Sales Orders" : 
                console.log("clicked template button", template_title)
                break;        
            
            case "Supplier Payments" : 
                console.log("clicked template button", template_title)
                break;            
        }
        $('#templatePreviewModal').modal('toggle');
        if(object_invoce.length > 0){
            console.log("entered", )
           
            $('#templatePreviewModal .o_url').text(object_invoce[0]["o_url"]);
            $('#templatePreviewModal .o_name').text(object_invoce[0]["o_name"]);
            $('#templatePreviewModal .o_address1').text(object_invoce[0]["o_address"]);
            $('#templatePreviewModal .o_city').text(object_invoce[0]["o_city"]);
            $('#templatePreviewModal .o_state').text(object_invoce[0]["o_state"]);
            $('#templatePreviewModal .o_reg').text(object_invoce[0]["o_reg"]);
            $('#templatePreviewModal .o_abn').text(object_invoce[0]["o_abn"]);
            $('#templatePreviewModal .o_phone').text(object_invoce[0]["o_phone"]);
            $('#templatePreviewModal .customer').text(object_invoce[0]["supplier"]);
            $('#templatePreviewModal .date').text(object_invoce[0]["date"]);
            $('#templatePreviewModal .print-header').text(object_invoce[0]["title"]);
            $('#templatePreviewModal .modal-title').text(object_invoce[0]["title"] + " template");
    
            $('#templatePreviewModal .po').text(object_invoce[0]["po"] );
            $('#templatePreviewModal .io').text(object_invoce[0]["io"] );
            $('#templatePreviewModal .ro').text(object_invoce[0]["ro"] );
    
            $('#templatePreviewModal .due').text(object_invoce[0]["due"] );
    
            if(object_invoce[0]["paylink"] == ""){
                $('#templatePreviewModal .link').hide();
            }else{
                $('#templatePreviewModal .link').show();
            }
        }
     
       


    }
});

Template.templatesettings.helpers({

    'getTemplateList' : function() {
        return template_list;
    },

    'getTemplateNumber' : function(){
        let template_numbers = ["1","2", "3"]
        return template_numbers;
    },

    
});

Template.templatesettings.events({

});


