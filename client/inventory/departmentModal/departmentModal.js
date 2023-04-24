import { ReactiveVar } from "meteor/reactive-var";
import { AccountService } from "../../accounts/account-service";
import { ProductService } from "../../product/product-service";

import { Template } from "meteor/templating";
import "./departmentModal.html";
import {SideBarService} from "../../js/sidebar-service";

let productService = new ProductService();

Template.departmentModal.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.deptrecords = new ReactiveVar([]);
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);

  //
  templateObject.getDataTableList = function(data) {
    let linestatus = '';

    if (data.Active == true) {
      linestatus = "";
    } else if (data.Active == false) {
      linestatus = "In-Active";
    }

    let chkBox = '<div class="custom-control custom-switch chkBox pointer text-center">' +
        '<input name="pointer" class="custom-control-input chkBox notevent pointer" type="checkbox" id="f-' + data.ClassID + '" name="' + data.ClassID + '">' +
        '<label class="custom-control-label chkBox pointer" for="f--' + data.ClassID +
        '"></label></div>'; //switchbox

    let dataList = [
      chkBox,
      data.ClassID || "",
      data.ClassName || "",
      data.Description || "",
      data.ClassGroup || "",
      data.ClassName,
      data.Level1 || "",
      linestatus
    ];

    return dataList;
  }

  let checkBoxHeader = `<div class="custom-control custom-switch colChkBoxAll pointer" style="width:15px;">
        <input name="pointer" class="custom-control-input colChkBoxAll pointer" type="checkbox" id="colChkBoxAll" value="0">
        <label class="custom-control-label colChkBoxAll" for="colChkBoxAll"></label>
        </div>`;
  let headerStructure = [
    { index: 0, label: checkBoxHeader, class: 'colCheckBox', active: true, display: false, width: "10" },
    { index: 1, label: "ID", class: 'colID', active: false, display: false, width: "10" },
    { index: 2, label: 'Department Name', class: 'colDeptClassName', active: true, display: true, width: "200" },
    { index: 3, label: 'Description', class: 'colDescription', active: true, display: true, width: "500" },
    { index: 4, label: 'Header Department', class: 'colHeaderDept', active: false, display: true, width: "250" },
    { index: 5, label: 'Full Department Name', class: 'colFullDeptName', active: false, display: true, width: "250" },
    { index: 6, label: 'Department Tree', class: 'colDeptTree', active: false, display: true, width: "250" },
    { index: 7, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
  ];

  templateObject.tableheaderrecords.set(headerStructure);
});

Template.departmentModal.onRendered(function () {
  let templateObject = Template.instance();
  let deptrecords = [];
  templateObject.getDepartments = function () {
    getVS1Data("TDeptClass")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          productService.getDepartment().then(function (data) {
            //let deptArr = [];
            for (let i in data.tdeptclass) {
              let deptrecordObj = {
                id: data.tdeptclass[i].Id || " ",
                department: data.tdeptclass[i].DeptClassName || " ",
              };
              //deptArr.push(data.tdeptclass[i].DeptClassName);
              deptrecords.push(deptrecordObj);
            }
            templateObject.deptrecords.set(deptrecords);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tdeptclass;
          for (let i in useData) {
            let deptrecordObj = {
              id: useData[i].Id || " ",
              department: useData[i].DeptClassName || " ",
            };
            //deptArr.push(data.tdeptclass[i].DeptClassName);
            deptrecords.push(deptrecordObj);
          }
          templateObject.deptrecords.set(deptrecords);
        }
      })
      .catch(function (err) {
        productService.getDepartment().then(function (data) {
          //let deptArr = [];
          for (let i in data.tdeptclass) {
            let deptrecordObj = {
              id: data.tdeptclass[i].Id || " ",
              department: data.tdeptclass[i].DeptClassName || " ",
            };
            //deptArr.push(data.tdeptclass[i].DeptClassName);
            deptrecords.push(deptrecordObj);
          }
          templateObject.deptrecords.set(deptrecords);
        });
      });
  };
  templateObject.getDepartments();

  // Damien
  // Set focus when open account list modal
  $("#myModalDepartment").on('shown.bs.modal', function(){
    setTimeout(function() {
      $('#tbldepartmentlist_filter .form-control-sm').get(0).focus();
    }, 500);
  });
});

Template.departmentModal.events({
  "click .btnSaveSelect": async function () {
    playSaveAudio();
    setTimeout(function () {
      $("#myModalDepartment").modal("toggle");
      $(".fullScreenSpin").css("display", "none");
      $(".modal-backdrop").css("display", "none");
    }, delayTimeAfterSound);
  },
  "click .btnAddNewDepartment": function(e) {
    e.preventDefault();

    $("#newDeptHeader").text("Add New Department");

    $("#newDepartmentModal").modal();
  },
  "click #tbldepartmentlist tbody tr td:not(.colCheckBox)": function(e) {
    e.preventDefault();

    let selectedDepartmentName = $(e.target.parentElement).find(".colDeptClassName").text();
    let selectedDescription = $(e.target.parentElement).find(".colDescription").text();
    let selectedID = $(e.target.parentElement).find(".ClassID").text();

    $("#edtNewDeptName").val(selectedDepartmentName);
    $("#edtDeptDesc").val(selectedDescription);
    $("#edtDepartmentID").val(selectedID);
    $("#newDeptHeader").text("Edit Department");

    $("#newDepartmentModal").modal();
  },
});

Template.departmentModal.helpers({
  deptrecords: () => {
    return Template.instance()
      .deptrecords.get()
      .sort(function (a, b) {
        if (a.department == "NA") {
          return 1;
        } else if (b.department == "NA") {
          return -1;
        }
        return a.department.toUpperCase() > b.department.toUpperCase() ? 1 : -1;
      });
  },
  datatablerecords: () => {
    return Template.instance().datatablerecords.get().sort(function(a, b) {
      return (a.ClassName.toUpperCase() > b.ClassName.toUpperCase()) ? 1 : -1;
    });
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },

  apiFunction:function() {
    let sideBarService = new SideBarService();
    return sideBarService.getDepartmentDataList;
  },

  searchAPI: function() {
    let sideBarService = new SideBarService();
    return sideBarService.getDepartmentDataListByName;
  },

  service: ()=>{
    return new SideBarService();
  },

  datahandler: function () {
    let templateObject = Template.instance();
    return function(data) {
      return templateObject.getDataTableList(data);
    }
  },

  exDataHandler: function() {
    let templateObject = Template.instance();
    return function(data) {
      return templateObject.getDataTableList(data);
    }
  },

  apiParams: function() {
    return ['limitCount', 'limitFrom', 'deleteFilter'];
  },
});
