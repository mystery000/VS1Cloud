import {TaxRateService} from "../settings-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import { CountryService } from "../../js/country-service";
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();

Template.reportsAccountantSettings.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.countryData = new ReactiveVar();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.employeerecords = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.roomrecords = new ReactiveVar([]);

    templateObject.departlist = new ReactiveVar([]);
});

Template.reportsAccountantSettings.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];
    const deptrecords = [];
    let countries = [];
    let deptprodlineItems = [];

    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'accountantList', function(error, result){
        if(error){

        }else{
            if(result){
                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;

                    $("th."+columnClass+"").html(columData);
                    $("th."+columnClass+"").css('width',""+columnWidth+"px");
                }
            }
        }
    });

    var countryService = new CountryService();
    templateObject.getCountryData = function () {
        getVS1Data("TCountries")
          .then(function (dataObject) {
            if (dataObject.length == 0) {
              countryService.getCountry().then((data) => {
                for (let i = 0; i < data.tcountries.length; i++) {
                  countries.push(data.tcountries[i].Country);
                }
                countries = _.sortBy(countries);
                templateObject.countryData.set(countries);
              });
            } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.tcountries;
              for (let i = 0; i < useData.length; i++) {
                countries.push(useData[i].Country);
              }
              countries = _.sortBy(countries);
              templateObject.countryData.set(countries);
            }
          })
          .catch(function (err) {
            countryService.getCountry().then((data) => {
              for (let i = 0; i < data.tcountries.length; i++) {
                countries.push(data.tcountries[i].Country);
              }
              countries = _.sortBy(countries);
              templateObject.countryData.set(countries);
            });
          });
    };
    templateObject.getCountryData();

    function MakeNegative() {
        $('td').each(function(){
            if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    templateObject.getAllEmployees = function () {

      getVS1Data('TEmployee').then(function (dataObject) {
        if(dataObject.length == 0){
          taxRateService.getEmployees().then(function (data) {
              let employeeList = [];
              for (let i = 0; i < data.temployee.length; i++) {

                  let dataObj = {
                      empID: data.temployee[i].Id || ' ',
                      employeename: data.temployee[i].EmployeeName || ' '
                  };
                  if(data.temployee[i].EmployeeName.replace(/\s/g, '') != ''){
                      employeeList.push(dataObj);
                  }
              }
              templateObject.employeerecords.set(employeeList);
          });
        }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.temployee;
        let employeeList = [];
        for (let i = 0; i < useData.length; i++) {

            let dataObj = {
                empID: useData[i].fields.ID || ' ',
                employeename: useData[i].fields.EmployeeName || ' '
            };
            if(useData[i].fields.EmployeeName.replace(/\s/g, '') != ''){
                employeeList.push(dataObj);
            }
        }
        templateObject.employeerecords.set(employeeList);

        }
        }).catch(function (err) {
          taxRateService.getEmployees().then(function (data) {
              let employeeList = [];
              for (let i = 0; i < data.temployee.length; i++) {

                  let dataObj = {
                      empID: data.temployee[i].Id || ' ',
                      employeename: data.temployee[i].EmployeeName || ' '
                  };
                  if(data.temployee[i].EmployeeName.replace(/\s/g, '') != ''){
                      employeeList.push(dataObj);
                  }
              }
              templateObject.employeerecords.set(employeeList);
          });
        });


    };
    templateObject.getAllEmployees();

    templateObject.getRooms = function () {

        taxRateService.getBins().then(function (data) {
            let binList = [];
            for (let i = 0; i < data.tproductbin.length; i++) {

                let dataObj = {
                    roomid: data.tproductbin[i].BinNumber || ' ',
                    roomname: data.tproductbin[i].BinLocation || ' '
                };
                if(data.tproductbin[i].BinLocation.replace(/\s/g, '') != ''){
                    binList.push(dataObj);
                }

            }
            templateObject.roomrecords.set(binList);
        });
    };
    templateObject.getRooms();

    templateObject.getDeptList = function () {
      getVS1Data('TDeptClass').then(function (dataObject) {
        if(dataObject.length == 0){
          taxRateService.getDepartment().then(function (data) {
              let deptList = [];
              for (let i = 0; i < data.tdeptclass.length; i++) {

                  let dataObject = {
                      departid: data.tdeptclass[i].Id || ' ',
                      deptname: data.tdeptclass[i].DeptClassName || ' ',
                  };

                  if(data.tdeptclass[i].DeptClassName.replace(/\s/g, '') != ''){
                      deptList.push(dataObject);
                  }

              }
              templateObject.departlist.set(deptList);
          });
        }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tdeptclass;
        let deptList = [];
        for (let i = 0; i < data.tdeptclass.length; i++) {

            let dataObject = {
                departid: useData[i].Id || ' ',
                deptname: useData[i].DeptClassName || ' ',
            };

            if(data.tdeptclass[i].DeptClassName.replace(/\s/g, '') != ''){
                deptList.push(dataObject);
            }

        }
        templateObject.departlist.set(deptList);

        }
      }).catch(function (err) {
        taxRateService.getDepartment().then(function (data) {
            let deptList = [];
            for (let i = 0; i < data.tdeptclass.length; i++) {

                let dataObject = {
                    departid: data.tdeptclass[i].Id || ' ',
                    deptname: data.tdeptclass[i].DeptClassName || ' ',
                };

                if(data.tdeptclass[i].DeptClassName.replace(/\s/g, '') != ''){
                    deptList.push(dataObject);
                }

            }
            templateObject.departlist.set(deptList);
        });
      });

    };
    templateObject.getDeptList();

    templateObject.getTaxRates = function () {
      getVS1Data('TDeptClass').then(function (dataObject) {
        if(dataObject.length == 0){
          taxRateService.getDepartment().then(function (data) {
              let lineItems = [];
              let lineItemObj = {};
              for(let i=0; i<data.tdeptclass.length; i++){
                  // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                  var dataList = {
                      id: data.tdeptclass[i].Id || '',
                      headDept: data.tdeptclass[i].DeptClassGroup || '-',
                      departmentName: data.tdeptclass[i].DeptClassName || '-',
                      description: data.tdeptclass[i].Description || '-',
                      sitecode:data.tdeptclass[i].SiteCode || '-',
                      status:data.tdeptclass[i].Active || 'false',


                  };

                  dataTableList.push(dataList);
                  //}
              }

              templateObject.datatablerecords.set(dataTableList);

              if(templateObject.datatablerecords.get()){

                  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'accountantList', function(error, result){
                      if(error){

                      }else{
                          if(result){
                              for (let i = 0; i < result.customFields.length; i++) {
                                  let customcolumn = result.customFields;
                                  let columData = customcolumn[i].label;
                                  let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                  let hiddenColumn = customcolumn[i].hidden;
                                  let columnClass = columHeaderUpdate.split('.')[1];
                                  let columnWidth = customcolumn[i].width;
                                  let columnindex = customcolumn[i].index + 1;

                                  if(hiddenColumn == true){

                                      $("."+columnClass+"").addClass('hiddenColumn');
                                      $("."+columnClass+"").removeClass('showColumn');
                                  }else if(hiddenColumn == false){
                                      $("."+columnClass+"").removeClass('hiddenColumn');
                                      $("."+columnClass+"").addClass('showColumn');
                                  }

                              }
                          }

                      }
                  });


                  setTimeout(function () {
                      MakeNegative();
                  }, 100);
              }

              $('.fullScreenSpin').css('display','none');
              setTimeout(function () {
                  $('#accountantList').DataTable({
                      columnDefs: [
                          {type: 'date', targets: 0},
                          { "orderable": false, "targets": -1 }
                      ],
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      buttons: [
                          {
                              extend: 'excelHtml5',
                              text: '',
                              download: 'open',
                              className: "btntabletocsv hiddenColumn",
                              filename: "departmentlist_"+ moment().format(),
                              orientation:'portrait',
                              exportOptions: {
                                  columns: ':visible'
                              }
                          },{
                              extend: 'print',
                              download: 'open',
                              className: "btntabletopdf hiddenColumn",
                              text: '',
                              title: 'Department List',
                              filename: "departmentlist_"+ moment().format(),
                              exportOptions: {
                                  columns: ':visible'
                              }
                          }],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      colReorder: {
                          fixedColumnsRight: 1
                      },
                      // bStateSave: true,
                      // rowId: 0,
                      paging: false,
//                      "scrollY": "400px",
//                      "scrollCollapse": true,
                      info: true,
                      responsive: true,
                      "order": [[ 0, "asc" ]],
                      action: function () {
                          $('#accountantList').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          setTimeout(function () {
                              MakeNegative();
                          }, 100);
                      },

                  }).on('page', function () {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
                      let draftRecord = templateObject.datatablerecords.get();
                      templateObject.datatablerecords.set(draftRecord);
                  }).on('column-reorder', function () {

                  }).on( 'length.dt', function ( e, settings, len ) {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
                  });

                  // $('#accountantList').DataTable().column( 0 ).visible( true );
                  $('.fullScreenSpin').css('display','none');
              }, 0);

              var columns = $('#accountantList th');
              let sTible = "";
              let sWidth = "";
              let sIndex = "";
              let sVisible = "";
              let columVisible = false;
              let sClass = "";
              $.each(columns, function(i,v) {
                  if(v.hidden == false){
                      columVisible =  true;
                  }
                  if((v.className.includes("hiddenColumn"))){
                      columVisible = false;
                  }
                  sWidth = v.style.width.replace('px', "");

                  let datatablerecordObj = {
                      sTitle: v.innerText || '',
                      sWidth: sWidth || '',
                      sIndex: v.cellIndex || '',
                      sVisible: columVisible || false,
                      sClass: v.className || ''
                  };
                  tableHeaderList.push(datatablerecordObj);
              });
              templateObject.tableheaderrecords.set(tableHeaderList);
              $('div.dataTables_filter input').addClass('form-control form-control-sm');

          }).catch(function (err) {
              swal({
                  title: 'Oooops...',
                  text: err,
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
              }).then((result) => {
                  if (result.value) {
                      Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {

                  }
              });
              $('.fullScreenSpin').css('display','none');
              // Meteor._reload.reload();
          });
        }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tdeptclass;
        let lineItems = [];
        let lineItemObj = {};
        for(let i=0; i<useData.length; i++){
            // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
            var dataList = {
                id: useData[i].Id|| '',
                headDept: useData[i].DeptClassGroup || '-',
                departmentName: useData[i].DeptClassName || '-',
                description: useData[i].Description || '-',
                sitecode:useData[i].SiteCode || '-',
                status:useData[i].Active || 'false',


            };

            dataTableList.push(dataList);
            //}
        }

        templateObject.datatablerecords.set(dataTableList);

        if(templateObject.datatablerecords.get()){

            Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'accountantList', function(error, result){
                if(error){

                }else{
                    if(result){
                        for (let i = 0; i < result.customFields.length; i++) {
                            let customcolumn = result.customFields;
                            let columData = customcolumn[i].label;
                            let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                            let hiddenColumn = customcolumn[i].hidden;
                            let columnClass = columHeaderUpdate.split('.')[1];
                            let columnWidth = customcolumn[i].width;
                            let columnindex = customcolumn[i].index + 1;

                            if(hiddenColumn == true){

                                $("."+columnClass+"").addClass('hiddenColumn');
                                $("."+columnClass+"").removeClass('showColumn');
                            }else if(hiddenColumn == false){
                                $("."+columnClass+"").removeClass('hiddenColumn');
                                $("."+columnClass+"").addClass('showColumn');
                            }

                        }
                    }

                }
            });


            setTimeout(function () {
                MakeNegative();
            }, 100);
        }

        $('.fullScreenSpin').css('display','none');
        setTimeout(function () {
            $('#accountantList').DataTable({
                columnDefs: [
                    {type: 'date', targets: 0},
                    { "orderable": false, "targets": -1 }
                ],
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "departmentlist_"+ moment().format(),
                        orientation:'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    },{
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Department List',
                        filename: "departmentlist_"+ moment().format(),
                        exportOptions: {
                            columns: ':visible'
                        }
                    }],
                select: true,
                destroy: true,
                colReorder: true,
                colReorder: {
                    fixedColumnsRight: 1
                },
                // bStateSave: true,
                // rowId: 0,
                paging: false,
//                "scrollY": "400px",
//                "scrollCollapse": true,
                info: true,
                responsive: true,
                "order": [[ 0, "asc" ]],
                action: function () {
                    $('#accountantList').DataTable().ajax.reload();
                },
                "fnDrawCallback": function (oSettings) {
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                },

            }).on('page', function () {
                setTimeout(function () {
                    MakeNegative();
                }, 100);
                let draftRecord = templateObject.datatablerecords.get();
                templateObject.datatablerecords.set(draftRecord);
            }).on('column-reorder', function () {

            }).on( 'length.dt', function ( e, settings, len ) {
                setTimeout(function () {
                    MakeNegative();
                }, 100);
            });

            // $('#accountantList').DataTable().column( 0 ).visible( true );
            $('.fullScreenSpin').css('display','none');
        }, 0);

        var columns = $('#accountantList th');
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i,v) {
            if(v.hidden == false){
                columVisible =  true;
            }
            if((v.className.includes("hiddenColumn"))){
                columVisible = false;
            }
            sWidth = v.style.width.replace('px', "");

            let datatablerecordObj = {
                sTitle: v.innerText || '',
                sWidth: sWidth || '',
                sIndex: v.cellIndex || '',
                sVisible: columVisible || false,
                sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
        $('div.dataTables_filter input').addClass('form-control form-control-sm');
        }
      }).catch(function (err) {
        taxRateService.getDepartment().then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            for(let i=0; i<data.tdeptclass.length; i++){
                // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                var dataList = {
                    id: data.tdeptclass[i].Id || '',
                    headDept: data.tdeptclass[i].DeptClassGroup || '-',
                    departmentName: data.tdeptclass[i].DeptClassName || '-',
                    description: data.tdeptclass[i].Description || '-',
                    sitecode:data.tdeptclass[i].SiteCode || '-',
                    status:data.tdeptclass[i].Active || 'false',


                };

                dataTableList.push(dataList);
                //}
            }

            templateObject.datatablerecords.set(dataTableList);

            if(templateObject.datatablerecords.get()){

                Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'accountantList', function(error, result){
                    if(error){

                    }else{
                        if(result){
                            for (let i = 0; i < result.customFields.length; i++) {
                                let customcolumn = result.customFields;
                                let columData = customcolumn[i].label;
                                let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                let hiddenColumn = customcolumn[i].hidden;
                                let columnClass = columHeaderUpdate.split('.')[1];
                                let columnWidth = customcolumn[i].width;
                                let columnindex = customcolumn[i].index + 1;

                                if(hiddenColumn == true){

                                    $("."+columnClass+"").addClass('hiddenColumn');
                                    $("."+columnClass+"").removeClass('showColumn');
                                }else if(hiddenColumn == false){
                                    $("."+columnClass+"").removeClass('hiddenColumn');
                                    $("."+columnClass+"").addClass('showColumn');
                                }

                            }
                        }

                    }
                });


                setTimeout(function () {
                    MakeNegative();
                }, 100);
            }

            $('.fullScreenSpin').css('display','none');
            setTimeout(function () {
                $('#accountantList').DataTable({
                    columnDefs: [
                        {type: 'date', targets: 0},
                        { "orderable": false, "targets": -1 }
                    ],
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [
                        {
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "departmentlist_"+ moment().format(),
                            orientation:'portrait',
                            exportOptions: {
                                columns: ':visible'
                            }
                        },{
                            extend: 'print',
                            download: 'open',
                            className: "btntabletopdf hiddenColumn",
                            text: '',
                            title: 'Department List',
                            filename: "departmentlist_"+ moment().format(),
                            exportOptions: {
                                columns: ':visible'
                            }
                        }],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    colReorder: {
                        fixedColumnsRight: 1
                    },
                    // bStateSave: true,
                    // rowId: 0,
                    paging: false,
//                    "scrollY": "400px",
//                    "scrollCollapse": true,
                    info: true,
                    responsive: true,
                    "order": [[ 0, "asc" ]],
                    action: function () {
                        $('#accountantList').DataTable().ajax.reload();
                    },
                    "fnDrawCallback": function (oSettings) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    },

                }).on('page', function () {
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                    let draftRecord = templateObject.datatablerecords.get();
                    templateObject.datatablerecords.set(draftRecord);
                }).on('column-reorder', function () {

                }).on( 'length.dt', function ( e, settings, len ) {
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                });

                // $('#accountantList').DataTable().column( 0 ).visible( true );
                $('.fullScreenSpin').css('display','none');
            }, 0);

            var columns = $('#accountantList th');
            let sTible = "";
            let sWidth = "";
            let sIndex = "";
            let sVisible = "";
            let columVisible = false;
            let sClass = "";
            $.each(columns, function(i,v) {
                if(v.hidden == false){
                    columVisible =  true;
                }
                if((v.className.includes("hiddenColumn"))){
                    columVisible = false;
                }
                sWidth = v.style.width.replace('px', "");

                let datatablerecordObj = {
                    sTitle: v.innerText || '',
                    sWidth: sWidth || '',
                    sIndex: v.cellIndex || '',
                    sVisible: columVisible || false,
                    sClass: v.className || ''
                };
                tableHeaderList.push(datatablerecordObj);
            });
            templateObject.tableheaderrecords.set(tableHeaderList);
            $('div.dataTables_filter input').addClass('form-control form-control-sm');

        }).catch(function (err) {
            swal({
                title: 'Oooops...',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {
                    Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {

                }
            });
            $('.fullScreenSpin').css('display','none');
            // Meteor._reload.reload();
        });
      });

    }
    templateObject.getTaxRates();

    templateObject.getDepartments = function(){
      getVS1Data('TDeptClass').then(function (dataObject) {
        if(dataObject.length == 0){
          taxRateService.getDepartment().then(function(data){
              for(let i in data.tdeptclass){

                  let deptrecordObj = {
                      id: data.tdeptclass[i].Id || ' ',
                      department: data.tdeptclass[i].DeptClassName || ' ',
                  };

                  deptrecords.push(deptrecordObj);
                  templateObject.deptrecords.set(deptrecords);

              }
          });
        }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tdeptclass;
        for(let i in useData){

            let deptrecordObj = {
                id: useData[i].Id || ' ',
                department: useData[i].DeptClassName || ' ',
            };

            deptrecords.push(deptrecordObj);
            templateObject.deptrecords.set(deptrecords);

        }

        }
      }).catch(function (err) {
        taxRateService.getDepartment().then(function(data){
            for(let i in data.tdeptclass){

                let deptrecordObj = {
                    id: data.tdeptclass[i].Id || ' ',
                    department: data.tdeptclass[i].DeptClassName || ' ',
                };

                deptrecords.push(deptrecordObj);
                templateObject.deptrecords.set(deptrecords);

            }
        });
      });


    }
    templateObject.getDepartments();

    $(document).on('click', '.table-remove', function() {
        event.stopPropagation();
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteLineModal').modal('toggle');
    });

    $('#accountantList tbody').on( 'click', 'tr .colDeptID, tr .colHeadDept, tr .colDeptName, tr .colStatus, tr .colDescription, tr .colSiteCode', function () {
        var listData = $(this).closest('tr').attr('id');
        if(listData){
            $('#add-accountant-title').text('Edit Accountant');
            if (listData !== '') {
                listData = Number(listData);
                //taxRateService.getOneDepartment(listData).then(function (data) {

                    var deptID = listData || '';
                    //var headerDept = data.fields.DeptClassGroup || '';
                    var deptName = $(event.target).closest("tr").find(".colDeptName").text() || '';
                    var deptDesc = $(event.target).closest("tr").find(".colDescription").text() || '';
                    var siteCode = $(event.target).closest("tr").find(".colSiteCode").text() || '';
                    //data.fields.Rate || '';


                    $('#edtDepartmentID').val(deptID);
                    //$('#sltDepartment').val(headerDept);
                    $('#edtDeptName').val(deptName);
                    $('#edtDeptName').prop('readonly', true);
                    $('#edtDeptDesc').val(deptDesc);
                    $('#edtSiteCode').val(siteCode);

                    // if (data.fields.StSClass != null) {
                    //
                    //     var stsmaincontactno = data.fields.StSClass.fields.PrincipleContactPhone || '';
                    //     var licensenumber = data.fields.StSClass.fields.LicenseNumber || '';
                    //     var principlecontactname = data.fields.StSClass.fields.PrincipleContactName || '';
                    //     var defaultroomname = data.fields.StSClass.fields.DefaultBinLocation || '';
                    //
                    //     $('#stsMainContactNo').val(stsmaincontactno);
                    //     $('#stsLicenseNo').val(licensenumber);
                    //     $('#sltMainContact').val(principlecontactname);
                    //     $('#sltDefaultRoom').val(defaultroomname);
                    // }

                //});

                $(this).closest('tr').attr('data-target', '#myModal');
                $(this).closest('tr').attr('data-toggle', 'modal');

            }

        }

    });
});


Template.reportsAccountantSettings.events({
    'click #btnNewInvoice':function(event){
        // FlowRouter.go('/invoicecard');
    },
    'click .chkDatatable' : function(event){
        var columns = $('#accountantList th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function(i,v) {
            let className = v.classList;
            let replaceClass = className[1];

            if(v.innerText == columnDataValue){
                if($(event.target).is(':checked')){
                    $("."+replaceClass+"").css('display','table-cell');
                    $("."+replaceClass+"").css('padding','.75rem');
                    $("."+replaceClass+"").css('vertical-align','top');
                }else{
                    $("."+replaceClass+"").css('display','none');
                }
            }
        });
    },
    'click .resetTable' : function(event){
        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'accountantList'});
                if (checkPrefDetails) {
                    CloudPreference.remove({_id:checkPrefDetails._id}, function(err, idTag) {
                        if (err) {

                        }else{
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable' : function(event){
        let lineItems = [];
        $('.columnSettings').each(function (index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumn").text()||'';
            var colWidth = $tblrow.find(".custom-range").val()||0;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate")||'';
            var colHidden = false;
            if($tblrow.find(".custom-control-input").is(':checked')){
                colHidden = false;
            }else{
                colHidden = true;
            }
            let lineItemObj = {
                index: index,
                label: colTitle,
                hidden: colHidden,
                width: colWidth,
                thclass: colthClass
            }

            lineItems.push(lineItemObj);
        });

        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'accountantList'});
                if (checkPrefDetails) {
                    CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                                                                               PrefGroup:'salesform',PrefName:'accountantList',published:true,
                                                                               customFields:lineItems,
                                                                               updatedAt: new Date() }}, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');
                        }
                    });

                }else{
                    CloudPreference.insert({ userid: clientID,username:clientUsername,useremail:clientEmail,
                                            PrefGroup:'salesform',PrefName:'accountantList',published:true,
                                            customFields:lineItems,
                                            createdAt: new Date() }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');

                        }
                    });
                }
            }
        }

    },
    'blur .divcolumn' : function(event){
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#accountantList').DataTable();
        var title = datable.column( columnDatanIndex ).header();
        $(title).html(columData);

    },
    'change .rngRange' : function(event){
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#accountantList th');
        $.each(datable, function(i,v) {

            if(v.innerText == columnDataValue){
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("."+replaceClass+"").css('width',range+'px');

            }
        });

    },
    'click .btnOpenSettings' : function(event){
        let templateObject = Template.instance();
        var columns = $('#accountantList th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i,v) {
            if(v.hidden == false){
                columVisible =  true;
            }
            if((v.className.includes("hiddenColumn"))){
                columVisible = false;
            }
            sWidth = v.style.width.replace('px', "");

            let datatablerecordObj = {
                sTitle: v.innerText || '',
                sWidth: sWidth || '',
                sIndex: v.cellIndex || '',
                sVisible: columVisible || false,
                sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
    },
    'click #exportbtn': function () {
        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#departmentList_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');

    },
    'click .btnRefresh': function () {
      $('.fullScreenSpin').css('display','inline-block');
      sideBarService.getDepartment().then(function(dataReload) {
          addVS1Data('TDeptClass',JSON.stringify(dataReload)).then(function (datareturn) {
          location.reload(true);
          }).catch(function (err) {
            location.reload(true);
          });
      }).catch(function(err) {
          location.reload(true);
      });
    },
    'click .btnAddNewAccountant': function () {
        $('#newTaxRate').css('display','block');

    },
    'click .btnCloseAddNewDept': function () {
        $('#newTaxRate').css('display','none');

    },
    'click .btnDeleteDepartment': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let deptId = $('#selectDeleteLineID').val();


        let objDetails = {
            type: "TDeptClass",
            fields: {
                Id: parseInt(deptId),
                Active: false
            }
        };

        taxRateService.saveDepartment(objDetails).then(function (objDetails) {
          sideBarService.getDepartment().then(function(dataReload) {
              addVS1Data('TDeptClass',JSON.stringify(dataReload)).then(function (datareturn) {
              location.reload(true);
              }).catch(function (err) {
                location.reload(true);
              });
          }).catch(function(err) {
              location.reload(true);
          });
        }).catch(function (err) {
            swal({
                title: 'Oooops...',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {
                    Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {

                }
            });
            $('.fullScreenSpin').css('display','none');
        });

    },
    'click .btnSaveAccountant': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();
        let accountantID = $('#edtAccountantID').val();
        let firstName = $('#edtFirstName').val();
        let lastName = $('#edtLastName').val();
        let companyName = $('#edtCompanyName').val();
        let address = $('#edtAddress').val();
        let docName = $('#edtDocName').val();
        let townCity = $('#edtTownCity').val();
        let postalZip = $('#edtPostalZip').val();
        let stateRegion = $('#edtStateRegion').val();
        let country = $('#edtCountry').val();
        
        if (firstName === ''){
            swal('First name cannot be blank!', '', 'warning');
            $('.fullScreenSpin').css('display','none');
            e.preventDefault();
        }
        else if(lastName === ''){
            swal('Last name cannot be blank!', '', 'warning');
            $('.fullScreenSpin').css('display','none');
            e.preventDefault();
        }
        else if(companyName === ''){
            swal('Company name cannot be blank!', '', 'warning');
            $('.fullScreenSpin').css('display','none');
            e.preventDefault();
        }
        else if(address === ''){
            swal('Address cannot be blank!', '', 'warning');
            $('.fullScreenSpin').css('display','none');
            e.preventDefault();
        }
        else if(docName === ''){
            swal('Document name cannot be blank!', '', 'warning');
            $('.fullScreenSpin').css('display','none');
            e.preventDefault();
        }
        else if(townCity === ''){
            swal('Town / City cannot be blank!', '', 'warning');
            $('.fullScreenSpin').css('display','none');
            e.preventDefault();
        }
        else if(postalZip === ''){
            swal('Postal / Zip cannot be blank!', '', 'warning');
            $('.fullScreenSpin').css('display','none');
            e.preventDefault();
        }
        else if(stateRegion === ''){
            swal('State / Region cannot be blank!', '', 'warning');
            $('.fullScreenSpin').css('display','none');
            e.preventDefault();
        }
        else if(country === ''){
            swal('Country cannot be blank!', '', 'warning');
            $('.fullScreenSpin').css('display','none');
            e.preventDefault();
        }

        let objDetails = '';
        let objStSDetails = null;

        if (isModuleGreenTrack) {

            let sltMainContact = $('#sltMainContact').val();
            let stsMainContactNo = $('#stsMainContactNo').val();
            let stsLicenseNo = $('#stsLicenseNo').val();
            let sltDefaultRoomName = $('#sltDefaultRoom').val();
            var newbinnum = $("#sltDefaultRoom").find('option:selected').attr('mytagroom');
            objStSDetails = {
                type: "TStSClass",
                fields: {
                    DefaultBinLocation: sltDefaultRoomName || '',
                    DefaultBinNumber: newbinnum || '',
                    LicenseNumber: stsLicenseNo || '',
                    PrincipleContactName: sltMainContact || '',
                    PrincipleContactPhone: stsMainContactNo || ''
                }
            }
        }

        if (firstName === ''){
            Bert.alert('<strong>WARNING:</strong> First Name cannot be blank!', 'warning');
            e.preventDefault();
        }
        else if (lastName === ''){
            Bert.alert('<strong>WARNING:</strong> Last Name cannot be blank!', 'warning');
            e.preventDefault();
        }
        else if (companyName === ''){
            Bert.alert('<strong>WARNING:</strong> Company Name cannot be blank!', 'warning');
            e.preventDefault();
        }
        else if (address === ''){
            Bert.alert('<strong>WARNING:</strong> Address cannot be blank!', 'warning');
            e.preventDefault();
        }
        else if (docName === ''){
            Bert.alert('<strong>WARNING:</strong> Document Name cannot be blank!', 'warning');
            e.preventDefault();
        }
        else if (townCity === ''){
            Bert.alert('<strong>WARNING:</strong> Town / City cannot be blank!', 'warning');
            e.preventDefault();
        }
        else if (postalZip === ''){
            Bert.alert('<strong>WARNING:</strong> Postal / Zip cannot be blank!', 'warning');
            e.preventDefault();
        }
        else if (stateRegion === ''){
            Bert.alert('<strong>WARNING:</strong> State / Region cannot be blank!', 'warning');
            e.preventDefault();
        }
        else if (country === ''){
            Bert.alert('<strong>WARNING:</strong> Country cannot be blank!', 'warning');
            e.preventDefault();
        }

        if(accountantID == ""){
            taxRateService.checkAccountantByName(docName).then(function (data) {
                accountantID = data.tdeptclass[0].Id;
                objDetails = {
                    type: "TReportsAccountantsCategory",
                    fields: {
                        ID: parseInt(accountantID)||0,
                        Active: true,
                        FirstName: firstName,
                        LastName: lastName,
                        CompanyName: companyName,
                        Address: address,
                        DocName: docName,
                        TownCity: townCity,
                        PostalZip: postalZip,
                        StateRegion: stateRegion,
                        Country: country,
                    }
                };

                taxRateService.saveAccountantCategory(objDetails).then(function (objDetails) {
                  sideBarService.getAccountantCategory().then(function(dataReload) {
                      addVS1Data('TReportsAccountantsCategory',JSON.stringify(dataReload)).then(function (datareturn) {
                      location.reload(true);
                      }).catch(function (err) {
                        location.reload(true);
                      });
                  }).catch(function(err) {
                      location.reload(true);
                  });
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
                    $('.fullScreenSpin').css('display','none');
                });

            }).catch(function (err) {
                objDetails = {
                    type: "TReportsAccountantsCategory",
                    fields: {
                        Active: true,
                        FirstName: firstName,
                        LastName: lastName,
                        CompanyName: companyName,
                        Address: address,
                        DocName: docName,
                        TownCity: townCity,
                        PostalZip: postalZip,
                        StateRegion: stateRegion,
                        Country: country
                    }
                };

                taxRateService.saveAccountantCategory(objDetails).then(function (objDetails) {
                    console.log("--------");
                  sideBarService.getAccountantCategory().then(function(dataReload) {
                      addVS1Data('TReportsAccountantsCategory',JSON.stringify(dataReload)).then(function (datareturn) {
                        location.reload(true);
                      }).catch(function (err) {
                        location.reload(true);
                      });
                  }).catch(function(err) {
                      location.reload(true);
                  });
                }).catch(function (err) {
                    console.log("========");
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
                    $('.fullScreenSpin').css('display','none');
                });
            });

        }else{
            objDetails = {
                type: "TReportsAccountantsCategory",
                fields: {
                    ID: parseInt(accountantID),
                    Active: true,
                    FirstName: firstName,
                    LastName: lastName,
                    CompanyName: companyName,
                    Address: address,
                    DocName: docName,
                    TownCity: townCity,
                    PostalZip: postalZip,
                    StateRegion: stateRegion,
                    Country: country
                }
            };

            taxRateService.saveAccountantCategory(objDetails).then(function (objDetails) {
                console.log('objDetails', objDetails);
              sideBarService.getAccountantCategory().then(function(dataReload) {
                  addVS1Data('TReportsAccountantsCategory',JSON.stringify(dataReload)).then(function (datareturn) {
                  location.reload(true);
                  }).catch(function (err) {
                    location.reload(true);
                  });
              }).catch(function(err) {
                  location.reload(true);
              });
            }).catch(function (err) {
                console.log('==========');
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
                $('.fullScreenSpin').css('display','none');
            });
        }
    },
    'click .btnAddAccountant': function () {
        $('#add-accountant-title').text('Add New Accountant');
        $('#edtAccountantID').val('');
        
        $('#edtFirstName').val('');
        $('#edtLastName').val('');
        $('#edtCompanyName').val('');
        $('#edtAddress').val('');
        $('#edtDocName').val('');
        $('#edtTownCity').val('');
        $('#edtPostalZip').val('');
        $('#edtStateRegion').val('');
        $('#edtCountry').val('');
        // $('#edtDeptName').prop('readonly', false);
    },
    'click .btnBack':function(event){
        event.preventDefault();
        history.back(1);
    },
    'click .btnSaveRoom': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let taxRateService = new TaxRateService();

        var parentdept = $('#sltDepartmentList').val();
        var newroomname = $('#newRoomName').val();
        var newroomnum = $('#newRoomNum').val();


        let data = '';

        data = {
            type: "TProductBin",
            fields: {
                BinClassName: parentdept|| '',
                BinLocation: newroomname|| '',
                BinNumber: newroomnum|| ''
            }
        };

        taxRateService.saveRoom(data).then(function (data) {
            window.open('/reportsAccountantSettings','_self');
        }).catch(function (err) {

            $('.fullScreenSpin').css('display','none');
        });
    },
});

Template.reportsAccountantSettings.helpers({
    countryList: () => {
        return Template.instance().countryData.get();
    },
    datatablerecords : () => {
        return Template.instance().datatablerecords.get().sort(function(a, b){
            if (a.headDept == 'NA') {
                return 1;
            }
            else if (b.headDept == 'NA') {
                return -1;
            }
            return (a.headDept.toUpperCase() > b.headDept.toUpperCase()) ? 1 : -1;
            // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'accountantList'});
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b){
            if (a.department == 'NA') {
                return 1;
            }
            else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    isModuleGreenTrack: () => {
        return isModuleGreenTrack;
    },
    listEmployees: () => {
        return Template.instance().employeerecords.get().sort(function(a, b){
            if (a.employeename == 'NA') {
                return 1;
            }
            else if (b.employeename == 'NA') {
                return -1;
            }
            return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
        });
    },
    listBins: () => {
        return Template.instance().roomrecords.get().sort(function(a, b){
            if (a.roomname == 'NA') {
                return 1;
            }
            else if (b.roomname == 'NA') {
                return -1;
            }
            return (a.roomname.toUpperCase() > b.roomname.toUpperCase()) ? 1 : -1;
        });
    },
    listDept: () => {
        return Template.instance().departlist.get().sort(function(a, b){
            if (a.deptname == 'NA') {
                return 1;
            }
            else if (b.deptname == 'NA') {
                return -1;
            }
            return (a.deptname.toUpperCase() > b.deptname.toUpperCase()) ? 1 : -1;
        });
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
