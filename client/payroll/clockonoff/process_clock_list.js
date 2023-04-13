import { ReactiveVar } from 'meteor/reactive-var';
import { UtilityService } from "../../utility-service";
import { ContactService } from "../../contacts/contact-service";
import { SideBarService } from '../../js/sidebar-service';
import 'jquery-editable-select';
import { Template } from 'meteor/templating';
import "./process_clock_list.html";
import { cloneDeep, template } from 'lodash';
import { ManufacturingService } from "../../manufacture/manufacturing-service";



let utilityService = new UtilityService();
let sideBarService = new SideBarService();
let manufacturingService = new ManufacturingService();

Template.process_clock_template.onCreated(function() {
    const templateObject = Template.instance();

    templateObject.workOrderRecords = new ReactiveVar([]);
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.selectedFile = new ReactiveVar();

    templateObject.getDataTableList = function(data) {               
        
        var dataList = [
            data.EmpId,
            '<div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input" /><label class="custom-control-label"></label></div>', 
            data.EmpId || '',
            data.EmpName || '',
            data.ProcessDate || '',
            data.WorkorderID || '',
            data.Process || '',
            data.Product || '',
            data.ClockedTime || 0,
            data.Note || '',
            data.Status || '',            

        ];
        return dataList;
    }
});

Template.process_clock_template.onRendered(function() {

    $('.fullScreenSpin').css('display', 'inline-block');
    
    let templateObject = Template.instance();
     
    let launchClockOnOff = localStorage.getItem('CloudTimesheetLaunch') || false;
    let canClockOnClockOff = localStorage.getItem('CloudClockOnOff') || false;
 
    let headerStructure = [
        { index: 0, label: '', class: 'colID', active: true, display: true, width: "50" },
        { index: 1, label: '', class: 'colCheckbox', active: true, display: true, width: "50" },
        { index: 2, label: 'EmployeeID', class: 'colEmpID', active: true, display: true, width: "100" },
        { index: 3, label: 'Employee Name', class: 'colEmpName', active: true, display: true, width: "150" },
        { index: 4, label: 'Date', class: 'colDate', active: true, display: true, width: "150" },
        { index: 5, label: 'Workorder Number', class: 'colWorkorder', active: true, display: true, width: "150" },
        { index: 6, label: 'Process', class: 'colProcess', active: true, display: true, width: "100" },
        { index: 7, label: 'Product', class: 'colProduct', active: true, display: true, width: "100" },
        { index: 8, label: 'Clocked Time', class: 'colClockedTime', active: true, display: true, width: "120" },
        { index: 9, label: 'Note', class: 'colNote', active: true, display: true, width: "150" },
        { index: 10, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
        
    ];

    templateObject.tableheaderrecords.set(headerStructure);

    templateObject.getProcessClockedList = function () {
        getVS1Data('TVS1Workorder').then(async function (dataObject) {
            if (dataObject.length == 0) {
                let workOrderList = manufacturingService.getWorkOrderList();
                addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workOrderList})).then(function(datareturn){
                        
                }).catch(function(err){
                });
    
                let ProcessClockList = new Array();
                let workorderdata = workOrderList;
                let bomData;
                let tempData;
    
                for (let t = 0; t < workorderdata.length; t++) {
                    bomData =  JSON.parse(workorderdata[t].fields.BOMStructure);           
                    
                    let bomdetails = JSON.parse(bomData.Details);
    
                    for(let i = 0; i < bomdetails.length; i++) {
                        
                        if(bomdetails[i].process != '' ){
                            tempData = {
                                EmpId : workorderdata[t].fields.EmployeeId || i,
                                EmpName: workorderdata[t].fields.EmployeeName || 'Dene Mill',
                                Date: workorderdata[t].fields.DueDate != '' ? moment(workorderdata[t].fields.DueDate).format("DD/MM/YYYY") : workorderdata[t].fields.DueDate || new Date(),
                                WorkorderID: workorderdata[t].fields.ID || '',
                                Process: bomdetails[i].process || '',
                                Product: workorderdata[t].fields.ProductName || '',
                                ClockedTime : bomdetails[i].ClockedTime || 0,
                                Note : workorderdata[t].fields.Note || '',
                                Status: workorderdata[t].fields.Status || ''                  
                
                            };
            
                            ProcessClockList.push(tempData);
    
                        }
                        
                    }           
                }
    
                addVS1Data('TVS1ProcessClockList', JSON.stringify({tvs1processclocklist: ProcessClockList})).then(function(datareturn){
                       console.log(datareturn); 
                }).catch(function(err){
                    console.log(err);
                });
    
            } else {
                let data = JSON.parse(dataObject[0].data);
    
                let ProcessClockList = new Array();
                let workorderdata = data.tvs1workorder;
                let bomData;
                let tempData;
    
                for (let t = 0; t < workorderdata.length; t++) {
                    bomData =  JSON.parse(workorderdata[t].fields.BOMStructure);           
                    
                    let bomdetails = JSON.parse(bomData.Details);
    
                    for(let i = 0; i < bomdetails.length; i++) {
                        
                        if(bomdetails[i].process != '' ){
                            tempData = {
                                EmpId : workorderdata[t].fields.EmployeeId || i,
                                EmpName: workorderdata[t].fields.EmployeeName || 'Dene Mill',
                                ProcessDate: workorderdata[t].fields.DueDate != '' ? moment(workorderdata[t].fields.DueDate).format("DD/MM/YYYY") : workorderdata[t].fields.DueDate || '',
                                WorkorderID: workorderdata[t].fields.ID || '',
                                Process: bomdetails[i].process || '',
                                Product: workorderdata[t].fields.ProductName || '',
                                ClockedTime : bomdetails[i].ClockedTime || 0,
                                Note : workorderdata[t].fields.Note || '',
                                Status: workorderdata[t].fields.Status || ''                  
                
                            };
            
                            ProcessClockList.push(tempData);
    
                        }
                        
                    }           
                }
    
                addVS1Data('TVS1ProcessClockList', JSON.stringify({tvs1processclocklist: ProcessClockList})).then(function(datareturn){
                }).catch(function(err){
                    
                });
    
    
    
                
            }
        }).catch(async function (err) {
            let workOrderList = manufacturingService.getWorkOrderList();
    
                addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workOrderList})).then(function(datareturn){
                        
                }).catch(function(err){
                });
    
                let ProcessClockList = new Array();
                let workorderdata = workOrderList;
                let bomData;
                let tempData;
    
                for (let t = 0; t < workorderdata.length; t++) {
                    bomData =  JSON.parse(workorderdata[t].fields.BOMStructure);           
                    
                    let bomdetails = JSON.parse(bomData.Details);
    
                    for(let i = 0; i < bomdetails.length; i++) {
                        
                        if(bomdetails[i].process != '' ){
                            tempData = {
                                EmpId : workorderdata[t].fields.EmployeeId || i,
                                EmpName: workorderdata[t].fields.EmployeeName || 'Dene Mill',
                                Date: workorderdata[t].fields.DueDate != '' ? moment(workorderdata[t].fields.DueDate).format("DD/MM/YYYY") : workorderdata[t].fields.DueDate || '',
                                WorkorderID: workorderdata[t].fields.ID || '',
                                Process: bomdetails[i].process || '',
                                Product: workorderdata[t].fields.ProductName || '',
                                ClockedTime : bomdetails[i].ClockedTime || 0,
                                Note : workorderdata[t].fields.Note || '',
                                Status: workorderdata[t].fields.Status || ''                  
                
                            };
            
                            ProcessClockList.push(tempData);
    
                        }
                        
                    }           
                }
    
                addVS1Data('TVS1ProcessClockList', JSON.stringify({tvs1processclocklist: ProcessClockList})).then(function(datareturn){
                }).catch(function(err){
                });
        });
    

    }

    templateObject.getProcessClockedList();


    
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

    
    if (launchClockOnOff == true && canClockOnClockOff == true) {
        setTimeout(function() {
            $("#btnClockOnOff").trigger("click");
        }, 500);
    }
 

    Meteor.call('readPrefMethod', localStorage.getItem('mycloudLogonID'), 'tblProcessClockList', function(error, result) {
        if (error) {} else {
            if (result) {

                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;

                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

                }
            }

        }
    });

    function MakeNegative() {
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0)
                $(this).addClass('text-danger')
        });
    }; 


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

Template.process_clock_template.events({
   
    'click .exportbtn': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblProcessClockList_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .exportbtnExcel': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblProcessClockList_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .printConfirm': function (event) {
        playPrintAudio();
        setTimeout(function(){
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblProcessClockList_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    }, delayTimeAfterSound);
    },
    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        templateObject.getProcessClockedList();
        setTimeout(function () {
            window.open('/process_clock_list','_self');
            
        }, 2000);

    },
    'click .templateDownload': function () {
        let utilityService = new UtilityService();
        let rows = [];
        const filename = 'SampleCustomer' + '.csv';
        rows[0] = ['Company', 'First Name', 'Last Name', 'Phone', 'Mobile', 'Email', 'Skype', 'Street', 'Street2', 'State', 'Post Code', 'Country'];
        rows[1] = ['ABC Company', 'John', 'Smith', '9995551213', '9995551213', 'johnsmith@email.com', 'johnsmith', '123 Main Street', 'Main Street', 'New York', '1234', 'United States'];
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
    'click .btnImport': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let contactService = new ContactService();
        let objDetails;
        Papa.parse(templateObject.selectedFile.get(), {
            complete: function (results) {

                if (results.data.length > 0) {
                    if ((results.data[0][0] == "Company") && (results.data[0][1] == "First Name")
                        && (results.data[0][2] == "Last Name") && (results.data[0][3] == "Phone")
                        && (results.data[0][4] == "Mobile") && (results.data[0][5] == "Email")
                        && (results.data[0][6] == "Skype") && (results.data[0][7] == "Street")
                        && (results.data[0][8] == "Street2") && (results.data[0][9] == "State")
                        && (results.data[0][10] == "Post Code") && (results.data[0][11] == "Country")) {

                        let dataLength = results.data.length * 500;
                        setTimeout(function () {
                            // $('#importModal').modal('toggle');
                            Meteor._reload.reload();
                        }, parseInt(dataLength));

                        for (let i = 0; i < results.data.length - 1; i++) {
                            objDetails = {
                                type: "TCustomer",
                                fields:
                                {
                                    ClientName: results.data[i + 1][0],
                                    FirstName: results.data[i + 1][1],
                                    LastName: results.data[i + 1][2],
                                    Phone: results.data[i + 1][3],
                                    Mobile: results.data[i + 1][4],
                                    Email: results.data[i + 1][5],
                                    SkypeName: results.data[i + 1][6],
                                    Street: results.data[i + 1][7],
                                    Street2: results.data[i + 1][8],
                                    State: results.data[i + 1][9],
                                    PostCode: results.data[i + 1][10],
                                    Country: results.data[i + 1][11],

                                    BillStreet: results.data[i + 1][7],
                                    BillStreet2: results.data[i + 1][8],
                                    BillState: results.data[i + 1][9],
                                    BillPostCode: results.data[i + 1][10],
                                    Billcountry: results.data[i + 1][11],
                                    PublishOnVS1: true
                                }
                            };
                            if (results.data[i + 1][1]) {
                                if (results.data[i + 1][1] !== "") {
                                    contactService.saveCustomer(objDetails).then(function (data) {
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

    
     
    'click #btnGroupClockOnOff': function(event) {
        $('#groupclockonoff').modal('show');
    },

    
    'click .btnGroupClockSave': async function(event) {

        $('.fullScreenSpin').css('display', 'inline-block');

        templateObject = Template.instance();
        let contactService = new ContactService();
       
        let type = "Clockon";
        if ($('#break').is(":checked")) {
            type = $('#break').val();
        } else if ($('#lunch').is(":checked")) {
            type = $('#lunch').val();
        } else if ($('#clockonswitch').is(":checked")) {
            type = $('#clockonswitch').val();
        } else if ($('#clockoffswitch').is(":checked")) {
            type = $('#clockoffswitch').val();
        }else {
            swal({
                title: 'Please Select Option',
                text: 'Please select Clockon, Break, Lunch or ClockOff Option',
                type: 'info',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((results) => {
                if (results.value) {} else if (results.dismiss === 'cancel') {}
            });
            $('.fullScreenSpin').css('display', 'none');
            return false;
        }

        let groups = [];

        $("#tblProcessClockList tr").each(function() {
            
            // If the checkbox is checked, add its value to the corresponding group
            if ($(this).find("input[type='checkbox']").is(":checked")) {
                var empName = $(this).closest("tr").find("td:eq(2)").text();
                var empId = $(this).closest("tr").find("td:eq(1)").text();
                var workorderId = $(this).closest("tr").find("td:eq(4)").text();
                var processName = $(this).closest("tr").find("td:eq(5)").text();
                
               // var clockedTime = $(this).closest("tr").find("td:eq(8)").text();
                var pauseTime ;
                if(type == "Lunch") {
                    pauseTime = -45/60;
                } else if(type == "Break" ) {
                    pauseTime = -15/40 ;
                } else {
                    pauseTime = 0;
                }
               var temp = {EmpId:empId,  EmpName: empName,workorderId:workorderId, processName:processName, PauseTime: pauseTime} ;
                groups.push(temp);
            }
        });


        let workorders = await Template.instance().workOrderRecords.get();
        
        for(let i=0 ; i < groups.length; i++) {
            let workorderindex = workorders.findIndex(order => {
                return order.fields.ID == groups[i].workorderId;
            });
            let processName = groups[i].processName;
            let pauseTime = groups[i].PauseTime;

            if(workorderindex > -1) {
                currentworkorder = workorders[workorderindex];
                let tempworkorder = cloneDeep(currentworkorder);

                let bomStructureData = JSON.parse(currentworkorder.fields.BOMStructure);
                let bomDetailData = JSON.parse(bomStructureData.Details);
                

                for (let j = 0; j < bomDetailData.length; j++) {
                    if(bomDetailData[j].process == processName) {
                        bomDetailData[j].ClockedTime += pauseTime;  
                    }
                    
                }

                bomStructureData.Details = JSON.stringify(bomDetailData);
                tempworkorder.fields = {...tempworkorder.fields, BOMStructure: JSON.stringify(bomStructureData) };
                workorders.splice(workorderindex, 1, tempworkorder);

            }
        }

        addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workorders})).then(function(){

            $('.fullScreenSpin').css('display', 'none')
            swal('The Group Clock On/Off is saved', '', 'success');
            $('#groupclockonoff').modal('toggle');
        })           

    },

    'change #clockonswitch': function(event) {
        $('#break').prop('checked', false);
        $('#lunch').prop('checked', false);
        $('#clockoffswitch').prop('checked', false);
    },

    'change #clockoffswitch': function(event) {
        $('#break').prop('checked', false);
        $('#lunch').prop('checked', false);
        $('#clockonswitch').prop('checked', false);
    },
    
    'change #lunch': function(event) {
        $('#break').prop('checked', false);
        $('#clockoffswitch').prop('checked', false);
        $('#clockonswitch').prop('checked', false);
    },

    'change #break': function(event) {
        $('#lunch').prop('checked', false);
        $('#clockoffswitch').prop('checked', false);
        $('#clockonswitch').prop('checked', false);
    }, 

});


Template.process_clock_template.helpers({
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
        return sideBarService.getAllJobssDataVS1;
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
        return ["limitCount", "limitFrom", "deleteFilter"];
    },
});
