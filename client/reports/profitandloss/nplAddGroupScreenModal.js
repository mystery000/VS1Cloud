import { ReportService } from "../report-service";
import { UtilityService } from "../../utility-service";
import layoutEditor from "./layoutEditor";
import ApiService from "../../js/Api/Module/ApiService";
import { ProductService } from "../../product/product-service";
import ProfitLossLayout from "../../js/Api/Model/ProfitLossLayout";
import ProfitLossLayoutFields from "../../js/Api/Model/ProfitLossLayoutFields";
import ProfitLossLayoutApi from "../../js/Api/ProfitLossLayoutApi";
import { TaxRateService } from "../../settings/settings-service";
import LoadingOverlay from "../../LoadingOverlay";
import GlobalFunctions from "../../GlobalFunctions";
import moment from "moment";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";
import CachedHttp from "../../lib/global/CachedHttp";
import erpObject from "../../lib/global/erp-objects";
import TemplateInjector from "../../TemplateInjector";
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import "jQuery.print/jQuery.print.js";
import { jsPDF } from "jspdf";
import Datehandler from "../../DateHandler";
import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './nplAddGroupScreenModal.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let utilityService = new UtilityService();
let reportService = new ReportService();
let taxRateService = new TaxRateService();

const templateObject = Template.instance();
const productService = new ProductService();
const defaultPeriod = 3;
const employeeId = localStorage.getItem("mySessionEmployeeLoggedID");
let defaultCurrencyCode = CountryAbbr; // global variable "AUD"

Template.npladdgroupscreen.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.departments = new ReactiveVar([]);
  templateObject.reportOptions = new ReactiveVar();
  templateObject.recordslayout = new ReactiveVar([]);
  templateObject.profitlosslayoutrecords = new ReactiveVar([]);
  templateObject.profitlosslayoutfields = new ReactiveVar([]);
  templateObject.daterange = new ReactiveVar();
  FxGlobalFunctions.initVars(templateObject);
});

Template.npladdgroupscreen.onRendered(function () {
  const templateObject = Template.instance();
});

Template.npladdgroupscreen.events({
  "click .saveProfitLossLayouts": async function () {

    $('.fullScreenSpin').css('display', 'block');
    buildPositions();

    const profitLossLayoutApis = new ProfitLossLayoutApi();

    // make post request to save layout data
    const apiEndpoint = profitLossLayoutApis.collection.findByName(
      profitLossLayoutApis.collectionNames.TProfitLossLayout
    );

    const pSortfields = $(".pSortItems");
    const employeeId = localStorage.getItem("mySessionEmployeeLoggedID");
    let pSortList = [];
    pSortfields.each(function(){
      let Position = $(this).attr('position');
      let accountType = $(this).data('group');
      pSortList.push({
        "position": Position,
        "accountType": accountType,
        "employeeId": employeeId,
        "subAccounts": buildSubAccountJson( $(this).find('ol li') )
      });
    });

    /**
     *
     * Update all layout fields index DB
     */
    let name = $("#nplLayoutName").val();
    let description = $("#nplLayoutDescr").val();
    let isdefault = $("#npldefaultSettting").is(":checked") ? true : false;
    let profitLossLayoutData = {
      "type": "TProfitLossLayout",
      "action": "save",
      "layout": pSortList
    }

    try {
      const ApiResponse = await apiEndpoint.fetch(null, {
          method: "POST",
          headers: ApiService.getPostHeaders(),
          body: JSON.stringify(profitLossLayoutData),
      });

      if (ApiResponse.ok == true) {
          const jsonResponse = await ApiResponse.json();
          LoadingOverlay.hide();
      }else{
          LoadingOverlay.hide();
      }
  } catch (error) {
      LoadingOverlay.hide();
  }

    // "type": "TProfitLossLayout",
    // "action": "save",
    // "layout": [

    // let layoutLists = {
    //   Name: name,
    //   Description: description,
    //   Isdefault: isdefault,
    //   EmployeeID: employeeID,
    //   LayoutLists: profitlosslayoutfields,
    // };
    // await addVS1Data("TProfitLossEditLayout", JSON.stringify(layoutLists));
  },
});

Template.npladdgroupscreen.helpers({
  companyname: () => {
    return loggedCompany;
  },
  dateAsAt: () => {
    const templateObject = Template.instance();
    return templateObject.data.dateAsAt || "";
  },
  profitlosslayoutrecords() {
    const templateObject = Template.instance();
    return templateObject.data.profitlosslayoutrecords || [];
  },
  recordslayout: () => {
    return Template.instance().recordslayout.get();
  },
});

Template.registerHelper("equal", function (a, b) {
  return a == b;
});

Template.registerHelper("equals", function (a, b) {
  return a === b;
});

Template.registerHelper("notEquals", function (a, b) {
  return a != b;
});

Template.registerHelper("containsequals", function (a, b) {
  let chechTotal = false;
  if (a.toLowerCase().indexOf(b.toLowerCase()) >= 0) {
    chechTotal = true;
  }
  return chechTotal;
});

Template.registerHelper("shortDate", function (a) {
  let dateIn = a;
  let dateOut = moment(dateIn, "DD/MM/YYYY").format("MMM YYYY");
  return dateOut;
});

Template.registerHelper("noDecimal", function (a) {
  let numIn = a;
  let numOut = parseInt(numIn);
  return numOut;
});
