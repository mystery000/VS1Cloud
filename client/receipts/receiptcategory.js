import { ReceiptService } from "./receipt-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
Template.receiptcategory.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.receiptcategoryrecords = new ReactiveVar();
});

Template.receiptcategory.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let receiptService = new ReceiptService();
    const receiptCategoryList = [];
    const dataTableList = [];
    const tableHeaderList = [];

    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'receiptCategoryList', function(error, result){
        if(error){

        }else{
            if(result){
                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;
                    $("th."+columnClass+"").html(columData);
                    $("th."+columnClass+"").css('width',""+columnWidth+"px");
                }
            }
        }
    });

    function MakeNegative() {
        $('td').each(function(){
            if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
        });
    }

    templateObject.getReceiptCategoryList = function(){
        getVS1Data('TReceiptCategory').then(function (dataObject) {
            if(dataObject.length == 0){
                receiptService.getAllReceiptCategorys().then(function(data){
                    setReceiptCategory(data);
                });
            }else{
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
                let Obj = {
                    id: data.treceiptcategory[i].Id || ' ',
                    categoryName: data.treceiptcategory[i].CategoryName || ' ',
                    description: data.treceiptcategory[i].CategoryDesc || ' ',
                };
                receiptCategoryList.push(Obj);
            }
        }
        templateObject.receiptcategoryrecords.set(receiptCategoryList);
        $('.fullScreenSpin').css('display','none');
    }
    templateObject.getReceiptCategoryList();

    $(document).on('click', '.table-remove', function() {
        event.stopPropagation();
        event.stopPropagation();
        const targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteLineModal').modal('toggle');
        // if ($('.receiptCategoryList tbody>tr').length > 1) {
        // // if(confirm("Are you sure you want to delete this row?")) {
        // this.click;
        // $(this).closest('tr').remove();
        // //} else { }
        // event.preventDefault();
        // return false;
        // }
    });

    $('#receiptCategoryList tbody').on( 'click', 'tr .colName, tr .colDescription', function () {
        let listData = $(this).closest('tr').attr('id');
        if(listData){
            $('#add-receiptcategory-title').text('Edit Receipt Category');
            if (listData !== '') {
                listData = Number(listData);
                const receiptCategoryID = listData || '';
                const receiptCategoryName = $(event.target).closest("tr").find(".colName").text() || '';
                const receiptCategoryDesc = $(event.target).closest("tr").find(".colDescription").text() || '';
                $('#edtReceiptCategoryID').val(receiptCategoryID);
                $('#edtReceiptCategoryName').val(receiptCategoryName);
                $('#edtReceiptCategoryDesc').val(receiptCategoryDesc);
                $(this).closest('tr').attr('data-target', '#myModal');
                $(this).closest('tr').attr('data-toggle', 'modal');
            }
        }
    });
});

Template.receiptcategory.events({
    'click .chkDatatable' : function(event){
        const columns = $('#receiptCategoryList th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();
        $.each(columns, function(i,v) {
            let className = v.classList;
            let replaceClass = className[1];
            if(v.innerText == columnDataValue){
                if($(event.target).is(':checked')){
                    $("."+replaceClass+"").css('display','table-cell');
                    $("."+replaceClass+"").css('padding','.75rem');
                    $("."+replaceClass+"").css('vertical-align','top');
                }else{
                    $("."+replaceClass+"").css('display','none');
                }
            }
        });
    },
    'click .btnOpenSettings' : function(event){
        let templateObject = Template.instance();
        const columns = $('#receiptCategoryList th');
        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i,v) {
            if(v.hidden == false){
                columVisible =  true;
            }
            if((v.className.includes("hiddenColumn"))){
                columVisible = false;
            }
            sWidth = v.style.width.replace('px', "");
            let datatablerecordObj = {
                sTitle: v.innerText || '',
                sWidth: sWidth || '',
                sIndex: v.cellIndex || '',
                sVisible: columVisible || false,
                sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
    },
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
        $('.fullScreenSpin').css('display','inline-block');
        let receiptService = new ReceiptService();
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

    },
    'click .btnSave': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let receiptService = new ReceiptService();
        let receiptCategoryID = $('#edtReceiptCategoryID').val();
        let receiptCategoryName = $('#edtReceiptCategoryName').val();
        if (receiptCategoryName == '') {
            swal('Receipt Category name cannot be blank!', '', 'warning');
            $('.fullScreenSpin').css('display','none');
            return false;
        }
        let receiptCategoryDesc = $('#edtReceiptCategoryDesc').val();
        let objDetails = '';
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
                            CategoryDesc: receiptCategoryDesc
                        }
                    };
                    doSaveReceiptCategory(objDetails);
                }
            }).catch(function (err) {
                objDetails = {
                    type: "TReceiptCategory",
                    fields: {
                        Active: true,
                        CategoryName: receiptCategoryName,
                        CategoryDesc: receiptCategoryDesc
                    }
                };
                // doSaveReceiptCategory(objDetails);
            });
        } else {
            objDetails = {
                type: "TReceiptCategory",
                fields: {
                    ID: parseInt(receiptCategoryID),
                    Active: true,
                    CategoryName: receiptCategoryName,
                    CategoryDesc: receiptCategoryDesc
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
    },
    'click .btnAdd': function () {
        $('#add-receiptcategory-title').text('Add New Receipt Category');
        $('#edtReceiptCategoryID').val('');
        $('#edtReceiptCategoryName').val('');
        $('#edtReceiptCategoryDesc').val('');
    },
    'click .btnBack':function(event){
        event.preventDefault();
        history.back(1);
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
    }
});
