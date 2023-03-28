import '../lib/global/indexdbstorage.js';
import { ReactiveVar } from 'meteor/reactive-var';
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';

import { Template } from 'meteor/templating';
import './salesorderlistpop.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.salesorderslistpop.onCreated(()=>{
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.custfields = new ReactiveVar([]);
    templateObject.displayfields = new ReactiveVar([]);
    templateObject.reset_data = new ReactiveVar([]);
    templateObject.convertedStatus = new ReactiveVar();


    templateObject.getDataTableList = function(data){

        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.TotalAmount)|| 0.00;
        let totalTax = utilityService.modifynegativeCurrencyFormat(data.TotalTax) || 0.00;
        // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.TotalAmountInc)|| 0.00;
        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.Payment)|| 0.00;
        let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.Balance)|| 0.00;
        let salestatus = data.QuoteStatus || '';
        if(data.Deleted == true){
          salestatus = "Deleted";
        }else if(data.CustomerName == ''){
          salestatus = "Deleted";
        };
        let dataList = [
            data.SaleDate !=''? moment(data.SaleDate).format("YYYY/MM/DD"): data.SaleDate,
            data.SaleDate !=''? moment(data.SaleDate).format("DD/MM/YYYY"): data.SaleDate,
            data.SaleID || '',
            data.DueDate !=''? moment(data.DueDate).format("DD/MM/YYYY"): data.DueDate,
            data.CustomerName || '',
            totalAmountEx || 0.00,
            totalTax || 0.00,
            totalAmount || 0.00,
            data.EmployeeName || '',
            data.Converted? 'Converted': 'Unconverted',
            data.Comments || '',
            data.SaleCustField1 || '',
            data.SaleCustField2 || '',
            data.SaleCustField3 || '',
            salestatus || '',
        ];
        return dataList;
    }

    templateObject.getExData = function(data){
    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmount) || 0.00;
    let totalTax = utilityService.modifynegativeCurrencyFormat(data.fields.TotalTax) || 0.00;
    // Currency+''+data.fields.TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc) || 0.00;
    let totalPaid = utilityService.modifynegativeCurrencyFormat(data.fields.TotalPaid) || 0.00;
    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance) || 0.00;
    let salestatus = data.fields.SalesStatus || '';
    if(data.fields.Deleted == true){
        salestatus = "Deleted";
    }else if(data.fields.CustomerName == ''){
        salestatus = "Deleted";
    };
    var dataList = [
        data.fields.SaleDate != '' ? moment(data.fields.SaleDate).format("YYYY/MM/DD") : data.fields.SaleDate,
        data.fields.SaleDate != '' ? moment(data.fields.SaleDate).format("DD/MM/YYYY") : data.fields.SaleDate,
        data.fields.ID || '',
        data.fields.DueDate != '' ? moment(data.fields.DueDate).format("DD/MM/YYYY") : data.fields.DueDate,
        data.fields.CustomerName || '',
        totalAmountEx || 0.00,
        totalTax || 0.00,
        totalAmount || 0.00,
        salestatus || '',
        data.fields.EmployeeName || '',
        data.fields.Converted? 'Converted': 'Unconverted',
        data.fields.Comments || '',
    ];
    return dataList
    }
    let headerStructure = [ { index: 0, label: '#Sort Date', class:'colSortDate', active: false, display: true, width: "20" },
        { index: 1, label: "Sale Date", class: "colSaleDate", active: true, display: true, width: "100" },
        { index: 2, label: "Sales No.", class: "colSalesNo", active: true, display: true, width: "100" },
        { index: 3, label: "Due Date", class: "colDueDate", active: true, display: true, width: "100" },
        { index: 4, label: "Customer", class: "colCustomer", active: true, display: true, width: "150" },
        { index: 5, label: "Amount (Ex)", class: "colAmountEx", active: true, display: true, width: "100" },
        { index: 6, label: "Tax", class: "colTax", active: true, display: true, width: "100" },
        { index: 7, label: "Amount (Inc)", class: "colAmount", active: true, display: true, width: "100" },
        { index: 8, label: "Employee", class: "colEmployee", active: true, display: true, width: "100" },
        { index: 9, label: "Converted", class: "colConverted", active: true, display: true, width: "80" },
        { index: 10, label: "Comments", class: "colComments", active: true, display: true, width: "80" },
        { index: 11, label: "Status", class: "colStatus", active: true, display: true, width: "60" },
    ]

    let custFields = [];
      let customFieldCount = 3; // customfield tempcode
      let customData = {};
      let displayfields = headerStructure;

      sideBarService.getAllCustomFields().then(function (data) {
        let custIndex = 0;
        for (let x = 0; x < data.tcustomfieldlist.length; x++) {
          if (data.tcustomfieldlist[x].fields.ListType == 'ltSales') {

            customData = {
              index: displayfields.length+ custIndex,
              active: data.tcustomfieldlist[x].fields.Active || false,
              id: parseInt(data.tcustomfieldlist[x].fields.ID) || 0,
              label: data.tcustomfieldlist[x].fields.Description || "",
              class: "custfield" + x,
              display: true,
              width: "100"
            };
            custIndex++
            custFields.push(customData);
          }
        }

        if (custFields.length < customFieldCount) {
          let remainder = customFieldCount - custFields.length;
          let getRemCustomFields = parseInt(custFields.length);
          // count = count + remainder;
          for (let r = 0; r < remainder; r++) {
            getRemCustomFields++;
            customData = {
              index: displayfields.length + r,
              active: false,
              id: "",
              label: "Custom Field " + getRemCustomFields,
              class: "custfield" + r + customFields.length,
              display: true,
              width: "120"
            };
            // count++;
            custFields.push(customData);
          }
        }

        displayfields = displayfields.concat(custFields);
        templateObject.custfields.set(custFields);
        // setTimeout(() => {
          templateObject.tableheaderrecords.set(displayfields);
        // }, 500);

      })
  
})

Template.salesorderslistpop.onRendered(()=>{
    const templateObject = Template.instance();
    templateObject.convertedStatus.set(FlowRouter.current().queryParams.converted == 'true' ? "Converted" : "Unconverted");

    
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if ((currentDate.getMonth() + 1) < 10) {
        fromDateMonth = "0" + (currentDate.getMonth() + 1);
    }

    if (currentDate.getDate() < 10) {
        fromDateDay = "0" + currentDate.getDate();
    }
    var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();

    $("#date-input,#dateTo,#dateFrom").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/imgCal2.png',
        dateFormat: 'dd/mm/yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
        onChangeMonthYear: function(year, month, inst){
        // Set date to picker
        $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
        // Hide (close) the picker
        // $(this).datepicker('hide');
        // // Change ttrigger the on change function
        // $(this).trigger('change');
       }
    });

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);


    templateObject.resetData = function (dataVal) {
        if(FlowRouter.current().queryParams.converted){
          if(FlowRouter.current().queryParams.converted === true) {
            location.reload();
          }else{
            location.reload();
          }
        }else {
          location.reload();
        }
    }



})

Template.salesorderslistpop.events({
    "click #btnCreateNewSalesorder": function(event) {
        $('.fullScreenSpin').css('display', 'none');
        $('#salesOrderListModal').modal('toggle');
        setTimeout(()=>{
            FlowRouter.go('/salesordercard')
        }, 100)
    } 
})

Template.salesorderslistpop.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get()
    },

    tableheaderrecords:()=> {
        return Template.instance().tableheaderrecords.get()
    },

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
    return sideBarService.getAllTSalesOrderListData
    },

    searchAPI: function() {
    return sideBarService.getNewSalesOrderByNameOrID
    },

    apiParams: function() {
    return ['dateFrom', 'dateTo', 'ignoredate', 'limitCount', 'limitFrom', 'deleteFilter'];
    },

    service: ()=>{
    return sideBarService;
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
        let dataReturn = templateObject.getExData(data);
        return dataReturn
    }
    }

})
