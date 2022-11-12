import { ReactiveVar } from "meteor/reactive-var";
import {ProductService} from '../product/product-service';
import { SideBarService } from "./sidebar-service";
import 'jquery-editable-select';


//product name, process name, product sales description, qty in stock, subs, 
Template.bom_setup.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.bomProducts = new ReactiveVar([]);
    templateObject.initialRecord = new ReactiveVar();
    templateObject.selectedProcessField = new ReactiveVar();
    templateObject.selectedProductField = new ReactiveVar();
    templateObject.isMobileDevices = new ReactiveVar(false);
    templateObject.showSubButton = new ReactiveVar(true)
})
let productService =  new ProductService();
let sideBarService = new SideBarService();
Template.bom_setup.onRendered(function() {
    const templateObject = Template.instance();
    let temp = localStorage.getItem('TProcTree');
    let tempArray = temp?JSON.parse(temp): [];
    templateObject.bomProducts.set(tempArray)

    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))){
        templateObject.isMobileDevices.set(true);
    }


    templateObject.getBOMStructure = function() {
        // $('.fullScreenSpin').css('display', 'inline-block')
    
        let bomProducts = templateObject.bomProducts.get()
        $('#edtMainProductName').editableSelect();
        if(FlowRouter.current().queryParams.id) {
            $('#edtMainProductName').prop('disabled', true);

            let id = FlowRouter.current().queryParams.id;
            let objectFields = bomProducts[id].fields;
            $('#edtMainProductName').val(objectFields.productName)
            $('#edtProcess').editableSelect();
            $('#edtProcess').val(objectFields.process)
            
            templateObject.initialRecord.set(bomProducts[id].fields);
            if(objectFields.subs.length >0) {
                let subs = objectFields.subs;
                for(let i=0; i< subs.length; i++) {
                    let html = '';
                    html = html + "<div class='product-content'>"+
                        "<div class='d-flex productRow'>"+
                            "<div class='colProduct form-group d-flex'><div style='width: 29%'></div>" ;
                                
                                let isBOM = false;
                                let bomProductIndex = bomProducts.findIndex(object => {
                                    return object.fields.productName == subs[i].productName;
                                })
                                if(bomProductIndex > -1) {
                                    isBOM = true
                                }
    
                                if(isBOM == true) {
                                    html +="<select type='search' class='edtProductName edtRaw form-control es-input' style='width: 40%'></select><button type='button' class='btnShowSub btn btn-primary'>Show Sub</button>";
                                } else {
                                    html +="<select type='search' class='edtProductName edtRaw form-control es-input' style='width: 70%'></select>"
                                }
                              
    
                            html += "</div>"+
                            "<div class='colQty form-group'>"+
                                "<input type='text' class='form-control edtQuantity w-100' type='number' step='.00001' value='"+ subs[i].qty +"'>" +
                            "</div>";
    
    
                                    html += "<div class='colProcess form-group'>"+
                                    "<input type='search' autocomplete='off' class='edtProcessName form-control w-100 es-input' value = '"+ subs[i].process +"' /></div>"+
                                    "<div class='colNote form-group'>" +
                                    "<input class='w-100 form-control edtProcessNote'  type='text' value='"+subs[i].processNote+"'></div>" +
                                    "<div class='colAttachment form-group'><a class='btn btn-primary btnAddAttachment' role='button' data-toggle='modal' href='#myModalAttachment-"+subs[i].productName.replace(/[|&;$%@"<>()+," "]/g, '')+"' id='btn_Attachment' name='btn_Attachment'><i class='fa fa-paperclip' style='padding-right: 8px;'></i>Add Attachments</a><div class='d-none attachedFiles'></div></div>"
    
                            html += "<div class='colDelete d-flex align-items-center justify-content-center'><button class='btn btn-danger btn-rounded btn-sm my-0 btn-remove-raw'><i class='fa fa-remove'></i></button></div>" +
                        "</div>"+
                    "</div>"
    
                    let productContents = $('.product-content');
                    $(html).insertAfter($(productContents[productContents.length-2]))
                    productContents = $('.product-content');
                    let productContent = $(productContents[productContents.length-2])
                    $(productContent).find('.edtProductName').editableSelect();
                    $(productContent).find('.edtProcessName').editableSelect()
                    $(productContent).find('.edtProductName').val(subs[i].productName || '')
                    $(productContent).find('.edtQuantity').val(subs[i].qty || 1)
                    $(productContent).find('.edtProcessName').val(subs[i].process || "")
                    // $(productContent).find('.edtProcessName').val(subs[i].process || "")
                    $(productContent).find('.edtProcessNote').val(subs[i].processNote || "")
    
                }
            }
            

            $('.fullScreenSpin').css('display', 'none')
        } else {
            $('#edtMainProductName').prop('disabled', false);
            setTimeout(()=>{
                $('#productListModal').modal('toggle');
                $('.fullScreenSpin').css('display', 'none')
            }, 300)
        }
    }

    templateObject.getBOMStructure()


    templateObject.setEditableSelect = async function() {
        $(document).ready(function(){
            $('.edtProcessName').editableSelect();
            $('.edtProductName').editableSelect();
        })
    }

    templateObject.setEditableSelect();
})


Template.bom_setup.events({
    'click #productListModal tbody tr': function(event) {
        let templateObject = Template.instance();
        let inputElement = templateObject.selectedProductField.get();
        event.preventDefault();
        event.stopPropagation();

        if(!inputElement || inputElement.hasClass('edtProductName') != true) {
            let productName = $(event.target).closest('tr').find('td.productName').text();
            getVS1Data('TProductVS1').then(function(dataObject) {
                if(dataObject.length == 0) {
                    productService.getOneProductdatavs1byname(productName).then(function(data){
                        let description = data.tproduct[0].fields.SalesDescription;
                        let stockQty = data.tproduct[0].fields.TotalQtyInStock;
                        let objectDetail = {
                            productName: productName,
                            qty: 1,
                            process: '',
                            processNote: '',
                            productDescription: description,
                            totalQtyInStock: stockQty,
                            attachments: []
                        }
                        templateObject.initialRecord.set(objectDetail);
                        $('#productListModal').modal('toggle')
                    })
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tproductvs1;
                    for(let i=0 ; i< useData.length; i++) {
                        if(useData[i].fields.ProductName == productName) {
                            let description = useData[i].fields.SalesDescription;
                            let stockQty = useData[i].fields.TotalQtyInStock;
                            let objectDetail = {
                                productName: productName,
                                qty: 1,
                                process: '',
                                processNote: '',
                                productDescription: description,
                                totalQtyInStock: stockQty,
                                attachments: []
                            }
                            templateObject.initialRecord.set(objectDetail);
                            $('#edtMainProductName').val(objectDetail.productName)
                            $('#productListModal').modal('toggle')
                        }
                    }
                }
            }).catch(function(error){
                productService.getOneProductdatavs1byname(productName).then(function(data){
                    let description = data.tproduct[0].fields.SalesDescription;
                    let stockQty = data.tproduct[0].fields.TotalQtyInStock;
                    let objectDetail = {
                        productName: productName,
                        qty: 1,
                        process: '',
                        processNote: '',
                        productDescription: description,
                        totalQtyInStock: stockQty,
                        attachments: []
                    }
                    templateObject.initialRecord.set(objectDetail);
                    $('#productListModal').modal('toggle')
                })
            })
        } else {
            let productName = $(event.target).closest('tr').find('.productName').text();
            let selEle = templateObject.selectedProductField.get();
            selEle.val(productName);
            let bomProducts = templateObject.bomProducts.get();
        let isBOM = false;
        let existIndex = bomProducts.findIndex(product => {
            return product.fields.productName == productName;
        })
        if(existIndex > -1) {
            isBOM = true
        }
        if(isBOM == true) {
            let colProduct = $(selEle).closest('.colProduct')
            $(colProduct).find('.edtProductName').css('width', '40%')
            if(templateObject.showSubButton.get() == true) {
                $(colProduct).append("<button type='button' class='btnShowSub btn btn-primary'>Show Sub</button>");
            }

            templateObject.showSubButton.set(true);
            let colProcess = $(selEle).closest('.productRow').find('.edtProcessName');
            $(colProcess).val(bomProducts[existIndex].fields.process)
            $(colProcess).attr('disabled', 'true');
            let colProcessNote = $(selEle).closest('.productRow').find('.edtProcessNote');
            $(colProcessNote).val(bomProducts[existIndex].fields.processNote)
            $(colProcessNote).attr('disabled', 'true');
        }
            $('#productListModal').modal('toggle')
        }
    },

    'click #edtMainProductName': function(event) {
        let templateObject = Template.instance();
        // let colProduct = $(event.target).closest('div.colProduct');
        templateObject.selectedProductField.set($('#edtMainProductName'))
        // templateObject.selectedProductField.set($(colProduct).children('input'))
        $('#productListModal').modal('toggle');
    },

    'click .edtProductName': function(event) {
        let templateObject = Template.instance();
        let colProduct = $(event.target).closest('div.colProduct');
        templateObject.selectedProductField.set($(colProduct).children('input'))
        $('#productListModal').modal('toggle');
    },

    'click .edtProcessName': function(event) {
        let templateObject = Template.instance();
        let colProcess = $(event.target).closest('div.colProcess');
        $(event.target).editableSelect();
        templateObject.selectedProcessField.set($(colProcess).children('.edtProcessName'))
        $('#processListModal').modal('toggle');
    },

    'click #processListModal tbody tr': function (event) {
        event.preventDefault();
        event.stopPropagation();
        let templateObject = Template.instance()
        let processName = $(event.target).closest('tr').find('.colProcessName').text();
        let selEle = templateObject.selectedProcessField.get();
        selEle.val(processName);
        $('#processListModal').modal('toggle')
    },

    'click .btnAddProduct': function(event) {
        event.preventDefault();
        event.stopPropagation();
        let row = $(event.target).closest('.productRow');
        let tempObject = Template.instance();
        let parent = row.parent();


        let grandParent = parent.parent();
        let modalElement = $(row).closest('.modal');
        let topParent = modalElement.parent();

        let count = $(grandParent).find('.product-content').length;
        if(count > 1) {
            let lastRow = $(grandParent).find('.product-content')[count-2];
            if(lastRow && lastRow != null) {
                if ($(lastRow).find('.edtProductName').val() == '' || $(lastRow).find('.edtQuantity').val() == '') {
                    return
                }
            }
        }


        let colProduct = row.find('.colProduct');
        let colQty = row.find('.colQty');
        let colProcess = row.find('.colProcess');
        let colNote = row.find('.colNote');
        let colAttachment = row.find('.colAttachment');
        let colDelete = row.find('.colDelete');
        $(colProduct).prepend("<div style='width: 29%'></div><select class='edtProductName edtRaw form-control' id='edtRaw' type='search' style='width: 70%'></select>")
        $(event.target).remove()
        $(colProduct).find('.edtProductName').editableSelect()
        $(colQty).append("<input type='text' class='form-control edtQuantity w-100' type='number' step='.00001'/>");
        // $(colProduct).append("<button type='button' class='btnShowSub btn btn-primary'>Show Sub</button>");
        $(colProcess).append("<select class='edtProcessName form-control w-100' type='search' ></select>")
        $(colProcess).find('.edtProcessName').editableSelect();
        $(colNote).append("<input class='w-100 form-control edtProcessNote' type='text'/>");
        $(colDelete).addClass('d-flex align-items-center justify-content-center')
        $(colDelete).append("<button class='btn btn-danger btn-rounded btn-sm my-0 btn-remove-raw'><i class='fa fa-remove'></i></button>")



        grandParent.append("<div class='product-content'><div class='d-flex productRow'>" +
                        "<div class='colProduct  d-flex form-group'>" +
                        "<button class='btn btn-primary btnAddProduct' style='width: 29%;'>Product+</button>" +
                        "</div>" +
                        "<div class='colQty form-group'>" +
                        "</div>" +
                        "<div class='colProcess form-group'>" +
                        "</div>" +
                        "<div class='colNote form-group'>" +
                        "</div>" +
                        "<div class='colAttachment form-group'></div>" +
                        "<div class='colDelete'>" +
                        "</div>" +
                        "</div></div>")
        let productContentCount = $(grandParent).find('.product-content').length;

        $(colAttachment).append("<a class='btn btn-primary btnAddAttachment' role='button' data-toggle='modal' href='#myModalAttachment-"+productContentCount+"' id='btn_Attachment' name='btn_Attachment'>"+
                    "<i class='fa fa-paperclip' style='padding-right: 8px;'></i>Add Attachments</a><div class='d-none attachedFiles'></div>")

        let attachModalHtml = "<div class='modal fade' role='dialog' tabindex='-1' id='myModalAttachment-"+productContentCount+"'>" +
        "<div class='modal-dialog modal-dialog-centered' role='document'>" +
            "<div class='modal-content'>" +
                "<div class='modal-header'>" +
                    "<h4>Upload Attachments</h4><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>×</span></button>" +
                "</div>" +
                "<div class='modal-body' style='padding: 0px;'>" +
                    "<div class='divTable file-display'>" +
                        "<div class='col inboxcol1'>" +
                            "<img src='/icons/nofiles_icon.jpg' class=' style='width:100%;'>" +
                        "</div>" +
                        "<div class='col inboxcol2' style='text-align: center;'>" +
                            "<div>Upload files or add files from the file library.</div>"
                            if(tempObject.isMobileDevices.get() == true) {
                                attachModalHtml = attachModalHtml +"<div>Capture copies of receipt's or take photo's of completed jobs.</div>"
                            }


                                        attachModalHtml = attachModalHtml + "<p style='color: #ababab;'>Only users with access to your company can view these files</p>" +
                                    "</div>" +
                                "</div>" +
                            "</div>"+
                            "<div class='modal-footer'>";
                            if(tempObject.isMobileDevices.get() == true) {
                                attachModalHtml = attachModalHtml +"<input type='file' class='img-attachment-upload' id='img-attachment-upload' style='display:none' accept='image/*' capture='camera'>" +
                                "<button class='btn btn-primary btnUploadFile img_new_attachment_btn' type='button'><i class='fas fa-camera' style='margin-right: 5px;'></i>Capture</button>" +

                                "<input type='file' class='attachment-upload' id='attachment-upload' style='display:none' multiple accept='.jpg,.gif,.png'>"
                            }else {
                                attachModalHtml = attachModalHtml + "<input type='file' class='attachment-upload' id='attachment-upload' style='display:none' multiple accept='.jpg,.gif,.png,.bmp,.tiff,.pdf,.doc,.docx,.xls,.xlsx,.ppt," +
                                ".pptx,.odf,.csv,.txt,.rtf,.eml,.msg,.ods,.odt,.keynote,.key,.pages-tef," +
                                ".pages,.numbers-tef,.numbers,.zip,.rar,.zipx,.xzip,.7z,image/jpeg," +
                                "image/gif,image/png,image/bmp,image/tiff,application/pdf," +
                                "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
                                "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +
                                "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation," +
                                "application/vnd.oasis.opendocument.formula,text/csv,text/plain,text/rtf,message/rfc822," +
                                "application/vnd.ms-outlook,application/vnd.oasis.opendocument.spreadsheet," +
                                "application/vnd.oasis.opendocument.text,application/x-iwork-keynote-sffkey," +
                                "application/vnd.apple.keynote,application/x-iwork-pages-sffpages," +
                                "application/vnd.apple.pages,application/x-iwork-numbers-sffnumbers," +
                                "application/vnd.apple.numbers,application/zip,application/rar," +
                                "application/x-zip-compressed,application/x-zip,application/x-7z-compressed'>"
                            }
                            attachModalHtml = attachModalHtml +
                                "<button class='btn btn-primary btnUploadFile new_attachment_btn' type='button'><i class='fa fa-cloud-upload' style='margin-right: 5px;'></i>Upload</button>" +
                                "<button class='btn btn-success closeModal' data-dismiss='modal' type='button' style='margin-right: 5px;' autocomplete='off'>" +
                                    "<i class='fa fa-save' style='padding-right: 8px;'></i>Save" +
                                "</button>" +
                                "<button class='btn btn-secondary' data-dismiss='modal' type='button'><i class='fa fa-remove' style='margin-right: 5px;'></i>Close</button>" +
                            "</div>"+
                        "</div>"+
                    "</div>"+
                "</div>"
                    topParent.append(attachModalHtml);
    },

    'click .btnShowSub': function(event) {
        let row = $(event.target).closest('.product-content');
        let templateObject = Template.instance();
        let bomProducts = templateObject.bomProducts.get();
        let productName = $(event.target).closest('.productRow').find('.edtProductName').val();
        let processName = $(event.target).closest('.productRow').find('.edtProcessName').val();
        let quantity = $(event.target).closest('.productRow').find('.edtQuantity').val();
        if(productName == '' || quantity == '' ) {
            return
        }
        $(event.target).closest('.productRow').find('.edtProductName').css('width', '70%')
        let bomIndex = bomProducts.findIndex(product=>{
            return product.fields.productName == productName
        })
        
        if(bomIndex > -1) {
            let subIndex = -1;
            let parentBOM = bomProducts.find(product => {
                return product.fields.productName == templateObject.initialRecord.get().productName;
            })
            if(parentBOM) {
                subIndex = parentBOM.fields.subs.findIndex(sub=>{
                    return sub.productName == productName;
                })
            }

            if(subIndex > -1) {
                let subs = parentBOM.fields.subs[subIndex].subs
                    $(event.target).remove()
                    if(subs && subs.length) {
                        for (let i = 0; i < subs.length; i++) {
                            $(row).append("<div class='d-flex productRow'>" +
                                "<div class= 'd-flex colProduct form-group'>" +
                                "<div style='width: 60%'></div>" +
                                "<select class='edtProductName edtRaw form-control' type='search' style='width: 40%'></select>" +
                                "</div>" +
                                "<div class='colQty form-group'>" +
                                "<input type='text' class='edtQuantity w-100 form-control' type='number' step='.00001' value='" + subs[i].qty + "'/>" +
                                "</div>" +
                                "<div class='colProcess form-group'>"+
                                "<select type='search' autocomplete='off' class='edtProcessName form-control w-100 es-input' ></select>"+
                                "</div>" +
                                "<div class='colNote form-group'></div>" +
                                "<div class='colAttachment'></div>" +
                                "<div class='d-flex colDelete align-items-center justify-content-center'><button class='btn btn-danger btn-rounded btn-sm my-0 btn-remove-raw'><i class='fa fa-remove'></i></button></div>" +
                                "</div>")

                            let elements = $(row).find('.edtProductName')
                            $(elements[elements.length - 1]).editableSelect();

                            let inputElements = $(row).find('input.edtProductName');
                                $(inputElements[inputElements.length - 1]).val(subs[i].productName)
                            let processes = $(row).find('.edtProcessName');
                            $(processes[processes.length - 1]).editableSelect();
                            let processElements = $(row).find('input.edtProcessName');
                            $(processElements[processElements.length - 1]).val(subs[i].process)
                        }
                    }
            } else {

                let subs = bomProducts[bomIndex].fields.subs

                    $(event.target).remove()
                    if(subs && subs.length) {
                        for (let i = 0; i < subs.length; i++) {
                            $(row).append("<div class='d-flex productRow'>" +
                                "<div class= 'd-flex colProduct form-group'>" +
                                "<div style='width: 60%'></div>" +
                                "<select class='edtProductName edtRaw form-control' type='search' style='width: 40%'></select>" +
                                "</div>" +
                                "<div class='colQty form-group'>" +
                                "<input type='text' class='edtQuantity w-100 form-control' type='number' step='.00001' value='" + subs[i].qty + "'/>" +
                                "</div>" +
                                "<div class='colProcess form-group'>"+
                                "<select type='search' autocomplete='off' class='edtProcessName form-control w-100 es-input' ></select>"+
                                "</div>" +
                                "<div class='colNote form-group'></div>" +
                                "<div class='colAttachment'></div>" +
                                "<div class='d-flex colDelete align-items-center justify-content-center'><button class='btn btn-danger btn-rounded btn-sm my-0 btn-remove-raw'><i class='fa fa-remove'></i></button></div>" +
                                "</div>")

                            let elements = $(row).find('.edtProductName')
                            $(elements[elements.length - 1]).editableSelect();
                            let inputElements = $(row).find('input.edtProductName');
                                $(inputElements[inputElements.length - 1]).val(subs[i].productName)
                            let processes = $(row).find('.edtProcessName');
                            $(processes[processes.length - 1]).editableSelect();
                            let processElements = $(row).find('input.edtProcessName');
                            // $(processElements[processElements.length - 1]).val(subs[i].process)
                        }
                    }
            }
        }

        $(row).append("<div class='d-flex productRow'>"+
                        "<div class='d-flex colProduct form-group'>"+
                        "<div class='d-flex align-items-center justify-content-end form-group' style='width: 60%'>"+
                        "<button class='btn btn-primary w-25 d-flex align-items-center justify-content-center form-control btnAddSubProduct'><span class='fas fa-plus'></span></button>" +
                        "</div>"+
                        "<select class='edtProductName edtRaw form-control' type='search' style='width: 40%'></select>" +
                        "</div>"+
                        "<div class='colQty'>" +
                        "<input type='text' class='edtQuantity  w-100 form-control' type='number' step='.00001'/>" +
                        "</div>"+
                        "<div class='colProcess form-group'>"+
                        "<select type='search' autocomplete='off' class='edtProcessName form-control w-100 es-input' ></select>"+
                        "</div>" +
                        "<div class='colNote form-group'></div>" +
                        "<div class='colAttachment'></div>" +
                        "<div class='colDelete'></div>"+
                        "</div>")
                        let eles = $(row).find('.edtProductName')
                        $(eles[eles.length - 1]).editableSelect();
                        let edtprocesses = $(row).find('.edtProcessName')
                        $(edtprocesses[edtprocesses.length-1]).editableSelect()
    },

    'click .btnAddSubProduct': function(event) {
        let button  = $(event.target).closest('button.btnAddSubProduct');
        let tempObject = Template.instance();
        let row = $(event.target).closest('.productRow');
        let colProduct = row.find('.colProduct');
        let colQty = row.find('.colQty');
        let colProcess = row.find('.colProcess');
        let colNote = row.find('.colNote');
        let colAttachment = row.find('.colAttachment');
        let colDelete = row.find('.colDelete');

        if($(colProduct).find('.edtProductName').val() != '') {
            if($(colQty).find('.edtQuantity').val() != '') {
                let quantity = $(colQty).find('.edtQuantity').val();
                let edtRaw = colProduct.find('.edtProductName')
                $(event.target).remove();
                $(button).remove();
                $(colDelete).addClass('d-flex align-items-center justify-content-center')
                $(colDelete).append("<button class='btn btn-danger btn-rounded btn-sm my-0 btn-remove-raw'><i class='fa fa-remove'></i></button>")
                let parent = row.parent();

                $(parent).append("<div class='d-flex productRow'>"+
                "<div class='d-flex colProduct form-group'>"+
                "<div class='d-flex align-items-center justify-content-end form-group' style='width: 60%'>"+
                "<button class='btn btn-primary w-25 d-flex align-items-center justify-content-center form-control btnAddSubProduct'><span class='fas fa-plus'></span></button>" +
                "</div>"+
                "<select class='edtProductName edtRaw form-control' type='search' style='width: 40%'></select>" +
                "</div>"+
                "<div class='colQty'>" +
                "<input type='text' class='edtQuantity w-100 form-control' type='number' step='.00001'/>" +
                "</div>"+
                "<div class='colProcess form-group'>"+
                "<select type='search' autocomplete='off' class='edtProcessName form-control w-100 es-input' ></select>"+
                "</div>" +
                "<div class='colNote form-group'></div>" +
                "<div class='colAttachment'></div>" +
                "<div class='colDelete'></div>"+
                "</div>")
                let eles = $(parent).find('.edtProductName')
                $(eles[eles.length - 1]).editableSelect();
                let procElements = $(parent).find('.edtProcessName')
                $(procElements[procElements.length -1]).editableSelect()
            }
        }
    },

    'click .btn-remove-raw': function(event) {
        let row = $(event.target).closest('div.productRow');
        let productName = $(row).find('.edtProductName').val();
        let content = $(event.target).closest('div.product-content');
        let rowCount = $(content).find('.productRow').length;
        if (rowCount == 1 || $(content).first().find('.edtProductName').val() == productName) {
            $(content).remove();
        } else {
            $(row).remove();
        }
    },
    'click .btn-save-bom': function(event) {
        const tempObject = Template.instance();
        playSaveAudio();
        setTimeout(function(){
        $('.fullScreenSpin').css('display', 'inline-block')
        let mainProductName = $('#edtMainProductName').val();
        let mainProcessName = $('#edtProcess').val();
        let bomProducts = localStorage.getItem('TProcTree')? JSON.parse(localStorage.getItem('TProcTree')) : []
        if(mainProductName == '') {
            swal('Please provide the product name !', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            return false;
        }
        if(mainProcessName == '') {
            swal('Please provide the process !', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            return false;
        }

        let products = $('.product-content');
        if(products.length < 3) {
            swal('Must have sub builds or raws !', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            return false;
        }
        let objDetails  = {
            productName: mainProductName,
            qty: 1,
            process: mainProcessName,
            processNote: $(products[0]).find('.edtProcessNote').val() || '',
            attachments: JSON.parse($(products[0]).find('.attachedFiles').text() != ''?$(products[0]).find('.attachedFiles').text(): '[]').uploadedFilesArray || [],
            subs: [],
            productDescription: tempObject.initialRecord.get().productDescription,
            totalQtyInStock: tempObject.initialRecord.get().totalQtyInStock
        }

        for(let i = 1; i< products.length - 1; i ++) {
            let productRows = products[i].querySelectorAll('.productRow')
            let objectDetail;
                let _name = $(productRows[0]).find('.edtProductName').val();
                let _qty = $(productRows[0]).find('.edtQuantity').val();
                let _process = $(productRows[0]).find('.edtProcessName').val();
                let _note = $(productRows[0]).find('.edtProcessNote').val();
                let _attachments = JSON.parse($(productRows[0]).find('.attachedFiles').text()!= ''?$(productRows[0]).find('.attachedFiles').text(): '[]').uploadedFilesArray || [];
                objectDetail = {
                    productName: _name,
                    qty: _qty,
                    process: _process,
                    processNote: _note,
                    attachments: _attachments,
                    subs:[],
                }
                if(productRows.length > 1) {
                    for(let j = 1; j<productRows.length; j++) {
                        let _productName = $(productRows[j]).find('.edtProductName').val();
                        let _productQty = $(productRows[j]).find('.edtQuantity').val();
                        let _rawProcess = $(productRows[j]).find('.edtProcessName').val();
                        if(_productName != '' && _productQty != '' ) {
                            objectDetail.subs.push ({
                                productName: _productName,
                                qty: _productQty,
                                process: _rawProcess
                            })
                        }
                    }
                } else {
                    let bomProductIndex = bomProducts.findIndex(product => {
                        return product.fields.productName == _name;
                    })
                    if(bomProductIndex > -1) {
                        let subProduct = bomProducts[bomProductIndex];
                        if(subProduct && subProduct.fields.subs && subProduct.fields.subs.length> 0) {
                            for(let j=0; j< subProduct.fields.subs.length; j++) {
                                let sub = subProduct.fields.subs[j];
                                objectDetail.subs.push({
                                    productName: sub.productName,
                                    qty: sub.qty,
                                    process: sub.process
                                })
                            }
                        }
                    }
                }
            // }
            objDetails.subs.push(objectDetail);
        }

        // tempObject.bomStructure.set(objDetails);
        // let object = {
        //     type: 'TProcTree',
        //     fields: objDetails
        // }


        getVS1Data('TProductVS1').then(function(dataObject) {
            if(dataObject.length == 0) {
                productService.getOneProductdatavs1byname(tempObject.initialRecord.get().productName).then(function(data){
                    productService.saveProduct({
                        type: 'TProduct',
                        fields: {
                            ...data.tproduct[0].fields,
                            IsManufactured: true
                        }
                    }).then(function(){
                        sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
                            addVS1Data('TProductVS1',JSON.stringify(data)).then(()=>{
                                saveBOMStructure(objDetails)
                            });
                        })
                    })
                    
                })
            }else {
                let data = JSON.parse(dataObject[0].data)
                let useData = data.tproductvs1;
                for(let i = 0; i< useData.length; i++) {
                    if(useData[i].fields.ProductName == empObject.initialRecord.get().productName ) {
                        productService.saveProductVS1({
                            type: 'TProductVS1',
                            fields: {
                                // ...useData[i].fields,
                                ID: useData[i].fields.ID,
                                IsManufactured: true
                            }
                        }).then(function(){
                            sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
                                addVS1Data('TProductVS1',JSON.stringify(data)).then(()=>{
                                    saveBOMStructure(objDetails)
                                });
                            })
                        })
                    }
                }
            }
        }).catch(function(e) {
            productService.getOneProductdatavs1byname(tempObject.initialRecord.get().productName).then(function(data){
                productService.saveProduct({
                    type: 'TProduct',
                    fields: {
                        ...data.tproduct[0].fields,
                        IsManufactured: true
                    }
                }).then(function(){
                    sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
                        addVS1Data('TProductVS1',JSON.stringify(data)).then(()=>{
                            saveBOMStructure(objDetails)
                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                            swal("Something went wrong!", "", "error");
                        });
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                        swal("Something went wrong!", "", "error");
                    })
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                    swal("Something went wrong!", "", "error");
                })
                
            }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
                swal("Something went wrong!", "", "error");
            })
        })


        function saveBOMStructure(objDetails) {

            let bomProducts = localStorage.getItem('TProcTree')?JSON.parse(localStorage.getItem('TProcTree')):[];
    
            let existIndex = bomProducts.findIndex(product =>{
                return product.fields.productName == objDetails.productName;
            })
    
            let bomObject = {
                type: 'TProcTree',
                fields: objDetails
            }
            if(existIndex > -1) {
                bomProducts.splice(existIndex, 1, bomObject)
            }else {
                bomProducts.push(bomObject);
            }
    
            localStorage.setItem('TProcTree', JSON.stringify(bomProducts));
            $('.fullScreenSpin').css('display', 'none')
            swal('BOM Settings Successfully Saved', '', 'success');
            
            // for (let l = 1; l < productContents.length -1; l++) {
            //     $(productContents[l]).remove()
            // }
            FlowRouter.go('/bomlist?success=true')
        }



        
       

        // tempObject.getProductData();
        // tempObject.isManufactured.set(true);
        }, delayTimeAfterSound);
    },

    'click .btn-cancel-bom': function(event) {
        FlowRouter.go('/bomlist')
    },

    'click .btn-print-bom': function(event) {
        playPrintAudio();
        setTimeout(function(){
        document.title = 'Product BOM Setup';
        $("#bom-setup-card.card-body").print({
            // title   :  document.title +" | Product Sales Report | "+loggedCompany,
            noPrintSelector : ".btnAddProduct",
            noPrintSelector : ".btnAddSubProduct",
            noPrintSelector : ".btn-remove-raw",
            noPrintSelector : ".btnAddAttachment",
        });
    }, delayTimeAfterSound);
    },
})

Template.bom_setup.helpers({
    initialRecord: ()=>{
        return Template.instance().initialRecord.get()
    }
})