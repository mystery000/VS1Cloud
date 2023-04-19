import { ReactiveVar } from 'meteor/reactive-var';
import { UtilityService } from "../../utility-service";
import { ContactService } from "../../contacts/contact-service";
import { SideBarService } from '../../js/sidebar-service';
import 'jquery-editable-select';
import { Template } from 'meteor/templating';
import "./employee_clock_status.html";
import { cloneDeep, template } from 'lodash';
import { ManufacturingService } from "../../manufacture/manufacturing-service";


let manufacturingService = new ManufacturingService();
let utilityService = new UtilityService();
let sideBarService = new SideBarService();
Template.employee_clock_status_template.onCreated(function() {

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

        if (data.Active  == false) {
            linestatus = "";
        } else if (data.Active  == true) {
            linestatus = "In-Active";
        }
        
        const date_1 = new Date(data.OrderDate);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };  
        const formattedDate = date_1.toLocaleDateString('en-GB', options);
                
        var dataList = [
            data.EmployeeId || '',
            data.EmployeeName || '',
            formattedDate || '',
            data.WorkorderNumber || '',
            data.ClockedOn || '',
            '',
            '',
            linestatus,
        ];

        return dataList;
    }

    let headerStructure = [
        { index: 0, label: 'EmpID', class: 'colEmpID', active: true, display: true, width: "50" },
        { index: 1, label: 'Employee Name', class: 'colEmpName', active: true, display: true, width: "150" },
        { index: 2, label: 'Date', class: 'colDate', active: true, display: true, width: "120" },
        { index: 3, label: 'WorkorderNumber', class: 'colTotalProcess', active: true, display: true, width: "150" },
        { index: 4, label: 'Clocked On/Off', class: 'colVariance', active: true, display: true, width: "100" },
        { index: 5, label: 'Process Clocked On/Off', class: 'colPercent', active: true, display: true, width: "150" },
        { index: 6, label: 'On a Break/Lunch', class: 'colPercent', active: true, display: true, width: "150" },
        { index: 7, label: 'Status', class: 'colStatus', active: true, display: true, width: "120" },
        
    ];

    templateObject.tableheaderrecords.set(headerStructure);
});

Template.employee_clock_status_template.onRendered(function() {

    $('.fullScreenSpin').css('display', 'inline-block');
 
    let templateObject = Template.instance();   
    
    templateObject.makeIndexedDBdata = function (){

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

                                let order_date = workorder_data[k].fields.OrderDate;
                                let order_number = workorder_data[k].fields.ID;
                                let clocked_on = workorder_data[k].fields.status;
                            
                                clockon_temp = { EmployeeId : employee_id,
                                                EmployeeName: employee_name , 
                                                OrderDate: order_date,
                                                WorkorderNumber: order_number,
                                                ClockedOn : clocked_on,
                                                Active : false,
                                                };
                                                
                                clockon_report_data.push(clockon_temp);

                            }
                        }

                        

                    }


                    addVS1Data('TVS1EmployeeClockStatus', JSON.stringify({tvs1employeeclockstatus: clockon_report_data})).then(function(datareturn){
                    }).catch(function(err){
                        
                    });                    
                    
                })

                                   
            }) 

        })

    }
    
    templateObject.makeIndexedDBdata();       
       
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

Template.employee_clock_status_template.events({
   
    'click .exportbtn': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblEmployeeClockStatus_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .exportbtnExcel': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblEmployeeClockStatus_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .printConfirm': function (event) {
        playPrintAudio();
        setTimeout(function(){
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblEmployeeClockStatus_wrapper .dt-buttons .btntabletopdf').click();
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
        const filename = 'SampleEmployeeClockStatus' + '.csv';
        rows[0] = ['EmpID', 'EmployeeName', 'Date', 'WorkorderNumber', 'Clock On/Off', 'Process Clocked On/Off', 'On a Break/Lunch', 'State'];
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
        window.location.href = 'sample_imports/SampleEmployeeClockStatus.xlsx';
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
    
});


Template.employee_clock_status_template.helpers({
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
        return sideBarService.getAllClockOnReport;
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
