import {PurchaseBoardService} from '../js/purchase-service';
import { ReactiveVar } from 'meteor/reactive-var';
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
import { Template } from 'meteor/templating';
import './bankrulelist.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {BankNameService} from "../lib/global/bank-names";

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let bankNameService = new BankNameService();

Template.bankrulelist.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

});

Template.bankrulelist.onRendered(function() {
    let templateObject = Template.instance();


    templateObject.resetData = function () {
        let headerStructure = [
            {index: 0, label: "Bank Name", class: "colBankName", width: "200", active: true, display: true},
            {index: 1, label: "Description", class: "colDescription", width: "300", active: true, display: true},
            {index: 2, label: "Created At", class: "colDate", width: "300", active: true, display: true},
        ];
        templateObject.tableheaderrecords.set(headerStructure);
    };
    templateObject.resetData();

    templateObject.getDataTableList = function(data) {
        let dataList = [
            data.bankname,
            data.description,
            data.date
        ];
        return dataList;
    }

    $('#tblBankRuleList tbody').on( 'click', 'tr', function () {
        var table = $(this);
        let bankName = table.find(".colBankName").text();
        if(bankName){
            window.open('/newbankrule?preview=1&bankaccountid=1&bankaccountname=' + bankName,'_self');
        }
    });
});

Template.bankrulelist.events({
    'click #btnBankRule':function(event){
        FlowRouter.go('/newbankrule');
    },
    'click .chkDatatable' : function(event){
        const columns = $('#tblbankrulelist th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();
        $.each(columns, function(i,v) {
            let className = v.classList;
            let replaceClass = className[1];
            if (v.innerText == columnDataValue){
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
    'click .resetTable' : function(event){
        const getcurrentCloudDetails = CloudUser.findOne({
            _id: localStorage.getItem('mycloudLogonID'),
            clouddatabaseID: localStorage.getItem('mycloudLogonDBID')
        });
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                const clientID = getcurrentCloudDetails._id;
                const clientUsername = getcurrentCloudDetails.cloudUsername;
                const clientEmail = getcurrentCloudDetails.cloudEmail;
                const checkPrefDetails = CloudPreference.findOne({userid: clientID, PrefName: 'tblbankrulelist'});
                if (checkPrefDetails) {
                    CloudPreference.remove({_id:checkPrefDetails._id}, function(err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable' : function(event){
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
            _id: localStorage.getItem('mycloudLogonID'),
            clouddatabaseID: localStorage.getItem('mycloudLogonDBID')
        });
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                const clientID = getcurrentCloudDetails._id;
                const clientUsername = getcurrentCloudDetails.cloudUsername;
                const clientEmail = getcurrentCloudDetails.cloudEmail;
                const checkPrefDetails = CloudPreference.findOne({userid: clientID, PrefName: 'tblbankrulelist'});
                if (checkPrefDetails) {
                    CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                                                                               PrefGroup:'salesform',PrefName:'tblbankrulelist',published:true,
                                                                               customFields:lineItems,
                                                                               updatedAt: new Date() }}, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');
                        }
                    });
                } else {
                    CloudPreference.insert({ userid: clientID,username:clientUsername,useremail:clientEmail,
                                            PrefGroup:'salesform',PrefName:'tblbankrulelist',published:true,
                                            customFields:lineItems,
                                            createdAt: new Date() }, function(err, idTag) {
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
    'blur .divcolumn' : function(event){
        let columData = $(event.target).text();
        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        const datable = $('#tblbankrulelist').DataTable();
        const title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange' : function(event){
        let range = $(event.target).val();
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        const datable = $('#tblbankrulelist th');
        $.each(datable, function(i,v) {
            if(v.innerText == columnDataValue){
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("."+replaceClass+"").css('width',range+'px');
            }
        });
    },
    'click .btnOpenSettings' : function(event){
        let templateObject = Template.instance();
        const columns = $('#tblbankrulelist th');
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
    'click #exportbtn': function () {
        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblbankrulelist_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');
    },
    'change #dateTo': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        setTimeout(function(){
            const dateFrom = new Date($("#dateFrom").datepicker("getDate"));
            const dateTo = new Date($("#dateTo").datepicker("getDate"));
            let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
            let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
            //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
            const formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
            //templateObject.dateAsAt.set(formatDate);
            if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {

            } else {
              templateObject.getAllFilterBankRule(formatDateFrom,formatDateTo, false);
            }
        },500);
    },
    'change #dateFrom': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        setTimeout(function(){
            const dateFrom = new Date($("#dateFrom").datepicker("getDate"));
            const dateTo = new Date($("#dateTo").datepicker("getDate"));

            let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
            let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
            //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
            const formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
            //templateObject.dateAsAt.set(formatDate);
            if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {

            } else {
                templateObject.getAllFilterBankRule(formatDateFrom,formatDateTo, false);
            }
        },500);
    },
    'click #today': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        const currentBeginDate = new Date();
        const begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();
        if ((currentBeginDate.getMonth()+1) < 10){
            fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
        } else {
          fromDateMonth = (currentBeginDate.getMonth()+1);
        }

        if(currentBeginDate.getDate() < 10){
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        const toDateERPFrom = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
        const toDateERPTo = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
        const toDateDisplayFrom = (fromDateDay) + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();
        const toDateDisplayTo = (fromDateDay) + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();
        $("#dateFrom").val(toDateDisplayFrom);
        $("#dateTo").val(toDateDisplayTo);
        templateObject.getAllFilterBankRule(toDateERPFrom,toDateERPTo, false);
    },
    'click #lastweek': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        const currentBeginDate = new Date();
        const begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();
        if ((currentBeginDate.getMonth()+1) < 10){
            fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
        } else {
          fromDateMonth = (currentBeginDate.getMonth()+1);
        }
        if(currentBeginDate.getDate() < 10){
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        const toDateERPFrom = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay - 7);
        const toDateERPTo = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
        const toDateDisplayFrom = (fromDateDay - 7) + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();
        const toDateDisplayTo = (fromDateDay) + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();
        $("#dateFrom").val(toDateDisplayFrom);
        $("#dateTo").val(toDateDisplayTo);
        templateObject.getAllFilterBankRule(toDateERPFrom,toDateERPTo, false);
    },
    'click #lastMonth': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        const currentDate = new Date();
        const prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const prevMonthFirstDate = new Date(currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1), (currentDate.getMonth() - 1 + 12) % 12, 1);
        const formatDateComponent = function (dateComponent) {
            return (dateComponent < 10 ? '0' : '') + dateComponent;
        };
        const formatDate = function (date) {
            return formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
        };
        const formatDateERP = function (date) {
            return date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
        };
        const fromDate = formatDate(prevMonthFirstDate);
        const toDate = formatDate(prevMonthLastDate);
        $("#dateFrom").val(fromDate);
        $("#dateTo").val(toDate);
        const getLoadDate = formatDateERP(prevMonthLastDate);
        let getDateFrom = formatDateERP(prevMonthFirstDate);
        templateObject.getAllFilterBankRule(getDateFrom,getLoadDate, false);
    },
    'click #lastQuarter': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        const currentDate = new Date();
        let begunDate = moment(currentDate).format("DD/MM/YYYY");
        function getQuarter(d) {
            d = d || new Date();
            const m = Math.floor(d.getMonth() / 3) + 2;
            return m > 4 ? m - 4 : m;
        }
        const quarterAdjustment = (moment().month() % 3) + 1;
        const lastQuarterEndDate = moment().subtract({
            months: quarterAdjustment
        }).endOf('month');
        const lastQuarterStartDate = lastQuarterEndDate.clone().subtract({
            months: 2
        }).startOf('month');
        const lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
        const lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");
        $("#dateFrom").val(lastQuarterStartDateFormat);
        $("#dateTo").val(lastQuarterEndDateFormat);
        let fromDateMonth = getQuarter(currentDate);
        const quarterMonth = getQuarter(currentDate);
        let fromDateDay = currentDate.getDate();
        const getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
        let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
        templateObject.getAllFilterBankRule(getDateFrom,getLoadDate, false);
    },
    'click #last12Months': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        const currentDate = new Date();
        const begunDate = moment(currentDate).format("DD/MM/YYYY");
        let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
        let fromDateDay = currentDate.getDate();
        if ((currentDate.getMonth()+1) < 10) {
            fromDateMonth = "0" + (currentDate.getMonth()+1);
        }
        if (currentDate.getDate() < 10) {
            fromDateDay = "0" + currentDate.getDate();
        }
        const fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() - 1);
        $("#dateFrom").val(fromDate);
        $("#dateTo").val(begunDate);
        const currentDate2 = new Date();
        let fromDateMonth2, fromDateDay2;
        if ((currentDate2.getMonth()+1) < 10) {
            fromDateMonth2 = "0" + Math.floor(currentDate2.getMonth() + 1);
        }
        if (currentDate2.getDate() < 10) {
            fromDateDay2 = "0" + currentDate2.getDate();
        }
        const getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
        let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + fromDateMonth2 + "-" + currentDate2.getDate();
        templateObject.getAllFilterBankRule(getDateFrom,getLoadDate, false);
    },
    'click #ignoreDate': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', true);
        $('#dateTo').attr('readonly', true);
        templateObject.getAllFilterBankRule('', '', true);
    },
});

Template.bankrulelist.helpers({
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },

    apiFunction:function() {
        return bankNameService.getBankNameList;
    },

    searchAPI: function() {
        return bankNameService.getBankNameList;
    },

    service: ()=>{
        let bankNameService = new BankNameService();
        return bankNameService;

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
        return [];
    },
});
