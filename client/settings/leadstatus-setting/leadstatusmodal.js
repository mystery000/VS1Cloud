import { ContactService } from "../../contacts/contact-service";
import { SideBarService } from '../../js/sidebar-service';
import { ReactiveVar } from 'meteor/reactive-var';

let sideBarService = new SideBarService();
Template.leadstatusmodal.onCreated(function () {
    const templateObject = Template.instance();
});

Template.leadstatusmodal.onRendered(function () {

});

Template.leadstatusmodal.events({
    // 'click .btnSaveLeadStatus': function () {
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     const url = FlowRouter.current().path;
    //     let contactService = new ContactService();
    //     let objDetails ={};
    //     //let headerDept = $('#sltDepartment').val();
    //     let statusName = $('#edtLeadStatusName').val() || '';
    //     let statusDesc = $('#statusDescription').val() || '';
    //     let id = $('#statusID').val() || '';
    //     if (statusName === '') {
    //         swal('Lead Status name cannot be blank!', '', 'warning');
    //         $('.fullScreenSpin').css('display', 'none');
    //         e.preventDefault();
    //     } else {
    //         if (id == "") {
    //             objDetails = {
    //                 type: "TLeadStatus",
    //                 fields: {
    //                     TypeName: statusName,
    //                     Description: statusDesc,
    //                     Active: true
    //                 }
    //             }
    //         } else {
    //             objDetails = {
    //                 type: "TLeadStatus",
    //                 fields: {
    //                     Id: id,
    //                     TypeName: statusName,
    //                     Description: statusDesc,
    //                     Active: true
    //                 }
    //             }
    //         }
    //         objDetails = {
    //             type: "TLeadStatus",
    //             fields: {
    //                 TypeName: statusName,
    //                 Description: statusDesc,
    //                 Active: true
    //             }
    //         }
    //         contactService.saveLeadStatusData(objDetails).then(function (objDetails) {
    //             sideBarService.getLeadStatusData().then(function (dataReload) {
    //                 addVS1Data('TLeadStatus', JSON.stringify(dataReload)).then(function (datareturn) {
    //                     if(url.includes("/productview")) {
    //                         $('#sltCustomerType').val(statusName);
    //                         $('#myModalLeadStatus').modal('toggle');
    //                         $('.fullScreenSpin').css('display', 'none');
    //                         return false;
    //                     }
    //                     Meteor._reload.reload();
    //                 }).catch(function (err) {
    //                     if(url.includes("/productview")) {
    //                         $('#sltCustomerType').val(statusName);
    //                         $('#myModalLeadStatus').modal('toggle');
    //                         $('.fullScreenSpin').css('display', 'none');
    //                         return false;
    //                     }
    //                     Meteor._reload.reload();
    //                 });
    //             }).catch(function (err) {
    //                 if(url.includes("/productview")) {
    //                     $('#sltCustomerType').val(statusName);
    //                     $('#myModalLeadStatus').modal('toggle');
    //                     $('.fullScreenSpin').css('display', 'none');
    //                     return false;
    //                 }
    //                 Meteor._reload.reload();
    //             });
    //         }).catch(function (err) {
    //             swal({
    //                 title: 'Oooops...',
    //                 text: err,
    //                 type: 'error',
    //                 showCancelButton: false,
    //                 confirmButtonText: 'Try Again'
    //             }).then((result) => {
    //                 if (result.value) {
    //                     // Meteor._reload.reload();
    //                 } else if (result.dismiss === 'cancel') {}
    //             });
    //             $('.fullScreenSpin').css('display', 'none');
    //         });
    //     }
    // },
});

Template.leadstatusmodal.helpers({

});
