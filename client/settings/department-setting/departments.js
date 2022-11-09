import {TaxRateService} from "../settings-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';

let sideBarService = new SideBarService();
Template.departmentSettings.inheritsHooksFrom('non_transactional_list');

Template.departmentSettings.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.employeerecords = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.roomrecords = new ReactiveVar([]);

    templateObject.departlist = new ReactiveVar([]);
});

Template.departmentSettings.onRendered(function() {
    //$('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];
    const deptrecords = [];
    let deptprodlineItems = [];


    function MakeNegative() {
        $('td').each(function(){
            if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    $('#tblDepartmentList tbody').on("click", "tr", function () {
        $('#add-dept-title').text('Edit Department');
        let deptID = $(event.target).closest('tr').attr('id');
        let deptName = $(event.target).closest('tr').find('.colDeptName').text();
        let deptDesc = $(event.target).closest('tr').find('.colDescription').text();
        let siteCode = $(event.target).closest('tr').find('.colSiteCode').text();
        $('#edtDepartmentID').val(deptID);
        $('#edtDeptName').val(deptName);
        $('#txaDescription').val(deptDesc);
        $('#edtSiteCode').val(deptDesc);
        $('#myModalDepartment').modal('show');

    });
});


Template.departmentSettings.events({
    'click #btnNewInvoice':function(event){
        // FlowRouter.go('/invoicecard');
    },
    'click #exportbtn': function () {
        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblDepartmentList_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');

    },
    "click .printConfirm": function (event) {
      $(".fullScreenSpin").css("display", "inline-block");
      jQuery("#tblDepartmentList_wrapper .dt-buttons .btntabletopdf").click();
      $(".fullScreenSpin").css("display", "none");
    },
    'click .btnRefresh': function () {
      sideBarService.getDepartmentDataList().then(function (dataReload) {
          addVS1Data('TDepartment', JSON.stringify(dataReload)).then(function (datareturn) {
              Meteor._reload.reload();
          }).catch(function (err) {
              Meteor._reload.reload();
          });
      }).catch(function (err) {
          Meteor._reload.reload();
      });
      // Meteor._reload.reload();
  },
    'click .btnAddNewDepart': function () {
        $('#newdepartment').css('display','block');

    },
    'click .btnCloseAddNewDept': function () {
        playCancelAudio();
        setTimeout(function(){
        $('#newdepartment').css('display','none');
        }, delayTimeAfterSound);
    },
    'click .btnDeleteDept': function () {
        playDeleteAudio();
        let taxRateService = new TaxRateService();
        setTimeout(function(){
        $('.fullScreenSpin').css('display', 'inline-block');
        let deptId = $('#edtDepartmentID').val();

        let objDetails = {
            type: "TDeptClass",
            fields: {
                Id: deptId,
                Active: false
            }
        };

        taxRateService.saveDepartment(objDetails).then(function (objDetails) {
            sideBarService.getDepartmentDataList(initialBaseDataLoad, 0,true).then(function (dataReload) {
                addVS1Data('TDepartment', JSON.stringify(dataReload)).then(function (datareturn) {
               Meteor._reload.reload();
            }).catch(function (err) {
               Meteor._reload.reload();
            });
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
                } else if (result.dismiss === 'cancel') {}
            });
            $('.fullScreenSpin').css('display', 'none');
        });
    }, delayTimeAfterSound);
    },
    'click .btnSaveDept': function () {
        playSaveAudio();
        let taxRateService = new TaxRateService();
        setTimeout(function(){
        $('.fullScreenSpin').css('display','inline-block');

        let deptID = $('#edtDepartmentID').val()||0;
        //let headerDept = $('#sltDepartment').val();
        let deptName = $('#edtDeptName').val()||'';
        if (deptName === ''){
        swal('Department name cannot be blank!', '', 'warning');
        $('.fullScreenSpin').css('display','none');
        e.preventDefault();
        }

        let deptDesc = $('#txaDescription').val()||'';
        let siteCode = $('#edtSiteCode').val()||'';
        let checkDeptID ='';
        let objDetails = '';
        let objStSDetails = null;

        if (isModuleGreenTrack) {

            let sltMainContact = $('#sltMainContact').val();
            let stsMainContactNo = $('#stsMainContactNo').val();
            let stsLicenseNo = $('#stsLicenseNo').val();
            let sltDefaultRoomName = $('#sltDefaultRoom').val();
            var newbinnum = $("#sltDefaultRoom").find('option:selected').attr('mytagroom');
            objStSDetails = {
                type: "TStSClass",
                fields: {
                    DefaultBinLocation: sltDefaultRoomName || '',
                    DefaultBinNumber: newbinnum || '',
                    LicenseNumber: stsLicenseNo || '',
                    PrincipleContactName: sltMainContact || '',
                    PrincipleContactPhone: stsMainContactNo || ''
                }
            }
        }

        if (deptName === ''){
            Bert.alert('<strong>WARNING:</strong> Department Name cannot be blank!', 'warning');
            e.preventDefault();
        }

        if(deptID == ""){

            taxRateService.checkDepartmentByName(deptName).then(function (data) {
                deptID = data.tdeptclass[0].Id;
                objDetails = {
                    type: "TDeptClass",
                    fields: {
                        ID: parseInt(deptID)||0,
                        Active: true,
                        //DeptClassGroup: headerDept,
                        DeptClassName: deptName,
                        Description: deptDesc,
                        SiteCode: siteCode,
                        StSClass: objStSDetails
                    }
                };

                taxRateService.saveDepartment(objDetails).then(function (objDetails) {
                  sideBarService.getDepartment().then(function(dataReload) {
                      addVS1Data('TDeptClass',JSON.stringify(dataReload)).then(function (datareturn) {
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

            }).catch(function (err) {
                objDetails = {
                    type: "TDeptClass",
                    fields: {
                        Active: true,
                        DeptClassName: deptName,
                        Description: deptDesc,
                        SiteCode: siteCode,
                        StSClass: objStSDetails
                    }
                };

                taxRateService.saveDepartment(objDetails).then(function (objDetails) {
                  sideBarService.getDepartment().then(function(dataReload) {
                      addVS1Data('TDeptClass',JSON.stringify(dataReload)).then(function (datareturn) {
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
            });

        }else{
            objDetails = {
                type: "TDeptClass",
                fields: {
                    ID: parseInt(deptID),
                    Active: true,
                    //  DeptClassGroup: headerDept,
                    DeptClassName: deptName,
                    Description: deptDesc,
                    SiteCode: siteCode,
                    StSClass: objStSDetails
                }
            };

            taxRateService.saveDepartment(objDetails).then(function (objDetails) {
              sideBarService.getDepartment().then(function(dataReload) {
                  addVS1Data('TDeptClass',JSON.stringify(dataReload)).then(function (datareturn) {
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
    'click .btnAddDept': function () {
        $('#add-dept-title').text('Add New Department');
        $('#edtDepartmentID').val('');
        $('#edtSiteCode').val('');
        $('#edtDeptName').val('');
        $('#edtDeptName').prop('readonly', false);
        $('#edtDeptDesc').val('');
    },
    'click .btnBack':function(event){
        playCancelAudio();
        event.preventDefault();
        setTimeout(function(){
        history.back(1);
        }, delayTimeAfterSound);
    },
    'keydown #edtSiteCode, keyup #edtSiteCode': function(event){
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }

        if (event.shiftKey == true) {

        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190) {
            event.preventDefault();
        } else {
            //event.preventDefault();
        }

    },
    'blur #edtSiteCode': function(event){
        $(event.target).val($(event.target).val().toUpperCase());

    },
    'click .btnSaveRoom': function () {
        playSaveAudio();
        let taxRateService = new TaxRateService();
        setTimeout(function(){
        $('.fullScreenSpin').css('display','inline-block');

        var parentdept = $('#sltDepartmentList').val();
        var newroomname = $('#newRoomName').val();
        var newroomnum = $('#newRoomNum').val();


        let data = '';

        data = {
            type: "TProductBin",
            fields: {
                BinClassName: parentdept|| '',
                BinLocation: newroomname|| '',
                BinNumber: newroomnum|| ''
            }
        };


        taxRateService.saveRoom(data).then(function (data) {
            window.open('/departmentSettings','_self');
        }).catch(function (err) {

            $('.fullScreenSpin').css('display','none');
        });
    }, delayTimeAfterSound);
    },
});

Template.departmentSettings.helpers({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get().sort(function(a, b){
            if (a.headDept == 'NA') {
                return 1;
            }
            else if (b.headDept == 'NA') {
                return -1;
            }
            return (a.headDept.toUpperCase() > b.headDept.toUpperCase()) ? 1 : -1;
            // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'departmentList'});
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b){
            if (a.department == 'NA') {
                return 1;
            }
            else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    isModuleGreenTrack: () => {
        return isModuleGreenTrack;
    },
    listEmployees: () => {
        return Template.instance().employeerecords.get().sort(function(a, b){
            if (a.employeename == 'NA') {
                return 1;
            }
            else if (b.employeename == 'NA') {
                return -1;
            }
            return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
        });
    },
    listBins: () => {
        return Template.instance().roomrecords.get().sort(function(a, b){
            if (a.roomname == 'NA') {
                return 1;
            }
            else if (b.roomname == 'NA') {
                return -1;
            }
            return (a.roomname.toUpperCase() > b.roomname.toUpperCase()) ? 1 : -1;
        });
    },
    listDept: () => {
        return Template.instance().departlist.get().sort(function(a, b){
            if (a.deptname == 'NA') {
                return 1;
            }
            else if (b.deptname == 'NA') {
                return -1;
            }
            return (a.deptname.toUpperCase() > b.deptname.toUpperCase()) ? 1 : -1;
        });
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
