import { ReactiveVar } from 'meteor/reactive-var';
import { PurchaseBoardService } from '../js/purchase-service';
import { SalesBoardService } from '../js/sales-service';
import { SideBarService } from '../js/sidebar-service';
import { StockTransferService } from './stockadjust-service';
import '../lib/global/indexdbstorage.js';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./serialnumberlist.html";

// Define services
let sideBarService = new SideBarService();
const purchaseService = new PurchaseBoardService();
const salesService = new SalesBoardService();
const stockTransferService = new StockTransferService();
Template.serialnumberlist.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.custfields = new ReactiveVar([]);
    templateObject.displayfields = new ReactiveVar([]);

    templateObject.convertedStatus = new ReactiveVar();

    templateObject.getDataTableList = function(data) {
        let dataList = [
            data.SerialNumber || '',
            data.ProductName || 'Unknown',
            data.PartsDescription || '',
            data.AllocType || '',
            data.Quantity || '',
            moment(data.TransDate).format("YYYY/MM/DD") || '',
            data.Description || '',
            data.DepartmentName || '',
            data.BinNumber || '',
            data.Barcode || ''
        ];
        return dataList;
    }

    let headerStructure = [
        { index: 0, label: "Serial Number", class: "colSerialNumber", active: true, display: true, width: "100" },
        { index: 1, label: "Product Name", class: "colProductName", active: true, display: true, width: "150" },
        { index: 2, label: "Sales Description", class: "colSalesDescription", active: true, display: true, width: "150" },
        { index: 3, label: "Status", class: "colStatus", active: true, display: true, width: "85" },
        { index: 4, label: "Qty", class: "colQty", active: true, display: true, width: "80" },
        { index: 5, label: "Date", class: "colDate", active: true, display: true, width: "100" },
        { index: 6, label: "Transaction", class: "colTransaction", active: true, display: true, width: "100" },
        { index: 7, label: "Department", class: "colDepartment", active: true, display: true, width: "100" },
        { index: 8, label: "Bin", class: "colBin", active: true, display: true, width: "100" },
        { index: 9, label: "Barcode", class: "colBarcode", active: true, display: true, width: "100" },
    ];
    templateObject.tableheaderrecords.set(headerStructure);
});

Template.serialnumberlist.onRendered(function() {

    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();


    const dataTableList = [];
    const tableHeaderList = [];

    if (FlowRouter.current().queryParams.success) {
        $('.btnRefresh').addClass('btnRefreshAlert');
    }
    Meteor.call('readPrefMethod', localStorage.getItem('mycloudLogonID'), 'tblSerialNumberList', function(error, result) {
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
                    // let columnindex = customcolumn[i].index + 1;
                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

                }
            }

        }
    });

    function MakeNegative() {
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    templateObject.resetData = function(dataVal) {
        Meteor._reload.reload();
        // window.open('/serialnumberlist?page=last', '_self');
    }

    shareFunctionByName.initTable(localStorage.getItem("ERPDefaultDepartment"), "tblDepartmentCheckbox");

    // templateObject.getAllSerialNumberData();
    tableResize();
});

Template.serialnumberlist.events({
    'click .btnRefresh': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        stockTransferService.getAllSerialNumber(initialDataLoad, 0).then(function(data) {
            addVS1Data('TSerialNumberListCurrentReport', JSON.stringify(data)).then(function(datareturn) {
                window.open('/serialnumberlist', '_self');
            }).catch(function(err) {
                window.open('/serialnumberlist', '_self');
            });
        }).catch(function(err) {
            window.open('/serialnumberlist', '_self');
        });
    },
    'click .chkDatatable': function(event) {
        var columns = $('#tblSerialNumberList th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function(i, v) {
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
    'keyup #tblSerialNumberList_filter input': function(event) {
        if ($(event.target).val() != '') {
            $(".btnRefreshStockAdjustment").addClass('btnSearchAlert');
        } else {
            $(".btnRefreshStockAdjustment").removeClass('btnSearchAlert');
        }
        if (event.keyCode == 13) {
            $(".btnRefreshStockAdjustment").trigger("click");
        }
    },
    'click .btnRefreshStockAdjustment': function(event) {
        $(".btnRefresh").trigger("click");
    },
    'click .resetTable': function(event) {
        var getcurrentCloudDetails = CloudUser.findOne({ _id: localStorage.getItem('mycloudLogonID'), clouddatabaseID: localStorage.getItem('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblSerialNumberList' });
                if (checkPrefDetails) {
                    CloudPreference.remove({ _id: checkPrefDetails._id }, function(err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable': function(event) {
        let lineItems = [];
        //let datatable =$('#tblSerialNumberList').DataTable();
        $('.columnSettings').each(function(index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumn").text() || '';
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
            var colHidden = false;
            if ($tblrow.find(".custom-control-input").is(':checked')) {
                colHidden = false;
            } else {
                colHidden = true;
            }
            let lineItemObj = {
                index: index,
                label: colTitle,
                hidden: colHidden,
                width: colWidth,
                thclass: colthClass
            }

            lineItems.push(lineItemObj);
        });

        var getcurrentCloudDetails = CloudUser.findOne({ _id: localStorage.getItem('mycloudLogonID'), clouddatabaseID: localStorage.getItem('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblSerialNumberList' });
                if (checkPrefDetails) {
                    CloudPreference.update({ _id: checkPrefDetails._id }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'salesform',
                            PrefName: 'tblSerialNumberList',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function(err, idTag) {
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
                        PrefName: 'tblSerialNumberList',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');

                        }
                    });

                }
            }
        }
    },
    'blur .divcolumn': function(event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');

        var datable = $('#tblSerialNumberList').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function(event) {
        let range = $(event.target).val();
        // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblSerialNumberList th');
        $.each(datable, function(i, v) {

            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettings': function(event) {
        let templateObject = Template.instance();
        var columns = $('#tblSerialNumberList th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i, v) {
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
                sIndex: v.cellIndex || 0,
                sVisible: columVisible || false,
                sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
        });

        templateObject.tableheaderrecords.set(tableHeaderList);
    },
    'click #exportbtn': function() {

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblSerialNumberList_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .printConfirm': function(event) {
        playPrintAudio();
        setTimeout(function(){
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblSerialNumberList_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    }, delayTimeAfterSound);
    }
});
Template.serialnumberlist.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get();
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({ userid: localStorage.getItem('mycloudLogonID'), PrefName: 'tblSerialNumberList' });
    },
    // currentdate: () => {
    //     var currentDate = new Date();
    //     var begunDate = moment(currentDate).format("DD/MM/YYYY");
    //     return begunDate;
    // }
    // custom fields displaysettings
    custfields: () => {
        return Template.instance().custfields.get();
      },
  
      // custom fields displaysettings
      displayfields: () => {
        return Template.instance().displayfields.get();
      },
  
      convertedStatus: () => {
        return Template.instance().convertedStatus.get()
      },
  
      apiFunction:function() { // do not use arrow function
        return stockTransferService.getAllSerialNumber
      },
  
      searchAPI: function() {
        return stockTransferService.getSerialNumberListByDeptID
      },
  
      apiParams: function() {
        return ['dateFrom', 'dateTo', 'ignoredate', 'limitCount', 'limitFrom', 'deleteFilter'];
      },
  
      service: ()=>{
        return stockTransferService;
      },
  
      datahandler: function () {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
      }
});

Template.registerHelper("equals", function(a, b) {
    return a === b;
});
