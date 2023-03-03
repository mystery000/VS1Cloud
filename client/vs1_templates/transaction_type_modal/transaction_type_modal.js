import {ReactiveVar} from "meteor/reactive-var";
import {AccountService} from "../../accounts/account-service";
import {ProductService} from "../../product/product-service";

import {Template} from "meteor/templating";
import "./transaction_type_modal.html";

let productService = new ProductService();

Template.transaction_type_modal.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.deptrecords = new ReactiveVar([]);
});

Template.transaction_type_modal.onRendered(function () {
    let templateObject = Template.instance();
    let deptrecords = [];
    templateObject.getTransactionType = function () {
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
    templateObject.getTransactionType();
});

Template.transaction_type_modal.events({
    "click #myModalTransactionType button.btnTransactionTypeSelect": function () {

        $("#myModalTransactionType").modal("hide");
    },

    "change input.chkServiceCard": function() {
        console.log('123123');
    }
});

Template.transaction_type_modal.helpers({
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
