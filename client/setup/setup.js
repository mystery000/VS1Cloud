import { Meteor, fetch } from "meteor/meteor";
import { ReactiveVar } from "meteor/reactive-var";
import { OrganisationService } from "../js/organisation-service";
import { CountryService } from "../js/country-service";
import { TaxRateService } from "../settings/settings-service";
import { SideBarService } from "../js/sidebar-service";
import { UtilityService } from "../utility-service";
import { PurchaseBoardService } from "../js/purchase-service";
import LoadingOverlay from "../LoadingOverlay";
import Employee from "../js/Api/Model/Employee";
import { AccountService } from "../accounts/account-service";
import "jquery-editable-select";
import { ContactService } from "../contacts/contact-service";
import ApiService from "../js/Api/Module/ApiService";
import XLSX from 'xlsx';
import FxGlobalFunctions from "../packages/currency/FxGlobalFunctions";
import '../lib/global/utBarcodeConst.js';
import '../lib/global/indexdbstorage.js';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './AddTermModal.html'
import './setup.html';
import './organization-settings.html'
import '../settings/paymentmethod-setting/paymentmethods.js'
import '../settings/tax-rates-setting/tax-rates.js'

let organisationService = new OrganisationService();
let sideBarService = new SideBarService();
const contactService = new ContactService();
const utilityService = new UtilityService();

const refreshTableTimout = 300;

let stepTitles = ["Organization", "Tax Rates", "Payment", "Terms", "Employees", "Accounts", "Customers", "Suppliers", "Inventory", "Dashboard", "Launch"];
/**
 * This will get the TCompanyInfo
 * @returns {Object}
 */
export const getCompanyInfo = async () => {

  const headers = ApiService.getHeaders();
  const url = "https://sandboxdb.vs1cloud.com:4443/erpapi/TCompanyInfo?PropertyList=ID,GlobalRef,CompanyName,TradingName,CompanyCategory,CompanyNumber,SiteCode,Firstname,LastName,PoBox,PoBox2,PoBox3,PoCity,PoState,PoPostcode,PoCountry,Contact,Address,Address2,Address3,City,State,Postcode,Country,PhoneNumber,Email,Url,MobileNumber,FaxNumber,DvaABN,,ContactEmail,ContactName,abn,Apcano,Bsb,AccountNo,BankBranch,BankCode,Bsb,FileReference,TrackEmails,IsUSRegionTax,IsSetUpWizard";
  const response = await fetch(url, {
    headers: headers,
    method: "GET"
  });

  if(response.status >= 200 && response.status < 301) {
    const data = await response.json();
    const companyInfo = data.tcompanyinfo[0];
    return companyInfo;
  }

}

export const handleSetupRedirection = (onSetupFinished = "/dashboard", onSetupUnFinished = "/setup") => {
    let ERPIPAddress = localStorage.getItem('EIPAddress');
    let ERPUsername = localStorage.getItem('EUserName');
    let ERPPassword = localStorage.getItem('EPassword');
    let ERPDatabase = localStorage.getItem('EDatabase');
    let ERPPort = localStorage.getItem('EPort');
    const apiUrl = `${URLRequest}${ERPIPAddress}:${ERPPort}/erpapi/TCompanyInfo?PropertyList=ID`; //,IsSetUpWizard
    const _headers = {
        database: ERPDatabase,
        username: ERPUsername,
        password: ERPPassword
    };
    Meteor.http.call("GET", apiUrl, { headers: _headers }, (error, result) => {
        if (error) {
          // handle error here
        } else {
          if(result.data != undefined) {
            if( result.data.tcompanyinfo.length > 0 ){
              let data = result.data.tcompanyinfo[0];
              let cntConfirmedSteps = data.Address3 == "" ? 0 : parseInt(data.Address3);
              let bSetupFinished = cntConfirmedSteps == confirmStepCount ? true : false;
              localStorage.setItem("IS_SETUP_FINISHED", bSetupFinished); //data.IsSetUpWizard
              if(bSetupFinished == true) { // data.IsSetUpWizard
                window.open(onSetupFinished, '_self');
              } else {
                window.open(onSetupUnFinished, '_self');
              }
            }
          } else {
            window.open(onSetupUnFinished, '_self');
          }

        }
    });
};


/**
 *
 * @returns {boolean} true / false
 */
export const isSetupFinished  = async () => {

  // This is to get from remote server the IsSetupWizard status
  // But it is not working, because we need to hit the right URL
  // const companyInfo = await getCompanyInfo();
  // return companyInfo.IsSetUpWizard == true ? false : true;

  const isFinished = localStorage.getItem("IS_SETUP_FINISHED") || false;
  if (isFinished == true || isFinished == "true") {
    return true;
  }
  return false;
}

function MakeNegative() {
  $("td").each(function () {
    if (
      $(this)
        .text()
        .indexOf("-" + Currency) >= 0
    )
      $(this).addClass("text-danger");
  });
}

const numberOfSteps = confirmStepCount + 1;


function setAlreadyLoaded(step, bool = false) {
  return localStorage.setItem(`SETUP_STEP_ALREADY-${step}`, bool);
}

function isAlreadyLoaded(step) {
  const string = localStorage.getItem(`SETUP_STEP_ALREADY-${step}`) || false;

  return string == "true" || string == true ? true : false;
}

function getCurrentStep(onNaN = 1) {
  const step = localStorage.getItem("VS1Cloud_SETUP_STEP") || onNaN;
  return parseInt(step);
}

function setCurrentStep(stepId = 1) {
  if (isNaN(stepId)) return false;
  let templateObject = Template.instance();
  templateObject.currentStep.set(stepId);
  return localStorage.setItem("VS1Cloud_SETUP_STEP", parseInt(stepId));
}

function getConfirmedSteps() {
  return (
    localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") || JSON.stringify([])
  );
}

function setConfirmedSteps(steps = []) {
  return localStorage.setItem("VS1Cloud_SETUP_CONFIRMED_STEPS", JSON.stringify(steps));
}

function addConfirmedStep(step) {
  if (isNaN(step)) return false;
  let steps = getConfirmedSteps();
  if (!steps.includes(step)) {
    steps = JSON.parse(steps);
    steps.push(step);
    setConfirmedSteps(steps);
  }
}

/**
 *
 * @param {integer} stepId
 * @returns {boolean}
 */
function isConfirmedStep(stepId) {
  if (isNaN(stepId)) return false;
  let steps = getConfirmedSteps();
  return steps.includes(stepId);
}

function getSkippedSteps() {
  return (
    localStorage.getItem("VS1Cloud_SETUP_SKIPPED_STEP") || JSON.stringify([])
  );
}

function addSkippedStep(step) {
  if (isNaN(step)) return false;
  let steps = getSkippedSteps();
  if (!steps.includes(step)) {
    steps = JSON.parse(steps);
    steps.push(step);
    setSkippedSteps(steps);
  }
}

function setSkippedSteps(steps = []) {
  return localStorage.setItem("VS1Cloud_SETUP_SKIPPED_STEP", JSON.stringify(steps));
}

/**
 *
 * @param {integer} stepId
 * @returns {boolean}
 */
function isStepSkipped(stepId) {
  let steps = getSkippedSteps();
  return steps.includes(stepId);
}

/**
 * This function will check if the link is clickable or not
 * @param {*} stepId
 * @returns
 */
function isClickableStep(stepId) {
  const confirmedSteps = getConfirmedSteps();
  const skippedSteps = getSkippedSteps();
  if (confirmedSteps.includes(stepId) || skippedSteps.includes(stepId)) {
    return true;
  }
  return false;
}

function setSetupFinished() {
  return localStorage.setItem("IS_SETUP_FINISHED", true);
}

Template.setup.onCreated(() => {

})

Template.setup.onRendered(function () {
  LoadingOverlay.show();
  const templateObject = Template.instance();
    /**
   * This function will autoredirect to dashboard if setup is finished
   */
    templateObject.isSetupFinished = async () => {
      const isFinished = localStorage.getItem("IS_SETUP_FINISHED") || false;
  
      if (isFinished == true || isFinished == "true") {
        FlowRouter.go("dashboard");
      }
    };
  
    //templateObject.isSetupFinished();
    // Get step local storage variable and set step
    const currentStep = getCurrentStep();
    templateObject.loadSteps = () => {
      let _steps = [];
      let remainingSteps = 0;
      for (let i = 1; i <= numberOfSteps - 1; i++) {
        let isStepConfirm = isConfirmedStep(i);
        if( isStepConfirm == false ){
          remainingSteps++;
        }
        _steps.push({
          id: i,
          index: i,
          active: getCurrentStep() == i ? true : false,
          clickable: !isClickableStep(i),
          isConfirmed: isStepConfirm,
          skippedSteps: isStepSkipped(i),
          title: stepTitles[i - 1]
        });
  
        setAlreadyLoaded(i, false);
      }
      _steps.push({
        id: numberOfSteps,
        index: numberOfSteps,
        active: ( getCurrentStep() == numberOfSteps) ? true : false,
        clickable: !isClickableStep(numberOfSteps),
        isConfirmed: ( remainingSteps == 0 ) ? true : false,
        skippedSteps: isStepSkipped(numberOfSteps),
        title: stepTitles[numberOfSteps - 1]
      });
      templateObject.steps.set(_steps);
    };
  
    setTimeout(function () {
      var url = FlowRouter.current().path;
      if (url.indexOf("?step") > 0) {
        url = new URL(window.location.href);
        var stepId = url.searchParams.get("step");
        $('#progress-steps a[' + 'data-step-id="' + stepId + '"]').trigger("click");
      }
    }, 200);
  
  
    templateObject.loadSteps();
})