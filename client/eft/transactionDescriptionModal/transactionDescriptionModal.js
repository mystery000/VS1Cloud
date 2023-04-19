import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import './transactionDescriptionModal.html'
import {SideBarService} from "../../js/sidebar-service";

let sideBarService = new SideBarService();
Template.transactionDescriptionModal.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.eftOptionsList = new ReactiveVar([]);

  templateObject.tableheaderrecords = new ReactiveVar([]);

  templateObject.getDataTableList = function(data) {
    let linestatus = '';
    if(data.length == 3){
    
      if(data[2] == true){
        linestatus = "";
      }
      else if(data[2] == false){
        linestatus = "In-Active";
      }
    }
    let dataList = [
      data[0],
      data[1],
      linestatus
    ];
    return dataList;
  }
    

  let headerStructure = [
    {index: 0, label: "ID", active: false, width: "30", class: "colID", display: true},
    {index: 1, label: "Transaction Description", active: true, width: "500", class: "colTransactionDescription", display: true},
    {index: 2, label: "Status", active: true, width: "120", class: "colStatus", display: true}
  ];
  templateObject.tableheaderrecords.set(headerStructure);
});

Template.transactionDescriptionModal.onRendered(async function () {
  const templateObject = Template.instance();

  async function saveDisplaySettings() {
    let headers = templateObject.tableheaderrecords.get();
    let lineItems = [];
    let tableName = 'tblTransactionDescription';
    $(".fullScreenSpin").css("display", "inline-block");

    

    
    try {
        let erpGet = erpDb();

        let employeeId = parseInt(localStorage.getItem('mySessionEmployeeLoggedID')) || 0;
        let added = await sideBarService.saveNewCustomFields(erpGet, tableName, employeeId, headers);
        if (added) {
          sideBarService.getNewCustomFieldsWithQuery(parseInt(localStorage.getItem('mySessionEmployeeLoggedID')), '').then(async function (dataCustomize) {
              await addVS1Data('VS1_Customize', JSON.stringify(dataCustomize));
              $(".fullScreenSpin").css("display", "none");
              
          });
        } else {
        }
    } catch (error) {
        $(".fullScreenSpin").css("display", "none");
        swal("Something went wrong!", "", "error");
    }
  }
  
  await saveDisplaySettings();
});

Template.transactionDescriptionModal.events({

});

Template.transactionDescriptionModal.helpers({

  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },

  apiFunction:function() {
    let sideBarService = new SideBarService();
    return sideBarService.getTransactionDescription;
  },

  searchAPI: function() {
    let sideBarService = new SideBarService();
    return sideBarService.getTransactionDescription;
  },

  service: ()=>{
    let sideBarService = new SideBarService();
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
      let dataReturn =  templateObject.getDataTableList(data)
      return dataReturn
    }
  },

  apiParams: function() {
    return [];
  },
});
