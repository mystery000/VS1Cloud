
import './productTable.html';
import '../inventorypopups/onBackOrderPopUp.html';
import '../inventorypopups/onOrderPopUp.html';
import '../inventorypopups/onSalesOrderPopUp.html';
import { Template } from 'meteor/templating';
import '../inventorypopups/RecentTransactionPopUp.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {ProductService} from "../../product/product-service";
import { ReactiveVar } from 'meteor/reactive-var';
import {UtilityService} from "../../utility-service";
import 'jquery-editable-select';
import XLSX from 'xlsx';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import { template } from 'lodash';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();



//   $("#tblInventoryOverview tbody").on("click", "td.colInStock", function() {
//     var listData = $(this).closest("tr").find(".colProductID").text();
//     if (listData) {
//         FlowRouter.go("/stockmovementreport?id=" + listData);
//         // Filter the stock movement report based on product ID
//     }
// });

// $("#tblInventoryOverview tbody").on("click", "td.OnBO", function() {
//     var listData = $(this).closest("tr").find(".colProductID").text();
//     var listProductName = $(this).closest("tr").find(".colProductName").text();
//     if (listData) {
//         $('#onBackOrderPopUp').modal("show");
//         $(".productNameOnBo").text(listProductName);
//     }
// });

// $("#tblInventoryOverview tbody").on("click", "td.colOnSO", function() {
//     var listData = $(this).closest("tr").find(".colProductID").text();
//     var listProductName = $(this).closest("tr").find(".colProductName").text();
//     if (listData) {
//         $('#onSalesOrderPopUp').modal("show");
//         $(".productNameOnSO").text(listProductName);
//     }
// });

// $("#tblInventoryOverview tbody").on("click", "td.colOnOrder", function() {
//     var listData = $(this).closest("tr").find(".colProductID").text();
//     var listProductName = $(this).closest("tr").find(".colProductName").text();
//     if (listData) {
//         $('#onOrderPopUp').modal("show");
//         $(".productNameOnOrder").text(listProductName);
//     }
// });

// $("#tblInventoryOverview tbody").on("click", "td.colQuantity", function() {
//     var listData = $(this).closest("tr").find(".colProductID").text();
//     if (listData) {
//         FlowRouter.go("/productview?id=" + listData + "&instock=true");
//     }
// });

// $("#tblInventoryOverview tbody").on("click", "td.colSerialNo .btnNoBatchorSerial", function() {
//     var listData = $(this).closest("tr").find(".colProductID").text();
//     var selectedProductName = $(this).closest("tr").find(".colProductName").text();
//     if (listData) {
//        swal('', 'The product ' + selectedProductName + ' does not currently track Serial Numbers, Lot Numbers or Bin Locations, <br>Do You Wish To Add that Ability.', 'info');
//     }
// });

// $("#tblInventoryOverview tbody").on("click", "td.colSerialNo .btnBatch", function() {
//     var listData = $(this).closest("tr").find(".colProductID").text();
//     if (listData) {
//         FlowRouter.go("/lotnumberlist?id=" + listData);
//     }
// });

// $("#tblInventoryOverview tbody").on("click", "td.colSerialNo .btnSNTracking", function() {
//     var listData = $(this).closest("tr").find(".colProductID").text();
//     if (listData) {
//         FlowRouter.go("/serialnumberlist?id=" + listData);
//     }
// });

Template.productTable.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.productList = new ReactiveVar();
  templateObject.columns = new ReactiveVar();
  templateObject.productID = new ReactiveVar();
  templateObject.autorun(() => {
    const data = Template.currentData(); // creates a reactive dependency

    if(data.productList){
      this.productList.set(data.productList);
      this.columns.set(data.columns);
    }
  })
});

Template.productTable.onRendered(function() {

  var templateObject = Template.instance();
  splashArrayProductList = JSON.parse(templateObject.productList.get());
  columnData = JSON.parse(templateObject.columns.get());

  function MakeNegative() {
    $('td').each(function () {
        if ($(this).text().indexOf('-' + Currency) >= 0)
            $(this).addClass('text-danger')
    });

    $('td.colAvailable, td.colOnSO, td.colOnBO, td.colInStock, td.colOnOrder').each(function(){
        // if(parseInt($(this).text()) == 0) $(this).addClass('neutralVolume');
        if (parseInt($(this).text()) > 0) $(this).addClass('positiveVolume');
        if (parseInt($(this).text()) < 0) $(this).addClass('negativeVolume');
    });
};


  templateObject.drawDataTable = function(splashArrayProductList , columData)
  {
    $("#tblInventoryOverview").dataTable({

      data: splashArrayProductList,
      sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
      columnDefs: columData,
        select: true,
        destroy: true,
        colReorder: true,
        buttons: [{
                extend: "excelHtml5",
                text: "",
                download: "open",
                className: "btntabletocsv hiddenColumn",
                filename: "inventory_" + moment().format(),
                orientation: "portrait",
                exportOptions: {
                    columns: ":visible",
                },
            },
            {
                extend: "print",
                download: "open",
                className: "btntabletopdf hiddenColumn",
                text: "",
                title: "Inventory List",
                filename: "inventory_" + moment().format(),
                exportOptions: {
                    columns: ":visible",
                },
            },
        ],
        // bStateSave: true,
        // rowId: 0,
        // paging: false,
        // "scrollY": "800px",
        // "scrollCollapse": true,
        pageLength: initialBaseDataLoad,
        lengthMenu: [
            [initialBaseDataLoad, -1],
            [initialBaseDataLoad, "All"],
        ],
        info: true,
        responsive: true,
        order: [
            [1, "asc"] // modified by matthias
        ],
        action: function() {
            $("#tblInventoryOverview").DataTable().ajax.reload();
        },
        fnDrawCallback: function(oSettings) {
            $(".paginate_button.page-item").removeClass("disabled");
            $("#tblInventoryOverview_ellipsis").addClass("disabled");
            if (oSettings._iDisplayLength == -1) {
                if (oSettings.fnRecordsDisplay() > 150) {}
                $(".fullScreenSpin").css("display", "inline-block");
                setTimeout(function() {
                    $(".fullScreenSpin").css("display", "none");
                }, 100);
            } else {}
            if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                $(".paginate_button.page-item.next").addClass("disabled");
            }

            $(".paginate_button.next:not(.disabled)",this.api().table().container()).on("click", function() {
                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = oSettings._iDisplayLength;
                let customerSearch = $("#tblInventoryOverview_filter input").val();
                sideBarService.getProductListVS1(initialDatatableLoad,oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                  getVS1Data("TProductList").then(function (dataObjectold) {
                      if (dataObjectold.length == 0) {
                      } else {
                        let dataOld = JSON.parse(dataObjectold[0].data);

                        var thirdaryData = $.merge($.merge([],dataObjectnew.tproductlist),dataOld.tproductlist);
                        let objCombineData = {
                          Params: dataOld.Params,
                          tproductlist: thirdaryData,
                        };

                        addVS1Data("TProductList",JSON.stringify(objCombineData)).then(function (datareturn) {
                            templateObject.resetData(objCombineData);
                            $(".fullScreenSpin").css("display", "none");
                          }).catch(function (err) {
                            $(".fullScreenSpin").css("display", "none");
                          });
                      }
                  }).catch(function (err) {});

                }).catch(function(err) {
                    $(".fullScreenSpin").css("display", "none");
                });
              });
            setTimeout(function() {
                MakeNegative();
            }, 100);
        },
        language: { search: "",searchPlaceholder: "Search List..." },
        fnInitComplete: function() {
          let urlParametersPage = FlowRouter.current().queryParams.page;
          if (urlParametersPage) {
            this.fnPageChange("last");
          };
            $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
            ).insertAfter("#tblInventoryOverview_filter");
        },
        // "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
        //   let countTableData = data.Params.Count || 0; //get count from API data

        //     return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
        // },
    }).on("length.dt", function(e, settings, len) {
        $(".fullScreenSpin").css("display", "inline-block");
        let dataLenght = settings._iDisplayLength;
        // splashArrayProductList = [];
        if (dataLenght == -1) {
            $(".fullScreenSpin").css("display", "none");
        } else {
            if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                $(".fullScreenSpin").css("display", "none");
            } else {
                $(".fullScreenSpin").css("display", "none");
            }
        }
    });
  }
  templateObject.drawDataTable(splashArrayProductList,columnData);

  // templateObject.productList.set(template.data.productList);
  // templateObject.columns.set(template.data.columns);
  // templateObject.fields.set(template.data.fields);

//   $("#tblInventoryOverview tbody").on("click", "td:not(.colAvailable, .colOnSO, .colOnBO, .colInStock, .colOnOrder, .colQuantity, .colSerialNo)", function() {
//     var listData = $(this).closest("tr").find(".colProductID").text();
//     if (listData) {
//         //FlowRouter.go('/productview?id=' + listData);
//         FlowRouter.go("/productview?id=" + listData);
//     }
// });

// $("#tblInventoryOverview tbody").on("click", "td.colAvailable", function() {
//     var listData = $(this).closest("tr").find(".colProductID").text();
//     var listProductName = $(this).closest("tr").find(".colProductName").text();
//     if (listData) {
//         // FlowRouter.go("/stockmovementreport?id=" + listData);
//         // Filter the stock movement report based on product ID
//         //modified by Matthias
//         // $('#recentTransactionPopUp').modal("show");
//         $(".productNameOnRT").text(listProductName);

//     }
// });


});

Template.productTable.helpers({

  productID: () => {
    return Template.instance().productID.get();
},
  productList: () => {
    return Template.instance().productList.get();
  },
  columns: () => {
    return Template.instance().columns.get();
  },

  });

Template.productTable.events({
  'click .OnBO' : function(event) {
    var listData = $(event.target).closest("tr").find(".colProductID").text();
    var listProductName = $(event.target).closest("tr").find(".ProductName").text();
    if (listData) {
        $('#onBackOrderPopUp').modal("show");
        $(".productNameOnBo").text(listProductName);
    }
  },
  "click .InStock": function(event) {
    var listData = $(event.target).closest("tr").find(".colProductID").text();
    var listProductName = $(event.target).closest("tr").find(".ProductName").text();
    if (listData) {
        // FlowRouter.go("/stockmovementreport?id=" + listData);
        let templateObject = Template.instance();
        $('#recentTransactionPopUp').modal("show");
        templateObject.productID.set(listData);
        $('.productIDOnRT').text(listData);
        $('.productNameOnRT').text(listProductName);
        // Filter the stock movement report based on product ID
    }
  },

  "click .OnSO": function(event) {
      var listData = $(event.target).closest("tr").find(".colProductID").text();
      var listProductName = $(event.target).closest("tr").find(".ProductName").text();
      if (listData) {
          $('#onSalesOrderPopUp').modal("show");
          $(".productNameOnSO").text(listProductName);
      }
  },

  "click .OnOrder": function(event) {
      var listData = $(event.target).closest("tr").find(".colProductID").text();
      var listProductName = $(event.target).closest("tr").find(".ProductName").text();
      if (listData) {
          $('#onOrderPopUp').modal("show");
          $(".productNameOnOrder").text(listProductName);
      }
  },

  "click .ProductName, . SalesDescription, . Available": function(event) {
      var listData = $(event.target).closest("tr").find(".colProductID").text();
      if (listData) {
          FlowRouter.go("/productview?id=" + listData);
      }
  },
  'click .th.colCostPrice': function(event) {
    $('.colCostPrice').addClass('hiddenColumn');
    $('.colCostPrice').removeClass('showColumn');

    $('.colCostPriceInc').addClass('showColumn');
    $('.colCostPriceInc').removeClass('hiddenColumn');

    $('.chkCostPrice').prop("checked", false);
    $('.chkCostPriceInc').prop("checked", true);
},
'click .th.colCostPriceInc': function(event) {
    $('.colCostPriceInc').addClass('hiddenColumn');
    $('.colCostPriceInc').removeClass('showColumn');

    $('.colCostPrice').addClass('showColumn');
    $('.colCostPrice').removeClass('hiddenColumn');

    $('.chkCostPrice').prop("checked", true);
    $('.chkCostPriceInc').prop("checked", false);
},
'click .th.colSalePrice': function(event) {
    $('.colSalePrice').addClass('hiddenColumn');
    $('.colSalePrice').removeClass('showColumn');

    $('.colSalePriceInc').addClass('showColumn');
    $('.colSalePriceInc').removeClass('hiddenColumn');

    $('.chkSalePrice').prop("checked", false);
    $('.chkSalePriceInc').prop("checked", true);
},
'click .th.colSalePriceInc': function(event) {
    $('.colSalePriceInc').addClass('hiddenColumn');
    $('.colSalePriceInc').removeClass('showColumn');

    $('.colSalePrice').addClass('showColumn');
    $('.colSalePrice').removeClass('hiddenColumn');

    $('.chkSalePrice').prop("checked", true);
    $('.chkSalePriceInc').prop("checked", false);

},
"keyup #tblInventoryOverview_filter input": function(event) {
  if ($(event.target).val() != "") {
      $(".btnRefreshProduct").addClass("btnSearchAlert");
  } else {
      $(".btnRefreshProduct").removeClass("btnSearchAlert");
  }
  if (event.keyCode == 13) {
      $(".btnRefreshProduct").trigger("click");
  }
},
"blur #tblInventoryOverview_filter input": function(event) {
  if ($(event.target).val() != "") {
      $(".btnRefreshProduct").addClass("btnSearchAlert");
  } else {
      $(".btnRefreshProduct").removeClass("btnSearchAlert");
  }
},
});
