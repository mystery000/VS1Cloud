// @ts-nocheck
import { ContactService } from "./contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { UtilityService } from "../utility-service";
import { CountryService } from '../js/country-service';
import { SideBarService } from '../js/sidebar-service';
import { CRMService } from "../crm/crm-service";
import '../lib/global/indexdbstorage.js';
import { Template } from 'meteor/templating';
import './addSupplier.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import moment from "moment";
import { OrganisationService } from "../js/organisation-service";

const sideBarService = new SideBarService();
const utilityService = new UtilityService();
const contactService = new ContactService();
const countryService = new CountryService();
const organisationService = new OrganisationService();
const crmService = new CRMService();
let primaryAccountantName = localStorage.getItem('VS1Accountant');

function MakeNegative() {
  $('td').each(function () {
    if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
  });
}

Template.supplierscard.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar();
  templateObject.countryData = new ReactiveVar();
  templateObject.supplierrecords = new ReactiveVar([]);
  templateObject.recentTrasactions = new ReactiveVar([]);
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.crmRecords = new ReactiveVar([]);
  templateObject.crmTableheaderRecords = new ReactiveVar([]);
  templateObject.preferredPaymentList = new ReactiveVar();
  templateObject.termsList = new ReactiveVar();
  templateObject.deliveryMethodList = new ReactiveVar();
  templateObject.taxCodeList = new ReactiveVar();
  templateObject.defaultpurchasetaxcode = new ReactiveVar(loggedTaxCodeSalesInc);
  templateObject.defaultpurchaseterm = new ReactiveVar();
  templateObject.isSameAddress = new ReactiveVar();
  templateObject.isSameAddress.set(false);

  /* Attachments */
  templateObject.uploadedFile = new ReactiveVar();
  templateObject.uploadedFiles = new ReactiveVar([]);
  templateObject.attachmentCount = new ReactiveVar();
  templateObject.currentAttachLineID = new ReactiveVar();
  templateObject.correspondences = new ReactiveVar([]);
  templateObject.crmRecords = new ReactiveVar([]);

  templateObject.active_projects = new ReactiveVar([]);
  templateObject.deleted_projects = new ReactiveVar([]);
  templateObject.favorite_projects = new ReactiveVar([]);
  templateObject.tprojectlist = new ReactiveVar([]);
  templateObject.all_projects = new ReactiveVar([]);
  templateObject.subTasks = new ReactiveVar([]);

  // Methods
  templateObject.updateTaskSchedule = function (id, date) {
    let due_date = "";
    let due_date_display = "No Date";
    if (date) {
      due_date = moment(date).format("YYYY-MM-DD hh:mm:ss");
      due_date_display = moment(due_date).format("dddd, Do MMMM");
    }
    $('#edit_task_modal_due_date').html(due_date_display)

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        due_date: due_date,
      },
    };

    if (id) {
      $(".fullScreenSpin").css("display", "inline-block");
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $(".fullScreenSpin").css("display", "none");
        $(".btnRefresh").addClass('btnSearchAlert');
      });
    }
  };
  templateObject.fillBankInfoFromUrl = function () {
    var queryParams = FlowRouter.current().queryParams;
    if (queryParams.bank) {
      let edtBankName = queryParams.edtBankName;
      let edtBankAccountName = queryParams.edtBankAccountName;
      let edtBSB = queryParams.edtBSB;
      let edtBankAccountNo = queryParams.edtBankAccountNo;
      let swiftCode = queryParams.swiftCode;
      let routingNo = queryParams.routingNo;
      $('.bilingTab').click();
      $('#edtBankName').val(edtBankName)
      $('#edtBankAccountName').val(edtBankAccountName)
      $('#edtBsb').val(edtBSB)
      $('#edtBankAccountNumber').val(edtBankAccountNo)
      $('#edtSwiftCode').val(swiftCode)
      $('#edtRoutingNumber').val(routingNo);

      $("#edtBankName").editableSelect();
      $("#edtBankName")
        .editableSelect()
        .on("click.editable-select", function (e, li) {
          var $earch = $(this);
          var offset = $earch.offset();
          var bankName = e.target.value || "";

          if (e.pageX > offset.left + $earch.width() - 8) {
            $("#bankNameModal").modal();
            $(".fullScreenSpin").css("display", "none");

          } else {
            if (bankName.replace(/\s/g, "") != "") {
              $("#bankNameModal").modal("toggle");
            } else {
              $("#bankNameModal").modal();
            }
          }
        });
    }
  }
  templateObject.getReferenceLetters = () => {
    const mySessionEmployeeLoggedID = localStorage.getItem('mySessionEmployeeLoggedID');
    getVS1Data('TCorrespondence').then(data => {
      if (data.length == 0) {
        sideBarService.getCorrespondences().then(dataObject => {
          addVS1Data('TCorrespondence', JSON.stringify(dataObject))
          let tempArray = [];
          if (dataObject.tcorrespondence.length > 0) {
            let temp = dataObject.tcorrespondence.filter(item => {
              return item.fields.EmployeeId == mySessionEmployeeLoggedID
            })

            for (let i = 0; i < temp.length; i++) {
              for (let j = i + 1; j < temp.length; j++) {
                if (temp[i].fields.Ref_Type == temp[j].fields.Ref_Type) {
                  temp[j].fields.dup = true
                }
              }
            }

            temp.map(item => {
              if (item.fields.EmployeeId == mySessionEmployeeLoggedID && item.fields.dup != true) {
                tempArray.push(item.fields)
              }
            })
          }
          templateObject.correspondences.set(tempArray)
        })
      } else {
        let dataObj = JSON.parse(data[0].data);
        let tempArray = [];
        if (dataObj.tcorrespondence.length > 0) {
          let temp = dataObj.tcorrespondence.filter(item => {
            return item.fields.EmployeeId == mySessionEmployeeLoggedID
          })

          for (let i = 0; i < temp.length; i++) {
            for (let j = i + 1; j < temp.length; j++) {
              if (temp[i].fields.Ref_Type == temp[j].fields.Ref_Type) {
                temp[j].fields.dup = true
              }
            }
          }
          temp.map(item => {
            if (item.fields.EmployeeId == mySessionEmployeeLoggedID && item.fields.dup != true) {
              tempArray.push(item.fields)
            }
          })
        }
        templateObject.correspondences.set(tempArray)
      }
    }).catch(function () {
      sideBarService.getCorrespondences().then(dataObject => {
        addVS1Data('TCorrespondence', JSON.stringify(dataObject));
        let tempArray = [];
        if (dataObject.tcorrespondence.length > 0) {
          let temp = dataObject.tcorrespondence.filter(item => {
            return item.fields.EmployeeId == mySessionEmployeeLoggedID
          })

          for (let i = 0; i < temp.length; i++) {
            for (let j = i + 1; j < temp.length; j++) {
              if (temp[i].fields.Ref_Type == temp[j].fields.Ref_Type) {
                temp[j].fields.dup = true
              }
            }
          }
          temp.map(item => {
            if (item.fields.EmployeeId == mySessionEmployeeLoggedID && item.fields.dup != true) {
              tempArray.push(item.fields)
            }
          })
        }
        templateObject.correspondences.set(tempArray)
      })
    })
  }
  templateObject.getTermsList = function () {
    getVS1Data('TTermsVS1').then(function (dataObject) {
      if (dataObject.length === 0) {
        contactService.getTermDataVS1().then((data) => {
          setTermsDataVS1(data);
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        setTermsDataVS1(data);
      }
    }).catch(function (err) {
      contactService.getTermDataVS1().then((data) => {
        setTermsDataVS1(data);
      });
    });
  };

  function setTermsDataVS1(data) {
    let terms = [];
    for (let i = 0; i < data.ttermsvs1.length; i++) {
      terms.push(data.ttermsvs1[i].TermsName);
      if (data.ttermsvs1[i].isPurchasedefault === true) {
        templateObject.defaultpurchaseterm.set(data.ttermsvs1[i].TermsName);
        localStorage.setItem('ERPTermsPurchase', data.ttermsvs1[i].TermsName || "COD");
        if (JSON.stringify(currentId) != '{}') {
          if (currentId.id == "undefined") {
            $('#sltTerms').val(data.ttermsvs1[i].TermsName);
          }
        } else {
          $('#sltTerms').val(loggedTermsPurchase || '');
        }
      }
    }
    templateObject.termsList.set(terms);
  }


  function setTab() {
    if (currentId.crmTab === 'active') {
      $('.supplierTab').removeClass('active');
      $('.crmTab').trigger('click');
    } else {
      $('.supplierTab').addClass('active');
      $('.supplierTab').trigger('click')
    }
  }


  templateObject.setInitialForEmptyCurrentID = ()=>{
    let lineItemObj = {
      id: '',
      lid: 'Add Supplier',
      company: '',
      email: '',
      title: '',
      firstname: '',
      middlename: '',
      lastname: '',
      tfn: '',
      terms: loggedTermsPurchase || '',
      phone: '',
      mobile: '',
      fax: '',
      shippingaddress: '',
      scity: '',
      sstate: '',
      spostalcode: '',
      scountry: LoggedCountry || '',
      billingaddress: '',
      bcity: '',
      bstate: '',
      bpostalcode: '',
      bcountry: LoggedCountry || '',
      custFld1: '',
      custFld2: '',
      bankName: '',
      swiftCode: '',
      routingNumber: '',
      bankAccountName: '',
      bankAccountBSB: '',
      bankAccountNo: '',
    };
    templateObject.isSameAddress.set(true);
    templateObject.records.set(lineItemObj);
    setTimeout(function () {
      setTab();
      $('.fullScreenSpin').css('display', 'none');
    }, 100);

    templateObject.getTermsList();
    $('.fullScreenSpin').css('display', 'none');
  }


  templateObject.getCountryData = function () {
    getVS1Data('TCountries').then(function (dataObject) {
      if (dataObject.length === 0) {
        countryService.getCountry().then((data) => {
          setCountry(data);
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        setCountry(data);

      }
    }).catch(function (err) {
      countryService.getCountry().then((data) => {
        setCountry(data);
      });
    });
  };

  function setCountry(data) {
    let countries = [];
    for (let i = 0; i < data.tcountries.length; i++) {
      countries.push(data.tcountries[i].Country)
    }
    countries.sort((a, b) => a.localeCompare(b));
    templateObject.countryData.set(countries);
  }


  function setOneSupplierDataEx(data) {
    let lineItemObj = {
      id: data.fields.ID,
      lid: 'Edit Supplier',
      company: data.fields.ClientName || '',
      email: data.fields.Email || '',
      title: data.fields.Title || '',
      firstname: data.fields.FirstName || '',
      middlename: data.fields.CUSTFLD10 || '',
      lastname: data.fields.LastName || '',
      tfn: '' || '',
      phone: data.fields.Phone || '',
      mobile: data.fields.Mobile || '',
      fax: data.fields.Faxnumber || '',
      skype: data.fields.SkypeName || '',
      website: data.fields.URL || '',
      shippingaddress: data.fields.Street || '',
      scity: data.fields.Street2 || '',
      sstate: data.fields.State || '',
      spostalcode: data.fields.Postcode || '',
      scountry: data.fields.Country || LoggedCountry,
      billingaddress: data.fields.BillStreet || '',
      bcity: data.fields.BillStreet2 || '',
      bstate: data.fields.BillState || '',
      bpostalcode: data.fields.BillPostcode || '',
      bcountry: data.fields.Billcountry || '',
      custfield1: data.fields.CUSTFLD1 || '',
      custfield2: data.fields.CUSTFLD2 || '',
      custfield3: data.fields.CUSTFLD3 || '',
      custfield4: data.fields.CUSTFLD4 || '',
      notes: data.fields.Notes || '',
      preferedpayment: data.fields.PaymentMethodName || '',
      terms: data.fields.TermsName || '',
      deliverymethod: data.fields.ShippingMethodName || '',
      accountnumber: data.fields.ClientNo || 0.00,
      isContractor: data.fields.Contractor || false,
      issupplier: data.fields.IsSupplier || false,
      iscustomer: data.fields.IsCustomer || false,
      bankName: data.fields.BankName || '',
      swiftCode: data.fields.SwiftCode || '',
      routingNumber: data.fields.RoutingNumber || '',
      bankAccountName: data.fields.BankAccountName || '',
      bankAccountBSB: data.fields.BankAccountBSB || '',
      bankAccountNo: data.fields.BankAccountNo || '',
      foreignExchangeCode: data.fields.ForeignExchangeCode || CountryAbbr,
    };

    $('#sltCurrency').val(data.fields.ForeignExchangeCode || CountryAbbr);

    if ((data.fields.Street === data.fields.BillStreet) && (data.fields.Street2 === data.fields.BillStreet2) &&
      (data.fields.State === data.fields.BillState) && (data.fields.Postcode === data.fields.Postcode) &&
      (data.fields.Country === data.fields.Billcountry)) {
      templateObject.isSameAddress.set(true);
    }
    if (data.fields.Contractor === true) {
      $('#isformcontractor').attr("checked", "checked");
    } else {
      $('#isformcontractor').removeAttr("checked");
    }
    templateObject.records.set(lineItemObj);
    templateObject.getAllTask(data.fields.ClientName);
    /* START attachment */
    templateObject.attachmentCount.set(0);
    if (data.fields.Attachments) {
      if (data.fields.Attachments.length) {
        templateObject.attachmentCount.set(data.fields.Attachments.length);
        templateObject.uploadedFiles.set(data.fields.Attachments);
      }
    }

    setTimeout(function () {
      const rowCount = $('.results tbody tr').length;
      $('.counter').text(rowCount + 'items');
      setTab();
      $('#edtActivePrimaryPassword').val('VS1Cloud@123')
      if (primaryAccountantName === lineItemObj.company) {
        $('#chkSameAsPrimary').prop('checked', true)
        $('.active-password-wrapper').removeClass('invisible')
        $('.vs1-login-nav').removeClass('d-none')        
      }
      $('#primaryAccountantUsername').val(lineItemObj.email)
      $('#primaryAccountantPassword').val(`${lineItemObj.firstname}@123`)
    }, 1000)
    $('.fullScreenSpin').css('display', 'none');
  }

  templateObject.getEmployeeData = function (supplierID) {
    getVS1Data('TSupplierVS1').then(function (dataObject) {
      if (dataObject.length === 0) {
        contactService.getOneSupplierDataEx(supplierID).then(function (data) {
          setOneSupplierDataEx(data);
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tsuppliervs1;
        let added = false;
        for (let i = 0; i < useData.length; i++) {
          if (parseInt(useData[i].fields.ID) === parseInt(supplierID)) {
            added = true;
            setOneSupplierDataEx(useData[i]);
          }
        }
        if (!added) {
          contactService.getOneSupplierDataEx(supplierID).then(function (data) {
            setOneSupplierDataEx(data);
          });
        }
      }
    }).catch(function (err) {
      contactService.getOneSupplierDataEx(supplierID).then(function (data) {
        setOneSupplierDataEx(data);
      });
    });
  };

  templateObject.getEmployeeDataByName = function (supplierID) {
    getVS1Data('TSupplierVS1').then(function (dataObject) {
      if (dataObject.length === 0) {
        contactService.getOneSupplierDataExByName(supplierID).then(function (data) {
          setOneSupplierDataEx(data.tsupplier[0]);
        }).catch(function (err) {
          $('.fullScreenSpin').css('display', 'none');
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tsuppliervs1;
        let added = false;
        for (let i = 0; i < useData.length; i++) {
          if ((useData[i].fields.ClientName) === supplierID) {
            added = true;
            setOneSupplierDataEx(useData[i]);
          }
        }
        if (!added) {
          contactService.getOneSupplierDataExByName(supplierID).then(function (data) {
            setOneSupplierDataEx(data.tsupplier[0]);
          }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'none');
          });
        }
      }
    }).catch(function (err) {
      contactService.getOneSupplierDataExByName(supplierID).then(function (data) {
        setOneSupplierDataEx(data.tsupplier[0]);
      }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
      });
    });
  };


  templateObject.getPreferredPaymentList = function () {
    getVS1Data('TPaymentMethod').then(function (dataObject) {
      if (dataObject.length === 0) {
        contactService.getPaymentMethodDataVS1().then((data) => {
          setPreferredPaymentList(data);
        });
      } else {
        const data = JSON.parse(dataObject[0].data);
        setPreferredPaymentList(data);
      }
    }).catch(function (err) {
      contactService.getPaymentMethodDataVS1().then((data) => {
        setPreferredPaymentList(data);
      });
    });
  };

  function setPreferredPaymentList(data) {
    const preferredPayments = [];
    for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
      preferredPayments.push(data.tpaymentmethodvs1[i].fields.PaymentMethodName)
    }
    templateObject.preferredPaymentList.set(preferredPayments);
  }

  templateObject.getDeliveryMethodList = function () {
    getVS1Data('TShippingMethod').then(function (dataObject) {
      if (dataObject.length === 0) {
        contactService.getShippingMethodData().then((data) => {
          setShippingMethodData(data);
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        setShippingMethodData(data);
      }
    }).catch(function (err) {
      contactService.getShippingMethodData().then((data) => {
        setShippingMethodData(data);
      });
    });

  };

  function setShippingMethodData(data) {
    const deliveryMethods = [];
    for (let i = 0; i < data.tshippingmethod.length; i++) {
      deliveryMethods.push(data.tshippingmethod[i].ShippingMethod)
    }
    templateObject.deliveryMethodList.set(deliveryMethods);
  }

  templateObject.getTaxCodesList = function () {
    getVS1Data('TTaxcodeVS1').then(function (dataObject) {
      if (dataObject.length === 0) {
        contactService.getTaxCodesVS1().then((data) => {
          setTaxCodesVS1(data);
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        setTaxCodesVS1(data);
      }
    }).catch(function (err) {
      contactService.getTaxCodesVS1().then((data) => {
        setTaxCodesVS1(data);
      });
    });

  };

  function setTaxCodesVS1(data) {
    const taxCodes = [];
    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
      taxCodes.push(data.ttaxcodevs1[i].CodeName)
    }
    templateObject.taxCodeList.set(taxCodes);
  }


  templateObject.getAllTask = function (supplierName) {
    getVS1Data("TCRMTaskList").then(async function (dataObject) {
      if (dataObject.length == 0) {
        crmService.getAllTasksByContactName().then(async function (data) {
          if (data.tprojecttasks.length > 0) {
            addVS1Data("TCRMTaskList", JSON.stringify(data));
            templateObject.taskrecords.set(data.tprojecttasks);
          }
        }).catch(function (err) {
        })
      } else {
        let data = JSON.parse(dataObject[0].data);
        let all_records = data.tprojecttasks;
        templateObject.taskrecords.set(all_records);
      }
    }).catch(function (err) {
      crmService.getAllTasksByContactName().then(async function (data) {
        if (data.tprojecttasks.length > 0) {
          addVS1Data("TCRMTaskList", JSON.stringify(data));
          templateObject.taskrecords.set(data.tprojecttasks);
        }
      }).catch(function (err) {
      })
    });
  };


  templateObject.getSuppliersList = function () {
    getVS1Data('TSupplierVS1').then(function (dataObject) {
      if (dataObject.length === 0) {
        contactService.getAllSupplierSideDataVS1().then(function (data) {
          setAllSupplierSideDataVS1(data);
        }).catch(function (err) {

        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        setAllSupplierSideDataVS1(data);
      }
    }).catch(function (err) {
      contactService.getAllSupplierSideDataVS1().then(function (data) {
        setAllSupplierSideDataVS1(data);
      }).catch(function (err) {

      });
    });
  };

  function setAllSupplierSideDataVS1(data) {
    let lineItemsSupp = [];
    for (let j = 0; j < data.tsuppliervs1.length; j++) {
      let classname = '';
      if (!isNaN(currentId.id)) {
        if (data.tsuppliervs1[j].fields.ID === parseInt(currentId.id)) {
          classname = 'currentSelect';
        }
      }
      const dataListSupp = {
        id: data.tsuppliervs1[j].fields.ID || '',
        company: data.tsuppliervs1[j].fields.ClientName || '',
        classname: classname
      };
      lineItemsSupp.push(dataListSupp);
    }
    templateObject.supplierrecords.set(lineItemsSupp);
    if (templateObject.supplierrecords.get()) {
      setTimeout(function () {
        $('.counter').text(lineItemsSupp.length + ' items');
      }, 100);
    }
  }

  let currentId = FlowRouter.current().queryParams;
  if (FlowRouter.current().route.name != "supplierscard") {
    currentId = "";
  }
  let supplierID = '';

  if(templateObject.data.record) {
    templateObject.records.set(templateObject.data.record)
  } else {
    if (JSON.stringify(currentId) != '{}') {
      if (currentId.id === "undefined" || currentId.name === "undefined") {
        templateObject.setInitialForEmptyCurrentID();
      } else {
        if (!isNaN(currentId.id)) {
          supplierID = currentId.id;
          templateObject.getEmployeeData(supplierID);
          templateObject.getReferenceLetters();
        } else if ((currentId.name)) {
          supplierID = currentId.name.replace(/%20/g, " ");
          templateObject.getEmployeeDataByName(supplierID);
        } else {
          templateObject.setInitialForEmptyCurrentID();
        }
      }
    } else {
      templateObject.setInitialForEmptyCurrentID();
    }
  }

  templateObject.getDataTableList = function(data) {
    let taskDescription = data.TaskDescription || '';
    taskDescription = taskDescription.length < 50 ? taskDescription : taskDescription.substring(0, 49) + "...";

    const dataList = [
      data.ID || 0,
      // data.priority || 0,
      data.MsTimeStamp !== '' ? moment(data.MsTimeStamp).format("DD/MM/YYYY") : '',
      data.ProjectID || '',
      data.TaskName || '',
      //data.ProjectName || '',
      taskDescription,
      //JSON.stringify(taskLabelArray),
      //category: 'Task',
      data.Completed ? "Completed" : "In-Completed",
      data.due_date ? moment(data.due_date).format("DD/MM/YYYY") : "",
      data.Active ? "" : "In-Active",
    ];
    return dataList;
  }

  let headerStructure = [
    { index: 0, label: 'ID', class: 'colTaskId', active: false, display: true, width: "10" },
    { index: 1, label: 'Date', class: 'colDate', active: true, display: true, width: "80" },
    { index: 2, label: 'Action', class: 'colType', active: true, display: true, width: "110" },
    { index: 3, label: 'Name', class: 'colTaskName', active: true, display: true, width: "200" },
    { index: 4, label: 'Description', class: 'colTaskDesc', active: true, display: true, width: "300" },
    { index: 5, label: 'Completed By', class: 'colTaskLabels', active: true, display: true, width: "110" },
    { index: 6, label: '', class: 'colCompleteTask', active: true, display: true, width: "110" },
    { index: 7, label: 'Status', class: 'colStatus', active: true, display: true, width: "120" },
  ];
  templateObject.tableheaderrecords.set(headerStructure);

  templateObject.transactionTableheaderRecords = new ReactiveVar([]);
  templateObject.getTransactionDataTableList = function(data) {
    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data['Total Amount (Ex)']) || 0.00;
    let totalTax = utilityService.modifynegativeCurrencyFormat(data['Total Tax']) || 0.00;
    let totalAmount = utilityService.modifynegativeCurrencyFormat(data['Total Amount (Inc)']) || 0.00;
    let amountPaidCalc = data['Total Amount (Inc)'] - data.Balance;
    let totalPaid = utilityService.modifynegativeCurrencyFormat(amountPaidCalc) || 0.00;
    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.Balance) || 0.00;
    const dataList_Object = {
        id: data.PurchaseOrderID || '',
        employee: data.Contact || '',
        sortdate: data.OrderDate !== '' ? moment(data.OrderDate).format("YYYY/MM/DD") : data.OrderDate,
        orderdate: data.OrderDate !== '' ? moment(data.OrderDate).format("DD/MM/YYYY") : data.OrderDate,
        suppliername: data.Company || '',
        totalamountex: totalAmountEx || 0.00,
        totaltax: totalTax || 0.00,
        totalamount: totalAmount || 0.00,
        totalpaid: totalPaid || 0.00,
        totaloustanding: totalOutstanding || 0.00,
        orderstatus: '',
        type: data.Type || '',
        custfield1: data.Phone || '',
        custfield2: data.InvoiceNumber || '',
        comments: data.Comments || '',
    };
    var dataList = [
      dataList_Object.id,
      dataList_Object.orderdate,
      dataList_Object.id,
      dataList_Object.suppliername,
      dataList_Object.totalamountex,
      dataList_Object.totaltax,
      dataList_Object.totalamount,
      dataList_Object.totalpaid,
      dataList_Object.totaloustanding,
      dataList_Object.type,
      dataList_Object.custfield1,
      dataList_Object.custfield2,
      dataList_Object.employee,
      dataList_Object.comments,

  ];
    return dataList;
  }
  let transactionHeaderStructure = [
    { index: 0, label: 'ID', class: 'colSortDate', active: false, display: true, width: "10" },
    { index: 1, label: 'Company', class: 'colCompany', active: true, display: true, width: "110" },
    { index: 2, label: 'Phone', class: 'colPhone', active: true, display: true, width: "110" },
    { index: 3, label: 'AR Balance', class: 'colARBalance', active: true, display: true, width: "110" },
    { index: 4, label: 'Credit Balance', class: 'colCreditBalance', active: true, display: true, width: "110" },
    { index: 5, label: 'Balance', class: 'colBalance', active: true, display: true, width: "110" },
    { index: 6, label: 'Credit Limit', class: 'colCreditLimit', active: true, display: true, width: "110" },
    { index: 7, label: 'Order Balance', class: 'colSalesOrderBalance', active: true, display: true, width: "110" },
    { index: 8, label: 'Country', class: 'colCountry', active: true, display: true, width: "110" },
    { index: 9, label: 'Email', class: 'colEmail', active: false, display: true, width: "110" },
    { index: 10, label: 'Account No', class: 'colAccountNo', active: false, display: true, width: "110" },
    { index: 11, label: 'Custom Field 1', class: 'colClientNo', active: false, display: true, width: "110" },
    { index: 12, label: 'Custom Field 2', class: 'colJobTitle', active: false, display: true, width: "110" },
    { index: 13, label: 'Notes', class: 'colNotes', active: true, display: true, width: "110" },
    { index: 14, label: 'Status', class: 'colStatus', active: true, display: true, width: "120" },
  ];
  templateObject.transactionTableheaderRecords.set(transactionHeaderStructure);

});

Template.supplierscard.onRendered(function () {

  $('.fullScreenSpin').css('display', 'inline-block');

  let templateObject = Template.instance();

  templateObject.fillBankInfoFromUrl();
  templateObject.getCountryData();

  $(document).on("click", "#tblBankName tbody tr", function (e) {
    var table = $(this);
    let BankName = table.find(".colBankName").text();
    $('#bankNameModal').modal('toggle');
    $('#edtBankName').val(BankName);
  });

  $("#dtStartingDate,#dtDOB,#dtTermninationDate,#dtAsOf").datepicker({
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
  });
  $("#dtAsOf").datepicker({
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
  });

  templateObject.getPreferredPaymentList();
  templateObject.getTermsList();
  templateObject.getDeliveryMethodList();
  templateObject.getTaxCodesList();
  templateObject.getSuppliersList();

  setTimeout(function () {
    const x = window.matchMedia("(max-width: 1024px)");

    function mediaQuery(x) {
      if (x.matches) {
        $("#displayList").removeClass("col-2");
        $("#displayList").addClass("col-3");
        $("#displayInfo").removeClass("col-10");
        $("#displayInfo").addClass("col-9");
      }
    }
    mediaQuery(x);
    x.addListener(mediaQuery)
  }, 500);
  setTimeout(function () {
    const x = window.matchMedia("(max-width: 420px)");
    const btnView = document.getElementById("btnsViewHide");

    function mediaQuery(x) {
      if (x.matches) {
        $("#displayList").removeClass("col-3");
        $("#displayList").addClass("col-12");
        $("#supplierListCard").removeClass("cardB");
        $("#supplierListCard").addClass("cardB420");
        btnsViewHide.style.display = "none";
        $("#displayInfo").removeClass("col-10");
        $("#displayInfo").addClass("col-12");
      }
    }
    mediaQuery(x);
    x.addListener(mediaQuery)
  }, 500);

  $(document).on("click", "#paymentmethodList tbody tr", function (e) {
    let table = $(this);
    let linePaymentMethod = table.find(".colName").text();
    $("#sltPreferredPayment").val(linePaymentMethod);
    $('#paymentMethodModal').modal('toggle');
  });

  $(document).on('click', '#editSupplierTitle', function (e, li) {
    const $earch = $(this);
    const offset = $earch.offset();
    if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
      $('#supplierTitlePopModal').modal('toggle');
    } else {
      $('#supplierTitlePopModal').modal();
    }
  });

  $(document).ready(function () {
    setTimeout(function () {
      $('#sltTerms').editableSelect();
      $('#sltPreferredPayment').editableSelect();
      $('#editSupplierTitle').editableSelect();
      $('#sltTerms').editableSelect()
        .on('click.editable-select', function (e, li) {
          var $earch = $(this);
          var offset = $earch.offset();
          var termsDataName = e.target.value || '';
          $('#edtTermsID').val('');
          if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $('#termsListModal').modal('toggle');
          } else {
            if (termsDataName.replace(/\s/g, '') != '') {
              $('#termModalHeader').text('Edit Terms');
              getVS1Data('TTermsVS1').then(function (dataObject) { //edit to test indexdb
                if (dataObject.length == 0) {
                  $('.fullScreenSpin').css('display', 'inline-block');
                  sideBarService.getTermsVS1().then(function (data) {
                    for (let i in data.ttermsvs1) {
                      if (data.ttermsvs1[i].TermsName === termsDataName) {
                        $('#edtTermsID').val(data.ttermsvs1[i].Id);
                        $('#edtDays').val(data.ttermsvs1[i].Days);
                        $('#edtName').val(data.ttermsvs1[i].TermsName);
                        $('#edtDesc').val(data.ttermsvs1[i].Description);
                        if (data.ttermsvs1[i].IsEOM === true) {
                          $('#isEOM').prop('checked', true);
                        } else {
                          $('#isEOM').prop('checked', false);
                        }
                        if (data.ttermsvs1[i].IsEOMPlus === true) {
                          $('#isEOMPlus').prop('checked', true);
                        } else {
                          $('#isEOMPlus').prop('checked', false);
                        }
                        if (data.ttermsvs1[i].isSalesdefault === true) {
                          $('#chkCustomerDef').prop('checked', true);
                        } else {
                          $('#chkCustomerDef').prop('checked', false);
                        }
                        if (data.ttermsvs1[i].isPurchasedefault === true) {
                          $('#chkSupplierDef').prop('checked', true);
                        } else {
                          $('#chkSupplierDef').prop('checked', false);
                        }
                      }
                    }
                    setTimeout(function () {
                      $('.fullScreenSpin').css('display', 'none');
                      $('#newTermsModal').modal('toggle');
                    }, 200);
                  });
                } else {
                  let data = JSON.parse(dataObject[0].data);
                  let useData = data.ttermsvs1;
                  for (let i in useData) {
                    if (useData[i].TermsName === termsDataName) {
                      $('#edtTermsID').val(useData[i].Id);
                      $('#edtDays').val(useData[i].Days);
                      $('#edtName').val(useData[i].TermsName);
                      $('#edtDesc').val(useData[i].Description);
                      if (useData[i].IsEOM === true) {
                        $('#isEOM').prop('checked', true);
                      } else {
                        $('#isEOM').prop('checked', false);
                      }
                      if (useData[i].IsEOMPlus === true) {
                        $('#isEOMPlus').prop('checked', true);
                      } else {
                        $('#isEOMPlus').prop('checked', false);
                      }
                      if (useData[i].isSalesdefault === true) {
                        $('#chkCustomerDef').prop('checked', true);
                      } else {
                        $('#chkCustomerDef').prop('checked', false);
                      }
                      if (useData[i].isPurchasedefault === true) {
                        $('#chkSupplierDef').prop('checked', true);
                      } else {
                        $('#chkSupplierDef').prop('checked', false);
                      }
                    }
                  }
                  setTimeout(function () {
                    $('.fullScreenSpin').css('display', 'none');
                    $('#newTermsModal').modal('toggle');
                  }, 200);
                }
              }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'inline-block');
                sideBarService.getTermsVS1().then(function (data) {
                  for (let i in data.ttermsvs1) {
                    if (data.ttermsvs1[i].TermsName === termsDataName) {
                      $('#edtTermsID').val(data.ttermsvs1[i].Id);
                      $('#edtDays').val(data.ttermsvs1[i].Days);
                      $('#edtName').val(data.ttermsvs1[i].TermsName);
                      $('#edtDesc').val(data.ttermsvs1[i].Description);
                      if (data.ttermsvs1[i].IsEOM === true) {
                        $('#isEOM').prop('checked', true);
                      } else {
                        $('#isEOM').prop('checked', false);
                      }
                      if (data.ttermsvs1[i].IsEOMPlus === true) {
                        $('#isEOMPlus').prop('checked', true);
                      } else {
                        $('#isEOMPlus').prop('checked', false);
                      }
                      if (data.ttermsvs1[i].isSalesdefault === true) {
                        $('#chkCustomerDef').prop('checked', true);
                      } else {
                        $('#chkCustomerDef').prop('checked', false);
                      }
                      if (data.ttermsvs1[i].isPurchasedefault === true) {
                        $('#chkSupplierDef').prop('checked', true);
                      } else {
                        $('#chkSupplierDef').prop('checked', false);
                      }
                    }
                  }
                  setTimeout(function () {
                    $('.fullScreenSpin').css('display', 'none');
                    $('#newTermsModal').modal('toggle');
                  }, 200);
                });
              });
            } else {
              $('#termsListModal').modal();
              setTimeout(function () {
                $('#termsList_filter .form-control-sm').focus();
                $('#termsList_filter .form-control-sm').val('');
                $('#termsList_filter .form-control-sm').trigger("input");
                var datatable = $('#termsList').DataTable();
                datatable.draw();
                $('#termsList_filter .form-control-sm').trigger("input");
              }, 500);
            }
          }
        });


      $('#sltPreferredPayment').editableSelect()
        .on('click.editable-select', function (e, li) {
          var $earch = $(event.currentTarget);
          var offset = $earch.offset();

          const templateObject = Template.instance();
          $("#selectPaymentMethodLineID").val('');
          $('#edtPaymentMethodID').val('');
          $('#paymentMethodHeader').text('New Payment Method');
          var paymentDataName = $(event.target).val() || '';
          if (event.pageX > offset.left + $earch.width() - 10) { // X button 16px wide?
            $('#paymentMethodModal').modal('toggle');
            var targetID = $(event.target).closest('tr').attr('id');
            $('#selectPaymentMethodLineID').val(targetID);
            setTimeout(function () {
              $('#paymentmethodList_filter .form-control-sm').focus();
              $('#paymentmethodList_filter .form-control-sm').val('');
              $('#paymentmethodList_filter .form-control-sm').trigger("input");

              var datatable = $('#paymentmethodList').DataTable();
              datatable.draw();
              $('#paymentmethodList_filter .form-control-sm').trigger("input");

            }, 500);
          } else {
            if (paymentDataName.replace(/\s/g, '') != '') {
              var targetID = $(event.target).closest('tr').attr('id');
              $('#selectPaymentMethodLineID').val(targetID);

              $('#paymentMethodHeader').text('Edit Payment Method');

              getVS1Data('TPaymentMethod').then(function (dataObject) {
                if (dataObject.length == 0) {
                  $('.fullScreenSpin').css('display', 'inline-block');
                  sideBarService.getPaymentMethodDataVS1().then(function (data) {
                    for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                      if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                        $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                        $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                        if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                          $('#isformcreditcard').prop('checked', true);
                        } else {
                          $('#isformcreditcard').prop('checked', false);
                        }
                      }
                    }
                    setTimeout(function () {
                      $('.fullScreenSpin').css('display', 'none');
                      $('#newPaymentMethodModal').modal('toggle');
                    }, 200);
                  });
                } else {
                  let data = JSON.parse(dataObject[0].data);
                  let useData = data.tpaymentmethodvs1;

                  for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                    if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                      $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                      $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                      if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                        $('#isformcreditcard').prop('checked', true);
                      } else {
                        $('#isformcreditcard').prop('checked', false);
                      }
                    }
                  }
                  setTimeout(function () {
                    $('.fullScreenSpin').css('display', 'none');
                    $('#newPaymentMethodModal').modal('toggle');
                  }, 200);
                }
              }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'inline-block');
                sideBarService.getPaymentMethodDataVS1().then(function (data) {
                  for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                    if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                      $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                      $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                      if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                        $('#isformcreditcard').prop('checked', true);
                      } else {
                        $('#isformcreditcard').prop('checked', false);
                      }
                    }
                  }
                  setTimeout(function () {
                    $('.fullScreenSpin').css('display', 'none');
                    $('#newPaymentMethodModal').modal('toggle');
                  }, 200);
                });
              });

            } else {
              $('#paymentMethodModal').modal('toggle');
              var targetID = $(event.target).closest('tr').attr('id');
              $('#selectPaymentMethodLineID').val(targetID);
              setTimeout(function () {
                $('#paymentmethodList_filter .form-control-sm').focus();
                $('#paymentmethodList_filter .form-control-sm').val('');
                $('#paymentmethodList_filter .form-control-sm').trigger("input");

                var datatable = $('#paymentmethodList').DataTable();
                datatable.draw();
                $('#paymentmethodList_filter .form-control-sm').trigger("input");

              }, 500);
            }

          }

        });

      $(document).on("click", "#referenceLetterModal .btnSaveLetterTemp", function (e) {
        if ($("input[name='refTemp']:checked").attr('value') == undefined || $("input[name='refTemp']:checked").attr('value') == null) {
          swal({
            title: 'Oooops...',
            text: "No email template has been set",
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Cancel'
          }).then((result) => {
            if (result.value) {
              $('#referenceLetterModal').modal('toggle');
            }
          });
        } else {
          let email = $('#edtSupplierCompanyEmail').val();
          let dataLabel = $("input[name='refTemp']:checked").attr('value');
          let dataSubject = $("input[name='refTemp']:checked").attr('data-subject');
          let dataMemo = $("input[name='refTemp']:checked").attr('data-memo');
          if (email && email != null && email != '') {
            document.location =
              "mailto:" + email + "?subject=" + dataSubject + "&body=" + dataMemo;
            sideBarService.getCorrespondences().then(dataObject => {
              let temp = {
                type: "TCorrespondence",
                fields: {
                  Active: true,
                  EmployeeId: localStorage.getItem('mySessionEmployeeLoggedID'),
                  Ref_Type: dataLabel,
                  MessageAsString: dataMemo,
                  MessageFrom: localStorage.getItem('mySessionEmployee'),
                  MessageId: dataObject.tcorrespondence.length.toString(),
                  MessageTo: email,
                  ReferenceTxt: dataSubject,
                  Ref_Date: moment().format('YYYY-MM-DD'),
                  Status: ""
                }
              }
              sideBarService.saveCorrespondence(temp).then(data => {
                sideBarService.getCorrespondences().then(dataUpdate => {
                  addVS1Data('TCorrespondence', JSON.stringify(dataUpdate));
                })
                $('#referenceLetterModal').modal('toggle');
              })
            })
          } else {
            swal({
              title: 'Oooops...',
              text: "No user email has been set",
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Cancel'
            }).then((result) => {
              if (result.value) {
                $('#referenceLetterModal').modal('toggle');
              }
            });
          }
        }
      });

      $(document).on('click', '#referenceLetterModal .btnAddLetter', function (e) {
        $('#addLetterTemplateModal').modal('toggle')
      })


      $(document).on('click', '#addLetterTemplateModal #save-correspondence', function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let correspondenceTemp = templateObject.correspondences.get()
        let tempLabel = $("#edtTemplateLbl").val();
        let tempSubject = $('#edtTemplateSubject').val();
        let tempContent = $("#edtTemplateContent").val();
        if (correspondenceTemp.length > 0) {
          let index = correspondenceTemp.findIndex(item => {
            return item.Ref_Type == tempLabel
          })
          if (index > 0) {
            swal({
              title: 'Oooops...',
              text: 'There is already a template labeled ' + tempLabel,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
            }).then((result) => {
              if (result.value) { } else if (result.dismiss === 'cancel') { }
            });
            $('.fullScreenSpin').css('display', 'none');
          } else {

            sideBarService.getCorrespondences().then(dObject => {

              let temp = {
                Active: true,
                EmployeeId: localStorage.getItem('mySessionEmployeeLoggedID'),
                Ref_Type: tempLabel,
                MessageAsString: tempContent,
                MessageFrom: "",
                MessageId: dObject.tcorrespondence.length.toString(),
                MessageTo: "",
                ReferenceTxt: tempSubject,
                Ref_Date: moment().format('YYYY-MM-DD'),
                Status: ""
              }
              let objDetails = {
                type: 'TCorrespondence',
                fields: temp
              }

              sideBarService.saveCorrespondence(objDetails).then(data => {
                sideBarService.getCorrespondences().then(dataUpdate => {
                  addVS1Data('TCorrespondence', JSON.stringify(dataUpdate)).then(function () {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                      title: 'Success',
                      text: 'Template has been saved successfully ',
                      type: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'Continue'
                    }).then((result) => {
                      if (result.value) {
                        $('#addLetterTemplateModal').modal('toggle')
                        templateObject.getReferenceLetters();
                      } else if (result.dismiss === 'cancel') { }
                    });
                  })
                }).catch(function () {
                  $('.fullScreenSpin').css('display', 'none');
                  swal({
                    title: 'Oooops...',
                    text: 'Something went wrong',
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                  }).then((result) => {
                    if (result.value) {
                      $('#addLetterTemplateModal').modal('toggle')
                    } else if (result.dismiss === 'cancel') { }
                  });
                })
              }).catch(function () {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                  title: 'Oooops...',
                  text: 'Something went wrong',
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                }).then((result) => {
                  if (result.value) {
                    $('#addLetterTemplateModal').modal('toggle')
                  } else if (result.dismiss === 'cancel') { }
                });
              })

            })
          }
        } else {
          sideBarService.getCorrespondences().then(dObject => {
            let temp = {
              Active: true,
              EmployeeId: localStorage.getItem('mySessionEmployeeLoggedID'),
              Ref_Type: tempLabel,
              MessageAsString: tempContent,
              MessageFrom: "",
              MessageId: dObject.tcorrespondence.length.toString(),
              MessageTo: "",
              ReferenceTxt: tempSubject,
              Ref_Date: moment().format('YYYY-MM-DD'),
              Status: ""
            }
            let objDetails = {
              type: 'TCorrespondence',
              fields: temp
            }

            let array = [];
            array.push(objDetails)

            sideBarService.saveCorrespondence(objDetails).then(data => {
              sideBarService.getCorrespondences().then(function (dataUpdate) {
                addVS1Data('TCorrespondence', JSON.stringify(dataUpdate)).then(function () {
                  $('.fullScreenSpin').css('display', 'none');
                  swal({
                    title: 'Success',
                    text: 'Template has been saved successfully ',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Continue'
                  }).then((result) => {
                    if (result.value) {
                      $('#addLetterTemplateModal').modal('toggle')
                      templateObject.getReferenceLetters();

                    } else if (result.dismiss === 'cancel') { }
                  });
                }).catch(function (err) {
                  $('.fullScreenSpin').css('display', 'none');
                  swal({
                    title: 'Oooops...',
                    text: 'Something went wrong',
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                  }).then((result) => {
                    if (result.value) {
                      $('#addLetterTemplateModal').modal('toggle')
                    } else if (result.dismiss === 'cancel') { }
                  });
                })
              })
            }).catch(function () {
              swal({
                title: 'Oooops...',
                text: 'Something went wrong',
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
              }).then((result) => {
                if (result.value) {
                  $('#addLetterTemplateModal').modal('toggle')
                } else if (result.dismiss === 'cancel') { }
              });
            })
          })

        }
        // localStorage.setItem('correspondence', JSON.stringify(correspondenceTemp));
        // templateObject.correspondences.set(correspondenceTemp);
        // $('#addLetterTemplateModal').modal('toggle');
      })

      $(document).on("click", "#termsListModal tbody tr", function (e) {
        $('#sltTerms').val($(this).find(".colName").text());
        $('#termsListModal').modal('hide');
      });

      $(document).on("click", "#tblTitleList tbody tr", function (e) {
        $('#editSupplierTitle').val($(this).find(".colTitleName").text());
        $('#supplierTitlePopModal').modal('toggle');
      });

    }, 3000);
  });

  $(document).on("click", "#tblSupplierCrmListWithDate tbody .dnd-moved .colDate, #tblSupplierCrmListWithDate tbody .dnd-moved .colType", function (e) {
    $(".editTaskDetailName").val($("#tblSupplierCrmListWithDate tbody .dnd-moved .colTaskName").html());
    $(".editTaskDetailDescription").val($("#tblSupplierCrmListWithDate tbody .dnd-moved .colTaskDesc").html());
    $("#taskmodalDuedate").val($("#tblSupplierCrmListWithDate tbody .dnd-moved #completeDate").val());
    $("#taskDetailModal").modal("toggle");
  });

  $(document).on("change", ".editTaskDetailName, .editTaskDetailDescription, #taskmodalDuedate", function (e) {
    $("#tblSupplierCrmListWithDate tbody .dnd-moved .colTaskName").html($(".editTaskDetailName").val());
    $("#tblSupplierCrmListWithDate tbody .dnd-moved .colTaskDesc").html($(".editTaskDetailDescription").val());
    $("#tblSupplierCrmListWithDate tbody .dnd-moved #completeDate").val($("#taskmodalDuedate").val());
  });

  let tokenid = "random";
  $(document).on("focusout", "#" + tokenid + " .colTaskName, #" + tokenid + " .colTaskDesc, #" + tokenid + " .colCompletedBy", function (e) {
    $(".editTaskDetailName").val($("#tblSupplierCrmListWithDate tbody .dnd-moved .colTaskName").html());
    $(".editTaskDetailDescription").val($("#tblSupplierCrmListWithDate tbody .dnd-moved .colTaskDesc").html());
    $("#taskmodalDuedate").val($("#tblSupplierCrmListWithDate tbody .dnd-moved #completeDate").val());
    if ($("#" + tokenid + " .colTaskName").html() != "" && $("#" + tokenid + " .colTaskDesc").html() != "" && $("#" + tokenid + " #completeDate").val() != "") {
      $("input.form-control-sm").focus();
      $(".btnSaveEditTask").trigger("click");
      $(".btnAddLineGroup button").attr("disabled", false);
      $(".btnTask").attr("disabled", false);
    }
  });

  
  $(document).on('click', ".toggle-password", function (ev) {
    $(this).toggleClass("fa-eye fa-eye-slash");
    var passwordSecret = $($(this).data('toggle'));
    if (passwordSecret.attr("type") == "password") {
      passwordSecret.attr("type", "text");
    } else {
      passwordSecret.attr("type", "password");
    }
  });
                                
});

Template.supplierscard.events({
  'keyup .txtSearchSupplier': function (event) {
    if ($(event.target).val() != '') {
      $(".btnRefreshSuppliers").addClass('btnSearchAlert');
    } else {
      $(".btnRefreshSuppliers").removeClass('btnSearchAlert');
    }
    if (event.keyCode == 13) {
      $(".btnRefreshSuppliers").trigger("click");
    }
  },

  'click .btnRefreshSuppliers': async function (event) {
    let currentId = FlowRouter.current().queryParams;
    $('.fullScreenSpin').css('display', 'inline-block');
    let dataSearchName = $('.txtSearchSupplier').val() || '';
    if (dataSearchName.replace(/\s/g, '') != '') {
      sideBarService.getNewSupplierByNameOrID(dataSearchName).then(async function (data) {
        $(".btnRefreshSuppliers").removeClass('btnSearchAlert');
        let lineItems = [];
        let lineItemObj = {};
        if (data.tsuppliervs1.length > 0) {
          $("#tblSupplierSideList > tbody").empty();
          for (let i = 0; i < data.tsuppliervs1.length; i++) {
            let classname = '';
            if (!isNaN(currentId.id)) {
              if (data.tsuppliervs1[i].fields.ID == parseInt(currentId.id)) {
                classname = 'currentSelect';
              }
            }
            const dataList = {
              id: data.tsuppliervs1[i].fields.ID || '',
              company: data.tsuppliervs1[i].fields.ClientName || '',
              classname: classname
            };
            $(".tblSupplierSideList > tbody").append(
              ' <tr id="' + dataList.id + '" style="cursor: pointer;">' +
              '<td data-toggle="tooltip" data-bs-tooltip="" data-placement="bottom" title="' + dataList.company + '" id="' + dataList.id + '" class="' + dataList.classname + '" >' + dataList.company + '</td>' +
              '</tr>');
            lineItems.push(dataList);
          }

          setTimeout(function () {
            $('.counter').text(lineItems.length + ' items');
          }, 100);
          $('.fullScreenSpin').css('display', 'none');
        } else {
          $('.fullScreenSpin').css('display', 'none');
        }
      }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
      });
    } else {
      Meteor._reload.reload();
      $('.fullScreenSpin').css('display', 'none');
    }
  },
  'click #supplierShipping-1': function (event) {
    if ($(event.target).is(':checked')) {
      $('.supplierShipping-2').css('display', 'none');

    } else {
      $('.supplierShipping-2').css('display', 'block');
    }
  },
  'click .openBalance': function (event) {
    let currentId = FlowRouter.current().queryParams.id || '';
    let supplierName = $('#edtSupplierCompany').val() || '';
    if (supplierName !== "") {
      window.open('/agedpayables?contact=' + supplierName + '&contactid=' + currentId, '_self');
    } else {
      window.open('/agedpayables', '_self');
    }
  },
  'click .btnMakeSupplierPayment': async function (event) {
    let currentId = FlowRouter.current().queryParams.id || '';
    let supplierName = $('#edtSupplierCompany').val() || '';
    if (supplierName !== "") {
      await clearData('TAwaitingSupplierPayment');
      FlowRouter.go('/supplierawaitingpurchaseorder?contact=' + supplierName + '&contactid=' + currentId);
    }
  },
  'click .openBalancesummary': function (event) {
    let currentId = FlowRouter.current().queryParams.id || '';
    let supplierName = $('#edtSupplierCompany').val() || '';
    if (supplierName !== "") {
      window.open('/agedpayablessummary?contact=' + supplierName + '&contactid=' + currentId, '_self');
    } else {
      window.open('/agedpayablessummary', '_self');
    }
  },
  'click .btnBack': function (event) {
    playCancelAudio();
    event.preventDefault();
    setTimeout(function () {
      history.back(1);
    }, delayTimeAfterSound);
  },
  'click #chkSameAsShipping': function (event) {
    if ($(event.target).is(':checked')) {
      // let streetAddress = $('#edtSupplierShippingAddress').val();
      // let city = $('#edtSupplierShippingCity').val();
      // let state =  $('#edtSupplierShippingState').val();
      // let zipcode =  $('#edtSupplierShippingZIP').val();
      //
      // let country =  $('#sedtCountry').val();
      //  $('#edtSupplierBillingAddress').val(streetAddress);
      //  $('#edtSupplierBillingCity').val(city);
      //  $('#edtSupplierBillingState').val(state);
      //  $('#edtSupplierBillingZIP').val(zipcode);
      //  $('#bcountry').val(country);
    } else {
      // $('#edtSupplierBillingAddress').val('');
      // $('#edtSupplierBillingCity').val('');
      // $('#edtSupplierBillingState').val('');
      // $('#edtSupplierBillingZIP').val('');
      // $('#bcountry').val('');
    }
  },
  'click .btnSave': async function (event) {
    playSaveAudio();
    let templateObject = Template.instance();
    let contactService = new ContactService();
    setTimeout(async function () {
      if ($('#edtSupplierCompany').val() === '') {
        swal('Supplier Name should not be blank!', '', 'warning');
        e.preventDefault();
        return false;
      }

      if ($('#chkSameAsPrimary').prop('checked')) {
        if ($('#edtActivePrimaryPassword').val() !== "VS1Cloud@123") {
          swal('Activate primary password is incorrect!', '', 'error');
          return
        }
        if (!$('#primaryAccountantUsername').val() || !$('#primaryAccountantPassword').val()) {
          swal('VS1 User Login should not be empty!', '', 'error');
          $('.vs1-login-nav-link').trigger('click')
          return
        }
      }
      $('.fullScreenSpin').css('display', 'inline-block');

      let company = $('#edtSupplierCompany').val() || '';
      let email = $('#edtSupplierCompanyEmail').val() || '';
      let title = $('#editSupplierTitle').val() || '';
      let firstname = $('#edtSupplierFirstName').val() || '';
      let middlename = $('#edtSupplierMiddleName').val() || '';
      let lastname = $('#edtSupplierLastName').val() || '';
      let suffix = $('#suffix').val() || '';
      let phone = $('#edtSupplierPhone').val() || '';
      let mobile = $('#edtSupplierMobile').val() || '';
      if (mobile && mobile !== '') {
        mobile = contactService.changeMobileFormat(mobile);
      }
      let fax = $('#edtSupplierFax').val() || '';
      let accountno = $('#edtSupplierAccountNo').val() || '';
      let skype = $('#edtSupplierSkypeID').val() || '';
      let website = $('#edtSupplierWebsite').val() || '';
      let streetAddress = $('#edtSupplierShippingAddress').val() || '';
      let city = $('#edtSupplierShippingCity').val() || '';
      let state = $('#edtSupplierShippingState').val() || '';
      let postalcode = $('#edtSupplierShippingZIP').val() || '';
      let country = $('#sedtCountry').val() || '';
      let bstreetAddress = '';
      let bcity = '';
      let bstate = '';
      let bpostalcode = '';
      let bcountry = '';
      let isContractor = false;
      let isCustomer = false;
      isCustomer = !!$('#chkSameAsCustomer').is(':checked');
      if ($('#isformcontractor').is(':checked')) {
        isContractor = true;
      }
      if ($('#chkSameAsShipping').is(':checked')) {
        bstreetAddress = streetAddress;
        bcity = city;
        bstate = state;
        bpostalcode = postalcode;
        bcountry = country;
      } else {
        bstreetAddress = $('#edtSupplierBillingAddress').val() || '';
        bcity = $('#edtSupplierBillingCity').val() || '';
        bstate = $('#edtSupplierBillingState').val() || '';
        bpostalcode = $('#edtSupplierBillingZIP').val() || '';
        bcountry = $('#bcountry').val() || '';
      }
      // Billing tab fields
      let sltPaymentMethodName = $('#sltPreferredPayment').val() || '';
      let sltTermsName = $('#sltTerms').val() || '';
      let sltShippingMethodName = '';
      let notes = $('#txaNotes').val() || '';
      let suppaccountno = $('#suppAccountNo').val() || '';
      let BankAccountName = $('#edtBankAccountName').val() || '';
      let BSB = $('#edtBsb').val() || '';
      let BankName = $('#edtBankName').val() || '';
      let BankAccountNo = $('#edtBankAccountNumber').val() || '';
      let SwiftCode = $('#edtSwiftCode').val() || '';
      let RoutingNumber = $('#edtRoutingNumber').val() || '';

      // add to custom field
      let custField1 = $('#edtSaleCustField1').val() || '';
      let custField2 = $('#edtSaleCustField2').val() || '';
      let custField3 = $('#edtSaleCustField3').val() || '';
      let custField4 = $('#edtCustomeField4').val() || '';

      const url = FlowRouter.current().path;
      const getemp_id = url.split('?id=');
      let currentEmployee = getemp_id[getemp_id.length - 1];
      let objDetails = '';
      let uploadedItems = templateObject.uploadedFiles.get();

      if (company == '') {
        swal('Please provide the compamy name !', '', 'warning');
        $('.fullScreenSpin').css('display', 'none');
        e.preventDefault();
        return false;
      }

      if (firstname == '') {
        //swal('Please provide the first name !', '', 'warning');
        swal({
          title: "Please provide the first name !",
          text: '',
          type: 'warning',
        }).then((result) => {
          if (result.value) {
            $('#edtSupplierFirstName').focus();
          } else if (result.dismiss == 'cancel') {

          }
        });
        $('.fullScreenSpin').css('display', 'none');
        e.preventDefault();
        return false;
      }


      if (lastname == '') {
        //swal('Please provide the last name !', '', 'warning');
        swal({
          title: "Please provide the last name !",
          text: '',
          type: 'warning',
        }).then((result) => {
          if (result.value) {
            $('#edtSupplierLastName').focus();
          } else if (result.dismiss == 'cancel') {

          }
        });
        $('.fullScreenSpin').css('display', 'none');
        e.preventDefault();
        return false;
      }

      if (sltTermsName == '') {
        //swal("Terms has not been selected!", "", "warning");
        swal({
          title: "Terms has not been selected!",
          text: '',
          type: 'warning',
        }).then((result) => {
          if (result.value) {
            $('.bilingTab').trigger('click');
            $('#sltTerms').focus();
          } else if (result.dismiss == 'cancel') {

          }
        });
        $('.fullScreenSpin').css('display', 'none');
        e.preventDefault();
        return false;
      }

      if (getemp_id[1]) {
        currentEmployee = parseInt(currentEmployee);
        objDetails = {
          type: "TSupplierEx",
          fields: {
            ID: currentEmployee,
            Title: title,
            ClientName: company,
            FirstName: firstname,
            CUSTFLD10: middlename,
            LastName: lastname,
            IsCustomer: isCustomer,
            Email: email,
            Phone: phone,
            Mobile: mobile,
            SkypeName: skype,
            Faxnumber: fax,
            Street: streetAddress,
            Street2: city,
            State: state,
            PostCode: postalcode,
            Country: country,
            Contractor: isContractor,
            BillStreet: bstreetAddress,
            BillStreet2: bcity,
            BillState: bstate,
            BillPostCode: bpostalcode,
            Billcountry: bcountry,
            Notes: notes,
            PaymentMethodName: sltPaymentMethodName,
            TermsName: sltTermsName,
            ShippingMethodName: sltShippingMethodName,
            ClientNo: suppaccountno,
            URL: website,
            Attachments: uploadedItems,
            CUSTFLD1: custField1,
            CUSTFLD2: custField2,
            CUSTFLD3: custField3,
            PublishOnVS1: true,
            BankAccountName: BankAccountName,
            BankAccountBSB: BSB,
            BankAccountNo: BankAccountNo,
            BankName: BankName,
            SwiftCode: SwiftCode,
            RoutingNumber: RoutingNumber,
            ForeignExchangeCode: $("#sltCurrency").val(),

          }
        };
      } else {
        let suppdupID = 0;
        let checkSuppData = await contactService.getCheckSuppliersData(company);
        if (checkSuppData.tsupplier.length) {
          suppdupID = checkSuppData.tsupplier[0].Id;
          objDetails = {
            type: "TSupplierEx",
            fields: {
              ID: suppdupID || 0,
              Title: title,
              ClientName: company,
              FirstName: firstname,
              CUSTFLD10: middlename,
              LastName: lastname,
              IsCustomer: isCustomer,
              Email: email,
              Phone: phone,
              Mobile: mobile,
              SkypeName: skype,
              Faxnumber: fax,
              Street: streetAddress,
              Street2: city,
              State: state,
              PostCode: postalcode,
              Country: country,
              Contractor: isContractor,
              BillStreet: bstreetAddress,
              BillStreet2: bcity,
              BillState: bstate,
              BillPostCode: bpostalcode,
              Billcountry: bcountry,
              Notes: notes,
              PaymentMethodName: sltPaymentMethodName,
              TermsName: sltTermsName,
              ShippingMethodName: sltShippingMethodName,
              ClientNo: suppaccountno,
              URL: website,
              Attachments: uploadedItems,
              CUSTFLD1: custField1,
              CUSTFLD2: custField2,
              CUSTFLD3: custField3,
              PublishOnVS1: true,
              BankAccountName: BankAccountName,
              BankAccountBSB: BSB,
              BankAccountNo: BankAccountNo,
              BankName: BankName,
              SwiftCode: SwiftCode,
              RoutingNumber: RoutingNumber,
              ForeignExchangeCode: $("#sltCurrency").val(),
            }
          };
        } else {
          objDetails = {
            type: "TSupplierEx",
            fields: {
              Title: title,
              ClientName: company,
              FirstName: firstname,
              CUSTFLD10: middlename,
              LastName: lastname,
              IsCustomer: isCustomer,
              Email: email,
              Phone: phone,
              Mobile: mobile,
              SkypeName: skype,
              Faxnumber: fax,
              Street: streetAddress,
              Street2: city,
              State: state,
              PostCode: postalcode,
              Country: country,
              Contractor: isContractor,
              BillStreet: bstreetAddress,
              BillStreet2: bcity,
              BillState: bstate,
              BillPostCode: bpostalcode,
              Billcountry: bcountry,
              Notes: notes,
              PaymentMethodName: sltPaymentMethodName,
              TermsName: sltTermsName,
              ShippingMethodName: sltShippingMethodName,
              ClientNo: suppaccountno,
              URL: website,
              Attachments: uploadedItems,
              CUSTFLD1: custField1,
              CUSTFLD2: custField2,
              CUSTFLD3: custField3,
              PublishOnVS1: true,
              BankAccountName: BankAccountName,
              BankAccountBSB: BSB,
              BankAccountNo: BankAccountNo,
              BankName: BankName,
              SwiftCode: SwiftCode,
              RoutingNumber: RoutingNumber,
              ForeignExchangeCode: $("#sltCurrency").val(),
            }
          };
        }
      }

      contactService.saveSupplierEx(objDetails).then(function (objDetails) {
        let supplierSaveID = objDetails.fields.ID;
        if (supplierSaveID) {
          organisationService.getOrganisationDetail().then(function(data) {
            if (!data || !data.tcompanyinfo || !data.tcompanyinfo[0]) return
            data.tcompanyinfo[0] = {...data.tcompanyinfo[0], Contact: company}         
            let organisationSettings = {type: "TCompanyInfo", fields: data.tcompanyinfo[0]}
            organisationService
              .saveOrganisationSetting(organisationSettings)
              .then(function () {
                  localStorage.setItem("VS1Accountant", company);
                  addVS1Data('TCompanyInfo', JSON.stringify(data));
                  // swal("Organisation details successfully updated!", "", "success")
                  sideBarService.getAllSuppliersDataVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                    addVS1Data('TSupplierVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                      window.open('/supplierlist', '_self');
                    }).catch(function (err) {
                      window.open('/supplierlist', '_self');
                    });
                  }).catch(function (err) {
                    window.open('/supplierlist', '_self');
                  });
              })
              .catch(function (err) {
                  swal('Oooops...', err, 'error');                  
              });
          });
        }
        if (localStorage.getItem("enteredURL") != null) {
          FlowRouter.go(localStorage.getItem("enteredURL"));
          localStorage.removeItem("enteredURL");
          return;
        }
      }).catch(function (err) {
        swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    }, delayTimeAfterSound);
  },
  'keyup .search': function (event) {
    var searchTerm = $(".search").val();
    var listItem = $('.results tbody').children('tr');
    var searchSplit = searchTerm.replace(/ /g, "'):containsi('");

    $.extend($.expr[':'], {
      'containsi': function (elem, i, match, array) {
        return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
      }
    });

    $(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function (e) {
      $(this).attr('visible', 'false');
    });

    $(".results tbody tr:containsi('" + searchSplit + "')").each(function (e) {
      $(this).attr('visible', 'true');
    });

    var jobCount = $('.results tbody tr[visible="true"]').length;
    $('.counter').text(jobCount + ' items');

    if (jobCount == '0') { $('.no-result').show(); } else {
      $('.no-result').hide();
    }
    if (searchTerm === "") {
      $(".results tbody tr").each(function (e) {
        $(this).attr('visible', 'true');
        $('.no-result').hide();
      });

      //setTimeout(function () {
      var rowCount = $('.results tbody tr').length;
      $('.counter').text(rowCount + ' items');
      //}, 500);
    }

  },
  'click .tblSupplierSideList tbody tr': function (event) {
    const suppLineID = $(event.target).attr('id');
    if (suppLineID) {
      window.open('/supplierscard?id=' + suppLineID, '_self');
    }
  },

  'click .tblSupplierCrmListWithDate tbody tr': function (event) {
    const taskID = $(event.target).parent().attr('id');
    let colType = $(event.target).parent().find(".colType").text();

    if (taskID !== undefined && taskID !== "random") {
      if (colType == 'Task') {
        // FlowRouter.go('/crmoverview?taskid=' + taskID);
        openEditTaskModals(taskID, "");
      } else if (colType == 'Appointment') {
        // FlowRouter.go('/appointments?id=' + taskID);
        document.getElementById("updateID").value = taskID || 0;
        $("#event-modal").modal("toggle");
      }
    }
  },
  'click .chkDatatable': function (event) {
    const columns = $('#tblTransactionlist th');
    let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();
    $.each(columns, function (i, v) {
      let className = v.classList;
      let replaceClass = className[1];
      if (v.innerText === columnDataValue) {
        if ($(event.target).is(':checked')) {
          $("." + replaceClass + "").css('display', 'table-cell');
          $("." + replaceClass + "").css('padding', '.75rem');
          $("." + replaceClass + "").css('vertical-align', 'top');
        } else {
          $("." + replaceClass + "").css('display', 'none');
        }
      }
    });
  },
  'click .resetTable': function (event) {
    let checkPrefDetails = getCheckPrefDetails('tblTransactionlist');
    if (checkPrefDetails) {
      CloudPreference.remove({ _id: checkPrefDetails._id }, function (err, idTag) {
        if (err) {

        } else {
          Meteor._reload.reload();
        }
      });

    }
  },
  'click .saveTable': function (event) {
    let lineItems = [];
    //let datatable =$('#tblTransactionlist').DataTable();
    $('.columnSettings').each(function (index) {
      const $tblrow = $(this);
      const colTitle = $tblrow.find(".divcolumn").text() || '';
      const colWidth = $tblrow.find(".custom-range").val() || 0;
      const colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
      let colHidden = !$tblrow.find(".custom-control-input").is(':checked');
      let lineItemObj = {
        index: index,
        label: colTitle,
        hidden: colHidden,
        width: colWidth,
        thclass: colthClass
      };
      lineItems.push(lineItemObj);
    });
    //datatable.state.save();
    let checkPrefDetails = getCheckPrefDetails('tblTransactionlist');
    if (checkPrefDetails) {
      CloudPreference.update({ _id: checkPrefDetails._id }, {
        $set: {
          userid: clientID,
          username: clientUsername,
          useremail: clientEmail,
          PrefGroup: 'salesform',
          PrefName: 'tblTransactionlist',
          published: true,
          customFields: lineItems,
          updatedAt: new Date()
        }
      }, function (err, idTag) {
        if (err) {
          $('#myModal2').modal('toggle');
        } else {
          $('#myModal2').modal('toggle');
        }
      });
    } else {
      CloudPreference.insert({
        userid: clientID,
        username: clientUsername,
        useremail: clientEmail,
        PrefGroup: 'salesform',
        PrefName: 'tblTransactionlist',
        published: true,
        customFields: lineItems,
        createdAt: new Date()
      }, function (err, idTag) {
        if (err) {
          $('#myModal2').modal('toggle');
        } else {
          $('#myModal2').modal('toggle');
        }
      });
    }
    $('#myModal2').modal('toggle');
    //Meteor._reload.reload();
  },
  'blur .divcolumn': function (event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');

    var datable = $('#tblTransactionlist').DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);

  },
  'change .rngRange': function (event) {
    let range = $(event.target).val();
    // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

    // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
    let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    var datable = $('#tblTransactionlist th');
    $.each(datable, function (i, v) {

      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css('width', range + 'px');

      }
    });

  },
  'click .btnOpenSettings': function (event) {
    let templateObject = Template.instance();
    var columns = $('#tblTransactionlist th');

    const tableHeaderList = [];
    let sTible = "";
    let sWidth = "";
    let sIndex = "";
    let sVisible = "";
    let columVisible = false;
    let sClass = "";
    $.each(columns, function (i, v) {
      if (v.hidden == false) {
        columVisible = true;
      }
      if ((v.className.includes("hiddenColumn"))) {
        columVisible = false;
      }
      sWidth = v.style.width.replace('px', "");

      let datatablerecordObj = {
        sTitle: v.innerText || '',
        sWidth: sWidth || '',
        sIndex: v.cellIndex || 0,
        sVisible: columVisible || false,
        sClass: v.className || ''
      };
      tableHeaderList.push(datatablerecordObj);
    });

    templateObject.tableheaderrecords.set(tableHeaderList);
  },
  'click #exportbtn': function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    jQuery('#tblTransactionlist_wrapper .dt-buttons .btntabletocsv').click();
    $('.fullScreenSpin').css('display', 'none');

  },
  'click .printConfirm': function (event) {
    playPrintAudio();
    setTimeout(function () {
      $('.fullScreenSpin').css('display', 'inline-block');
      jQuery('#tblTransactionlist_wrapper .dt-buttons .btntabletopdf').click();
      $('.fullScreenSpin').css('display', 'none');
    }, delayTimeAfterSound);
  },
  'click .btnRefresh': function () {
    //Meteor._reload.reload();
    window.location.reload()
  },

  'click .btnRefreshCrm': function () {
    let currentId = FlowRouter.current().queryParams;
    $('.fullScreenSpin').css('display', 'inline-block');
    sideBarService.getTProjectTasks().then(function (data) {
      addVS1Data('TProjectTasks', JSON.stringify(data)).then(function (datareturn) {
        if (!isNaN(currentId.id)) {
          window.open('/supplierscard?id=' + currentId.id + '&crmTab=active', '_self');
        }
      }).catch(function (err) {
        if (!isNaN(currentId.id)) {
          window.open('/supplierscard?id=' + currentId.id + '&crmTab=active', '_self');
        }
      });
    }).catch(function (err) {
      if (!isNaN(currentId.id)) {
        window.open('/supplierscard?id=' + currentId.id + '&crmTab=active', '_self');
      }
    });
  },
  'click #formCheck-2': function () {
    if ($(event.target).is(':checked')) {
      $('#autoUpdate').css('display', 'none');
    } else {
      $('#autoUpdate').css('display', 'block');
    }
  },
  'click #formCheck-one': function (event) {
    if ($(event.target).is(':checked')) {
      $('.checkbox1div').css('display', 'block');

    } else {
      $('.checkbox1div').css('display', 'none');
    }
  },
  'click #formCheck-two': function (event) {
    if ($(event.target).is(':checked')) {
      $('.checkbox2div').css('display', 'block');
    } else {
      $('.checkbox2div').css('display', 'none');
    }
  },
  'click #formCheck-three': function (event) {
    if ($(event.target).is(':checked')) {
      $('.checkbox3div').css('display', 'block');
    } else {
      $('.checkbox3div').css('display', 'none');
    }
  },
  'click #formCheck-four': function (event) {
    if ($(event.target).is(':checked')) {
      $('.checkbox4div').css('display', 'block');
    } else {
      $('.checkbox4div').css('display', 'none');
    }
  },
  'blur .customField1Text': function (event) {
    var inputValue1 = $('.customField1Text').text();
    $('.lblCustomField1').text(inputValue1);
  },
  'blur .customField2Text': function (event) {
    var inputValue2 = $('.customField2Text').text();
    $('.lblCustomField2').text(inputValue2);
  },
  'blur .customField3Text': function (event) {
    var inputValue3 = $('.customField3Text').text();
    $('.lblCustomField3').text(inputValue3);
  },
  'blur .customField4Text': function (event) {
    var inputValue4 = $('.customField4Text').text();
    $('.lblCustomField4').text(inputValue4);
  },
  'click .btnSaveSettings': function (event) {
    playSaveAudio();
    setTimeout(function () {
      $('.lblCustomField1').html('');
      $('.lblCustomField2').html('');
      $('.lblCustomField3').html('');
      $('.lblCustomField4').html('');
      let getchkcustomField1 = true;
      let getchkcustomField2 = true;
      let getchkcustomField3 = true;
      let getchkcustomField4 = true;
      let getcustomField1 = $('.customField1Text').html();
      let getcustomField2 = $('.customField2Text').html();
      let getcustomField3 = $('.customField3Text').html();
      let getcustomField4 = $('.customField4Text').html();
      if ($('#formCheck-one').is(':checked')) {
        getchkcustomField1 = false;
      }
      if ($('#formCheck-two').is(':checked')) {
        getchkcustomField2 = false;
      }
      if ($('#formCheck-three').is(':checked')) {
        getchkcustomField3 = false;
      }
      if ($('#formCheck-four').is(':checked')) {
        getchkcustomField4 = false;
      }
      $('#customfieldModal').modal('toggle');
    }, delayTimeAfterSound);
  },
  'click .btnResetSettings': function (event) {
    let checkPrefDetails = getCheckPrefDetails('supplierscard');
    if (checkPrefDetails) {
      CloudPreference.remove({ _id: checkPrefDetails._id }, function (err, idTag) {
        if (err) {

        } else {
          Meteor._reload.reload();
        }
      });
    }
  },
  'click .new_attachment_btn': function (event) {
    $('#attachment-upload').trigger('click');
  },
  'change #attachment-upload': function (e) {
    let templateObj = Template.instance();
    let saveToTAttachment = false;
    let lineIDForAttachment = false;
    let uploadedFilesArray = templateObj.uploadedFiles.get();

    let myFiles = $('#attachment-upload')[0].files;
    let uploadData = utilityService.attachmentUploadTabs(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
    templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
    templateObj.attachmentCount.set(uploadData.totalAttachments);
  },
  'click .img_new_attachment_btn': function (event) {
    $('#img-attachment-upload').trigger('click');
  },
  'change #img-attachment-upload': function (e) {
    let templateObj = Template.instance();
    let saveToTAttachment = false;
    let lineIDForAttachment = false;
    let uploadedFilesArray = templateObj.uploadedFiles.get();

    let myFiles = $('#img-attachment-upload')[0].files;
    let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
    templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
    templateObj.attachmentCount.set(uploadData.totalAttachments);
  },
  'click .remove-attachment': function (event, ui) {
    let tempObj = Template.instance();
    let attachmentID = parseInt(event.target.id.split('remove-attachment-')[1]);
    if (tempObj.$("#confirm-action-" + attachmentID).length) {
      tempObj.$("#confirm-action-" + attachmentID).remove();
    } else {
      let actionElement = '<div class="confirm-action" id="confirm-action-' + attachmentID + '"><a class="confirm-delete-attachment btn btn-default" id="delete-attachment-' + attachmentID + '">' +
        'Delete</a><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
      tempObj.$('#attachment-name-' + attachmentID).append(actionElement);
    }
    tempObj.$("#new-attachment2-tooltip").show();

  },
  'click .file-name': function (event) {
    let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-name-')[1]);
    let templateObj = Template.instance();
    let uploadedFiles = templateObj.uploadedFiles.get();

    $('#myModalAttachment').modal('hide');
    let previewFile = {};
    let input = uploadedFiles[attachmentID].fields.Description;
    previewFile.link = 'data:' + input + ';base64,' + uploadedFiles[attachmentID].fields.Attachment;
    previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
    let type = uploadedFiles[attachmentID].fields.Description;
    if (type === 'application/pdf') {
      previewFile.class = 'pdf-class';
    } else if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      previewFile.class = 'docx-class';
    } else if (type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      previewFile.class = 'excel-class';
    } else if (type === 'application/vnd.ms-powerpoint' || type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      previewFile.class = 'ppt-class';
    } else if (type === 'application/vnd.oasis.opendocument.formula' || type === 'text/csv' || type === 'text/plain' || type === 'text/rtf') {
      previewFile.class = 'txt-class';
    } else if (type === 'application/zip' || type === 'application/rar' || type === 'application/x-zip-compressed' || type === 'application/x-zip,application/x-7z-compressed') {
      previewFile.class = 'zip-class';
    } else {
      previewFile.class = 'default-class';
    }

    if (type.split('/')[0] === 'image') {
      previewFile.image = true
    } else {
      previewFile.image = false
    }
    templateObj.uploadedFile.set(previewFile);

    $('#files_view').modal('show');

    return;
  },
  'click .confirm-delete-attachment': function (event, ui) {
    let tempObj = Template.instance();
    tempObj.$("#new-attachment2-tooltip").show();
    let attachmentID = parseInt(event.target.id.split('delete-attachment-')[1]);
    let uploadedArray = tempObj.uploadedFiles.get();
    let attachmentCount = tempObj.attachmentCount.get();
    $('#attachment-upload').val('');
    uploadedArray.splice(attachmentID, 1);
    tempObj.uploadedFiles.set(uploadedArray);
    attachmentCount--;
    if (attachmentCount === 0) {
      let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
      $('#file-display').html(elementToAdd);
    }
    tempObj.attachmentCount.set(attachmentCount);
    if (uploadedArray.length > 0) {
      let utilityService = new UtilityService();
      utilityService.showUploadedAttachmentTabs(uploadedArray);
    } else {
      $(".attchment-tooltip").show();
    }
  },
  'click .attachmentTab': function () {
    let templateInstance = Template.instance();
    let uploadedFileArray = templateInstance.uploadedFiles.get();
    if (uploadedFileArray.length > 0) {
      let utilityService = new UtilityService();
      utilityService.showUploadedAttachmentTabs(uploadedFileArray);
    } else {
      $(".attchment-tooltip").show();
    }
  },
  'click .btnView': function (e) {
    var btnView = document.getElementById("btnView");
    var btnHide = document.getElementById("btnHide");

    var displayList = document.getElementById("displayList");
    var displayInfo = document.getElementById("displayInfo");
    if (displayList.style.display === "none") {
      displayList.style.display = "flex";
      $("#displayInfo").removeClass("col-12");
      $("#displayInfo").addClass("col-9");
      btnView.style.display = "none";
      btnHide.style.display = "flex";
    } else {
      displayList.style.display = "none";
      $("#displayInfo").removeClass("col-9");
      $("#displayInfo").addClass("col-12");
      btnView.style.display = "flex";
      btnHide.style.display = "none";
    }
  },
  'click .transTab': function (event) {
    let templateObject = Template.instance();
    let supplierName = $('#edtSupplierCompany').val();
  },
  'click .btnDeleteSupplier': function (event) {
    playDeleteAudio();
    let templateObject = Template.instance();
    let contactService2 = new ContactService();
    setTimeout(function () {
      $('.fullScreenSpin').css('display', 'inline-block');

      let currentId = FlowRouter.current().queryParams;
      let objDetails = '';

      if (!isNaN(currentId.id) || templateObject.data.record) {
        let currentSupplier = parseInt(currentId.id);
        if(isNaN(currentId.id)) {
          currentSupplier = templateObject.data.record.id
        }
        objDetails = {
          type: "TSupplierEx",
          fields: {
            ID: currentSupplier,
            Active: false
          }
        };
        contactService2.saveSupplierEx(objDetails).then(function (objDetails) {
          FlowRouter.go('/supplierlist?success=true');
        }).catch(function (err) {
          swal({
            title: 'Oooops...',
            text: err,
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Try Again'
          }).then((result) => {
            if (result.value) { } else if (result.dismiss === 'cancel') {

            }
          });
          $('.fullScreenSpin').css('display', 'none');
        });
      } else {
        FlowRouter.go('/supplierlist?success=true');
      }
      $('#deleteSupplierModal').modal('toggle');
    }, delayTimeAfterSound);
  },
  'click .btnTask': function (event) {
    let templateObject = Template.instance();
    // $('.fullScreenSpin').css('display', 'inline-block');
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.id) || templateObject.data.record ) {
      let supplierID = parseInt(currentId.id);
      // FlowRouter.go('/crmoverview?supplierid=' + supplierID);
      $("#btnAddLine").trigger("click");
    } else {

    }
  },
  'click .btnEmail': function (event) {
    let templateObject = Template.instance();
    playEmailAudio();
    setTimeout(function () {
      $('.fullScreenSpin').css('display', 'inline-block');
      let currentId = FlowRouter.current().queryParams;
      if (!isNaN(currentId.id) ||  templateObject.data.record ) {
        let supplierID = parseInt(currentId.id);
        // FlowRouter.go('/crmoverview?supplierid=' + supplierID);
        $('#referenceLetterModal').modal('toggle');
        $('.fullScreenSpin').css('display', 'none');
      } else {

      }
    }, delayTimeAfterSound);
  },
  'click .btnAppointment': function (event) {
    let templateObject = Template.instance();
    $('.fullScreenSpin').css('display', 'inline-block');
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.id)) {
      let supplierID = parseInt(currentId.id);
      FlowRouter.go('/appointments?supplierid=' + supplierID);
    } else {
      if(templateObject.data.record) {
        $('.edtSupplier_modal').modal('hide')
        let suppID = parseInt(templateObject.data.record.id);
        FlowRouter.go('/appointments?supplierid=' + suppID);
      }
    }
  },
  'click .btnBill': function (event) {
    let templateObject = Template.instance();
    $('.fullScreenSpin').css('display', 'inline-block');
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.id)) {
      let supplierID = parseInt(currentId.id);
      FlowRouter.go('/billcard?supplierid=' + supplierID);
    } else {
      if(templateObject.data.record) {
        $('.edtSupplier_modal').modal('hide')
        let suppID = parseInt(templateObject.data.record.id);
        FlowRouter.go('/billcard?supplierid=' + suppID);
      }
    }
  },
  'click .btnCredit': function (event) {
    let templateObject = Template.instance();
    $('.fullScreenSpin').css('display', 'inline-block');
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.id)) {
      let supplierID = parseInt(currentId.id);
      FlowRouter.go('/creditcard?supplierid=' + supplierID);
    } else {
      if(templateObject.data.record) {
        $('.edtSupplier_modal').modal('hide')
        let suppID = parseInt(templateObject.data.record.id);
        FlowRouter.go('/creditcard?supplierid=' + suppID);
      }
    }
  },
  'click .btnPurchaseOrder': function (event) {
    let templateObject = Template.instance()
    $('.fullScreenSpin').css('display', 'inline-block');
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.id)) {
      let supplierID = parseInt(currentId.id);
      FlowRouter.go('/purchaseordercard?supplierid=' + supplierID);
    } else {
      if(templateObject.data.record) {
        $('edtSupplier_modal').modal('hide')
        let suppID = parseInt(templateObject.data.record.id);
        FlowRouter.go('/purchaseordercard?supplierid=' + suppID);
      }
    }
  },

  // add to custom field
  "click #edtSaleCustField1": function (e) {
    $("#clickedControl").val("one");
  },

  // add to custom field
  "click #edtSaleCustField2": function (e) {
    $("#clickedControl").val("two");
  },

  // add to custom field
  "click #edtSaleCustField3": function (e) {
    $("#clickedControl").val("three");
  },

  "click .btnSaveAddTask": function (e) {
    playSaveAudio();
    let templateObject = Template.instance();
    setTimeout(function () {
      let task_name = $("#add_task_name").val();
      let task_description = $("#add_task_description").val();
      let subTaskID = $("#txtCrmSubTaskID").val();

      let due_date = $(".crmEditDatepicker").val();
      due_date = due_date ? moment(due_date.split('/')[2] + '-' + due_date.split('/')[1] + '-' + due_date.split('/')[0]).format("YYYY-MM-DD hh:mm:ss") : moment().format("YYYY-MM-DD hh:mm:ss");

      let priority = 0;
      priority = $("#chkPriorityAdd1").prop("checked") ? 1 : $("#chkPriorityAdd2").prop("checked") ? 2 : $("#chkPriorityAdd3").prop("checked") ? 3 : 0;

      if (task_name === "") {
        swal("Task name is not entered!", "", "warning");
        return;
      }
      $(".fullScreenSpin").css("display", "inline-block");
      let projectID = $("#addProjectID").val() ? $("#addProjectID").val() : 11;
      projectID = $("#editProjectID").val() ? $("#editProjectID").val() : projectID;

      let selected_lbls = [];
      $("#addTaskLabelWrapper input:checked").each(function () {
        selected_lbls.push($(this).attr("name"));
      });

      let employeeID = localStorage.getItem("mySessionEmployeeLoggedID");
      let employeeName = localStorage.getItem("mySessionEmployee");

      let assignId = $('#assignedID').val();
      let assignName = $('#add_assigned_name').val();

      let contactID = $('#contactID').val();
      let contactName = $('#add_contact_name').val();
      let contactType = $('#contactType').val();
      let customerID = 0;
      let leadID = 0;
      let supplierID = 0;
      if (contactType == 'Customer') {
        customerID = contactID
      } else if (contactType == 'Lead') {
        leadID = contactID
      } else if (contactType == 'Supplier') {
        supplierID = contactID
      }

      let addObject = {
        TaskName: task_name,
        TaskDescription: task_description,
        Completed: false,
        ProjectID: projectID,
        due_date: due_date,
        priority: priority,
        EnteredByID: parseInt(employeeID),
        EnteredBy: employeeName,
        CustomerID: customerID,
        LeadID: leadID,
        SupplierID: supplierID,
        AssignID: assignId,
        AssignName: assignName,
        ContactName: contactName
      }

      if (subTaskID) {
        var objDetails = {
          type: "Tprojecttasks",
          fields: {
            ID: subTaskID,
            subtasks: [{
              type: "Tprojecttask_subtasks",
              fields: addObject,
            }]
          },
        };
      } else {
        var objDetails = {
          type: "Tprojecttasks",
          fields: addObject,
        };
      }

      crmService.saveNewTask(objDetails).then(function (res) {
        if (res.fields.ID) {
          if (moment(due_date).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) { }

          $(".btnAddSubTask").css("display", "block");
          $(".newTaskRow").css("display", "none");
          $(".addTaskModal").css("display", "none");

          $("#chkPriorityAdd0").prop("checked", false);
          $("#chkPriorityAdd1").prop("checked", false);
          $("#chkPriorityAdd2").prop("checked", false);
          $("#chkPriorityAdd3").prop("checked", false);


          //////////////////////////////
          // setTimeout(() => {
          //   templateObject.getAllTaskList();
          //   templateObject.getTProjectList();
          // }, 500);
          $("#newTaskModal").modal("hide");
          // $("#newProjectTasksModal").modal("hide");
          if (subTaskID) {
            crmService.getTaskDetail(subTaskID).then(function (data) {
              $(".fullScreenSpin").css("display", "none");
              if (data.fields.ID == subTaskID) {
                let selected_record = data.fields;

                if (selected_record.subtasks) {

                  let newSubTaskID = 0;
                  if (Array.isArray(selected_record.subtasks)) {
                    templateObject.subTasks.set(selected_record.subtasks)
                    newSubTaskID = selected_record.subtasks[selected_record.subtasks.length - 1].fields.ID
                  }

                  if (typeof selected_record.subtasks == 'object') {
                    let arr = [];
                    arr.push(selected_record.subtasks)
                    templateObject.subTasks.set(arr)
                    newSubTaskID = selected_record.subtasks.fields.ID

                  }

                  try {
                    // add labels to New task
                    // tempcode until api is updated
                    // current label and task is 1:1 relationship
                    selected_lbls.forEach((lbl) => {
                      crmService.updateLabel({
                        type: "Tprojecttask_TaskLabel",
                        fields: {
                          ID: lbl,
                          TaskID: newSubTaskID,
                        },
                      }).then(function (data) {
                        // templateObject.getAllTaskList();
                        templateObject.getTProjectList();
                      });
                    });
                    // tempcode until api is updated
                  } catch (error) {
                    swal(error, "", "error");
                  }
                } else {
                  let sutTaskTable = $('#tblSubtaskDatatable').DataTable();
                  sutTaskTable.clear().draw();
                }

              }

            }).catch(function (err) {
              $(".fullScreenSpin").css("display", "none");
              swal(err, "", "error");
              return;
            });
          }

        }

        // templateObject.getAllTaskList();
        templateObject.getTProjectList();

        $(".btnRefresh").addClass('btnSearchAlert');

        $(".fullScreenSpin").css("display", "none");

        // $("#add_task_name").val("");
        // $("#add_task_description").val("");

        // $('#assignedID').val("");
        // $('#add_assigned_name').val("");

        // $('#contactID').val("");
        // $('#add_contact_name').val("");

      }).catch(function (err) {
        swal({
          title: "Oooops...",
          text: err,
          type: "error",
          showCancelButton: false,
          confirmButtonText: "Try Again",
        }).then((result) => { });
        $(".fullScreenSpin").css("display", "none");
      });
    }, delayTimeAfterSound);
  },

  "click #btnAddLine, click #btnAddLineTask": function (e) {
    let tokenid = "random";
    let currentDate = new Date();
    let completeDate = new Date();
    currentDate = moment(currentDate).subtract(-1, "days").format("DD/MM/YYYY");
    completeDate = moment(completeDate).subtract(-3, "days").format("DD/MM/YYYY");
    var rowData = `<tr class="dnd-moved" id="${tokenid}">
            <td class="colTaskId hiddenColumn dtr-control" tabindex="0">
                ${tokenid}
            </td>
            <td class="colDate">${currentDate}</td>
            <td class="colType">Task</td>
            <td class="colTaskName" contenteditable="true"></td>
            <td class="colTaskDesc" contenteditable="true"></td>
            <td class="colCompletedBy" style="padding:5px!important">
                <div class="input-group date" style="width: 160px;">
                    <input type="text" class="form-control" id="completeDate" name="completeDate" >
                    <div class="input-group-addon">
                        <span class="glyphicon glyphicon-th"></span>
                    </div>
                </div>
            </td>
            <td class="colCompleteTask" align="right">
                <span class="btnRemoveLine"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0" style="margin-top:0!important"><i class="fa fa-remove"></i></button></span>
            </td>
        </tr>`;

    $("#tblSupplierCrmListWithDate tbody").prepend(rowData);

    $("#completeDate").datepicker({
      showOn: "button",
      buttonText: "Show Date",
      buttonImageOnly: true,
      buttonImage: "/img/imgCal2.png",
      dateFormat: "dd/mm/yy",
      showOtherMonths: true,
      selectOtherMonths: true,
      changeMonth: true,
      changeYear: true,
      yearRange: "-90:+10",
      onSelect: function (formated, dates) {
      },
      onChangeMonthYear: function (year, month, inst) {
        // Set date to picker
        $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
      }
    });
    $("#completeDate").datepicker("setDate", completeDate);

    $(".btnAddLineGroup button").attr("disabled", true);
    $(".btnTask").attr("disabled", true);

    $("#" + tokenid + " .colTaskName").focus();

    $("#frmEditTaskModal")[0].reset();
    $("#txtCrmTaskID").val("");
    $("#txtCrmProjectID").val("");
    $("#txtCrmSubTaskID").val("");
    $("#addProjectID").val("");
    $("#contactID").val("");
    $('#assignedID').val("");

    const url = FlowRouter.current().path;
    const getemp_id = url.split('?id=');
    let currentEmployee = getemp_id[getemp_id.length - 1];
    let TCustomerID = 0;
    if (getemp_id[1]) {
      TCustomerID = parseInt(currentEmployee);
    }

    $("#contactID").val(TCustomerID);
    $('#contactType').val('Supplier')
    $('#crmEditSelectLeadList').val($('#edtSupplierCompany').val());
    $('#contactEmailClient').val($('#edtSupplierCompanyEmail').val());
    $('#contactPhoneClient').val($('#edtSupplierPhone').val());
    $('#taskmodalDuedate').val(moment().format("DD/MM/YYYY"));
  },
  "click .btnRemoveLine": function (event) {
    var targetID = $(event.target).closest("tr").attr("id");
    $(event.target).closest("tr").remove();
    $(".btnAddLineGroup button").attr("disabled", false);
    $(".btnTask").attr("disabled", false);
    event.preventDefault();
  },

  "change #chkSameAsPrimary": async function (event) {
    if ($("#chkSameAsPrimary").prop('checked')) {
      if (primaryAccountantName !== $('#edtSupplierCompany').val()) {
        let result = await swal({
          title: 'Warning',
          text: `${primaryAccountantName} is already Your primary accountant, do you wish to switch?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        })        
        if (result.dismiss === 'cancel') {
          $("#chkSameAsPrimary").prop('checked', false)
        }
      }
      $('.active-password-wrapper').removeClass('invisible')
      $('.vs1-login-nav').removeClass('d-none')
    } else {
      $('.active-password-wrapper').addClass('invisible')
      $('.vs1-login-nav').addClass('d-none')
    }
  },

  // "change #edtSupplierFirstName": async function (event) {
  //   $('#primaryAccountantPassword').val(`${$(event.target).val()}@123`)
  // },

  // "change #edtSupplierCompanyEmail": async function (event) {
  //   $('#primaryAccountantUsername').val($(event.target).val())
  // },
});

Template.supplierscard.helpers({
  record: () => {
    let parentRecord = Template.parentData(0).record;
    if (parentRecord) {
      return parentRecord;
    } else {
      let temp = Template.instance().records.get();
      if (temp && temp.mobile) {
        temp.mobile = temp.mobile.replace('+61', '0')
      }
      return temp;
    }
  },
  countryList: () => {
    return Template.instance().countryData.get();
  },
  supplierrecords: () => {
    return Template.instance().supplierrecords.get().sort(function (a, b) {
      if (a.company === 'NA') {
        return 1;
      } else if (b.company === 'NA') {
        return -1;
      }
      return (a.company.toUpperCase() > b.company.toUpperCase()) ? 1 : -1;
    });
  },

  crmRecords: () => {
    return Template.instance().crmRecords.get().sort(function (a, b) {
      if (a.id === 'NA') {
        return 1;
      } else if (b.id === 'NA') {
        return -1;
      }
      return (a.id > b.id) ? 1 : -1;
    });
  },
  crmTableheaderRecords: () => {
    return Template.instance().crmTableheaderRecords.get();
  },

  correspondences: () => {
    return Template.instance().correspondences.get();
  },
  datatablerecords: () => {
    return Template.instance().datatablerecords.get().sort(function (a, b) {
      if (a.orderdate === 'NA') {
        return 1;
      } else if (b.orderdate === 'NA') {
        return -1;
      }
      return (a.orderdate.toUpperCase() > b.orderdate.toUpperCase()) ? 1 : -1;
    });
  },
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({ userid: localStorage.getItem('mycloudLogonID'), PrefName: 'tblSalesOverview' });
  },
  currentdate: () => {
    const currentDate = new Date();
    return moment(currentDate).format("DD/MM/YYYY");
  },
  preferredPaymentList: () => {
    return Template.instance().preferredPaymentList.get();
  },
  termsList: () => {
    return Template.instance().termsList.get();
  },
  deliveryMethodList: () => {
    return Template.instance().deliveryMethodList.get();
  },
  taxCodeList: () => {
    return Template.instance().taxCodeList.get();
  },
  uploadedFiles: () => {
    return Template.instance().uploadedFiles.get();
  },
  attachmentCount: () => {
    return Template.instance().attachmentCount.get();
  },
  uploadedFile: () => {
    return Template.instance().uploadedFile.get();
  },
  contactCloudPreferenceRec: () => {
    return CloudPreference.findOne({ userid: localStorage.getItem('mycloudLogonID'), PrefName: 'supplierscard' });
  },
  isSameAddress: () => {
    return Template.instance().isSameAddress.get();
  },
  isMobileDevices: () => {
    let isMobile = false; //initiate as false
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
      isMobile = true;
    }
    return isMobile;
  },

  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  apiFunction:function() {
    let crmService = new CRMService();
    return crmService.getAllTasksByContactName;
  },

  searchAPI: function() {
    return crmService.getAllTasksByName;
  },

  service: ()=>{
    let crmService = new CRMService();
    return crmService;

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
    return ['LimitCount', 'LimitFrom', 'deleteFilter'];
  },

  transactionTableheaderRecords: () => {
    return Template.instance().transactionTableheaderRecords.get();
  },
  transactionApiFunction:function() {
    const contactService = new ContactService();
    return contactService.getAllTransList;
  },

  transactionSearchAPI: function() {
    const contactService = new ContactService();
    return contactService.getAllTransListBySupplier;
  },

  transactionDatahandler: function () {
    let templateObject = Template.instance();
    return function(data) {
      let dataReturn =  templateObject.getTransactionDataTableList(data)
      return dataReturn
    }
  },

  transactionExDataHandler: function() {
    let templateObject = Template.instance();
    return function(data) {
      let dataReturn =  templateObject.getTransactionDataTableList(data)
      return dataReturn
    }
  },

  transactionApiParams: function() {
    return ['limitcount', 'limitfrom', 'deleteFilter'];
  },

  transactionService: ()=>{
    const contactService = new ContactService();
    return contactService;
  },
});

function getCheckPrefDetails(prefName) {
  const getcurrentCloudDetails = CloudUser.findOne({
    _id: localStorage.getItem('mycloudLogonID'),
    clouddatabaseID: localStorage.getItem('mycloudLogonDBID')
  });
  let checkPrefDetails = null;
  if (getcurrentCloudDetails) {
    if (getcurrentCloudDetails._id.length > 0) {
      const clientID = getcurrentCloudDetails._id;
      const clientUsername = getcurrentCloudDetails.cloudUsername;
      const clientEmail = getcurrentCloudDetails.cloudEmail;
      checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: prefName });
    }
  }
  return checkPrefDetails;
}

function openEditTaskModals(id, type) {
  const crmService = new CRMService();
  const contactService = new ContactService();
  // let catg = e.target.dataset.catg;
  let templateObject = Template.instance();
  // $("#editProjectID").val("");

  $("#txtCrmSubTaskID").val(id);

  $(".fullScreenSpin").css("display", "inline-block");
  // get selected task detail via api
  getVS1Data("TCRMTaskList").then(async function (dataObject) {
    if (dataObject.length == 0) {
      // crmService.getAllTasksByContactName().then(async function(data) {
      //     if (data.tprojecttasks.length > 0) {
      //         addVS1Data("TCRMTaskList", JSON.stringify(data));
      //         templateObject.taskrecords.set(data.tprojecttasks);
      //     }
      // }).catch(function(err) {
      // })
    } else {
      let data = JSON.parse(dataObject[0].data);
      let taskrecords = data.tprojecttasks;
      for (var i = 0; i < taskrecords.length; i++) {
        if (taskrecords[i].fields.ID == id) {
          $(".fullScreenSpin").css("display", "none");
          let selected_record = taskrecords[i].fields;

          $("#txtCrmTaskID").val(selected_record.ID);
          $("#txtCrmProjectID").val(selected_record.ProjectID);
          $("#txtCommentsDescription").val("");

          $(".editTaskDetailName").val(selected_record.TaskName);
          $(".editTaskDetailDescription").val(selected_record.TaskDescription);
          // tempcode check if AssignedName is set in selected_record
          let employeeName = selected_record.AssignName ? selected_record.AssignName : localStorage.getItem("mySessionEmployee");
          let assignId = selected_record.AssignID ? selected_record.AssignID : localStorage.getItem("mySessionEmployeeLoggedID");
          $('#crmEditSelectEmployeeList').val(employeeName);
          $('#assignedID').val(assignId)
          contactService.getOneEmployeeDataEx(assignId).then(function (empDetailInfo) {
            $('#contactEmailUser').val(empDetailInfo.fields.Email);
            $('#contactPhoneUser').val(empDetailInfo.fields.Phone);
          }).catch(function (err) { });

          // $('#contactEmailClient').val(selected_record.ClientEmail);
          // $('#contactPhoneClient').val(selected_record.ClientPhone);

          $("#contactEmailClient").val(selected_record.ContactEmail);
          $("#contactPhoneClient").val(selected_record.ContactPhone);
          $("#contactEmailUser").val(selected_record.AssignEmail);
          $("#contactPhoneUser").val(selected_record.AssignPhone);

          let colClientName = selected_record.ContactName;
          $('#crmEditSelectLeadList').val(colClientName);
          if (selected_record.CustomerID) {
            $('#contactID').val(selected_record.CustomerID)
            $('#contactType').val('Customer')

            if (selected_record.ContactEmail == "" && selected_record.ContactPhone == "") {
              contactService.getOneEmployeeDataEx(selected_record.CustomerID).then(function (empDetailInfo) {
                $('#contactEmailClient').val(empDetailInfo.fields.Email);
                $('#contactPhoneClient').val(empDetailInfo.fields.Phone);
              }).catch(function (err) {

              });
            }
          } else if (selected_record.LeadID) {
            $('#contactID').val(selected_record.LeadID)
            $('#contactType').val('Lead')

            if (selected_record.ContactEmail == "" && selected_record.ContactPhone == "") {
              contactService.getOneLeadDataEx(selected_record.LeadID).then(function (empDetailInfo) {
                $('#contactEmailClient').val(empDetailInfo.fields.Email);
                $('#contactPhoneClient').val(empDetailInfo.fields.Phone);
              }).catch(function (err) {

              });
            }
          } else {
            $('#contactID').val(selected_record.SupplierID)
            $('#contactType').val('Supplier')
            if (selected_record.SupplierID) {
              if (selected_record.ContactEmail == "" && selected_record.ContactPhone == "") {
                contactService.getOneSupplierDataEx(selected_record.SupplierID).then(function (empDetailInfo) {
                  $('#contactEmailClient').val(empDetailInfo.fields.Email);
                  $('#contactPhoneClient').val(empDetailInfo.fields.Phone);
                }).catch(function (err) {

                });
              }
            }
          }

          let projectName = selected_record.ProjectName == "Default" ? "All Tasks" : selected_record.ProjectName;

          if (selected_record.Completed) {
            $('#chkComplete_taskEdit').prop("checked", true);
          } else {
            $('#chkComplete_taskEdit').prop("checked", false);
          }

          let all_projects = templateObject.all_projects.get();
          let projectColorStyle = '';
          if (selected_record.ProjectID != 0) {
            let projects = all_projects.filter(project => project.fields.ID == selected_record.ProjectID);
            if (projects.length && projects[0].fields.ProjectColour) {
              projectColorStyle = 'color: ' + projects[0].fields.ProjectColour + ' !important';
            }
          }

          $("#addProjectID").val(selected_record.ProjectID);
          $("#taskDetailModalCategoryLabel").val(projectName);

          $("#taskmodalNameLabel").html(selected_record.TaskName);
          $(".activityAdded").html("Added on " + moment(selected_record.MsTimeStamp).format("MMM D h:mm A"));
          // let due_date = selected_record.due_date ? moment(selected_record.due_date).format("D MMM") : "No Date";
          let due_date = selected_record.due_date ? moment(selected_record.due_date).format("DD/MM/YYYY") : "";


          let todayDate = moment().format("ddd");
          let tomorrowDay = moment().add(1, "day").format("ddd");
          let nextMonday = moment(moment()).day(1 + 7).format("ddd MMM D");
          let date_component = due_date;

          $("#taskmodalDuedate").val(date_component);
          $("#taskmodalDescription").html(selected_record.TaskDescription);

          $("#chkComplete_taskEditLabel").removeClass("task_priority_0");
          $("#chkComplete_taskEditLabel").removeClass("task_priority_1");
          $("#chkComplete_taskEditLabel").removeClass("task_priority_2");
          $("#chkComplete_taskEditLabel").removeClass("task_priority_3");
          $("#chkComplete_taskEditLabel").addClass("task_priority_" + selected_record.priority);

          let taskmodalLabels = "";
          $(".chkDetailLabel").prop("checked", false);
          if (selected_record.TaskLabel) {
            if (selected_record.TaskLabel.fields != undefined) {
                taskmodalLabels =
                    `<span class="taskTag"><i class="fas fa-tag" style="color:${selected_record.TaskLabel.fields.Color};"></i><a class="taganchor filterByLabel" href="" data-id="${selected_record.TaskLabel.fields.ID}">` +
                    selected_record.TaskLabel.fields.TaskLabelName +
                    "</a></span>";
                $("#detail_label_" + selected_record.TaskLabel.fields.ID).prop(
                    "checked",
                    true
                );
                $(".taskModalActionLableDropdown").css("color", selected_record.TaskLabel.fields.Color);
            } else {
                selected_record.TaskLabel.forEach((lbl) => {
                    taskmodalLabels +=
                        `<span class="taskTag"><i class="fas fa-tag" style="color:${lbl.fields.Color};"></i><a class="taganchor filterByLabel" href="" data-id="${lbl.fields.ID}">` +
                        lbl.fields.TaskLabelName +
                        "</a></span> ";
                    $("#detail_label_" + lbl.fields.ID).prop("checked", true);
                    $(".taskModalActionLableDropdown").css("color", lbl.fields.Color);
                });
                taskmodalLabels = taskmodalLabels.slice(0, -2);
            }
          }
          else{
              $(".taskModalActionLableDropdown").css("color", "#858796");
          }
          $("#taskmodalLabels").html(taskmodalLabels);
          let subtasks = "";
          if (selected_record.subtasks) {
            if (Array.isArray(selected_record.subtasks)) {
              templateObject.subTasks.set(selected_record.subtasks)
            }

            if (typeof selected_record.subtasks == 'object') {
              let arr = [];
              arr.push(selected_record.subtasks)
              templateObject.subTasks.set(arr)
            }
          } else {
            let sutTaskTable = $('#tblSubtaskDatatable').DataTable();
            sutTaskTable.clear().draw();
          }

          let comments = "";
          if (selected_record.comments) {
            if (selected_record.comments.fields != undefined) {
              let comment = selected_record.comments.fields;
              let comment_date = comment.CommentsDate ? moment(comment.CommentsDate).format("MMM D h:mm A") : "";
              let commentUserArry = comment.EnteredBy.toUpperCase().split(" ");
              let commentUser = commentUserArry.length > 1 ? commentUserArry[0].charAt(0) + commentUserArry[1].charAt(0) : commentUserArry[0].charAt(0);
              comments = `
                        <div class="col-12 taskComment" style="padding: 16px 32px;" id="taskComment_${comment.ID}">
                        <div class="row commentRow">
                            <div class="col-1">
                            <div class="commentUser">${commentUser}</div>
                            </div>
                            <div class="col-11" style="padding-top:4px; padding-left: 24px;">
                            <div class="row">
                                <div>
                                <span class="commenterName">${comment.EnteredBy}</span>
                                <span class="commentDateTime">${comment_date}</span>
                                </div>
                            </div>
                            <div class="row">
                                <span class="commentText">${comment.CommentsDescription}</span>
                            </div>
                            </div>
                        </div>
                        </div>
                        `;
            } else {
              selected_record.comments.forEach((item) => {
                let comment = item.fields;
                let comment_date = comment.CommentsDate ? moment(comment.CommentsDate).format("MMM D h:mm A") : "";
                let commentUserArry = comment.EnteredBy.toUpperCase().split(" ");
                let commentUser = commentUserArry.length > 1 ? commentUserArry[0].charAt(0) + commentUserArry[1].charAt(0) : commentUserArry[0].charAt(0);
                comments += `
                        <div class="col-12 taskComment" style="padding: 16px 32px;" id="taskComment_${comment.ID}">
                            <div class="row commentRow">
                            <div class="col-1">
                                <div class="commentUser">${commentUser}</div>
                            </div>
                            <div class="col-11" style="padding-top:4px; padding-left: 24px;">
                                <div class="row">
                                <div>
                                    <span class="commenterName">${comment.EnteredBy}</span>
                                    <span class="commentDateTime">${comment_date}</span>
                                </div>
                                </div>
                                <div class="row">
                                <span class="commentText">${comment.CommentsDescription}</span>
                                </div>
                            </div>
                            </div>
                        </div>
                        `;
              });
            }
          }
          $(".task-comment-row").html(comments);

          let activities = "";
          if (selected_record.activity) {
            if (selected_record.activity.fields != undefined) {
              let activity = selected_record.activity.fields;
              let day = "";
              if (moment().format("YYYY-MM-DD") == moment(activity.ActivityDateStartd).format("YYYY-MM-DD")) {
                day = " ‧ Today";
              } else if (moment().add(-1, "day").format("YYYY-MM-DD") == moment(activity.ActivityDateStartd).format("YYYY-MM-DD")) {
                day = " . Yesterday";
              }
              let activityDate = moment(activity.ActivityDateStartd).format("MMM D") + day + " . " + moment(activity.ActivityDateStartd).format("ddd");

              let commentUserArry = activity.EnteredBy.toUpperCase().split(" ");
              let commentUser = commentUserArry.length > 1 ? commentUserArry[0].charAt(0) + commentUserArry[1].charAt(0) : commentUserArry[0].charAt(0);

              activities = `
                        <div class="row" style="padding: 16px;">
                        <div class="col-12">
                            <span class="activityDate">${activityDate}</span>
                        </div>
                        <hr style="width: 100%; margin: 8px 16px;" />
                        <div class="col-1">
                            <div class="commentUser">${commentUser}</div>
                        </div>
                        <div class="col-11" style="padding-top: 4px; padding-left: 24px;">
                            <div class="row">
                            <span class="activityName">${activity.EnteredBy
                } </span> <span class="activityAction">${activity.ActivityName
                } </span>
                            </div>
                            <div class="row">
                            <span class="activityComment">${activity.ActivityDescription
                }</span>
                            </div>
                            <div class="row">
                            <span class="activityTime">${moment(
                  activity.ActivityDateStartd
                ).format("h:mm A")}</span>
                            </div>
                        </div>
                        <hr style="width: 100%; margin: 16px;" />
                        </div>
                        `;
            } else {
              selected_record.activity.forEach((item) => {
                let activity = item.fields;
                let day = "";
                if (moment().format("YYYY-MM-DD") == moment(activity.ActivityDateStartd).format("YYYY-MM-DD")) {
                  day = " ‧ Today";
                } else if (moment().add(-1, "day").format("YYYY-MM-DD") == moment(activity.ActivityDateStartd).format("YYYY-MM-DD")) {
                  day = " . Yesterday";
                }
                let activityDate = moment(activity.ActivityDateStartd).format("MMM D") + day + " . " + moment(activity.ActivityDateStartd).format("ddd");

                let commentUserArry = activity.EnteredBy.toUpperCase().split(" ");
                let commentUser = commentUserArry.length > 1 ? commentUserArry[0].charAt(0) + commentUserArry[1].charAt(0) : commentUserArry[0].charAt(0);

                activities = `
                        <div class="row" style="padding: 16px;">
                            <div class="col-12">
                            <span class="activityDate">${activityDate}</span>
                            </div>
                            <hr style="width: 100%; margin: 8px 16px;" />
                            <div class="col-1">
                            <div class="commentUser">${commentUser}</div>
                            </div>
                            <div class="col-11" style="padding-top: 4px; padding-left: 24px;">
                            <div class="row">
                                <span class="activityName">${activity.EnteredBy
                  } </span> <span class="activityAction">${activity.ActivityName
                  } </span>
                            </div>
                            <div class="row">
                                <span class="activityComment">${activity.ActivityDescription
                  }</span>
                            </div>
                            <div class="row">
                                <span class="activityTime">${moment(
                    activity.ActivityDateStartd
                  ).format("h:mm A")}</span>
                            </div>
                            </div>
                            <hr style="width: 100%; margin: 16px;" />
                        </div>
                        `;
              });
            }
          }
          $(".task-activity-row").html(activities);

          if (type == "comment") {
            $("#nav-comments-tab").click();
          } else {
            $("#nav-subtasks-tab").click();
          }

          $("#chkPriority0").prop("checked", false);
          $("#chkPriority1").prop("checked", false);
          $("#chkPriority2").prop("checked", false);
          $("#chkPriority3").prop("checked", false);
          $("#chkPriority" + selected_record.priority).prop("checked", true);

          $(".taskModalActionFlagDropdown").removeClass(
            "task_modal_priority_3"
          );
          $(".taskModalActionFlagDropdown").removeClass(
            "task_modal_priority_2"
          );
          $(".taskModalActionFlagDropdown").removeClass(
            "task_modal_priority_1"
          );
          $(".taskModalActionFlagDropdown").removeClass(
            "task_modal_priority_0"
          );
          $(".taskModalActionFlagDropdown").addClass(
            "task_modal_priority_" + selected_record.priority
          );

          $("#taskDetailModal").modal("toggle");

          $(".crmDatepicker").datepicker({
            showOn: "button",
            buttonText: "Show Date",
            buttonImageOnly: true,
            buttonImage: "/img/imgCal2.png",
            constrainInput: false,
            dateFormat: "dd/mm/yy",
            showOtherMonths: true,
            selectOtherMonths: true,
            changeMonth: true,
            changeYear: true,
            yearRange: "-90:+10",
            onSelect: function (dateText, inst) {
              let task_id = inst.id;
              $(".crmDatepicker").val(dateText);

              templateObject.updateTaskSchedule(task_id, new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay));
            },
            onChangeMonthYear: function (year, month, inst) {
              // Set date to picker
              $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
            }
          });
          let currentDate = selected_record.due_date ? new Date(selected_record.due_date) : new Date();
          let begunDate = moment(currentDate).format("DD/MM/YYYY");
          $(".crmDatepicker").val(begunDate);

        }
        // else {
        //     swal("Cannot edit this task", "", "warning");
        //     return;
        // }
      }
    }
  }).catch(function (err) {
    // crmService.getAllTasksByContactName().then(async function(data) {
    //     if (data.tprojecttasks.length > 0) {
    //         addVS1Data("TCRMTaskList", JSON.stringify(data));
    //         templateObject.taskrecords.set(data.tprojecttasks);
    //     }
    // }).catch(function(err) {
    // })
  });
}
