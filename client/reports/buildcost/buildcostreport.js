import { ReactiveVar } from 'meteor/reactive-var';
import { UtilityService } from "../../utility-service";
import { ContactService } from "../../contacts/contact-service";
import { SideBarService } from '../../js/sidebar-service';
import 'jquery-editable-select';
import { Template } from 'meteor/templating';
import "./buildcostreport.html";
import { cloneDeep, template } from 'lodash';
import { ManufacturingService } from "../../manufacture/manufacturing-service";


let manufacturingService = new ManufacturingService();
let utilityService = new UtilityService();
let sideBarService = new SideBarService();
Template.buildcostreport.onCreated(function() {

    const templateObject = Template.instance();
    templateObject.workOrderRecords = new ReactiveVar([]);
    templateObject.employeeList = new ReactiveVar([]);
    templateObject.timesheetList = new ReactiveVar([]);
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.selectedFile = new ReactiveVar();

    templateObject.getDataTableList = function(data) {  
        
        let clocked_hrs = data.TotalClockedTime;
        let variance ;
        let wastage_value;
             
        let labour_cost = (data.HourlyLabourCost * clocked_hrs).toFixed(2);
        let changed_qty;
       
        if(data.ChangedQty == 0) { 
            changed_qty = data.BOMQty ;
        } else {
            changed_qty = data.ChangedQty;
        }

        variance = changed_qty - data.BOMQty;
        wastage_value = variance;

        if(isNaN(labour_cost)) {
            labour_cost = "";
        }

        let over_head_cost = (data.HourlyOverHeadCost * clocked_hrs).toFixed(2);
        if(isNaN(over_head_cost)) {
            over_head_cost = "";
        }

        let RawMaterialcost = parseFloat(data.UnitCost) * (parseFloat(data.BOMQty) + parseFloat(wastage_value));
        let wastage_cost = parseFloat(wastage_value * data.UnitCost);
        let total_bom_cost; 

        let clocked_times ;
        if(clocked_hrs == "") {
            clocked_times = "";
        } else {
          clocked_times = templateObject.timeFormat(clocked_hrs);
          //clocked_times = parseFloat(clocked_hrs).toFixed(4);
        }
      
        if(labour_cost == "" || over_head_cost == "" ) {
             total_bom_cost =  RawMaterialcost + wastage_cost;
        } else {
             total_bom_cost = (parseFloat(labour_cost) + parseFloat(over_head_cost) + parseFloat(RawMaterialcost) + parseFloat(wastage_cost)).toFixed(2); 
        }
        
        let linestatus = "";

        if (data.Active  == false) {
            linestatus = "";
        } else if (data.Active  == true) {
            linestatus = "In-Active";
        }                   

        var dataList = [ data.WorkorderID,
                        data.ProductID,
                        data.ProcessBOM || ' ',
                        data.BOMChanged || ' ',
                        data.BOMProducts|| ' ',
                        data.ProductsChanged || ' ',
                        data.UnitCost || 0,
                        parseFloat(data.BOMQty).toFixed(0) || 0,
                        parseFloat(changed_qty).toFixed(0) || 0,
                        variance,
                        wastage_value,
                        clocked_times || ' ' ,
                        labour_cost,
                        over_head_cost,
                        RawMaterialcost || 0,
                        wastage_cost ,
                        total_bom_cost || 0, 
                        linestatus,   ];
        return dataList;
    };

    let headerStructure = [
        { index: 0, label: 'Work Order', class: 'colWorkorder', active: true, display: true, width: "100" },
        { index: 1, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "100" },
        { index: 2, label: 'Process BOM', class: 'colProcessBOM', active: true, display: true, width: "120" },
        { index: 3, label: 'Process BOM Changed', class: 'colProcessBOMChanged', active: true, display: true, width: "150" },
        { index: 4, label: 'BOM Products', class: 'colBOMProduct', active: true, display: true, width: "100" },
        { index: 5, label: 'Product Changed', class: 'colProductChanged', active: true, display: true, width: "100" },
        { index: 6, label: 'Unit Cost', class: 'colUnitCost', active: true, display: true, width: "80" },
        { index: 7, label: 'BOM Qty', class: 'colBOMQty', active: true, display: true, width: "70" },
        { index: 8, label: 'Changed Qty', class: 'colChangedQty', active: true, display: true, width: "100" },
        { index: 9, label: 'Variance', class: 'colVariance', active: true, display: true, width: "80" },
        { index: 10, label: 'Wastage', class: 'colWastage', active: true, display: true, width: "70" },
        { index: 11, label: 'Total Clocked Hours', class: 'colTotalClockedHours', active: true, display: true, width: "150" },
        { index: 12, label: 'Labour Cost', class: 'colLabourCost', active: true, display: true, width: "100" },
        { index: 13, label: 'Overhead Cost', class: 'colOverheadCost', active: true, display: true, width: "100" },
        { index: 14, label: 'Raw Material Cost', class: 'colRawMaterialCost', active: true, display: true, width: "110" },
        { index: 15, label: 'Wastage Cost', class: 'colWastageCost', active: true, display: true, width: "120" },
        { index: 16, label: 'Total BOM Cost', class: 'colTotalBOMCost', active: true, display: true, width: "120" },  
        { index: 17, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },     
    ];
    templateObject.tableheaderrecords.set(headerStructure);

    templateObject.getDiffTime = function (time1, time2) {
        const [h1, m1, s1] = time1.split(/[:\s]/).map(Number);
        const [h2, m2, s2] = time2.split(/[:\s]/).map(Number);

        // Calculate the difference in hours
        const diffInHours = (h2 - h1) + (m2 - m1) / 60 + (s2 - s1) / 3600;
        return diffInHours;
    }
});

Template.buildcostreport.onRendered(function() {

    $('.fullScreenSpin').css('display', 'inline-block');
 
    let templateObject = Template.instance();


    
    templateObject.makeIndexedDBdata = function () {
       
        let buildcostreport_data = [];
        getVS1Data('TVS1Workorder').then(function(workorderDataObject) {
            let workorder;
            let templateObject = Template.instance();

            if(workorderDataObject.length == 0) {
                workorder = manufacturingService.getWorkOrderList();

                addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workorder})).then(function(datareturn){
                    
                }).catch(function(err){
                });

            }else {
                workorder = JSON.parse(workorderDataObject[0].data).tvs1workorder;
            }
            getVS1Data('TProcessStep').then(function(dataObject) {
                let process_data;
                if (dataObject.length == 0) {
                    manufacturingService.getAllProcessData(initialBaseDataLoad, 0).then( function(data) {                            
                        process_data = data;
                        addVS1Data('TProcessStep', JSON.stringify(data)).then(function(datareturn) {
                        })
                    })
                } else {
                    process_data = JSON.parse(dataObject[0].data).tprocessstep;
                }
                
                
                let bomData;
                let hourly_labour_cost;
                let hourly_overhead_cost;
                let unit_cost = 10;
                
             
                let startedTimes ;
                let stoppedTimes;

                for (let i = 0; i < workorder.length; i++) {
                    bomData = JSON.parse(workorder[i].fields.BOMStructure);
                    for(let k =0 ; k < process_data.length; k++) {
                        if (bomData.Info == process_data[k].fields.Description) {
                            hourly_labour_cost = parseFloat(process_data[k].fields.HourlyLabourCost);
                            hourly_overhead_cost = parseFloat(process_data[k].fields.OHourlyCost);
                        }
                    }
                  
                    startedTimes = workorder[i].fields.StartedTimes;
                    stoppedTimes = workorder[i].fields.StoppedTimes;
                    let clocked_hrs = 0;  
                                                           
                    for(let k=0; k < stoppedTimes.length; k++) {

                        const startTimeString = startedTimes[k];
                        const endTimeString = stoppedTimes[k];
                        const hoursDiff = templateObject.getDiffTime(startTimeString, endTimeString);
                   
                       clocked_hrs = clocked_hrs + hoursDiff;
                    }                           
                                      

                    let details = JSON.parse(bomData.Details);

                    let temp = {
                        WorkorderID: workorder[i].fields.ID || ' ',
                        ProductID: workorder[i].fields.ProductName || ' ',
                        ProcessBOM: bomData.Info || ' ',
                        BOMChanged: " ",
                        BOMProducts: bomData.Caption || ' ',
                        ProductsChanged: " ",
                        UnitCost: unit_cost || 0,
                        BOMQty: bomData.TotalQtyOriginal || 0,
                        ChangedQty : bomData.TotalChangeQty || 0,
                        TotalClockedTime: clocked_hrs || '0' ,
                        HourlyLabourCost: hourly_labour_cost || 0,
                        HourlyOverHeadCost : hourly_overhead_cost || 0,
                        RawMaterialcost : 0,
                        WastageCost : 0,
                        TotalBOMCost: 0,    
                        Active: false,               
                        

                    };

                    buildcostreport_data.push(temp);

                    for(let j=0; j<details.length;j++) {

                        temp = {
                            WorkorderID: ' ',
                            ProductID: ' ',
                            ProcessBOM: ' ',
                            BOMChanged: ' ',
                            BOMProducts: details[j].productName || ' ',
                            ProductsChanged: " ",
                            UnitCost: unit_cost || 0,
                            BOMQty: details[j].qty  || 0,
                            ChangedQty : details[j].changed_qty  || 0,
                            TotalClockedTime: "" ,
                            HourlyLabourCost: hourly_labour_cost || 0,
                            HourlyOverHeadCost : hourly_overhead_cost || 0,
                            RawMaterialcost : unit_cost * parseFloat(bomData.TotalQtyOriginal),
                            WastageCost : 0,
                            TotalBOMCost: 0,     
                            Active: false,
                        }  

                        buildcostreport_data.push(temp);
                    }
                    

                }     
                

                addVS1Data('TVS1BuildCostReport', JSON.stringify({tvs1buildcostreport: buildcostreport_data})).then(function(datareturn){
                }).catch(function(err){
                    
                });
                
                    
            }).catch(function(e) {
                manufacturingService.getAllProcessData(initialBaseDataLoad, 0).then(function(data) {
                    addVS1Data('TProcessStep', JSON.stringify(data)).then(function(datareturn) {
                                                                            })
                })
            })           

                                
        })       

    }
    
    templateObject.makeIndexedDBdata();     
      
    templateObject.timeToHours = function (time) {
        const parts = time.split(":");
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        const seconds = parseInt(parts[2]);
        const totalHours = hours + minutes / 60 + seconds / 3600;
        return totalHours;
    } ;    

    templateObject.timeFormat = function(hours) {
        var decimalTime = parseFloat(hours).toFixed(2);
        decimalTime = decimalTime * 60 * 60;
        var hours = Math.floor((decimalTime / (60 * 60)));
        decimalTime = decimalTime - (hours * 60 * 60);
        var minutes = Math.abs(decimalTime / 60);
        decimalTime = decimalTime - (minutes * 60);
        hours = ("0" + hours).slice(-2);
        minutes = ("0" + Math.round(minutes)).slice(-2);
        let time = hours + ":" + minutes;
        return time;
    }  
   
    templateObject.timeToDecimal = function(time) {
        var hoursMinutes = time.split(/[.:]/);
        var hours = parseInt(hoursMinutes[0], 10);
        var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        return hours + minutes / 60;
    }   

});

Template.buildcostreport.events({
   
    'click .exportbtn': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblBuildCostReport_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .exportbtnExcel': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblBuildCostReport_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .printConfirm': function (event) {
        playPrintAudio();
        setTimeout(function(){
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblBuildCostReport_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    }, delayTimeAfterSound);
    },
    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
       // templateObject.getProcessClockedList();
        setTimeout(function () {
            window.open('/buildcostreport','_self');
            
        }, 2000);

    },
    'click .templateDownload': function () {
        let utilityService = new UtilityService();
        let rows = [];
        const filename = 'SampleBuildcostReport' + '.csv';
        rows[0] = ['Work Order', 'Product ID', 'Process BOM', 'Process BOM Changed', 'BOM Products', 'Product Changed', 'Unit Cost', 'BOM Qty', 'Changed Qty', 'Variance', 'Wastage', 'Total Clocked Hours', 'Labour Cost', 'Overhead Cost', 'Raw Material Cost', 'Wastage Cost', 'Total BOM Cost'];
        utilityService.exportToCsv(rows, filename, 'csv');
    },
    'click .btnUploadFile': function (event) {
        $('#attachment-upload').val('');
        $('.file-name').text('');
        //$(".btnImport").removeAttr("disabled");
        $('#attachment-upload').trigger('click');

    },
    'click .templateDownloadXLSX': function (e) {

        e.preventDefault();  //stop the browser from following
        window.location.href = 'sample_imports/SampleBuildcostReport.xlsx';
    },
    'change #attachment-upload': function (e) {
        let templateObj = Template.instance();
        var filename = $('#attachment-upload')[0].files[0]['name'];
        var fileExtension = filename.split('.').pop().toLowerCase();
        var validExtensions = ["csv", "txt", "xlsx"];
        var validCSVExtensions = ["csv", "txt"];
        var validExcelExtensions = ["xlsx", "xls"];

        if (validExtensions.indexOf(fileExtension) == -1) {
            // Bert.alert('<strong>formats allowed are : '+ validExtensions.join(', ')+'</strong>!', 'danger');
            swal('Invalid Format', 'formats allowed are :' + validExtensions.join(', '), 'error');
            $('.file-name').text('');
            $(".btnImport").Attr("disabled");
        } else if (validCSVExtensions.indexOf(fileExtension) != -1) {

            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];

            templateObj.selectedFile.set(selectedFile);
            if ($('.file-name').text() != "") {
                $(".btnImport").removeAttr("disabled");
            } else {
                $(".btnImport").Attr("disabled");
            }
        } else if (fileExtension == 'xlsx') {
            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];
            var oFileIn;
            var oFile = selectedFile;
            var sFilename = oFile.name;
            // Create A File Reader HTML5
            var reader = new FileReader();

            // Ready The Event For When A File Gets Selected
            reader.onload = function (e) {
                var data = e.target.result;
                data = new Uint8Array(data);
                var workbook = XLSX.read(data, { type: 'array' });
                var result = {};
                workbook.SheetNames.forEach(function (sheetName) {
                    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                    var sCSV = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                    templateObj.selectedFile.set(sCSV);

                    if (roa.length) result[sheetName] = roa;
                });
                // see the result, caution: it works after reader event is done.

            };
            reader.readAsArrayBuffer(oFile);

            if ($('.file-name').text() != "") {
                $(".btnImport").removeAttr("disabled");
            } else {
                $(".btnImport").Attr("disabled");
            }

        }



    },
    'click .btnImport': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let contactService = new ContactService();
        let objDetails;
        Papa.parse(templateObject.selectedFile.get(), {
            complete: function (results) {

                if (results.data.length > 0) {
                    if ((results.data[0][0] == "Work Order") && (results.data[0][1] == "Product ID")
                        && (results.data[0][2] == "Process BOM") && (results.data[0][3] == "Process BOM Changed")
                        && (results.data[0][4] == "BOM Products") && (results.data[0][5] = "Product Changed")
                        && (results.data[0][6] == "Unit Cost") && (results.data[0][7] == "BOM Qty")
                        && (results.data[0][8] == "Changed Qty") && (results.data[0][9] == "Vairance")
                        && (results.data[0][10] == "Wastage") && (results.data[0][11] == "Total Clocked Hours")
                        && (results.data[0][12] == "Labour Cost") && (results.data[0][13] == "Overhead Cost")
                        && (results.data[0][14] == "Raw Material Cost ") && (results.data[0][15] == "Wastage Cost ")
                        && (results.data[0][16] == "Total BOM Cost") ) {

                        let dataLength = results.data.length * 500;
                        setTimeout(function () {
                            // $('#importModal').modal('toggle');
                            Meteor._reload.reload();
                        }, parseInt(dataLength));

                        for (let i = 0; i < results.data.length - 1; i++) {
                            objDetails = {
                                type: "TVS1BuildCostReport",
                                fields:
                                {
                                    WorkOrder: results.data[i + 1][0],
                                    ProductID: results.data[i + 1][1],
                                    ProcessBOM: results.data[i + 1][2],
                                    ProcessBOMChanged: results.data[i + 1][3],
                                    BOMProducts: results.data[i + 1][4],
                                    ProductsChanged: results.data[i + 1][5],
                                    UnitCost: results.data[i + 1][6],
                                    BOMQty: results.data[i + 1][7],
                                    ChangedQty: results.data[i + 1][8],
                                    Variance: results.data[i + 1][9],
                                    Wastage: results.data[i + 1][10],
                                    TotalClockedTime: results.data[i + 1][11],
                                    LabourCost: results.data[i + 1][12],
                                    OverheadCost: results.data[i + 1][13],
                                    RawMaterialcost: results.data[i + 1][14],
                                    WastageCost: results.data[i + 1][15],
                                    TotalBOMCost: results.data[i + 1][16],
                                }
                            };
                            if (results.data[i + 1][1]) {
                                if (results.data[i + 1][1] !== "") {
                                    manufacturingService.saveBuildCostReport(objDetails).then(function (data) {
                                        //$('.fullScreenSpin').css('display','none');
                                        //Meteor._reload.reload();
                                    }).catch(function (err) {
                                        //$('.fullScreenSpin').css('display','none');
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
                                    });
                                }
                            }
                        }

                    } else {
                        $('.fullScreenSpin').css('display', 'none');
                        // Bert.alert('<strong> Data Mapping fields invalid. </strong> Please check that you are importing the correct file with the correct column headers.', 'danger');
                        swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                    }
                } else {
                    $('.fullScreenSpin').css('display', 'none');
                    // Bert.alert('<strong> Data Mapping fields invalid. </strong> Please check that you are importing the correct file with the correct column headers.', 'danger');
                    swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                }

            }
        });
    },
    
    'click #check-all': function(event) {
        if ($(event.target).is(':checked')) {
            $(".chkBox").prop("checked", true);
        } else {
            $(".chkBox").prop("checked", false);
        }
    },      

    




});


Template.buildcostreport.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.company == 'NA') {
                return 1;
            }
            else if (b.company == 'NA') {
                return -1;
            }
            return (a.company.toUpperCase() > b.company.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({ userid: localStorage.getItem('mycloudLogonID'), PrefName: 'tblJoblist' });
    },

    apiFunction:function() {
        let sideBarService = new SideBarService();
        return sideBarService.getAllClockOnReport;
    },

    searchAPI: function() {
        return sideBarService.getAllJobssDataVS1;
    },

    service: ()=>{
        let sideBarService = new SideBarService();
        return sideBarService;

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
        return ["ignoredate", "limitCount", "limitFrom", "deleteFilter"];
    },
});
