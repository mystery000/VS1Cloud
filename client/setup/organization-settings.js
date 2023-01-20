import './organization-settings.html';
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import _, { template } from "lodash";
import LoadingOverlay from "../LoadingOverlay";
import { OrganisationService } from "../js/organisation-service";
import { CountryService } from "../js/country-service";
import { SideBarService } from "../js/sidebar-service";
import { UtilityService } from "../utility-service";
import "../lib/global/indexdbstorage.js";

const sideBarService = new SideBarService();
const utilityService = new UtilityService();
const organisationService = new OrganisationService();
const countryService = new CountryService();

Template.wizard_organisation.onCreated(() => {
  const templateObject = Template.instance();
  // variables for inputs
  templateObject.companyName = new ReactiveVar('');
  templateObject.tradingName = new ReactiveVar('');
  templateObject.abn = new ReactiveVar('');
  templateObject.companyNumber = new ReactiveVar('');
  templateObject.ownerFirstName = new ReactiveVar('');
  templateObject.ownerLastName = new ReactiveVar('');
  templateObject.contactPhoneNumber = new ReactiveVar('');
  templateObject.contactEmail = new ReactiveVar('');
  templateObject.useEmailAsLogin = new ReactiveVar(false);
  templateObject.contactWebsite = new ReactiveVar('');
  templateObject.contactFaxNumber = new ReactiveVar('');
  templateObject.address = new ReactiveVar('');
  templateObject.town = new ReactiveVar('');
  templateObject.region = new ReactiveVar('');
  templateObject.postal = new ReactiveVar('');
  templateObject.country = new ReactiveVar();
  templateObject.attention = new ReactiveVar('');
  templateObject.isPostalAddressSamePhysicAddress = new ReactiveVar(true);
  templateObject.postalAddress = new ReactiveVar('');
  templateObject.postalTown = new ReactiveVar('');
  templateObject.postalRegion = new ReactiveVar('');
  templateObject.postalPostal = new ReactiveVar('');
  templateObject.postalCountry = new ReactiveVar();
  templateObject.postalAttention = new ReactiveVar('');

  templateObject.countryList = new ReactiveVar([]);

  templateObject.companyData = new ReactiveVar();

  //Methods
  templateObject.getCountryData = function () {
    let countries = [];
    getVS1Data("TCountries")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          countryService.getCountry().then((data) => {
            for (let i = 0; i < data.tcountries.length; i++) {
              countries.push(data.tcountries[i].Country);
            }
            countries = _.sortBy(countries);
            templateObject.countryList.set(countries);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tcountries;
          for (let i = 0; i < useData.length; i++) {
            countries.push(useData[i].Country);
          }
          countries = _.sortBy(countries);
          templateObject.countryList.set(countries);
        }
      })
      .catch(function (err) {
        countryService.getCountry().then((data) => {
          for (let i = 0; i < data.tcountries.length; i++) {
            countries.push(data.tcountries[i].Country);
          }
          countries = _.sortBy(countries);
          templateObject.countryList.set(countries);
        });
      });
  };

  templateObject.getOrganisationDetails = async () => {
    LoadingOverlay.show();
    let dataListRet = null;
    try {
      let companyInfoData = await getVS1Data('TCompanyInfo');
      if (companyInfoData.length) {
        dataListRet = JSON.parse(companyInfoData[0].data);
      } else {
        dataListRet = await organisationService.getOrganisationDetail();
        addVS1Data('TCompanyInfo', JSON.stringify(dataListRet));
      }
    } catch (e) {
      dataListRet = await organisationService.getOrganisationDetail();
      addVS1Data('TCompanyInfo', JSON.stringify(dataListRet));
    }
    if(!dataListRet) {
       return;
    }
    templateObject.companyData.set(dataListRet);

    let mainData = dataListRet.tcompanyinfo[0];
    templateObject.companyName.set(mainData.CompanyName)
    templateObject.tradingName.set(mainData.TradingName)
    templateObject.abn.set(mainData.abn);
    templateObject.companyNumber.set(mainData.CompanyNumber);
    templateObject.ownerFirstName.set(mainData.Firstname)
    templateObject.ownerLastName.set(mainData.LastName)
    templateObject.contactPhoneNumber.set(mainData.PhoneNumber);
    templateObject.contactEmail.set(mainData.Email)
    templateObject.useEmailAsLogin.set(mainData.TrackEmails)
    templateObject.contactWebsite.set(mainData.Url);
    templateObject.contactFaxNumber.set(mainData.FaxNumber)
    templateObject.address.set(mainData.Address)
    templateObject.town.set(mainData.City)
    templateObject.region.set(mainData.State);
    templateObject.postal.set(mainData.Postcode);
    templateObject.country.set(mainData.Country)
    templateObject.attention.set(mainData.Contact);
    const isSamePostAddressAndPhysicAddress =  mainData.Address == mainData.PoBox &&
    mainData.City == mainData.PoCity &&
    mainData.State == mainData.PoState &&
    mainData.Postcode == mainData.PoPostcode &&
    mainData.Country == mainData.PoCountry;

    templateObject.isPostalAddressSamePhysicAddress.set(isSamePostAddressAndPhysicAddress);
    templateObject.postalAddress.set(mainData.PoBox);
    templateObject.postalTown.set(mainData.PoCity);
    templateObject.postalRegion.set(mainData.PoState);
    templateObject.postalPostal.set(mainData.PoPostcode);
    templateObject.postalCountry.set(mainData.PoCountry);
    templateObject.postalAttention.set(mainData.PoContact);

    LoadingOverlay.hide();
  };

});

Template.wizard_organisation.onRendered(() => {
  const templateObject = Template.instance();
  let showPoAddress = false;
  let organizations = [
    "Club or Society",
    "Company",
    "Individual",
    "Not for Profit",
    "Partnership",
    "Self Managed Superannuation Fund",
    "Sole Trader",
    "Superannuation Fund",
    "Trust",
  ];

  templateObject.getCountryData();
  templateObject.getOrganisationDetails()
})

Template.wizard_organisation.helpers({
  companyName: () => {
    return Template.instance().companyName.get();
  },
  tradingName:() => {
    return Template.instance().tradingName.get();
  },
  abn:() => {
    return Template.instance().abn.get();
  },
  companyNumber:() => {
    return Template.instance().companyNumber.get();
  },
  ownerFirstName:() => {
    return Template.instance().ownerFirstName.get();
  },
  ownerLastName:() => {
    return Template.instance().ownerLastName.get();
  },
  contactPhoneNumber:() => {
    return Template.instance().contactPhoneNumber.get();
  },
  contactEmail:() => {
    return Template.instance().contactEmail.get();
  },
  useEmailAsLogin: () => {
    return Template.instance().useEmailAsLogin.get() && 'checked';
  },
  contactWebsite:() => {
    return Template.instance().contactWebsite.get();
  },
  contactFaxNumber:() => {
    return Template.instance().contactFaxNumber.get();
  },
  address:() => {
    return Template.instance().address.get();
  },
  town:() => {
    return Template.instance().town.get();
  },
  region:() => {
    return Template.instance().region.get();
  },
  postal:() => {
    return Template.instance().postal.get();
  },
  country: () => {
    return Template.instance().country.get();
  },
  attention:() => {
    return Template.instance().attention.get();
  },
  isPostalAddressSamePhysicAddress: () => {
    return Template.instance().isPostalAddressSamePhysicAddress.get() && 'checked';
  },
  postalAddress:() => {
    return Template.instance().postalAddress.get();
  },
  postalTown:() => {
    return Template.instance().postalTown.get();
  },
  postalRegion:() => {
    return Template.instance().postalRegion.get();
  },
  postalPostal:() => {
    return Template.instance().postalPostal.get();
  },
  postalCountry: () => {
    return Template.instance().postalCountry.get();
  },
  postalAttention:() => {
    return Template.instance().postalAttention.get();
  },
  countryList: () => {
    return Template.instance().countryList.get();
  }
})

Template.wizard_organisation.events({
  'submit #org_form'(event) {
    event.preventDefault();
    const target = event.target;
    const templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    const companyID = 1;
    const companyName = target.displayname.value;
    const tradingName = target.tradingname.value;
    const abn = target.edtABNNumber.value;
    const companyNumber = target.edtCompanyNumber.value;
    const ownerFirstname = target.ownerfirstname.value;
    const ownerLastname = target.ownerlastname.value;
    const phoneNumber = target.edtphonenumber.value;
    const chkIsDefailtEmail = target.chkIsDefailtEmail.checked;
    const email = target.edtemailaddress.value || localStorage.getItem("VS1AdminUserName");
    const website = target.edtWebsite.value;
    const faxNumber = target.edtfaxnumber.value;
    const address = target.edtAddress.value;
    const city = target.edtCity.value;
    const postalcode = target.edtPostCode.value;
    const region = target.edtState.value;
    const country = target.edtCountry.value;
    const contact = target.pocontact.value;
    const isPostalAddressEqualPhysicAddress = target.chksameaddress.checked;
    let postalAddress = target.edtpostaladdress.value;
    let postalTown = target.edtPostalCity.value;
    let postalRegion = target.edtPostalState.value;
    let postalPostcode = target.edtPostalPostCode.value;
    let postalCountry = target.edtPostalCountry.value;
    let postalContact = target.contact.value;

    if (isPostalAddressEqualPhysicAddress) {
      postalAddress = address;
      postalTown = city;
      postalRegion = region;
      postalPostcode = postalcode;
      postalCountry = country;
    }

    var objDetails = {
      type: "TCompanyInfo",
      fields: {
        Id: companyID,
        CompanyName: companyName,
        TradingName: tradingName,
        Firstname: ownerFirstname,
        LastName: ownerLastname,
        abn: abn,
        CompanyNumber: companyNumber,
        ContactName: postalContact,
        Contact: contact,
        PhoneNumber: phoneNumber,
        Email: email,
        Url: website,
        FaxNumber: faxNumber,
        Address: address,
        City: city,
        State: region,
        Postcode: postalcode,
        Country: country,
        PoBox: postalAddress,
        PoCity: postalTown,
        PoState: postalRegion,
        PoPostcode: postalPostcode,
        PoCountry: postalCountry,
        TrackEmails: chkIsDefailtEmail,
      },
    };
    organisationService
      .saveOrganisationSetting(objDetails)
      .then(function (data) {
        if (chkIsDefailtEmail) {
          localStorage.setItem("VS1OrgEmail", emailAddress);
        } else {
          localStorage.setItem(
            "VS1OrgEmail",
            localStorage.getItem("mySession")
          );
        }
        let companyInfo = templateObject.companyData.get();
        companyInfo.tcompanyinfo[0] = {
          ...companyInfo.tcompanyinfo[0],
          ...objDetails.fields
        }

        addVS1Data('TCompanyInfo', JSON.stringify(companyInfo));
        LoadingOverlay.hide();
        swal({
          title: "Organisation details successfully saved!",
          text: "",
          type: "success",
          showCancelButton: false,
          confirmButtonText: "OK",
        })
      })
      .catch(function (err) {
        LoadingOverlay.hide();
        swal({
          title: "Oooops...",
          text: "All fields are required.",
          type: "error",
          showCancelButton: false,
          confirmButtonText: "Try Again",
        })
      });
  }
})

Template.registerHelper("equals", function (a, b) {
  return a === b;
});
