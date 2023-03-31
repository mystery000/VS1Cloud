import { ReactiveVar } from "meteor/reactive-var";
import { AccountService } from "../../accounts/account-service";
import { ProductService } from "../../product/product-service";

import { Template } from "meteor/templating";
import "./departmentModal.html";

let productService = new ProductService();

Template.departmentModal.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.deptrecords = new ReactiveVar([]);
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
  // For focus into search field
  $( "#myModalDepartment" ).on('shown.bs.modal', function(){
    setTimeout(function() {
      $('#tblDepartmentCheckbox_filter .form-control-sm').get(0).focus()
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
});
