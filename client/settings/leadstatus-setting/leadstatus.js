import { ContactService } from "../../contacts/contact-service";
import { SideBarService } from '../../js/sidebar-service';
import { ReactiveVar } from 'meteor/reactive-var';
import {UtilityService} from "../../utility-service";

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let contactService = new ContactService();

Template.leadstatussettings.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.leadStatusList = new ReactiveVar();
});

Template.leadstatussettings.onRendered(function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    const dataTableList = [];
    const tableHeaderList = [];
    let needAddUnqualified = true;
    let needAddOpportunity = true;
    let needAddQuoted = true;
    let needAddInvoiced = true;

    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'leadStatusList', function (error, result) {
        if (error) {
            
        } else {
            if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;
                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");
                }
            }
        }
    });

    function MakeNegative() {
        $('td').each(function () {
            if ($(this).text().indexOf('-' + Currency) >= 0)
                $(this).addClass('text-danger')
        });
    }

    templateObject.getLeadStatusData = function () {
        getVS1Data('TLeadStatusType').then(function (dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAllLeadStatus().then(function (data) {
                    setLeadStatusList(data);
                })
            } else {
                let data = JSON.parse(dataObject[0].data);
                setLeadStatusList(data);
            }
        }).catch(function (err) {
            sideBarService.getAllLeadStatus().then(function (data) {
                setLeadStatusList(data);
            })
        });
    }
    function setLeadStatusList(data) {
        for (let i = 0; i < data.tleadstatustype.length; i++) {
            let eqpm = Number(data.tleadstatustype[i].KeyValue.replace(/[^0-9.-]+/g, "")) || 10;
            const dataList = {
                id: data.tleadstatustype[i].Id || '',
                typeName: data.tleadstatustype[i].TypeName || '',
                description: data.tleadstatustype[i].Description || data.tleadstatustype[i].TypeName,
                eqpm: utilityService.negativeNumberFormat(eqpm)
            };
            if (data.tleadstatustype[i].TypeName == "Unqualified") {
                needAddUnqualified = false;
            }
            if (data.tleadstatustype[i].TypeName == "Opportunity") {
                needAddOpportunity = false;
            }
            if (data.tleadstatustype[i].TypeName == "Quoted") {
                needAddQuoted = false;
            }
            if (data.tleadstatustype[i].TypeName == "Invoiced") {
                needAddInvoiced = false;
            }
            dataTableList.push(dataList);
        }
        addDefaultValue();
        templateObject.datatablerecords.set(dataTableList);
        if (templateObject.datatablerecords.get()) {
            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'leadStatusList', function (error, result) {
                if (error) {

                } else {
                    if (result) {
                        for (let i = 0; i < result.customFields.length; i++) {
                            let customcolumn = result.customFields;
                            let columData = customcolumn[i].label;
                            let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                            let hiddenColumn = customcolumn[i].hidden;
                            let columnClass = columHeaderUpdate.split('.')[1];
                            let columnWidth = customcolumn[i].width;
                            let columnindex = customcolumn[i].index + 1;
                            if (hiddenColumn == true) {
                                $("." + columnClass + "").addClass('hiddenColumn');
                                $("." + columnClass + "").removeClass('showColumn');
                            } else if (hiddenColumn == false) {
                                $("." + columnClass + "").removeClass('hiddenColumn');
                                $("." + columnClass + "").addClass('showColumn');
                            }
                        }
                    }
                }
            });
            setTimeout(function () {
                MakeNegative();
            }, 100);
        }
        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function () {
            $('#leadStatusList').DataTable({
                columnDefs: [{
                    type: 'date',
                    targets: 0
                }, {
                    "orderable": false,
                    "targets": -1
                }
                ],
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [{
                    extend: 'excelHtml5',
                    text: '',
                    download: 'open',
                    className: "btntabletocsv hiddenColumn",
                    filename: "leadstatuslist_" + moment().format(),
                    orientation: 'portrait',
                    exportOptions: {
                        columns: ':visible'
                    }
                }, {
                    extend: 'print',
                    download: 'open',
                    className: "btntabletopdf hiddenColumn",
                    text: '',
                    title: 'Lead Status List',
                    filename: "leadstatuslist_" + moment().format(),
                    exportOptions: {
                        columns: ':visible'
                    }
                }
                ],
                select: true,
                destroy: true,
                // colReorder: true,
                colReorder: {
                    fixedColumnsRight: 1
                },
                // bStateSave: true,
                // rowId: 0,
                pageLength: initialDatatableLoad,
                lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                info: true,
                responsive: true,
                "order": [[0, "asc"]],
                action: function () {
                    $('#leadStatusList').DataTable().ajax.reload();
                },
                "fnDrawCallback": function (oSettings) {
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                },
            }).on('page', function () {
                setTimeout(function () {
                    MakeNegative();
                }, 100);
                let draftRecord = templateObject.datatablerecords.get();
                templateObject.datatablerecords.set(draftRecord);
            }).on('column-reorder', function () {}).on('length.dt', function (e, settings, len) {
                setTimeout(function () {
                    MakeNegative();
                }, 100);
            });
            // $('#leadStatusList').DataTable().column( 0 ).visible( true );
            $('.fullScreenSpin').css('display', 'none');
        }, 0);

        const columns = $('#leadStatusList th');
        let sWidth = "";
        let columnVisible = false;
        $.each(columns, function (i, v) {
            if (v.hidden == false) {
                columnVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
                columnVisible = false;
            }
            sWidth = v.style.width.replace('px', "");
            let datatablerecordObj = {
                sTitle: v.innerText || '',
                sWidth: sWidth || '',
                sIndex: v.cellIndex || '',
                sVisible: columnVisible || false,
                sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
        $('div.dataTables_filter input').addClass('form-control form-control-sm');
    }
    function addDefaultValue() {
        let needAddDefault = true;
        if (!needAddUnqualified && !needAddOpportunity && !needAddQuoted && !needAddInvoiced) {
            needAddDefault = false;
        }
        if (needAddDefault) {
            let isSaved = false;
            if (needAddUnqualified) {
                contactService.getOneLeadStatusExByName("Quoted").then(function (leadStatus) {
                    let objUnqualified;
                    if (leadStatus.tleadstatustype.length == 0) {
                        objUnqualified = {
                            type: "TLeadStatusType",
                            fields: {
                                TypeName: "Unqualified",
                                Description: "Default Value",
                                KeyValue: 10,
                                Active: true
                            }
                        }
                    } else {
                        let statusID = leadStatus.tleadstatustype[0].fields.ID;
                        objUnqualified = {
                            type: "TLeadStatusType",
                            fields: {
                                Id: statusID,
                                Active: true
                            }
                        }
                    }
                    contactService.saveLeadStatusData(objUnqualified).then(function (result) {
                        isSaved = true;
                    }).catch(function (err) {
                    });
                })
            }
            if (needAddOpportunity) {
                contactService.getOneLeadStatusExByName("Quoted").then(function (leadStatus) {
                    let objOpportunity;
                    if (leadStatus.tleadstatustype.length == 0) {
                        objOpportunity = {
                            type: "TLeadStatusType",
                            fields: {
                                TypeName: "Opportunity",
                                Description: "Default Value",
                                KeyValue: 10,
                                Active: true
                            }
                        }
                    } else {
                        let statusID = leadStatus.tleadstatustype[0].fields.ID;
                        objOpportunity = {
                            type: "TLeadStatusType",
                            fields: {
                                Id: statusID,
                                Active: true
                            }
                        }
                    }
                    contactService.saveLeadStatusData(objOpportunity).then(function (result) {
                        isSaved = true;
                    }).catch(function (err) {
                    });
                })
            }
            if (needAddQuoted) {
                contactService.getOneLeadStatusExByName("Quoted").then(function (leadStatus) {
                    let objQuoted;
                    if (leadStatus.tleadstatustype.length == 0) {
                        objQuoted = {
                            type: "TLeadStatusType",
                            fields: {
                                TypeName: "Quoted",
                                Description: "Default Value",
                                KeyValue: 10,
                                Active: true
                            }
                        }
                    } else {
                        let statusID = leadStatus.tleadstatustype[0].fields.ID;
                        objQuoted = {
                            type: "TLeadStatusType",
                            fields: {
                                Id: statusID,
                                Active: true
                            }
                        }
                    }
                    contactService.saveLeadStatusData(objQuoted).then(function (result) {
                        isSaved = true;
                    }).catch(function (err) {
                    });
                })
            }
            if (needAddInvoiced) {
                contactService.getOneLeadStatusExByName("Invoiced").then(function (leadStatus) {
                    let objInvoiced;
                    if (leadStatus.tleadstatustype.length == 0) {
                        objInvoiced = {
                            type: "TLeadStatusType",
                            fields: {
                                TypeName: "Invoiced",
                                Description: "Default Value",
                                KeyValue: 10,
                                Active: true
                            }
                        }
                    } else {
                        let statusID = leadStatus.tleadstatustype[0].fields.ID;
                        objInvoiced = {
                            type: "TLeadStatusType",
                            fields: {
                                Id: statusID,
                                Active: true
                            }
                        }
                    }
                    contactService.saveLeadStatusData(objInvoiced).then(function (result) {
                        isSaved = true;
                    }).catch(function (err) {
                    });
                })
            }
            setTimeout(function () {
                if (isSaved) {
                    sideBarService.getAllLeadStatus().then(function (dataReload) {
                        addVS1Data('TLeadStatusType', JSON.stringify(dataReload)).then(function (datareturn) {
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
    templateObject.getLeadStatusData();

    $(document).on('click', '.table-remove', function (event) {
        const targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteLineModal').modal('toggle');
    });

    $('#leadStatusList tbody').on('click', 'tr .colStatusName, tr .colDescription, tr .colQuantity', function(event) {
        $('#add-leadstatus-title').text('Edit Lead Status');
        let targetID = $(event.target).closest('tr').attr('id');
        let description = $(event.target).closest('tr').find('.colDescription').text();
        let statusName = $(event.target).closest('tr').find('.colStatusName').text();
        let quantity = $(event.target).closest('tr').find('.colQuantity').text();
        $('#statusID').val(targetID);
        $('#edtLeadStatusName').val(statusName);
        $('#statusDescription').val(description);
        $('#statusQuantity').val(quantity);
        $('#myModalLeadStatus').modal('show');
    });
});

Template.leadstatussettings.events({
    'click .chkDatatable': function (event) {
        const columns = $('#leadStatusList th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();
        $.each(columns, function (i, v) {
            let className = v.classList;
            let replaceClass = className[1];
            if (v.innerText == columnDataValue) {
                if ($(event.target).is(':checked')) {
                    $("." + replaceClass + "").css('display', 'table-cell');
                    $("." + replaceClass + "").css('padding', '.75rem');
                    $("." + replaceClass + "").css('vertical-align', 'top');
                } else {
                    $("." + replaceClass + "").css('display', 'none');
                }
            }
        });
    },
    'click .resetTable': function (event) {
        const getcurrentCloudDetails = CloudUser.findOne({
            _id: Session.get('mycloudLogonID'),
            clouddatabaseID: Session.get('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                const clientID = getcurrentCloudDetails._id;
                const clientUsername = getcurrentCloudDetails.cloudUsername;
                const clientEmail = getcurrentCloudDetails.cloudEmail;
                const checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'leadStatusList'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function (err, idTag) {
                        if (err) {}
                        else {
                            Meteor._reload.reload();
                        }
                    });
                }
            }
        }
    },
    'click .saveTable': function (event) {
        let lineItems = [];
        $('.columnSettings').each(function (index) {
            const $tblrow = $(this);
            const colTitle = $tblrow.find(".divcolumn").text() || '';
            const colWidth = $tblrow.find(".custom-range").val() || 0;
            const colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
            let colHidden = false;
            colHidden = !$tblrow.find(".custom-control-input").is(':checked');
            let lineItemObj = {
                index: index,
                label: colTitle,
                hidden: colHidden,
                width: colWidth,
                thclass: colthClass
            }
            lineItems.push(lineItemObj);
        });
        const getcurrentCloudDetails = CloudUser.findOne({
            _id: Session.get('mycloudLogonID'),
            clouddatabaseID: Session.get('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                const clientID = getcurrentCloudDetails._id;
                const clientUsername = getcurrentCloudDetails.cloudUsername;
                const clientEmail = getcurrentCloudDetails.cloudEmail;
                const checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'leadStatusList'
                });
                if (checkPrefDetails) {
                    CloudPreference.update({
                        _id: checkPrefDetails._id
                    }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'salesform',
                            PrefName: 'leadStatusList',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');
                        }
                    });
                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'salesform',
                        PrefName: 'leadStatusList',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function (err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');
                        }
                    });
                }
            }
        }
        $('#myModal2').modal('toggle');
    },
    'blur .divcolumn': function (event) {
        let columData = $(event.target).text();
        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        const datable = $('#leadStatusList').DataTable();
        const title = datable.column(columnDatanIndex).header();
        $(title).html(columData);
    },
    'change .rngRange': function (event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');
        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        const datable = $('#leadStatusList th');
        $.each(datable, function (i, v) {
            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');
            }
        });
    },
    'click .btnOpenSettings': function (event) {
        let templateObject = Template.instance();
        const columns = $('#leadStatusList th');
        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function (i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
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
    'click #exportbtn': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#leadStatusList_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .btnRefresh': function () {
        sideBarService.getAllLeadStatus().then(function (dataReload) {
            addVS1Data('TLeadStatusType', JSON.stringify(dataReload)).then(function (datareturn) {
                Meteor._reload.reload();
            }).catch(function (err) {
                Meteor._reload.reload();
            });
        }).catch(function (err) {
            Meteor._reload.reload();
        });
    },
    'click .btnAddLeadStatus': function () {
        $('#add-leadstatus-title').text('Add New Lead Status');
        $('#edtLeadStatusName').val("");
        $('#statusDescription').val("");
    },
    'click .btnDeleteLeadStatus': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let contactService = new ContactService();
        let statusId = $('#selectDeleteLineID').val();
        let objDetails = {
            type: "TLeadStatusType",
            fields: {
                Id: statusId,
                Active: false
            }
        };
        contactService.saveLeadStatusData(objDetails).then(function (result) {
            sideBarService.getAllLeadStatus().then(function (dataReload) {
                addVS1Data('TLeadStatusType', JSON.stringify(dataReload)).then(function (datareturn) {
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
    },
    'click .btnSaveLeadStatus': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let objDetails = {};
        let statusName = $('#edtLeadStatusName').val() || '';
        let statusDesc = $('#statusDescription').val() || '';
        let statusEQPM = $('#statusQuantity').val() || '';
        statusEQPM = Number(statusEQPM.replace(/[^0-9.-]+/g, "")) || 1.0
        statusEQPM = statusEQPM.toString();
        let id = $('#statusID').val() || '';
        if (statusName === '') {
            swal('Lead Status name cannot be blank!', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
        } else {
            if (id == "") {
                objDetails = {
                    type: "TLeadStatusType",
                    fields: {
                        TypeName: statusName,
                        Description: statusDesc,
                        KeyValue: statusEQPM,
                        Active: true
                    }
                }
            } else {
                objDetails = {
                    type: "TLeadStatusType",
                    fields: {
                        Id: id,
                        TypeName: statusName,
                        Description: statusDesc,
                        KeyValue: statusEQPM,
                        Active: true
                    }
                }
            }
            contactService.saveLeadStatusData(objDetails).then(function (result) {
                sideBarService.getAllLeadStatus().then(function (dataReload) {
                    addVS1Data('TLeadStatusType', JSON.stringify(dataReload)).then(function (datareturn) {
                        Meteor._reload.reload();
                    }).catch(function (err) {
                        Meteor._reload.reload();
                    });
                }).catch(function (err) {
                    Meteor._reload.reload();
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
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }
    },
    'click .btnBack': function (event) {
        event.preventDefault();
        history.back(1);
    }
});

Template.leadstatussettings.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.typeName == 'NA') {
                return 1;
            } else if (b.typeName == 'NA') {
                return -1;
            }
            return (a.typeName.toUpperCase() > b.typeName.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'leadStatusList'
        });
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
