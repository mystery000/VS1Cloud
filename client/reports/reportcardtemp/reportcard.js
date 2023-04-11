import {ReactiveVar} from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import "./reportcard.html"
import { TaxRateService } from '../../settings/settings-service';
import { SideBarService } from '../../js/sidebar-service';
import { ReportService } from '../report-service';
import { UtilityService } from '../../utility-service';
import FxGlobalFunctions from '../../packages/currency/FxGlobalFunctions';
import Datehandler from '../../DateHandler';
import GlobalFunctions from '../../GlobalFunctions';
import LoadingOverlay from '../../LoadingOverlay';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { cloneDeep } from 'lodash';


let sideBarService = new SideBarService();
let reportService = new ReportService();
let utilityService = new UtilityService();
let taxRateService = new TaxRateService();

let defaultCurrencyCode = CountryAbbr;

Template.reportcard.onCreated(function(){
    let templateObject = Template.instance();
    templateObject.reportrecords = new ReactiveVar();
    templateObject.transactiondatatablerecords = new ReactiveVar([]);
    templateObject.grandrecords = new ReactiveVar();
    templateObject.dateAsAt = new ReactiveVar();
    templateObject.deptrecords = new ReactiveVar();
    templateObject.reset_data = new ReactiveVar([]);
    templateObject.reportdata = new ReactiveVar([]);
    templateObject.apiParams = new ReactiveVar([]);
    templateObject.currencyList = new ReactiveVar([]);
  
    FxGlobalFunctions.initVars(templateObject);
    templateObject.reportOptions = new ReactiveVar();
    templateObject.init_reset_data = function () {
      let reset_data = templateObject.data.displaysettings;
      templateObject.reset_data.set(reset_data);
    }
    templateObject.init_reset_data();

    if(templateObject.data.listParam) {
      let params = templateObject.data.listParam;
      templateObject.apiParams.set(params);
    }

})

Template.reportcard.onRendered(async function() {
  let templateObject = Template.instance();
    LoadingOverlay.show();
  
  
  
    // await reportService.getBalanceSheetReport(dateAOsf) :
  
    // --------------------------------------------------------------------------------------------------
    templateObject.initDate = () => {
      Datehandler.initOneMonth();
    };
    templateObject.setDateAs = (dateFrom = null) => {
      templateObject.dateAsAt.set((dateFrom) ? moment(new Date(dateFrom)).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY"))
    };
    templateObject.initDate();
  
    templateObject.getReportData = async function (dateFrom, dateTo, ignoreDate, contactID=null) {
      templateObject.setDateAs(dateFrom);
      let indexdbname = templateObject.data.indexDBName
      getVS1Data(indexdbname).then(function (dataObject) {
        if (dataObject.length == 0) {

          let params = cloneDeep(templateObject.apiParams.get());
              for (let i = 0; i < params.length; i++) {
                  if (params[i] == 'ignoreDate') {
                      params[i] = ignoreDate;
                  } else if (params[i] == 'dateFrom') {
                      params[i] = dateFrom
                  } else if (params[i] == 'dateTo') {
                      params[i] = dateTo
                  } else if (params[i] == 'limitFrom') {
                      params[i] = 0
                  } else if (params[i] == 'limitCount') {
                      params[i] = initialReportLoad
                  } else if (params[i] == 'deleteFilter') {
                      params[i] = false
                  }
              }
          let that = templateObject.data.service;
          templateObject.data.apiName.apply(that, params).then(async function(data) {
            await addVS1Data(indexdbname, JSON.stringify(data));
            templateObject.displayReportData(data)
          }).catch(function(err) {

          })
        
        } else {
          let data = JSON.parse(dataObject[0].data);
          templateObject.displayReportData(data);
        }
      }).catch(function (err) {
        let params = cloneDeep(templateObject.apiParams.get());
              for (let i = 0; i < params.length; i++) {
                  if (params[i] == 'ignoreDate') {
                      params[i] = ignoreDate;
                  } else if (params[i] == 'dateFrom') {
                      params[i] = dateFrom
                  } else if (params[i] == 'dateTo') {
                      params[i] = dateTo
                  } else if (params[i] == 'limitFrom') {
                      params[i] = 0
                  } else if (params[i] == 'limitCount') {
                      params[i] = initialReportLoad
                  } else if (params[i] == 'deleteFilter') {
                      params[i] = false
                  }
              }
          let that = templateObject.data.service;
          templateObject.data.apiName.apply(that, params).then(async function(data) {
            await addVS1Data(indexdbname, JSON.stringify(data));
            templateObject.displayReportData(data)
          }).catch(function(err) {})
      });
    }

    templateObject.getFilteredReportData = async function (dateFrom, dateTo, ignoreDate) {
      $('#tableExport').DataTable().destroy();
      $('#tablePrint').DataTable().destroy();
      setTimeout(function(){
        let params = cloneDeep(templateObject.apiParams.get());
            for (let i = 0; i < params.length; i++) {
                if (params[i] == 'ignoreDate') {
                    params[i] = ignoreDate;
                } else if (params[i] == 'dateFrom') {
                    params[i] = dateFrom
                } else if (params[i] == 'dateTo') {
                    params[i] = dateTo
                } else if (params[i] == 'limitFrom') {
                    params[i] = 0
                } else if (params[i] == 'limitCount') {
                    params[i] = initialReportLoad
                } else if (params[i] == 'deleteFilter') {
                    params[i] = false
                }
            }
        let that = templateObject.data.service;
        templateObject.data.apiName.apply(that, params).then(async function(data) {
          templateObject.displayReportData(data)
        }).catch(function(err) {})
      }, 1000)
    }
    let url = FlowRouter.current().path;
    if (url.indexOf("?dateFrom") > 0) {
      url = new URL(window.location.href);
      var getDateFrom = url.searchParams.get("dateFrom");
      var getLoadDate = url.searchParams.get("dateTo");
      if( typeof getDateFrom === undefined || getDateFrom == "" || getDateFrom === null){
        let currentUrl = FlowRouter.current().queryParams;
        getDateFrom = currentUrl.dateFrom
        getLoadDate = currentUrl.dateTo
      }
      $("#dateFrom").datepicker('setDate', moment(getDateFrom).format('DD/MM/YYYY'));
      $("#dateTo").datepicker('setDate', moment(getLoadDate).format('DD/MM/YYYY'));
    }
  
    templateObject.getReportData(
      GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
      GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
      false
    );
    templateObject.displayReportData = async function (data) {
    
      let lowercasename = templateObject.data.lowercasename || templateObject.data.indexDBName.toLowerCase();
      if(data[lowercasename] && data[lowercasename].length > 0) {
        function groupBy(xs, prop) {
          var grouped = {};
          for (var i=0; i<xs.length; i++) {
            var p = xs[i][prop];
            if (!grouped[p]) { grouped[p] = []; }
            grouped[p].push(xs[i]);
          }
          return grouped;
        }
        let groupedData = groupBy(data[lowercasename], templateObject.data.mainfieldname);
        let keys = Object.keys(groupedData)
        let sumFieldsIndex=[];
        let datatableArr = [];
        let displaysettings = templateObject.reset_data.get();
        displaysettings.forEach((item, index) => {
          if(item.calc == true) {
            sumFieldsIndex.push(index)
          }
        });
        for(let i = 0; i< keys.length; i ++) {
          let subArr = [];
          if(groupedData[keys[i]].length > 0) {
            for(let j = 0; j<groupedData[keys[i]].length; j++) {
              let line = templateObject.data.datahandler(groupedData[keys[i]][j]);
              line[0] = ''
              subArr.push(line)
            }
            let calcedValues = [];
            for(let x = 0; x < sumFieldsIndex.length; x++) {
              calcedValues.push(0)
            }
            for(let k = 0 ; k< sumFieldsIndex.length; k++) {
              let index = sumFieldsIndex[k] - 1;
              if(index != undefined) {
                for(n = 0; n< subArr.length; n++) {
                  calcedValues[k] = calcedValues[k] + subArr[n][index];
                }
              }
            }
            let newLine = templateObject.data.datahandler('');
            newLine[0] = ' Total ' + keys[i] ;
            for(let o = 0; o<sumFieldsIndex.length; o++) {
              newLine[sumFieldsIndex[o]-1] = calcedValues[o]
            }
            subArr.push(newLine)

            subArr.forEach((item, index)=> {
              for(let p=0; p<sumFieldsIndex.length; p++) {
                item[sumFieldsIndex[p] - 1] = GlobalFunctions.showCurrency(item[sumFieldsIndex[p]-1])
              }
            })
          }
          let obj = {
            type: keys[i],
            subArr: subArr
          }
          datatableArr.push(obj)
         
        }
        let totalLine = templateObject.data.datahandler('');
        let totalValues = [];
            for(let x = 0; x < sumFieldsIndex.length; x++) {
              totalValues.push(0)
            }
            for(let k = 0 ; k< sumFieldsIndex.length; k++) {
              let index = sumFieldsIndex[k] - 1;
              if(index != undefined) {
                for(n = 0; n< datatableArr.length; n++) {
                  let subArray = datatableArr[n].subArr;
                  totalValues[k] = totalValues[k] + removeCurrencySymbol(subArray[subArray.length-1][index]);
                }
              }
            }
            function removeCurrencySymbol (data) {
              let retVal = Number(data.replace(/[^0-9.-]+/g,""));
              return retVal
            }
            for(let o = 0; o<sumFieldsIndex.length; o++) {
            
              totalLine[sumFieldsIndex[o]] = GlobalFunctions.showCurrency(totalValues[o])
            }
            totalLine[0]='Grand Total';
            datatableArr.push({type:'', subArr: [totalLine]})

        // }        
        templateObject.reportdata.set(datatableArr);
      } else {
        templateObject.reportdata.set('')
      }
      getColumnDef = function () {
        if(templateObject.reset_data.get()) {
          let dispSettings = templateObject.reset_data.get();
          let colDefs = [];

          let items = [];
          for (let i = 0; i < dispSettings.length; i++) {
            if(dispSettings[i].display == true) {
              items.push(dispSettings[i])
            }
          }
          for(let j = 0; j< items.length ;  j ++) {
            let item = {
                targets:j,
                className: !items[j].active?items[j].class + " hiddenColumn": items[j].class,
                title:items[j].label,
                width:items[j].width+"px"
            };
            colDefs.push(item)
          }

          return colDefs
        }
      }

      setTimeout(function () {
        $('#tableExport').DataTable({
          searching: false,
          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
          columnDefs: getColumnDef(),
          order: [[0, 'asc']], // default order by first column (type)
          
          buttons: [{
            extend: 'print',
            download: 'open',
            className: "btntabletopdf hiddenColumn",
            text: '',
            title: templateObject.data.exportfilename,
            filename: templateObject.data.exportfilename,
            exportOptions: {
                columns: ':visible',
                stripHtml: false
            },
        }],
          select: true,
          destroy: true,
          colReorder: true,
          pageLength: initialDatatableLoad,
          lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
          info: true,
          responsive: true,
          // "order": [],
          "bsort": true,
          action: function () {
            $('#tableExport').DataTable().ajax.reload();
          },
          "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
                // if(aData[0] == GlobalFunctions.generateSpan(`Grand Total`, 'table-cells text-bold'))
                //     $(nRow).addClass("grandtotal");
                // else if(nRow != 0 && aData[6] == "")
                //     $(nRow).addClass("totalhr");
                if(nRow !=0 && aData[3] == '' && aData[2] == "") {
                  $(nRow).addClass("totalline")
                  if(aData[aData.length -1] == '' && aData[aData.length-2]=='') {
                    $(nRow).addClass('titleLine');
                  } else {
                    $(nRow).addClass("listhr");
                  }
                }
          },
        }).on('column-reorder', function () {
  
        }).on('length.dt', function (e, settings, len) {
  
          $(".fullScreenSpin").css("display", "inline-block");
          let dataLenght = settings._iDisplayLength;
          if (dataLenght == -1) {
            if (settings.fnRecordsDisplay() > initialDatatableLoad) {
              $(".fullScreenSpin").css("display", "none");
            } else {
              $(".fullScreenSpin").css("display", "none");
            }
          } else {
            $(".fullScreenSpin").css("display", "none");
          }
        });

        $('#tablePrint').DataTable({
          searching: false,
          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
          columnDefs: getColumnDef(),
          order: [[0, 'asc']], // default order by first column (type)
          select: true,
          destroy: true,
          colReorder: true,
          lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
          info: true,
          responsive: true,
          // "order": [],
          "bsort": true,
          action: function () {
            $('#tablePrint').DataTable().ajax.reload();
          },
          "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
                if(nRow !=0 && aData[3] == '' && aData[2] == "") {
                  $(nRow).addClass("totalline")
                  if(aData[aData.length -1] == '' && aData[aData.length-2]=='') {
                    $(nRow).addClass('titleLine');
                  } else {
                    $(nRow).addClass("listhr");
                  }
                }
          },
        }).on('column-reorder', function () {
  
        }).on('length.dt', function (e, settings, len) {
  
          $(".fullScreenSpin").css("display", "inline-block");
          let dataLenght = settings._iDisplayLength;
          if (dataLenght == -1) {
            if (settings.fnRecordsDisplay() > initialDatatableLoad) {
              $(".fullScreenSpin").css("display", "none");
            } else {
              $(".fullScreenSpin").css("display", "none");
            }
          } else {
            $(".fullScreenSpin").css("display", "none");
          }
        });
        $(".fullScreenSpin").css("display", "none");
      }, 0);
  
      $('div.dataTables_filter input').addClass('form-control form-control-sm');
    }

    templateObject.getCurrencyList = function() {
      return new Promise((resolve, reject)=>{
        getVS1Data('TCurrencyList').then(function(dataObject){
          if(dataObject.length == 0) {
            taxRateService.getCurrencies().then(function(data){
              resolve(data.tcurrencylist)
            }).catch(function(e){resolve([])})
          } else {
            let data = JSON.parse(dataObject[0].data);
            let useData = data.tcurrencylist;
            resolve(useData)
          }
        }).catch(function(error){
          taxRateService.getCurrencies().then(function(data){
            resolve(data.tcurrencylist)
          }).catch(function(e){resolve([])})
        })
      })
    }

    let currencies = await templateObject.getCurrencyList();
    let currencyList = []
    for (let i = 0; i <currencies.length; i++) {
      // let taxRate = (data.tcurrency[i].fields.Rate * 100).toFixed(2) + '%';
      var dataList = {
        active: currencies[i].Active,
        id:currencies[i].CurrencyID || "",
        code:currencies[i].Code || "-",
        currency:currencies[i].Currency || "-",
        symbol:currencies[i].CurrencySymbol || "-",
        buyrate:currencies[i].BuyRate || "-",
        sellrate:currencies[i].SellRate || "-",
        country:currencies[i].Country || "-",
        description:currencies[i].CurrencyDesc || "-",
        ratelastmodified:currencies[i].RateLastModified || "-"
      };

      currencyList.push(dataList);
    }

    templateObject.currencyList.set(currencyList)
  
    $(document).on('change', '#dateTo, #dateFrom', function () {
      templateObject.getFilteredReportData(
        GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
        GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
        false
      )
    })
    LoadingOverlay.hide();
})

Template.reportcard.helpers({
  reportdata: ()=> {
    return Template.instance().reportdata.get();
  },
  reset_data: ()=> {
    return Template.instance().reset_data.get()
  },
  dateAsAt: () => {
    return Template.instance().dateAsAt.get();
  },

  currencyList: ()=>{
    return Template.instance().currencyList.get()
  },

  filterfunction: function() {
    return function(param1, param2, param3) {
      return Template.instance().getFilteredReportData(param1, param2, param3)
    }
  }
})

Template.reportcard.events({
  'click .chkDatatable': function (event) {
    let columnDataValue = $(event.target).closest("div").find(".divcolumn").attr('valueupdate');
    if ($(event.target).is(':checked')) {
      $('.' + columnDataValue).addClass('showColumn');
      $('.' + columnDataValue).removeClass('hiddenColumn');
    } else {
      $('.' + columnDataValue).addClass('hiddenColumn');
      $('.' + columnDataValue).removeClass('showColumn');
    }
  },

  'click .btnOpenReportSettings': () => {
    let templateObject = Template.instance();
    // let currenttranstablename = templateObject.data.tablename||";
    $(`thead tr th`).each(function (index) {
      var $tblrow = $(this);
      var colWidth = $tblrow.width() || 0;
      var colthClass = $tblrow.attr('data-class') || "";
      $('.rngRange' + colthClass).val(colWidth);
    });
    $('.' + templateObject.data.tablename + '_Modal').modal('toggle');
  },

  'change .custom-range': async function (event) {
    //   const tableHandler = new TableHandler();
    let range = $(event.target).val() || 0;
    let colClassName = $(event.target).attr("valueclass");
    await $('.' + colClassName).css('width', range);
    //   await $('.colAccountTree').css('width', range);
    $('.dataTable').resizable();
  },

  'click .btnRefresh': function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    Meteor._reload.reload();
  },

  'click td a': function (event) {
      let redirectid = $(event.target).closest('tr').attr('id');

      let transactiontype = $(event.target).closest('tr').attr('class'); ;

      if (redirectid && transactiontype) {
          if (transactiontype === 'Bill') {
              window.open('/billcard?id=' + redirectid, '_self');
          } else if (transactiontype === 'PO') {
              window.open('/purchaseordercard?id=' + redirectid, '_self');
          } else if (transactiontype === 'Credit') {
              window.open('/creditcard?id=' + redirectid, '_self');
          } else if (transactiontype === 'Supplier Payment') {
              window.open('/supplierpaymentcard?id=' + redirectid, '_self');
          }
      }
      // window.open('/balancetransactionlist?accountName=' + accountName+ '&toDate=' + toDate + '&fromDate=' + fromDate + '&isTabItem='+false,'_self');
  },

  'click .btnPrintReport': async function (event) {
    let templateObject = Template.instance();
    let docTitle = templateObject.data.printDocTitle;
    let targetElement = document.getElementById('tablePrint');
    var opt = {
        margin: 0,
        filename: docTitle,
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 2
        },
        jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait'
        }
    };
    let source = targetElement;
    async function getAttachments () {
      return new Promise(async(resolve, reject)=> {
        html2pdf().set(opt).from(source).toPdf().output('datauristring').then(function(dataObject){
          let pdfObject = "";
          let base64data = dataObject.split(',')[1];
          pdfObject = {
            filename: docTitle,
            content: base64data,
            encoding: 'base64'
          }
          let attachments = [];
          attachments.push(pdfObject);
          resolve(attachments)
        })
      })
    }
    async function checkBasedOnType() {
      return new Promise(async(resolve, reject)=>{
        let values = [];
        let typeIndex = templateObject.data.typeIndex;
        let basedOnTypeStorages = Object.keys(localStorage);
        basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
            let employeeId = storage.split('_')[2];
            return storage.includes('BasedOnType_');
            // return storage.includes('BasedOnType_') && employeeId == localStorage.getItem('mySessionEmployeeLoggedID')
        });
        let i = basedOnTypeStorages.length;
        if (i > 0) {
            while (i--) {
                values.push(localStorage.getItem(basedOnTypeStorages[i]));
            }
        }
        for (let j =0; j<values.length; j++) {
          let value = values[j]
          let reportData = JSON.parse(value);
          reportData.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://' + $(location).attr('hostname');
          if (reportData.BasedOnType.includes("P")) {
              if (reportData.FormID == 1) {
                  let formIds = reportData.FormIDs.split(',');
                  if (formIds.includes(typeIndex.toString())) {
                      reportData.FormID = typeIndex;
                      reportData.attachments = await getAttachments()
                      Meteor.call('sendNormalEmail', reportData);
                      resolve();
                  }
              } else {
                  if (reportData.FormID == typeIndex) {
                    reportData.attachments = await getAttachments();
                    Meteor.call('sendNormalEmail', reportData);
                    resolve();
                  }
              }
          }
          if(j == values.length -1) {resolve()}
        }

      })
    }
    await checkBasedOnType()
  },

  'click .btnExportReport': function () {
    $('.fullScreenSpin').css('display', 'inline-block');

    let templateObject = Template.instance();

    const filename = loggedCompany + ' - '+templateObject.data.tabledisplayname+'' + '.csv';
    utilityService.exportReportToCsvTable('tableExport', filename, 'csv');
  },
  'keyup #myInputSearch': function (event) {
    $('.table tbody tr').show();
    let searchItem = $(event.target).val();
    if (searchItem != '') {
        var value = searchItem.toLowerCase();
        $('.table tbody tr').each(function () {
            var found = 'false';
            $(this).each(function () {
                if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                    found = 'true';
                }
            });
            if (found == 'true') {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    } else {
        $('.table tbody tr').show();
    }
  },
  'blur #myInputSearch': function (event) {
      $('.table tbody tr').show();
      let searchItem = $(event.target).val();
      if (searchItem != '') {
          var value = searchItem.toLowerCase();
          $('.table tbody tr').each(function () {
              var found = 'false';
              $(this).each(function () {
                  if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                      found = 'true';
                  }
              });
              if (found == 'true') {
                  $(this).show();
              } else {
                  $(this).hide();
              }
          });
      } else {
          $('.table tbody tr').show();
      }
  },
  "click #ignoreDate": async function () {
    let templateObject = Template.instance();
    LoadingOverlay.show();

    localStorage.setItem(templateObject.data.localStorageKeyName, "");
    $("#dateFrom").attr("readonly", true);
    $("#dateTo").attr("readonly", true);
    templateObject.getFilteredReportData(null, null, true);
  },

  "click .currency-modal-save": (e) => {
    //$(e.currentTarget).parentsUntil(".modal").modal("hide");
    LoadingOverlay.show();

    let templateObject = Template.instance();

    // Get all currency list
    let _currencyList = templateObject.currencyList.get();

    // Get all selected currencies
    const currencySelected = $(".currency-selector-js:checked");
    let _currencySelectedList = [];
    if (currencySelected.length > 0) {
    $.each(currencySelected, (index, e) => {
        const sellRate = $(e).attr("sell-rate");
        const buyRate = $(e).attr("buy-rate");
        const currencyCode = $(e).attr("currency");
        const currencyId = $(e).attr("currency-id");
        console
        let _currency = _currencyList.find((c) => c.id == currencyId);
        _currency.active = true;
        _currencySelectedList.push(_currency);
    });
    } else {
    let _currency = _currencyList.find((c) => c.code == defaultCurrencyCode);
    _currency.active = true;
    _currencySelectedList.push(_currency);
    }

    _currencyList.forEach((value, index) => {
    if (_currencySelectedList.some((c) => c.id == _currencyList[index].id)) {
        _currencyList[index].active = _currencySelectedList.find(
        (c) => c.id == _currencyList[index].id
        ).active;
    } else {
        _currencyList[index].active = false;
    }
    });

    _currencyList = _currencyList.sort((a, b) => {
    if (a.code == defaultCurrencyCode) {
        return -1;
    }
    return 1;
    });

    // templateObject.activeCurrencyList.set(_activeCurrencyList);
    templateObject.currencyList.set(_currencyList);

    LoadingOverlay.hide();
  },
  // ...Datehandler.getDateRangeEvents(),

  ...FxGlobalFunctions.getEvents(),
})

Template.registerHelper('lookup', function (obj, key) {
  return obj[key-1];
});

Template.registerHelper('concat', function(param1, param2) {
  return parseFloat(param1.toString() + '.'+ param2.toString())
})
