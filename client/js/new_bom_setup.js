import { ReactiveVar } from "meteor/reactive-var";
import {ProductService} from '../product/product-service';
import { SideBarService } from "./sidebar-service";
import 'jquery-editable-select';
import { Template } from 'meteor/templating';
import '../manufacture/bom_setup.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

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



    // if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
    // /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))){
    //     templateObject.isMobileDevices.set(true);
    // }


})


Template.bom_setup.events({
    
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

        if($('.edtDuration').val() == '' ){
            swal('Please set duration for process !', '', 'warning');
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
            productDescription:  '',
            totalQtyInStock:  0,
            duration: parseFloat($('.edtDuration').val())
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
                productService.getOneProductdatavs1byname($('#edtMainProductName').val()).then(function(data){
                    objDetails.productDescription = data.tproduct[0].fields.SalesDescription;
                    objDetails.totalQtyInStock = data.tproduct[0].fields.TotalQtyInStock;
                    saveBOMStructure(objDetails)
                    // productService.saveProduct({
                    //     type: 'TProduct',
                    //     fields: {
                    //         ...data.tproduct[0].fields,
                    //         IsManufactured: true
                    //     }
                    // }).then(function(){
                    //     sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
                    //         addVS1Data('TProductVS1',JSON.stringify(data)).then(()=>{
                    //             saveBOMStructure(objDetails)
                    //         });
                    //     })
                    // })
                    
                })
            }else {
                let data = JSON.parse(dataObject[0].data)
                let useData = data.tproductvs1;
                for(let i = 0; i< useData.length; i++) {
                    if(useData[i].fields.ProductName == $('#edtMainProductName').val() ) {
                        objDetails.productDescription = useData[i].fields.SalesDescription;
                        objDetails.totalQtyInStock = useData[i].fields.TotalQtyInStock;
                        saveBOMStructure(objDetails)
                        // productService.saveProductVS1({
                        //     type: 'TProductVS1',
                        //     fields: {
                        //         // ...useData[i].fields,
                        //         ID: useData[i].fields.ID,
                        //         IsManufactured: true
                        //     }
                        // }).then(function(){
                        //     sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
                        //         addVS1Data('TProductVS1',JSON.stringify(data)).then(()=>{
                        //             saveBOMStructure(objDetails)
                        //         }).catch(function(err){});
                        //     }).catch(function(e){
                        //     })
                        // }).catch(function(err){
                        // })
                    }
                }
            }
        }).catch(function(e) {
            productService.getOneProductdatavs1byname($('#edtMainProductName').val()).then(function(data){
                objDetails.productDescription = data.tproduct[0].fields.SalesDescription;
                objDetails.totalQtyInStock = data.tproductp[0].fields.TotalQtyInStock;
                saveBOMStructure(objDetails)
                // productService.saveProduct({
                //     type: 'TProduct',
                //     fields: {
                //         ...data.tproduct[0].fields,
                //         IsManufactured: true
                //     }
                // }).then(function(){
                //     sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
                //         addVS1Data('TProductVS1',JSON.stringify(data)).then(()=>{
                //             saveBOMStructure(objDetails)
                //         }).catch(function(err) {
                //             $('.fullScreenSpin').css('display', 'none');
                //             swal("Something went wrong!", "", "error");
                //         });
                //     }).catch(function(err) {
                //         $('.fullScreenSpin').css('display', 'none');
                //         swal("Something went wrong!", "", "error");
                //     })
                // }).catch(function(err) {
                //     $('.fullScreenSpin').css('display', 'none');
                //     swal("Something went wrong!", "", "error");
                // })
                
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

            if (localStorage.getItem("enteredURL") != null) {
                FlowRouter.go(localStorage.getItem("enteredURL"));
                localStorage.removeItem("enteredURL");
                return;
            }

            FlowRouter.go('/bomlist?success=true')
        }

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
            // noPrintSelector : ".btnAddProduct",
            // noPrintSelector : ".btnAddSubProduct",
            // noPrintSelector : ".btn-remove-raw",
            noPrintSelector : ".no-print",
        });
    }, delayTimeAfterSound);
    },
})

Template.bom_setup.helpers({
    initialRecord: ()=>{
        return Template.instance().initialRecord.get()
    }
})