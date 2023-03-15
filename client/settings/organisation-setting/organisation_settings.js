import { OrganisationService } from "../../js/organisation-service";
import { CountryService } from "../../js/country-service";
import { ReactiveVar } from "meteor/reactive-var";
import { SideBarService } from "../../js/sidebar-service";
import { UtilityService } from "../../utility-service";
import "../../lib/global/indexdbstorage.js";
import LoadingOverlay from "../../LoadingOverlay";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import "./organisation.html";
import _ from "lodash";
import { ContactService } from "../../contacts/contact-service";
//

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let contactService = new ContactService();
let organisationService = new OrganisationService();
let accountantDetailObj
let supplierList
let supplierListIndex

function initEditSupplierForm() {
  let data = accountantDetailObj
  $(".fullScreenSpin").css("display", "none");                      
    $("#add-supplier-title").text("Edit Supplier");
    let popSupplierID = data.fields.ID || "";
    let popSupplierName = data.fields.ClientName || "";
    let popSupplierEmail = data.fields.Email || "";
    let popSupplierTitle = data.fields.Title || "";
    let popSupplierFirstName = data.fields.FirstName || "";
    let popSupplierMiddleName = data.fields.CUSTFLD10 || "";
    let popSupplierLastName = data.fields.LastName || "";
    let popSuppliertfn = "" || "";
    let popSupplierPhone = data.fields.Phone || "";
    let popSupplierMobile = data.fields.Mobile || "";
    let popSupplierFaxnumber = data.fields.Faxnumber || "";
    let popSupplierSkypeName = data.fields.SkypeName || "";
    let popSupplierURL = data.fields.URL || "";
    let popSupplierStreet = data.fields.Street || "";
    let popSupplierStreet2 = data.fields.Street2 || "";
    let popSupplierState = data.fields.State || "";
    let popSupplierPostcode = data.fields.Postcode || "";
    let popSupplierCountry = data.fields.Country || LoggedCountry;
    let popSupplierbillingaddress = data.fields.BillStreet || "";
    let popSupplierbcity = data.fields.BillStreet2 || "";
    let popSupplierbstate = data.fields.BillState || "";
    let popSupplierbpostalcode = data.fields.BillPostcode || "";
    let popSupplierbcountry =
        data.fields.Billcountry || LoggedCountry;
    let popSuppliercustfield1 = data.fields.CUSTFLD1 || "";
    let popSuppliercustfield2 = data.fields.CUSTFLD2 || "";
    let popSuppliercustfield3 = data.fields.CUSTFLD3 || "";
    let popSuppliercustfield4 = data.fields.CUSTFLD4 || "";
    let popSuppliernotes = data.fields.Notes || "";
    let popSupplierpreferedpayment =
        data.fields.PaymentMethodName || "";
    let popSupplierterms = data.fields.TermsName || "";
    let popSupplierdeliverymethod =
        data.fields.ShippingMethodName || "";
    let popSupplieraccountnumber = data.fields.ClientNo || "";
    let popSupplierisContractor = data.fields.Contractor || false;
    let popSupplierissupplier = data.fields.IsSupplier || false;
    let popSupplieriscustomer = data.fields.IsCustomer || false;

    $("#edtSupplierCompany").val(popSupplierName);
    $("#edtSupplierPOPID").val(popSupplierID);
    $("#edtSupplierCompanyEmail").val(popSupplierEmail);
    $("#edtSupplierTitle").val(popSupplierTitle);
    $("#edtSupplierFirstName").val(popSupplierFirstName);
    $("#edtSupplierMiddleName").val(popSupplierMiddleName);
    $("#edtSupplierLastName").val(popSupplierLastName);
    $("#edtSupplierPhone").val(popSupplierPhone);
    $("#edtSupplierMobile").val(popSupplierMobile);
    $("#edtSupplierFax").val(popSupplierFaxnumber);
    $("#edtSupplierSkypeID").val(popSupplierSkypeName);
    $("#edtSupplierWebsite").val(popSupplierURL);
    $("#edtSupplierShippingAddress").val(popSupplierStreet);
    $("#edtSupplierShippingCity").val(popSupplierStreet2);
    $("#edtSupplierShippingState").val(popSupplierState);
    $("#edtSupplierShippingZIP").val(popSupplierPostcode);
    $("#sedtCountry").val(popSupplierCountry);
    $("#txaNotes").val(popSuppliernotes);
    $("#sltPreferedPayment").val(popSupplierpreferedpayment);
    $("#sltTerms").val(popSupplierterms);
    $("#suppAccountNo").val(popSupplieraccountnumber);
    $("#edtCustomeField1").val(popSuppliercustfield1);
    $("#edtCustomeField2").val(popSuppliercustfield2);
    $("#edtCustomeField3").val(popSuppliercustfield3);
    $("#edtCustomeField4").val(popSuppliercustfield4);

    if (
        data.fields.Street ==
            data.fields.BillStreet &&
        data.fields.Street2 ==
            data.fields.BillStreet2 &&
        data.fields.State ==
            data.fields.BillState &&
        data.fields.Postcode ==
            data.fields.Postcode &&
        data.fields.Country ==
            data.fields.Billcountry
    ) {
        //templateObject.isSameAddress.set(true);
        $("#chkSameAsShipping").attr("checked", "checked");
    }
    if (data.fields.Contractor == true) {
        // $('#isformcontractor')
        $("#isformcontractor").attr("checked", "checked");
    } else {
        $("#isformcontractor").removeAttr("checked");
    }
}

function initAccountantDetails() {
  let data = accountantDetailObj
    let popSupplierID = data.fields.ID || "";    
    let popSupplierEmail = data.fields.Email || "";    
    let popSupplierFirstName = data.fields.FirstName || "";
    let popSupplierMiddleName = data.fields.CUSTFLD10 || "";
    let popSupplierLastName = data.fields.LastName || "";    
    let popSupplierPhone = data.fields.Phone || "";
    
    $("#sltAccountant").data('supplierId', popSupplierID);
    $("#accountantemailaddress").val(popSupplierEmail);
    $("#accountantfirstname").val(popSupplierFirstName);
    $("#accountantmiddlename").val(popSupplierMiddleName);
    $("#accountantlastname").val(popSupplierLastName);
    $("#accountantphonenumber").val(popSupplierPhone);
}

async function loadAccountantDetailByName(supplierDataName) {
  $(".fullScreenSpin").css("display", "inline-block");
  try {
    let dataObject = await getVS1Data("TSupplierVS1");
    if (dataObject.length) {
      let data = JSON.parse(dataObject[0].data);                
      supplierList = data
      var added = false;
      for (let i = 0; i < data.tsuppliervs1.length; i++) {
          if (
              data.tsuppliervs1[i].fields.ClientName ===
              supplierDataName
          ) {
              added = true;
              accountantDetailObj = data.tsuppliervs1[i]                        
              supplierListIndex = i
              continue;
          }
      }
      if (!added) {      
          data = await sideBarService.getOneSupplierDataExByName(supplierDataName)              
          accountantDetailObj = data.tsupplier[0]                             
      }
    } else {      
      let data = await sideBarService.getOneSupplierDataExByName(supplierDataName)
      accountantDetailObj = data.tsupplier[0]      
    }
  } catch (e) {    
    let data = await sideBarService.getOneSupplierDataExByName(supplierDataName)
    accountantDetailObj = data.tsupplier[0]                        
  }
  $(".fullScreenSpin").css("display", "none");
}

async function saveAccountantDetail() {
  let saveObj = {
      type: "TSupplierEx",
      fields: { 
        ...accountantDetailObj.fields, 
        FirstName: $("#accountantfirstname").val(),
        CUSTFLD10: $("#accountantmiddlename").val(),
        LastName: $("#accountantlastname").val(),
        Email: $("#accountantemailaddress").val(),
        Phone: $("#accountantphonenumber").val(),
      },
  };
  try {    
    let objDetails = await contactService.saveSupplierEx(saveObj)
    let supplierSaveID = objDetails.fields.ID;
    if (supplierSaveID) {
      supplierList.tsuppliervs1[supplierListIndex].fields = saveObj.fields
      await addVS1Data('TSupplierVS1', JSON.stringify(supplierList))
    }
    swal('Accountant details successfully updated', '', 'success')
  } catch (err) {
    swal('Oooops...', err, 'error')
  }
}

Template.organisationsettings.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.showSkype = new ReactiveVar();
  templateObject.showMob = new ReactiveVar();
  templateObject.showFax = new ReactiveVar();
  templateObject.showLinkedIn = new ReactiveVar();
  templateObject.countryList = new ReactiveVar([]);
  templateObject.showPoAddress = new ReactiveVar();
  templateObject.phCity = new ReactiveVar();
  templateObject.samePhysicalAddress1 = new ReactiveVar();
  templateObject.samePhysicalAddress2 = new ReactiveVar();
  templateObject.samePhysicalAddress3 = new ReactiveVar();
  templateObject.phState = new ReactiveVar();
  templateObject.phCountry = new ReactiveVar();
  templateObject.phCode = new ReactiveVar();
  templateObject.phAttention = new ReactiveVar();
  templateObject.countryData = new ReactiveVar();
  templateObject.suppliersData = new ReactiveVar();
  templateObject.hideCreateField = new ReactiveVar();
  templateObject.paAddress1 = new ReactiveVar();
  templateObject.paAddress2 = new ReactiveVar();
  templateObject.paAddress3 = new ReactiveVar();
  templateObject.phAddress1 = new ReactiveVar();
  templateObject.phAddress2 = new ReactiveVar();
  templateObject.phAddress3 = new ReactiveVar();
  templateObject.fieldLength = new ReactiveVar();
  templateObject.completePoAddress = new ReactiveVar();
  templateObject.completePhAddress = new ReactiveVar();
  templateObject.imageFileData = new ReactiveVar();

  templateObject.isSameAddress = new ReactiveVar();
  templateObject.isSameAddress.set(false);

  templateObject.iscompanyemail = new ReactiveVar();
  templateObject.iscompanyemail.set(false);

  templateObject.isChkUSRegionTax = new ReactiveVar();
  templateObject.isChkUSRegionTax.set(false);
});

Template.organisationsettings.onRendered(function () {
  $(".fullScreenSpin").css("display", "inline-block");
  const templateObject = Template.instance();
  let showPoAddress = false;
  let countries = [];
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
  let suppliers = [];
  var countryService = new CountryService();
  templateObject.getCountryData = function () {
    getVS1Data("TCountries").then(function(dataObject) {
            if (dataObject.length == 0) {
                countryService.getCountry().then((data) => {
                    for (let i = 0; i < data.tcountries.length; i++) {
                        countries.push(data.tcountries[i].Country);
                    }
                    countries.sort((a, b) => a.localeCompare(b));
                    templateObject.countryData.set(countries);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcountries;
                for (let i = 0; i < useData.length; i++) {
                    countries.push(useData[i].Country);
                }
                countries.sort((a, b) => a.localeCompare(b));
                templateObject.countryData.set(countries);
            }
        }).catch(function(err) {
            countryService.getCountry().then((data) => {
                for (let i = 0; i < data.tcountries.length; i++) {
                    countries.push(data.tcountries[i].Country);
                }
                countries.sort((a, b) => a.localeCompare(b));
                templateObject.countryData.set(countries);
            });
        });
  };
  templateObject.getCountryData();

  templateObject.getDropDown = function (id, country) {
    $("#" + id)
      .autocomplete({
        source: country,
        minLength: 0,
      })
      .focus(function () {
        $(this).autocomplete("search", "");
      });
    $("#" + id)
      .autocomplete("widget")
      .addClass("countries-dropdown");
  };
  
  templateObject.getOrganisationDetails = async () => {
    LoadingOverlay.show();
    let dataObject;
    try {
      let companyInfoData = await getVS1Data('TCompanyInfo');
      if (companyInfoData.length) {
        dataObject = JSON.parse(companyInfoData[0].data);
      } else {
        dataObject = await organisationService.getOrganisationDetail();
        addVS1Data('TCompanyInfo', JSON.stringify(dataObject));
      }
    } catch (e) {
      dataObject = await organisationService.getOrganisationDetail();
      addVS1Data('TCompanyInfo', JSON.stringify(dataObject));
    }    

    let mainData = dataObject.tcompanyinfo[0];
    templateObject.showSkype.set(mainData.ContactEmail);
    templateObject.showMob.set(mainData.MobileNumber);
    templateObject.showFax.set(mainData.FaxNumber);
    templateObject.showLinkedIn.set(mainData.DvaABN);
    templateObject.phCity.set(mainData.PoCity);
    templateObject.phState.set(mainData.PoState);
    templateObject.phCountry.set(mainData.PoCountry);
    templateObject.phCode.set(mainData.PoPostcode);
    templateObject.phAttention.set(mainData.Contact);
    let companyName = mainData.CompanyName;
    let postalAddress =
      mainData.PoBox + "\n" + mainData.PoBox2 + "\n" + mainData.PoBox3;
    // let physicalAddress =
    //     mainData.Address + "\n" + mainData.Address2 + "\n" + mainData.Address3;
    let physicalAddress = mainData.Address + "\n" + mainData.Address2;
    templateObject.samePhysicalAddress1.set(mainData.Address);
    templateObject.samePhysicalAddress2.set(mainData.Address2);
    // templateObject.samePhysicalAddress3.set(mainData.Address3);
    templateObject.samePhysicalAddress3.set("");

    $("#displayname").val(mainData.CompanyName);
    $("#tradingname").val(mainData.TradingName);

    $("#ownerfirstname").val(mainData.Firstname);
    $("#ownerlastname").val(mainData.LastName);
    $("#edtCompanyNumber").val(mainData.CompanyNumber);
    // $("#edtABNNumber").val(mainData.abn);
    $("#edtAddress").val(mainData.Address);
    $("#edtCity").val(mainData.City);
    $("#edtState").val(mainData.State);
    $("#edtPostCode").val(mainData.Postcode);
    $("#edtCountry").val(mainData.Country);
    $("#edtCountry").append(
      '<option selected="selected" value="' +
        mainData.Country +
        '">' +
        mainData.Country +
        "</option>"
    );
    $("#edtpostaladdress").val(mainData.PoBox);
    $("#edtPostalCity").val(mainData.PoCity);
    $("#edtPostalState").val(mainData.PoState);
    $("#edtPostalPostCode").val(mainData.PoPostcode);
    $("#edtPostalCountry").val(mainData.PoCountry);
    $("#edtPostalCountry").append(
      '<option selected="selected" value="' +
        mainData.PoCountry +
        '">' +
        mainData.PoCountry +
        "</option>"
    );

    if (mainData.IsUSRegionTax || mainData.Country == "United States") {
      templateObject.isChkUSRegionTax.set(true);
      $("#chkusregiontax").prop("checked", true);
      $(".chkusregiontax-col").show();
    } else {
      $(".chkusregiontax-col").hide();
    }

    if (
      mainData.Address == mainData.PoBox &&
      mainData.City == mainData.PoCity &&
      mainData.State == mainData.PoState &&
      mainData.Postcode == mainData.PoPostcode &&
      mainData.Country == mainData.PoCountry
    ) {
      templateObject.isSameAddress.set(true);
      $("#chksameaddress").attr("checked", "checked");
      $("#show_address_data").css("display", "none");
    } else {
      $("#chksameaddress").removeAttr("checked");
      $("#show_address_data").css("display", "block");
    }
    if (mainData.TrackEmails) {
      templateObject.iscompanyemail.set(true);
      $("#chkIsDefailtEmail").attr("checked", "checked");
    } else {
      //templateObject.iscompanyemail.set(false);
      $("#chkIsDefailtEmail").removeAttr("checked");
    }

    $("#sltAccountant").val(mainData.Contact);
    await loadAccountantDetailByName(mainData.Contact)
    initAccountantDetails()

    $("#sltYearEnd").val(localStorage.getItem("yearEnd"));
    // YearEnd: sltYearEnd,
    $("#sltCompanyType").val(mainData.CompanyCategory);
    $("#contact").val(mainData.ContactName);
    $("#edtphonenumber").val(mainData.PhoneNumber);
    $("#edtemailaddress").val(mainData.Email);
    $("#edtWebsite").val(mainData.Url);
    //$('#mobile').val(mainData.MobileNumber);
    $("#edtfaxnumber").val(mainData.FaxNumber);

    LoadingOverlay.hide();
  };
  templateObject.getOrganisationDetails();

  $(document).ready(function () {
    $("#sltAccountant").editableSelect();
    $("#sltAccountant")
      .editableSelect()
      .on("click.editable-select", function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        $("#edtSupplierPOPID").val("");
        var supplierDataName = e.target.value || "";        
        if (e.pageX > offset.left + $earch.width() - 8) {
          // X button 16px wide?
          $("#supplierListModal").modal();
          setTimeout(function () {
            $("#tblSupplierlist_filter .form-control-sm").focus();
            $("#tblSupplierlist_filter .form-control-sm").val("");
            $("#tblSupplierlist_filter .form-control-sm").trigger("input");
            var datatable = $("#tblSupplierlist").DataTable();
            datatable.draw();
            $("#tblSupplierlist_filter .form-control-sm").trigger("input");
          }, 500);
        } else {
          if (supplierDataName.replace(/\s/g, "") != "") {
            initEditSupplierForm()
            $("#addSupplierModal").modal("show");
            //FlowRouter.go('/supplierscard?name=' + e.target.value);
          } else {
            $("#supplierListModal").modal();
            setTimeout(function () {
              $("#tblSupplierlist_filter .form-control-sm").focus();
              $("#tblSupplierlist_filter .form-control-sm").val("");
              $("#tblSupplierlist_filter .form-control-sm").trigger("input");
              var datatable = $("#tblSupplierlist").DataTable();
              datatable.draw();
              $("#tblSupplierlist_filter .form-control-sm").trigger("input");
            }, 500);
          }
        }
      });
  });

  let imageData = localStorage.getItem("Image");
  if (imageData) {
    $("#uploadedImage").attr("src", imageData);
    $("#uploadedImage").attr("width", "50%");
    $("#removeLogo").show();
    $("#changeLogo").show();
  }

  $(document).on("click", "#tblSupplierlist tbody tr", async function (e) {
    const tableSupplier = $(this);
    $("#sltAccountant").val(tableSupplier.find(".colCompany").text());
    await loadAccountantDetailByName(tableSupplier.find(".colCompany").text())
    initAccountantDetails()
    $("#sltAccountant").data("supplierId", tableSupplier.find(".colID").text());
    $("#supplierListModal").modal("toggle");
  });
});

Template.organisationsettings.helpers({
  showMob: () => {
    return Template.instance().showMob.get();
  },
  showSkype: () => {
    return Template.instance().showSkype.get();
  },
  showFax: () => {
    return Template.instance().showFax.get();
  },
  showLinkedIn: () => {
    return Template.instance().showLinkedIn.get();
  },
  countryList: () => {
    return Template.instance().countryData.get();
  },
  showPoAddress: () => {
    return Template.instance().showPoAddress.get();
  },
  hideCreateField: () => {
    return Template.instance().hideCreateField.get();
  },
  fieldLength: () => {
    return Template.instance().fieldLength.get();
  },
  isSameAddress: () => {
    return Template.instance().isSameAddress.get();
  },
  iscompanyemail: () => {
    return Template.instance().iscompanyemail.get();
  },
  isChkUSRegionTax: () => {
    return Template.instance().isChkUSRegionTax.get();
  },
  checkCountryABN: () => {
    let countryABNValue = "ABN";
    if (LoggedCountry == "South Africa") {
      countryABNValue = "VAT";
    }
    return countryABNValue;
  },
  suppliersData: () => {
    return Template.instance()
      .suppliersData.get()
      .sort(function (a, b) {
        if (a.company == "NA") {
          return 1;
        } else if (b.company == "NA") {
          return -1;
        }
        return a.company.toUpperCase() > b.company.toUpperCase() ? 1 : -1;
      });
  },
});

Template.organisationsettings.events({
  "click #mobField": function (event) {
    $("#ul_o li:hidden").slice(0, 1);
    var Length = $("#ul_o li:visible").length;
    let templateObject = Template.instance();
    templateObject.fieldLength.set(Length);
    document.getElementById("open_mob").style.display = "inline-block";
    document.getElementById("exitMob").style.display = "inline-block";
    document.getElementById("mobField").style.display = "none";
  },
  "click #chkIsDefailtEmail": function (event) {
    let templateObj = Template.instance();
    if ($(event.target).is(":checked")) {
      templateObj.iscompanyemail.set(true);
    } else {
      templateObj.iscompanyemail.set(false);
    }
  },
  "click #exitMob": function (event) {
    let templateObject = Template.instance();
    let length = templateObject.fieldLength.get();
    templateObject.fieldLength.set(length + 1);
    document.getElementById("open_mob").style.display = "none";
    document.getElementById("exitMob").style.display = "none";
    document.getElementById("mobField").style.display = "inline-block";
  },
  "click #skypeId": function (event) {
    $("#ul_o li:hidden").slice(0, 1);
    var Length = $("#ul_o li:visible").length;
    let templateObject = Template.instance();
    templateObject.fieldLength.set(Length);
    document.getElementById("skypeId").style.display = "none";
    document.getElementById("open_skype").style.display = "inline-block";
    document.getElementById("exitSkype").style.display = "inline-block";
  },
  "click #exitSkype": function (event) {
    let templateObject = Template.instance();
    let length = templateObject.fieldLength.get();
    templateObject.fieldLength.set(length + 1);
    document.getElementById("open_skype").style.display = "none";
    document.getElementById("exitSkype").style.display = "none";
    document.getElementById("skypeId").style.display = "inline-block";
  },
  "click #faxId": function (event) {
    $("#ul_o li:hidden").slice(0, 1);
    var Length = $("#ul_o li:visible").length;
    let templateObject = Template.instance();
    templateObject.fieldLength.set(Length);
    document.getElementById("faxId").style.display = "none";
    document.getElementById("open_fax").style.display = "inline-block";
    document.getElementById("exitFax").style.display = "inline-block";
  },
  "click #exitFax": function (event) {
    let templateObject = Template.instance();
    let length = templateObject.fieldLength.get();
    templateObject.fieldLength.set(length + 1);
    document.getElementById("faxId").style.display = "inline-block";
    document.getElementById("open_fax").style.display = "none";
    document.getElementById("exitFax").style.display = "none";
  },
  "click #ddiField": function (event) {
    $("#ul_o li:hidden").slice(0, 1);
    var Length = $("#ul_o li:visible").length;
    let templateObject = Template.instance();
    templateObject.fieldLength.set(Length);
    document.getElementById("ddiField").style.display = "none";
    document.getElementById("open_ddi").style.display = "inline-block";
    document.getElementById("exitDdi").style.display = "inline-block";
  },
  "click #exitDdi": function (event) {
    let templateObject = Template.instance();
    let length = templateObject.fieldLength.get();
    templateObject.fieldLength.set(length + 1);
    document.getElementById("ddiField").style.display = "inline-block";
    document.getElementById("open_ddi").style.display = "none";
    document.getElementById("exitDdi").style.display = "none";
  },
  "click #linkedInField": function (event) {
    $("#ul_o li:hidden").slice(0, 1);
    var Length = $("#ul_o li:visible").length;
    let templateObject = Template.instance();
    templateObject.fieldLength.set(Length);
    document.getElementById("linkedInField").style.display = "none";
    document.getElementById("open_linkedIn").style.display = "inline-block";
    document.getElementById("exitlinkedIn").style.display = "inline-block";
  },
  "click #exitlinkedIn": function (event) {
    let templateObject = Template.instance();
    let length = templateObject.fieldLength.get();
    templateObject.fieldLength.set(length + 1);
    document.getElementById("linkedInField").style.display = "inline-block";
    document.getElementById("open_linkedIn").style.display = "none";
    document.getElementById("exitlinkedIn").style.display = "none";
  },
  "click #fbField": function (event) {
    $("#ul_o li:hidden").slice(0, 1);
    var Length = $("#ul_o li:visible").length;
    let templateObject = Template.instance();
    templateObject.fieldLength.set(Length);
    document.getElementById("fbField").style.display = "none";
    document.getElementById("open_fb").style.display = "inline-block";
    document.getElementById("exitFb").style.display = "inline-block";
  },
  "click #exitFb": function (event) {
    let templateObject = Template.instance();
    let length = templateObject.fieldLength.get();
    templateObject.fieldLength.set(length + 1);
    document.getElementById("fbField").style.display = "inline-block";
    document.getElementById("open_fb").style.display = "none";
    document.getElementById("exitFb").style.display = "none";
  },
  "click #googleField": function (event) {
    $("#ul_o li:hidden").slice(0, 1);
    var Length = $("#ul_o li:visible").length;
    let templateObject = Template.instance();
    templateObject.fieldLength.set(Length);
    document.getElementById("googleField").style.display = "none";
    document.getElementById("open_google").style.display = "inline-block";
    document.getElementById("exitGplus").style.display = "inline-block";
  },
  "click #exitGplus": function (event) {
    let templateObject = Template.instance();
    let length = templateObject.fieldLength.get();
    templateObject.fieldLength.set(length + 1);
    document.getElementById("googleField").style.display = "inline-block";
    document.getElementById("open_google").style.display = "none";
    document.getElementById("exitGplus").style.display = "none";
  },
  "click #twitField": function (event) {
    $("#ul_o li:hidden").slice(0, 1);
    var Length = $("#ul_o li:visible").length;
    let templateObject = Template.instance();
    templateObject.fieldLength.set(Length);
    document.getElementById("twitField").style.display = "none";
    document.getElementById("open_twitter").style.display = "inline-block";
    document.getElementById("exitTwitter").style.display = "inline-block";
  },
  "click #exitTwitter": function (event) {
    let templateObject = Template.instance();
    let length = templateObject.fieldLength.get();
    templateObject.fieldLength.set(length + 1);
    document.getElementById("twitField").style.display = "inline-block";
    document.getElementById("open_twitter").style.display = "none";
    document.getElementById("exitTwitter").style.display = "none";
  },
  "click #chksameaddress": function (event) {
    const templateObject = Template.instance();
    //templateObject.showPoAddress.set(!templateObject.showPoAddress.get());
    //let hideAddressData = templateObject.showPoAddress.get();
    if ($(event.target).is(":checked")) {
      document.getElementById("show_address_data").style.display = "none";
    } else {
      document.getElementById("show_address_data").style.display =
        "inline-flex";
    }
  },
  "click #saveCompanyInfo": function (event) {
    playSaveAudio();
    let templateObject = Template.instance();
    setTimeout(async function () {
      $(".fullScreenSpin").css("display", "inline-block");

      let companyID = 1;
      let companyName = $("#displayname").val();
      let tradingName = $("#tradingname").val();

      let ownerFistName = $("#ownerfirstname").val() || "";
      let ownerlastName = $("#ownerlastname").val() || "";
      // let companyCategory = $('#org_type').val();
      // let companyABNNumber = $("#edtABNNumber").val();
      let companyNumber = $("#edtCompanyNumber").val();
      let sltCompanyType = $("#sltCompanyType").val();
      let sltAccountant = $("#sltAccountant").val();
      let sltYearEnd = $("#sltYearEnd").val();
      // let pocontact = $("#pocontact").val();
      let contact = $("#contact").val();
      let phone = $("#edtphonenumber").val();
      let emailAddress =
        $("#edtemailaddress").val() || localStorage.getItem("VS1AdminUserName");
      let websiteURL = $("#edtWebsite").val();
      let fax = $("#edtfaxnumber").val();

      let shipAddress = $("#edtAddress").val();
      let shipCity = $("#edtCity").val();
      let shipState = $("#edtState").val();
      let shipPostCode = $("#edtPostCode").val();
      let shipCountry = $("#edtCountry").val();

      let poAddress = "";
      let poCity = "";
      let poState = "";
      let poPostCode = "";
      let poCountry = "";
      let isDefaultEmail = false;
      let isChkUSRegionTax = $("#chkusregiontax").is(":checked");

      if ($("#chksameaddress").is(":checked")) {
        poAddress = shipAddress;
        poCity = shipCity;
        poState = shipState;
        poPostCode = shipPostCode;
        poCountry = shipCountry;
      } else {
        poAddress = $("#edtpostaladdress").val();
        poCity = $("#edtPostalCity").val();
        poState = $("#edtPostalState").val();
        poPostCode = $("#edtPostalPostCode").val();
        poCountry = $("#edtPostalCountry").val();
      }

      if ($("#chkIsDefailtEmail").is(":checked")) {
        isDefaultEmail = true;
      }

      var objDetails = {
        type: "TCompanyInfo",
        fields: {
          Id: companyID,
          CompanyName: companyName,
          TradingName: tradingName,
          Firstname: ownerFistName,
          LastName: ownerlastName,
          CompanyCategory: sltCompanyType,
          // abn: companyABNNumber,
          CompanyNumber: companyNumber,
          // OrgType: sltCompanyType,
          // Accountant: sltAccountant,
          // YearEnd: sltYearEnd,
          ContactName: contact,
          Contact: sltAccountant,
          PhoneNumber: phone,
          Email: emailAddress,
          Url: websiteURL,
          FaxNumber: fax,
          Address: shipAddress,
          City: shipCity,
          State: shipState,
          Postcode: shipPostCode,
          Country: shipCountry,
          PoBox: poAddress,
          PoCity: poCity,
          PoState: poState,
          PoPostcode: poPostCode,
          PoCountry: poCountry,
          TrackEmails: isDefaultEmail,
          IsUSRegionTax: isChkUSRegionTax,
        },
      };

      await saveAccountantDetail()
      organisationService
        .saveOrganisationSetting(objDetails)
        .then(function (data) {
          // Bert.alert('<strong>'+ 'Organisation details successfully updated!'+'</strong>!', 'success');
          // swal('Organisation details successfully updated!', '', 'success');

          localStorage.setItem("tradingName", tradingName);
          localStorage.setItem("VS1Accountant", sltAccountant);
          localStorage.setItem("yearEnd", sltYearEnd);
          if (isDefaultEmail) {
            localStorage.setItem("VS1OrgEmail", emailAddress);
          } else {
            localStorage.setItem(
              "VS1OrgEmail",
              localStorage.getItem("mySession")
            );
          }

          swal({
            title: "Organisation details successfully updated!",
            text: "",
            type: "success",
            showCancelButton: false,
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.value) {
              window.open("/settings", "_self");
            } else if (result.dismiss === "cancel") {
            }
          });
          $(".fullScreenSpin").css("display", "none");
        })
        .catch(function (err) {
          $(".fullScreenSpin").css("display", "none");
          swal({
            title: "Oooops...",
            text: err,
            type: "error",
            showCancelButton: false,
            confirmButtonText: "Try Again",
          }).then((result) => {
            if (result.value) {
              // Meteor._reload.reload();
            } else if (result.dismiss === "cancel") {
            }
          });
        });
    }, delayTimeAfterSound);
  },
  "click .mob-img": function (event) {
    let templateObject = Template.instance();
    let allCountries = templateObject.countryData.get();
    templateObject.getDropDown("open-mobile", allCountries);
    templateObject.$("#open-mobile").trigger("focus");
  },
  "click .phone-img": function (event) {
    let templateObject = Template.instance();
    let allCountries = templateObject.countryData.get();
    templateObject.getDropDown("open-phonenumber", allCountries);
    templateObject.$("#open-phonenumber").trigger("focus");
  },
  "click .country-img": function (event) {
    let templateObject = Template.instance();
    let allCountries = templateObject.countryData.get();
    templateObject.getDropDown("open-country", allCountries);
    templateObject.$("#open-country").trigger("focus");
  },
  "click .pocountry-img": function (event) {
    let templateObject = Template.instance();
    let allCountries = templateObject.countryData.get();
    templateObject.getDropDown("open-pocountry", allCountries);
    templateObject.$("#open-pocountry").trigger("focus");
  },
  "click .fax-img": function (event) {
    let templateObject = Template.instance();
    let allCountries = templateObject.countryData.get();
    templateObject.getDropDown("open-fax", allCountries);
    templateObject.$("#open-fax").trigger("focus");
  },
  "click .ddi-img": function (event) {
    let templateObject = Template.instance();
    let allCountries = templateObject.countryData.get();
    templateObject.getDropDown("open-ddi", allCountries);
    templateObject.$("#open-ddi").trigger("focus");
  },
  "click .orgType-img": function (event) {
    let templateObject = Template.instance();
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

    templateObject.getDropDown("org_type", organizations);
    templateObject.$("#org_type").trigger("focus");
  },
  "keyup #postaladdress": function (event) {
    let templateObject = Template.instance();
    var text = document.getElementById("postaladdress").value;
    var lines = text.split("\n");
    var arrArr = text.split("\n");
    let add = "";
    for (let i = 0; i < arrArr.length; i++) {
      if (!arrArr[i]) {
        lines.splice(i, 1);
      }
    }
    templateObject.paAddress1.set(lines[0] ? lines[0] : "");
    templateObject.paAddress2.set(lines[1] ? lines[1] : "");
    if (lines.length > 3) {
      for (let i = 2; i < arrArr.length; i++) {
        add += lines[i] + " ";
      }
      templateObject.paAddress3.set(add ? add : "");
    } else {
      templateObject.paAddress3.set(lines[2] ? lines[2] : "");
    }
  },
  "keyup #physicaladdress": function (event) {
    let templateObject = Template.instance();
    let text = document.getElementById("physicaladdress").value;
    let address = text.split("\n");
    let arrArr = text.split("\n");
    let add = "";
    for (let i = 0; i < arrArr.length; i++) {
      if (!arrArr[i]) {
        address.splice(i, 1);
      }
    }

    templateObject.phAddress1.set(address[0] ? address[0] : "");
    templateObject.phAddress2.set(address[1] ? address[1] : "");
    if (address.length > 3) {
      for (let i = 2; i < arrArr.length; i++) {
        add += address[i] + " ";
      }
      templateObject.phAddress3.set(add ? add : "");
    } else {
      templateObject.phAddress3.set(address[2] ? address[2] : "");
    }
  },
  "click #uploadImg": async function (event) {
    //let imageData= (localStorage.getItem("Image"));
    let templateObject = Template.instance();
    let imageData = templateObject.imageFileData.get();
    let checkCompLogoData = await organisationService.getCheckTcompLogoData();
    let myFilesType = $("#fileInput")[0].files[0].type || "";
    if (imageData != null && imageData != "") {
      addVS1Data("TVS1Image", imageData);
      localStorage.setItem("Image", imageData);
      $("#uploadedImage").attr("src", imageData);
      $("#uploadedImage").attr("width", "50%");
      $("#removeLogo").show();
      $("#changeLogo").show();

      let companyLogoObj = "";
      if (checkCompLogoData.tcomplogo.length) {
        companyLogoObj = {
          type: "TCompLogo",
          fields: {
            ID: parseInt(checkCompLogoData.tcomplogo[0].Id) || 0,
            MIMEEncodedPicture: imageData.split(",")[1],
            ImageTypes: myFilesType || "image/png",
            Pictype: myFilesType.split("/")[1] || "png",
          },
        };
      } else {
        companyLogoObj = {
          type: "TCompLogo",
          fields: {
            MIMEEncodedPicture: imageData.split(",")[1],
            SetupID: 1,
            ImageTypes: myFilesType || "image/png",
            Pictype: myFilesType.split("/")[1] || "png",
          },
        };
      }

      organisationService
        .saveCompanyLogo(companyLogoObj)
        .then(function (companyLogoObj) {});
    }
  },

  "change #fileInput": function (event) {
    let templateObject = Template.instance();
    let selectedFile = event.target.files[0];
    let reader = new FileReader();
    $(".Choose_file").text("");
    reader.onload = function (event) {
      $("#uploadImg").prop("disabled", false);
      $("#uploadImg").addClass("on-upload-logo");
      $(".Choose_file").text(selectedFile.name);
      //$("#uploadImg").css("background-color","yellow");
      templateObject.imageFileData.set(event.target.result);

      //localStorage.setItem("Image",event.target.result);
    };
    reader.readAsDataURL(selectedFile);
  },
  "click #removeLogo": function (event) {
    let templateObject = Template.instance();
    templateObject.imageFileData.set(null);
    localStorage.removeItem("Image");
    // location.reload();
    Meteor._reload.reload();
    //window.open('/organisationsettings','_self');
    //Router.current().render(Template.organisationSettings);
  },
  "click .btnBack": function (event) {
    playCancelAudio();
    event.preventDefault();
    setTimeout(function () {
      history.back(1);
    }, delayTimeAfterSound);
    //FlowRouter.go('/settings');
    //window.open('/invoicelist','_self');
  },
  "click .btnUploadFile": function (event) {
    // $('#attachment-upload').val('');
    // $('.file-name').text('');
    //$(".btnImport").removeAttr("disabled");
    $("#fileInput").trigger("click");
  },
  "click .btnAddVS1User": function (event) {
    swal({
      title: "Is this an existing Employee?",
      text: "",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        swal("Please select the employee from the list below.", "", "info");
        $("#employeeListModal").modal("toggle");
        // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      } else if (result.dismiss === "cancel") {
        FlowRouter.go("/employeescard?addvs1user=true");
      }
    });
  },
  "click .btnCancelSub": function (event) {
    playCancelAudio();
    setTimeout(function () {
      let loggeduserEmail = localStorage.getItem("mySession");
      let currentURL = FlowRouter.current().queryParams;
      swal({
        title: "Are you sure you want to cancel this subscription?",
        text: "",
        type: "question",
        showCancelButton: true,
        // cancelButtonClass: "btn-success",
        cancelButtonClass: "btn-danger",
        confirmButtonText: "No",
        cancelButtonText: "Yes",
      }).then((result) => {
        if (result.value) {
        } else if (result.dismiss === "cancel") {
          swal({
            title: "Reason For Cancellation?",
            text: "Sorry to see you go, please comment below the reason you want to go.",
            input: "textarea",
            inputAttributes: {
              id: "edtFeedback",
              name: "edtFeedback",
            },
            showCancelButton: true,
            confirmButtonText: "OK",
            showLoaderOnConfirm: true,
          }).then((inputValue) => {
            if (inputValue.value === "") {
              swal({
                title: "Successfully Cancel Your Subscription",
                text: "",
                type: "success",
                showCancelButton: false,
                confirmButtonText: "OK",
              }).then((result) => {
                if (result.value) {
                  window.open(
                    "https://depot.vs1cloud.com/vs1subscription/cancelsubscription.php?email=" +
                      loggeduserEmail +
                      "&urlfrom=" +
                      currentURL.url +
                      "",
                    "_self"
                  );
                } else if (result.dismiss === "cancel") {
                }
              });
            } else if (inputValue.value != "") {
              Meteor.call(
                "sendEmail",
                {
                  from: "VS1 Cloud <info@vs1cloud.com>",
                  to: "info@vs1cloud.com",
                  subject: loggeduserEmail + ": Reason For Cancellation",
                  text: inputValue.value,
                  html: "",
                },
                function (error, result) {}
              );

              swal({
                title: "Successfully Cancel Your Subscription",
                text: "Thank you for the Feedback, We will work on solving the issue",
                type: "success",
                showCancelButton: false,
                confirmButtonText: "OK",
              }).then((result) => {
                if (result.value) {
                  window.open(
                    "https://depot.vs1cloud.com/vs1subscription/cancelsubscription.php?email=" +
                      loggeduserEmail +
                      "&urlfrom=" +
                      currentURL.url +
                      "",
                    "_self"
                  );
                } else if (result.dismiss === "cancel") {
                }
              });
            } else {
            }
          });
        }
      });
    }, delayTimeAfterSound);
  },
  "change #edtCountry": function (event) {
    if (event.target.value == "United States") {
      $("#chkusregiontax").prop("checked", true);
      $(".chkusregiontax-col").show();
    } else {
      $("#chkusregiontax").prop("checked", false);
      swal(
        "Ooops...",
        "Can't Alter Country Once the Database Is Set.",
        "error"
      );
      $(event.target).val("United States");
      event.preventDefault();
      return false;
      // $(".chkusregiontax-col").hide();
    }
  },
});

Template.registerHelper("equals", function (a, b) {
  return a === b;
});
