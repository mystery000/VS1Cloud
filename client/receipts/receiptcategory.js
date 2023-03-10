import { ReceiptService } from "./receipt-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';

import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './receiptcategory.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { EditableService } from "../editable-service";
import moment from "moment";

let sideBarService = new SideBarService();
let editableService = new EditableService();
let receiptService = new ReceiptService();
Template.receiptcategory.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.receiptcategoryrecords = new ReactiveVar();

    templateObject.getDataTableList = function(data) {
        let mobile = "";
        let linestatus = "";
        let currentData = data;

        if (currentData.Active == true) {
            linestatus = "";
        } else if (currentData.Active == false) {
            linestatus = "In-Active";
        }

        //let deleteBtn = `<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>`

        var dataList = [
            currentData.Id || "",
            currentData.CategoryName || "",
            currentData.CategoryDesc || "",
            currentData.CategoryPostAccount || "",
            currentData.Active ? "" : "In-Active",
        ];
        return dataList;
    }

    let headerStructure = [
        { index: 0, label: '#Id', class: 'colId', active: false, display: true, width: "30" },
        { index: 1, label: 'Category Name', class: 'colName', active: true, display: true, width: "180" },
        { index: 2, label: 'Description', class: 'colDescription', active: true, display: true, width: "150" },
        { index: 3, label: 'Post Account', class: 'colPostAccount', active: true, display: true, width: "100" },
        { index: 4, label: 'Status', class: 'colStatus', active: true, display: true, width: "60" }
    ];

    templateObject.tableheaderrecords.set(headerStructure);
});

Template.receiptcategory.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let receiptService = new ReceiptService();
    const receiptCategoryList = [];

    let needAddMaterials = true;
    let needAddMealsEntertainment = true;
    let needAddOfficeSupplies = true;
    let needAddTravel = true;
    let needAddVehicle = true;

    // Meteor.call('readPrefMethod',localStorage.getItem('mycloudLogonID'),'receiptCategoryList', function(error, result){
    //     if(error){
    //
    //     }else{
    //         if(result){
    //             for (let i = 0; i < result.customFields.length; i++) {
    //                 let customcolumn = result.customFields;
    //                 let columData = customcolumn[i].label;
    //                 let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
    //                 let hiddenColumn = customcolumn[i].hidden;
    //                 let columnClass = columHeaderUpdate.split('.')[1];
    //                 let columnWidth = customcolumn[i].width;
    //                 $("th."+columnClass+"").html(columData);
    //                 $("th."+columnClass+"").css('width',""+columnWidth+"px");
    //             }
    //         }
    //     }
    // });

    templateObject.getReceiptCategoryList = function(){
        getVS1Data('TReceiptCategory').then(function (dataObject) {
            if (dataObject.length == 0) {
                receiptService.getAllReceiptCategorys().then(function(data){
                    setReceiptCategory(data);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                setReceiptCategory(data);
            }
        }).catch(function (err) {
            receiptService.getAllReceiptCategorys().then(function(data){
                setReceiptCategory(data);
            });
        });
    };
    function setReceiptCategory(data) {
        for (let i in data.treceiptcategory){
            if (data.treceiptcategory.hasOwnProperty(i)) {
                let obj = {
                    id: data.treceiptcategory[i].Id || ' ',
                    categoryName: data.treceiptcategory[i].CategoryName || ' ',
                    description: data.treceiptcategory[i].CategoryDesc || ' ',
                };
                receiptCategoryList.push(obj);
                if (data.treceiptcategory[i].CategoryName == "Materials") {
                    needAddMaterials = false;
                }
                if (data.treceiptcategory[i].CategoryName == "Meals & Entertainment") {
                    needAddMealsEntertainment = false;
                }
                if (data.treceiptcategory[i].CategoryName == "Office Supplies") {
                    needAddOfficeSupplies = false;
                }
                if (data.treceiptcategory[i].CategoryName == "Travel") {
                    needAddTravel = false;
                }
                if (data.treceiptcategory[i].CategoryName == "Vehicle") {
                    needAddVehicle = false;
                }
            }
        }
        addDefaultValue();
        templateObject.receiptcategoryrecords.set(receiptCategoryList);
        $('.fullScreenSpin').css('display','none');
    }
    //templateObject.getReceiptCategoryList();
    function addDefaultValue() {
        let needAddDefault = true;
        if (!needAddMaterials && !needAddMealsEntertainment && !needAddOfficeSupplies && !needAddTravel && !needAddVehicle ) {
            needAddDefault = false;
        }
        if (needAddDefault) {
            let isSaved = false;
            if (needAddMaterials) {
                receiptService.getOneReceiptCategoryDataExByName("Materials").then(function (receiptCategory) {
                    let objMaterials;
                    if (receiptCategory.treceiptcategory.length == 0) {
                        objMaterials = {
                            type: "TReceiptCategory",
                            fields: {
                                Active: true,
                                CategoryName: "Materials",
                                CategoryDesc: "Default Value"
                            }
                        }
                    } else {
                        let categoryID = receiptCategory.treceiptcategory[0].fields.ID;
                        objMaterials = {
                            type: "TReceiptCategory",
                            fields: {
                                Id: categoryID,
                                Active: true
                            }
                        }
                    }
                    receiptService.saveReceiptCategory(objMaterials).then(function (result) {
                        isSaved = true;
                    }).catch(function (err) {
                    });
                })
            }
            if (needAddMealsEntertainment) {
                receiptService.getOneReceiptCategoryDataExByName("Meals & Entertainment").then(function (receiptCategory) {
                    let objMealsEntertainment;
                    if (receiptCategory.treceiptcategory.length == 0) {
                        objMealsEntertainment = {
                            type: "TReceiptCategory",
                            fields: {
                                Active: true,
                                CategoryName: "Meals & Entertainment",
                                CategoryDesc: "Default Value"
                            }
                        }
                    } else {
                        let categoryID = receiptCategory.treceiptcategory[0].fields.ID;
                        objMealsEntertainment = {
                            type: "TReceiptCategory",
                            fields: {
                                Id: categoryID,
                                Active: true
                            }
                        }
                    }
                    receiptService.saveReceiptCategory(objMealsEntertainment).then(function (result) {
                        isSaved = true;
                    }).catch(function (err) {
                    });
                })
            }
            if (needAddOfficeSupplies) {
                receiptService.getOneReceiptCategoryDataExByName("Office Supplies").then(function (receiptCategory) {
                    let objOfficeSupplies;
                    if (receiptCategory.treceiptcategory.length == 0) {
                        objOfficeSupplies = {
                            type: "TReceiptCategory",
                            fields: {
                                Active: true,
                                CategoryName: "Office Supplies",
                                CategoryDesc: "Default Value"
                            }
                        }
                    } else {
                        let categoryID = receiptCategory.treceiptcategory[0].fields.ID;
                        objOfficeSupplies = {
                            type: "TReceiptCategory",
                            fields: {
                                Id: categoryID,
                                Active: true
                            }
                        }
                    }
                    receiptService.saveReceiptCategory(objOfficeSupplies).then(function (result) {
                        isSaved = true;
                    }).catch(function (err) {
                    });
                })
            }
            if (needAddTravel) {
                receiptService.getOneReceiptCategoryDataExByName("Travel").then(function (receiptCategory) {
                    let objTravel;
                    if (receiptCategory.treceiptcategory.length == 0) {
                        objTravel = {
                            type: "TReceiptCategory",
                            fields: {
                                Active: true,
                                CategoryName: "Travel",
                                CategoryDesc: "Default Value"
                            }
                        }
                    } else {
                        let categoryID = receiptCategory.treceiptcategory[0].fields.ID;
                        objTravel = {
                            type: "TReceiptCategory",
                            fields: {
                                Id: categoryID,
                                Active: true
                            }
                        }
                    }
                    receiptService.saveReceiptCategory(objTravel).then(function (result) {
                        isSaved = true;
                    }).catch(function (err) {
                    });
                })
            }
            if (needAddVehicle) {
                receiptService.getOneReceiptCategoryDataExByName("Vehicle").then(function (receiptCategory) {
                    let objVehicle;
                    if (receiptCategory.treceiptcategory.length == 0) {
                        objVehicle = {
                            type: "TReceiptCategory",
                            fields: {
                                Active: true,
                                CategoryName: "Vehicle",
                                CategoryDesc: "Default Value"
                            }
                        }
                    } else {
                        let categoryID = receiptCategory.treceiptcategory[0].fields.ID;
                        objVehicle = {
                            type: "TReceiptCategory",
                            fields: {
                                Id: categoryID,
                                Active: true
                            }
                        }
                    }
                    receiptService.saveReceiptCategory(objVehicle).then(function (result) {
                        isSaved = true;
                    }).catch(function (err) {
                    });
                })
            }
            setTimeout(function () {
                if (isSaved) {
                    receiptService.getAllReceiptCategorys().then(function (dataReload) {
                        addVS1Data('TReceiptCategory', JSON.stringify(dataReload)).then(function (datareturn) {
                            Meteor._reload.reload();
                        }).catch(function (err) {
                            Meteor._reload.reload();
                        });
                    }).catch(function (err) {
                        Meteor._reload.reload();
                    });
                }
            }, 5000);
        }
    }

    $(document).on('click', '.table-remove', function(event) {
        event.stopPropagation();
        event.stopPropagation();
        const targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteLineModal').modal('toggle');
    });

    $('#tblReceiptCategoryList tbody').on( 'click', 'tr .colName, tr .colDescription', function (event) {
        let ID = $(this).closest('tr').find(".colId").text();
        if (ID) {
            $('#add-receiptcategory-title').text('Edit Receipt Category');
            if (ID !== '') {
                ID = Number(ID);
                const receiptCategoryID = ID || '';
                const receiptCategoryName = $(event.target).closest("tr").find(".colName").text() || '';
                const receiptCategoryDesc = $(event.target).closest("tr").find(".colDescription").text() || '';
                $('#edtReceiptCategoryID').val(receiptCategoryID);
                $('#edtReceiptCategoryName').val(receiptCategoryName);
                $('#edtReceiptCategoryDesc').val(receiptCategoryDesc);
                $('#receiptCategoryModal').modal('toggle');
            }
        }
    });

    $(document).on('click', '#receiptCategoryModal #edtReceiptCategoryPostAccount', editableService.clickAccount)
    $(document).on('click', '#tblAccountListPop tbody tr', function(e) {
        let table = $(this);
        let accountName = table.find(".colAccountName").text();
        $("#edtReceiptCategoryPostAccount").val(accountName)
        $("#accountListModal").modal('hide');
    })
});

Template.receiptcategory.events({
    // 'click .chkDatatable' : function(event){
    //     const columns = $('#tblReceiptCategoryList th');
    //     let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();
    //     $.each(columns, function(i,v) {
    //         let className = v.classList;
    //         let replaceClass = className[1];
    //         if(v.innerText == columnDataValue){
    //             if($(event.target).is(':checked')){
    //                 $("."+replaceClass+"").css('display','table-cell');
    //                 $("."+replaceClass+"").css('padding','.75rem');
    //                 $("."+replaceClass+"").css('vertical-align','top');
    //             }else{
    //                 $("."+replaceClass+"").css('display','none');
    //             }
    //         }
    //     });
    // },
    // 'click .btnOpenSettings' : function(event){
    //     let templateObject = Template.instance();
    //     const columns = $('#tblReceiptCategoryList th');
    //     const tableHeaderList = [];
    //     let sTible = "";
    //     let sWidth = "";
    //     let sIndex = "";
    //     let sVisible = "";
    //     let columVisible = false;
    //     let sClass = "";
    //     $.each(columns, function(i,v) {
    //         if(v.hidden == false){
    //             columVisible =  true;
    //         }
    //         if((v.className.includes("hiddenColumn"))){
    //             columVisible = false;
    //         }
    //         sWidth = v.style.width.replace('px', "");
    //         let datatablerecordObj = {
    //             sTitle: v.innerText || '',
    //             sWidth: sWidth || '',
    //             sIndex: v.cellIndex || '',
    //             sVisible: columVisible || false,
    //             sClass: v.className || ''
    //         };
    //         tableHeaderList.push(datatablerecordObj);
    //     });
    //     templateObject.tableheaderrecords.set(tableHeaderList);
    // },
    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display','inline-block');
        sideBarService.getReceiptCategory().then(function(dataReload) {
            addVS1Data('TReceiptCategory',JSON.stringify(dataReload)).then(function (datareturn) {
                location.reload(true);
            }).catch(function (err) {
                location.reload(true);
            });
        }).catch(function(err) {
            location.reload(true);
        });
    },
    'click .btnDelete': function () {
        playDeleteAudio();
        let receiptService = new ReceiptService();
        setTimeout(function(){
        $('.fullScreenSpin').css('display','inline-block');
        
        let receiptCategoryId = $('#selectDeleteLineID').val();
        let objDetails = {
            type: "TReceiptCategory",
            fields: {
                Id: parseInt(receiptCategoryId),
                Active: false
            }
        };
        receiptService.saveReceiptCategory(objDetails).then(function (objDetails) {
            sideBarService.getReceiptCategory().then(function(dataReload) {
                addVS1Data('TReceiptCategory',JSON.stringify(dataReload)).then(function (datareturn) {
                    location.reload(true);
                }).catch(function (err) {
                    location.reload(true);
                });
            }).catch(function(err) {
                location.reload(true);
            });
        }).catch(function (err) {
            swal({
                title: 'Oooops...',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {
                    Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {

                }
            });
            $('.fullScreenSpin').css('display','none');
        });
    }, delayTimeAfterSound);
    },
    'click .btnSave': function () {
        playSaveAudio();
        let receiptService = new ReceiptService();
        setTimeout(function(){
        $('.fullScreenSpin').css('display','inline-block');
        
        let receiptCategoryID = $('#edtReceiptCategoryID').val();
        let receiptCategoryName = $('#edtReceiptCategoryName').val();
        let receiptCategoryPostAccount = $('#edtReceiptCategoryPostAccount').val()
        let receiptCategoryDesc = $('#edtReceiptCategoryDesc').val();
        if (receiptCategoryName == '') {
            swal('Receipt Category name cannot be blank!', '', 'warning');
            $('.fullScreenSpin').css('display','none');
            return false;
        }        
        let objDetails = {};
        if (receiptCategoryID == "") {
            receiptService.getOneReceiptCategoryDataExByName(receiptCategoryName).then(function (data) {
                if (data.treceiptcategory.length > 0 ) {
                    swal('Category name duplicated.', '', 'warning');
                    $('.fullScreenSpin').css('display','none');
                    return false;
                } else {
                    objDetails = {
                        type: "TReceiptCategory",
                        fields: {
                            ID: parseInt(receiptCategoryID)||0,
                            Active: true,
                            CategoryName: receiptCategoryName,
                            CategoryDesc: receiptCategoryDesc,
                            // CategoryPostAccount: receiptCategoryPostAccount                            
                        }
                    };
                    doSaveReceiptCategory(objDetails);
                }
            }).catch(function (err) {
                
            });
        } else {
            objDetails = {
                type: "TReceiptCategory",
                fields: {
                    ID: parseInt(receiptCategoryID),
                    Active: true,
                    CategoryName: receiptCategoryName,
                    CategoryDesc: receiptCategoryDesc,
                    // CategoryPostAccount: receiptCategoryPostAccount 
                }
            };
            doSaveReceiptCategory(objDetails);
        }
        function doSaveReceiptCategory(objDetails) {
            receiptService.saveReceiptCategory(objDetails).then(function (objDetails) {
                sideBarService.getReceiptCategory().then(function(dataReload) {
                    addVS1Data('TReceiptCategory',JSON.stringify(dataReload)).then(function (datareturn) {
                        location.reload(true);
                    }).catch(function (err) {
                        location.reload(true);
                    });
                }).catch(function(err) {
                    location.reload(true);
                });
            }).catch(function (err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {

                    }
                });
                $('.fullScreenSpin').css('display','none');
            });
        }
    }, delayTimeAfterSound);
    },
    'click .btnAdd': function () {
        $('#add-receiptcategory-title').text('Add New Receipt Category');
        $('#edtReceiptCategoryID').val('');
        $('#edtReceiptCategoryName').val('');
        $('#edtReceiptCategoryDesc').val('');
    },
    'click .btnBack':function(event){
        playCancelAudio();
        event.preventDefault();
        setTimeout(function(){
        history.back(1);
        }, delayTimeAfterSound);
    },
});

Template.receiptcategory.helpers({
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    receiptcategoryrecords: () => {
        let arr = Template.instance().receiptcategoryrecords.get();
        if (arr != undefined && arr.length > 0) {
            return arr.sort(function(a, b){
                if (a.categoryName == 'NA') {
                    return 1;
                }
                else if (b.categoryName == 'NA') {
                    return -1;
                }
                return (a.categoryName.toUpperCase() > b.categoryName.toUpperCase()) ? 1 : -1;
            });
        } else {
            return arr;
        }
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    },

    apiFunction:function() {
        let receiptService = new ReceiptService();
        return receiptService.getAllReceiptCategorys;
    },

    searchAPI: function() {
        return receiptService.getOneReceiptCategoryDataExByName;
    },

    service: ()=>{
        let receiptService = new ReceiptService();
        return receiptService;

    },

    datahandler: function () {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    exDataHandler: function() {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    apiParams: function() {
        return ['limitCount', 'limitFrom', 'deleteFilter'];
    },
});
