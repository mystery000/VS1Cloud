import {UtilityService} from "../../utility-service";

Template.reconImportModal.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.selectedFile = new ReactiveVar();
});

Template.reconImportModal.onRendered(function () {
  const templateObject = Template.instance();
});

Template.reconImportModal.events({
  'click .templateDownload': function (e) {
    e.preventDefault();  //stop the browser from following
    window.location.href = 'sample_imports/SampleBankRecon.csv';
  },
  'click .btnUploadFile':function(event){
    $('#attachment-upload').val('');
    $('.file-name').text('');
    //$(".btnImport").removeAttr("disabled");
    $('#attachment-upload').trigger('click');

  },
  'click .templateDownloadXLSX': function (e) {
    e.preventDefault();  //stop the browser from following
    window.location.href = 'sample_imports/SampleBankRecon.xlsx';
  },
  'change #attachment-upload': function (e) {
    let templateObj = Template.instance();
    var filename = $('#attachment-upload')[0].files[0]['name'];
    var fileExtension = filename.split('.').pop().toLowerCase();
    var validExtensions = ["csv","txt","xlsx"];
    var validCSVExtensions = ["csv","txt"];
    var validExcelExtensions = ["xlsx","xls"];
    if (validExtensions.indexOf(fileExtension) == -1) {
      // Bert.alert('<strong>formats allowed are : '+ validExtensions.join(', ')+'</strong>!', 'danger');
      swal('Invalid Format', 'formats allowed are :' + validExtensions.join(', '), 'error');
      $('.file-name').text('');
      $(".btnImport").Attr("disabled");
    }else if(validCSVExtensions.indexOf(fileExtension) != -1){
      $('.file-name').text(filename);
      let selectedFile = event.target.files[0];
      templateObj.selectedFile.set(selectedFile);
      if($('.file-name').text() != ""){
          $(".btnImport").removeAttr("disabled");
      }else{
          $(".btnImport").Attr("disabled");
      }
    }else if(fileExtension == 'xlsx'){
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
          var workbook = XLSX.read(data, {type: 'array'});

          var result = {};
          workbook.SheetNames.forEach(function (sheetName) {
              var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
              var sCSV = XLSX.utils.make_csv(workbook.Sheets[sheetName]);
              templateObj.selectedFile.set(sCSV);

              if (roa.length) result[sheetName] = roa;
          });
          // see the result, caution: it works after reader event is done.

      };
      reader.readAsArrayBuffer(oFile);

      if($('.file-name').text() != ""){
          $(".btnImport").removeAttr("disabled");
      }else{
          $(".btnImport").Attr("disabled");
      }
    }
  },
  'click .btnImport' : function () {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    // let contactService = new ContactService();
    let objDetails;
    let firstName= '';
    let lastName = '';
    let taxCode = '';

    Papa.parse(templateObject.selectedFile.get(), {
        complete: function(results) {
            if(results.data.length > 0){
                if((results.data[0][0] == "Company") && (results.data[0][1] == "First Name")
                   && (results.data[0][2] == "Last Name") && (results.data[0][3] == "Phone")
                   && (results.data[0][4] == "Mobile") && (results.data[0][5] == "Email")
                   && (results.data[0][6] == "Skype") && (results.data[0][7] == "Street")
                   && (results.data[0][8] == "Street2" || results.data[0][8] == "City/Suburb") && (results.data[0][9] == "State")
                   && (results.data[0][10] == "Post Code") && (results.data[0][11] == "Country")) {

                    let dataLength = results.data.length * 500;
                    setTimeout(function(){
                      window.open('/customerlist?success=true','_self');
                      $('.fullScreenSpin').css('display','none');
                    },parseInt(dataLength));

                    for (let i = 0; i < results.data.length -1; i++) {
                      firstName = results.data[i+1][1] !== undefined? results.data[i+1][1] :'';
                      lastName = results.data[i+1][2]!== undefined? results.data[i+1][2] :'';
                      taxCode = results.data[i+1][12]!== undefined? results.data[i+1][12] :'NT';
                        objDetails = {
                            type: "TCustomer",
                            fields:
                            {
                                ClientName: results.data[i+1][0]||'',
                                FirstName: firstName || '',
                                LastName: lastName|| '',
                                Phone: results.data[i+1][3]||'',
                                Mobile: results.data[i+1][4]||'',
                                Email: results.data[i+1][5]||'',
                                SkypeName: results.data[i+1][6]||'',
                                Street: results.data[i+1][7]||'',
                                Street2: results.data[i+1][8]||'',
                                Suburb: results.data[i+1][8]||'',
                                State: results.data[i+1][9]||'',
                                PostCode:results.data[i+1][10]||'',
                                Country:results.data[i+1][11]||'',

                                BillStreet: results.data[i+1][7]||'',
                                BillStreet2: results.data[i+1][8]||'',
                                BillState: results.data[i+1][9]||'',
                                BillPostCode:results.data[i+1][10]||'',
                                Billcountry:results.data[i+1][11]||'',
                                TaxCodeName:taxCode||'NT',
                                PublishOnVS1: true
                            }
                        };
                        if(results.data[i+1][0]){
                            if(results.data[i+1][0] !== "") {
                                // contactService.saveCustomer(objDetails).then(function (data) {
                                //     //$('.fullScreenSpin').css('display','none');
                                //     //Meteor._reload.reload();
                                // }).catch(function (err) {
                                //     //$('.fullScreenSpin').css('display','none');
                                //     swal({
                                //         title: 'Oooops...',
                                //         text: err,
                                //         type: 'error',
                                //         showCancelButton: false,
                                //         confirmButtonText: 'Try Again'
                                //     }).then((result) => {
                                //         if (result.value) {
                                //             window.open('/customerlist?success=true','_self');
                                //         } else if (result.dismiss === 'cancel') {
                                //           window.open('/customerlist?success=true','_self');
                                //         }
                                //     });
                                // });
                            }
                        }
                    }

                }else{
                    $('.fullScreenSpin').css('display','none');
                    // Bert.alert('<strong> Data Mapping fields invalid. </strong> Please check that you are importing the correct file with the correct column headers.', 'danger');
                    swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                }
            }else{
                $('.fullScreenSpin').css('display','none');
                // Bert.alert('<strong> Data Mapping fields invalid. </strong> Please check that you are importing the correct file with the correct column headers.', 'danger');
                swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
            }

        }
    });
  }
});

Template.reconImportModal.helpers({

});
