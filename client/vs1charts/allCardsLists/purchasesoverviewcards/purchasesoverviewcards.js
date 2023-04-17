import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from "../../../js/sidebar-service";
import { UtilityService } from "../../../utility-service";

import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './purchasesoverviewcards.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let _ = require("lodash");
const _cardGroup = 'TPurchaseHeaderCard';
const _tabGroup = 7;

Template.purchasesoverviewcards.onCreated(function() {
    const templateObject = Template.instance();
});

Template.purchasesoverviewcards.onRendered(function() {
  let templateObject = Template.instance();
  const dataTableList = [];  
  let totAmount = 0;
  let totAmountBill = 0;
  let totAmountCredit = 0;

  let totCreditCount = 0;
  let totBillCount = 0;
  let totPOCount = 0;

  templateObject.getDataFromAPI = function() {
    $(".fullScreenSpin").css("display", "inline-block");
    sideBarService
      .getAllPurchaseOrderListAll(
        moment($("#dateFrom").val(), "DD/MM/YYYY").format("YYYY-MM-DD"),
        moment($("#dateTo").val(), "DD/MM/YYYY").format("YYYY-MM-DD"),
        false,
        initialReportLoad,
        0
      )
      .then(function (data) {
        $(".fullScreenSpin").css("display", "none");      
        // addVS1Data("TbillReport", JSON.stringify(data));
        templateObject.displayData(data.tbillreport)
      })
      .catch(function (err) {  
        $(".fullScreenSpin").css("display", "none");      
      });
  }

  templateObject.displayData = function(useData) {
    let totalExpense = 0;
    let totalBill = 0;
    let totalCredit = 0;
    let totalPO = 0;            
    for (let i = 0; i < useData.length; i++) {
      totalExpense += Number(useData[i]["Total Amount (Inc)"]);
      let orderType = useData[i].Type;
      if (useData[i].Type == "Credit") {
        totCreditCount++;
        totalCredit += Number(useData[i]["Total Amount (Inc)"]);
      }

      if (useData[i].Type == "Bill") {
        totBillCount++;
        totalBill += Number(useData[i]["Total Amount (Inc)"]);
      }

      if (useData[i].Type == "Purchase Order") {
        totPOCount++;
        orderType = "PO";
        totalPO += Number(useData[i]["Total Amount (Inc)"]);
      }
      let totalAmountEx =
        utilityService.modifynegativeCurrencyFormat(
          useData[i]["Total Amount (Ex)"]
        ) || 0.0;
      let totalTax =
        utilityService.modifynegativeCurrencyFormat(
          useData[i]["Total Tax"]
        ) || 0.0;
      let totalAmount =
        utilityService.modifynegativeCurrencyFormat(
          useData[i]["Total Amount (Inc)"]
        ) || 0.0;
      let amountPaidCalc =
        useData[i]["Total Amount (Inc)"] - useData[i].Balance;
      let totalPaid =
        utilityService.modifynegativeCurrencyFormat(amountPaidCalc) ||
        0.0;
      let totalOutstanding =
        utilityService.modifynegativeCurrencyFormat(useData[i].Balance) ||
        0.0;
      var dataList = {
        id: useData[i].PurchaseOrderID || "",
        employee: useData[i].Contact || "",
        sortdate:
          useData[i].OrderDate != ""
            ? moment(useData[i].OrderDate).format("YYYY/MM/DD")
            : useData[i].OrderDate,
        orderdate:
          useData[i].OrderDate != ""
            ? moment(useData[i].OrderDate).format("DD/MM/YYYY")
            : useData[i].OrderDate,
        suppliername: useData[i].Company || "",
        totalamountex: totalAmountEx || 0.0,
        totaltax: totalTax || 0.0,
        totalamount: totalAmount || 0.0,
        totalpaid: totalPaid || 0.0,
        totaloustanding: totalOutstanding || 0.0,
        // orderstatus: useData[i].OrderStatus || '',
        type: orderType || "",
        custfield1: useData[i].Phone || "",
        custfield2: useData[i].InvoiceNumber || "",
        comments: useData[i].Comments || "",
      };
      //if (useData[i].Deleted === false) {
      dataTableList.push(dataList);
      //if (useData[i].Balance != 0) {
      if (useData[i].Type == "Purchase Order") {
        totAmount += Number(useData[i].Balance);
      }

      if (useData[i].Type == "Bill") {
        totAmountBill += Number(useData[i].Balance);
      }

      if (useData[i].Type == "Credit") {
        totAmountCredit += Number(useData[i].Balance);
      }
      //}
      //}
      $(".suppAwaitingAmt").text(
        utilityService.modifynegativeCurrencyFormat(totAmount)
      );
      $(".billAmt").text(
        utilityService.modifynegativeCurrencyFormat(totAmountBill)
      );
      $(".creditAmt").text(
        utilityService.modifynegativeCurrencyFormat(totAmountCredit)
      );
      // splashArray.push(dataList);
      //}
    }    
  }

  templateObject.getAllPurchaseOrderAll = function () {    
      getVS1Data("TbillReport")
        .then(function (dataObject) {          
          if (dataObject.length == 0) {
            templateObject.getDataFromAPI()
          } else {
            let data = JSON.parse(dataObject[0].data);
            let useData = data.tbillreport;
            templateObject.displayData(useData)
          }
        })
        .catch(function (err) {
          templateObject.getDataFromAPI()
        });
  };

  templateObject.getAllPurchaseOrderAll();
  $(document).on("change", "#dateFrom, #dateTo", templateObject.getDataFromAPI)
});

Template.purchasesoverviewcards.helpers({

});
