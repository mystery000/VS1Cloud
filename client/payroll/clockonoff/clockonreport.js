import { ReactiveVar } from 'meteor/reactive-var';
import { UtilityService } from "../../utility-service";
import { ContactService } from "../../contacts/contact-service";
import { SideBarService } from '../../js/sidebar-service';
import 'jquery-editable-select';
import { Template } from 'meteor/templating';
import "./clockonreport.html";
import { cloneDeep, template } from 'lodash';
import { ManufacturingService } from "../../manufacture/manufacturing-service";


let manufacturingService = new ManufacturingService();
let utilityService = new UtilityService();
let sideBarService = new SideBarService();
Template.clockonreport_template.onCreated(function() {

    const templateObject = Template.instance();
    templateObject.workOrderRecords = new ReactiveVar([]);
    templateObject.employeeList = new ReactiveVar([]);
    templateObject.timesheetList = new ReactiveVar([]);
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.selectedFile = new ReactiveVar();

    templateObject.getDataTableList = function(data) {  
        
        let percent_variance;
        if(parseFloat(data.TotalClockedTime) == 0) {
            percent_variance = 0;
        }
        else {
            
            percent_variance = parseFloat(data.ProcessClockedTime)/parseFloat(data.TotalClockedTime);
        }

        let linestatus = "";
        if (data.Active == false) {
            linestatus = "";
        } else if (data.Active == true) {
            linestatus = "In-Active";
        }

        
        var dataList = [
            data.EmployeeId || '',
            data.EmployeeName || '',
            data.TotalClockedTime.toFixed(2) || 0,
            data.ProcessClockedTime.toFixed(2) || 0,
            (parseFloat(data.TotalClockedTime) - parseFloat(data.ProcessClockedTime)).toFixed(2) || 0,
            percent_variance.toFixed(2) + "%",
            linestatus,
        ];

        return dataList;
    }
});

Template.clockonreport_template.onRendered(function() {

    $('.fullScreenSpin').css('display', 'inline-block');
 
    let templateObject = Template.instance();
   
    let headerStructure = [
        { index: 0, label: 'EmpID', class: 'colEmpID', active: true, display: true, width: "50" },
        { index: 1, label: 'Employee Name', class: 'colEmpName', active: true, display: true, width: "120" },
        { index: 2, label: 'Total Clocked Hours', class: 'colTotalHour', active: true, display: true, width: "130" },
        { index: 3, label: 'Total Process Clocked Hours', class: 'colTotalProcess', active: true, display: true, width: "120" },
        { index: 4, label: 'Variance in Hours', class: 'colVariance', active: true, display: true, width: "150" },
        { index: 5, label: 'Variance in Percentage', class: 'colPercent', active: true, display: true, width: "150" },
        { index: 6, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
        
    ];

    templateObject.tableheaderrecords.set(headerStructure);
    
    templateObject.makeIndexedDBdata = function (from_date , to_date){

        getVS1Data('TEmployee').then(function(empdataObject) {
            let empdata = JSON.parse(empdataObject[0].data).temployee;
            getVS1Data('TVS1Workorder').then(function(workorderDataObject) {
                let workorder;
                if(workorderDataObject.length == 0) {
                    workorder = manufacturingService.getWorkOrderList();

                    addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workorder})).then(function(datareturn){
                        
                    }).catch(function(err){
                    });

                }else {
                    workorder = JSON.parse(workorderDataObject[0].data).tvs1workorder;
                }

                getVS1Data('TTimeSheet').then(function(timesheetdataObject) {
                    let timesheet = JSON.parse(timesheetdataObject[0].data);
                    let clockon_report_data = [];
                    let clockon_temp ;
                    let employee_data = empdata;
                    let timesheet_data = timesheet.ttimesheet;
                    let workorder_data = workorder;
        

                    for(let i = 0; i < employee_data.length ; i++) {
                        let employee_name = employee_data[i].fields.EmployeeName;
                        let employee_id = employee_data[i].fields.EmployeeNo;
                        let total_clocked_time = 0;
                        let process_clocked_time = 0

                        for(let j = 0 ; j < timesheet_data.length ; j++) {
                            if(timesheet_data[j].fields.EmployeeName == employee_name) {
                                total_clocked_time = total_clocked_time + timesheet_data[j].fields.Hours;
                            }
                        }
                        
                        for(let k = 0; k < workorder_data.length ; k++) {
                          
                           
                           if(workorder_data[k].fields.EmployeeName == employee_name ) {
                             let bomData = JSON.parse(workorder_data[k].fields.BOMStructure);
                             let bomDetailData = JSON.parse(bomData.Details);

                         

                             for(let l=0; l < bomDetailData.length; l++ ) {
                                process_clocked_time = process_clocked_time + bomDetailData[l].ClockedTime;
                                
                             }

                            }
                        }

                        clockon_temp = {EmployeeId : employee_id,
                                        EmployeeName: employee_name , 
                                        TotalClockedTime: total_clocked_time,
                                        ProcessClockedTime: process_clocked_time,
                                        Active: false,
                                        };
                        clockon_report_data.push(clockon_temp);


                    }

                    addVS1Data('TVS1ClockOnReport', JSON.stringify({tvs1clockonreport: clockon_report_data})).then(function(datareturn){
                    }).catch(function(err){
                        
                    });

                    
                    
                })

                                   
            }) 

        })

    }
    
    templateObject.makeIndexedDBdata("","");       
       
    //get all work orders
    templateObject.getAllWorkorders = async function() {
        return new Promise(async(resolve, reject)=>{
            getVS1Data('TVS1Workorder').then(function(dataObject){
                if(dataObject.length == 0) {
                    resolve ([]);
                }else  {
                    let data = JSON.parse(dataObject[0].data);
                    resolve(data.tvs1workorder)
                }
            })
        })
    }

    let temp =  templateObject.getAllWorkorders();
    templateObject.workOrderRecords.set(temp);
   
    templateObject.timeToDecimal = function(time) {
        var hoursMinutes = time.split(/[.:]/);
        var hours = parseInt(hoursMinutes[0], 10);
        var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        return hours + minutes / 60;
    }
    
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

});

Template.clockonreport_template.events({
   
    'click .exportbtn': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblClockOnReport_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .exportbtnExcel': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblClockOnReport_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .printConfirm': function (event) {
        playPrintAudio();
        setTimeout(function(){
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblClockOnReport_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    }, delayTimeAfterSound);
    },
    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
       // templateObject.getProcessClockedList();
        setTimeout(function () {
            window.open('/clockonreport','_self');
            
        }, 2000);

    },
    'click .templateDownload': function () {
        let utilityService = new UtilityService();
        let rows = [];
        const filename = 'ClockOnReport' + '.csv';
        rows[0] = ['EmpID', 'Employee Name', 'Total Clocked Hours', 'Total Process Clocked Hours', 'Variance in Hours', 'Status'];
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
        window.location.href = 'sample_imports/SampleCustomer.xlsx';
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
   
    'click #check-all': function(event) {
        if ($(event.target).is(':checked')) {
            $(".chkBox").prop("checked", true);
        } else {
            $(".chkBox").prop("checked", false);
        }
    },
    




});


Template.clockonreport_template.helpers({
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
        return ["dateFrom", "dateTo", "ignoredate", "limitCount", "limitFrom", "deleteFilter"];
    },
});
