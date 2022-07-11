import { OrganisationService } from "../../js/organisation-service";
import { CountryService } from "../../js/country-service";
import { ReactiveVar } from "meteor/reactive-var";
import { SideBarService } from "../../js/sidebar-service";
import "../../lib/global/indexdbstorage.js";
let sideBarService = new SideBarService();
let organisationService = new OrganisationService();

var template_list = [
  "Bills",
  "Credits",
  "Customer Payments",
  "Customer Statements",
  "Invoices",
  "Invoice Back Orders",
  "Purchase Orders",
  "Quotes",
  "Refunds",
  "Sales Orders",
  "Supplier Payments",
  "Statements",
  "Delivery Docket",
];

var modal_data = [];

Template.templatesettings.onCreated(() => {

      let templateObject = Template.instance();
      templateObject.invoice_data = new ReactiveVar([]);
});

Template.templatesettings.onRendered(function () {
      let templateObject = Template.instance();

      $(document).on("click", ".templateItem .btnPreviewTemplate", function(e) {

        title = $(this).parent().attr("data-id");
        number =  $(this).parent().attr("data-template-id");//e.getAttribute("data-template-id");
        templateObject.generateInvoiceData(title,number);

      });


      templateObject.getTemplateInfo = function() {

             getVS1Data('TemplateSettings').then(function(dataObject) {

              let data = JSON.parse(dataObject[0].data);
              let useData = data;
              let lineItems = [];
              let lineItemObj = {};


              if(data.fields)
              {
                  var bill = data.fields.bill;
                  var credits = data.fields.credits;
                  var customer_payment = data.fields.customer_payment;
                  var invoices = data.fields.invoices;
                  var invoices_back_order = data.fields.invoices_back_order;
                  var purchase_orderbill = data.fields.purchase_order;
                  var quotes = data.fields.quotes;
                  var refunds = data.fields.refunds;
                  var sales_orders = data.fields.sales_orders;
                  var supplier_payments = data.fields.supplier_payments;
                  var statements = data.fields.statements;
                  var customer_statement =  data.fields.customer_statement;
                  var delivery_docket = data.fields.delivery_docket;
                  $('#Bills_'+bill).attr("checked", "checked");
                  $('#Credits_'+credits).attr("checked", "checked");
                  $("[id='Customer Payments_"+customer_payment+"']").attr("checked", "checked");
                  $('#Invoices_'+invoices).attr("checked", "checked");
                  $("[id='Invoice Back Orders_"+invoices_back_order+"']").attr("checked", "checked");
                  $("[id='Purchase Orders_"+purchase_orderbill+"']").attr("checked", "checked");
                  $('#Quotes_'+quotes).attr("checked", "checked");
                  $('#Refunds_'+refunds).attr("checked", "checked");
                  $("[id='Sales Orders_"+sales_orders+"']").attr("checked", "checked");
                  $("[id='Supplier Payments_"+supplier_payments+"']").attr("checked", "checked");
                  $('#Statements_'+statements).attr("checked", "checked");
                  $("[id='Delivery Docket_"+delivery_docket+"']").attr("checked", "checked");
                  $("[id='Customer Statements_"+customer_statement+"']").attr("checked", "checked");

              }


        });


      };


      templateObject.getTemplateInfo();

      $("#templatePreviewModal").on("shown.bs.modal", function () {
        const data = templateObject.invoice_data.get();
        // Session.set("template",data)
      });

  //save template fields in the localstorage
      function saveTemplateFields(key, value){
        localStorage.setItem(key, value)
      }


  //update template with invoice type
    function updateTemplate(object_invoce) {

      $("#templatePreviewModal").modal("toggle");
      if (object_invoce.length > 0) {
        $('#templatePreviewModal #printcomment').text(object_invoce[0]["comment"]);
        $("#templatePreviewModal .o_url").text(object_invoce[0]["o_url"]);
        $("#templatePreviewModal .o_name").text(object_invoce[0]["o_name"]);
        $("#templatePreviewModal .o_address1").text(
          object_invoce[0]["o_address"]
        );
        $("#templatePreviewModal .o_city").text(object_invoce[0]["o_city"]);
        $("#templatePreviewModal .o_state").text(object_invoce[0]["o_state"]);
        $("#templatePreviewModal .o_reg").text(object_invoce[0]["o_reg"]);
        $("#templatePreviewModal .o_abn").text(object_invoce[0]["o_abn"]);
        $("#templatePreviewModal .o_phone").text(object_invoce[0]["o_phone"]);

        if(object_invoce[0]["applied"] == ""){
          $("#templatePreviewModal .applied").hide()
          $("#templatePreviewModal .applied").text(object_invoce[0]["applied"]);
        }else{
          $("#templatePreviewModal .applied").show()
          $("#templatePreviewModal .applied").text("Applied : " +  object_invoce[0]["applied"]);
        }



        if(object_invoce[0]["supplier_type"] == ""){
          $("#templatePreviewModal .customer").hide()
        }else{
          $("#templatePreviewModal .customer").show()
        }
        $("#templatePreviewModal .customer").empty();
        $("#templatePreviewModal .customer").append(object_invoce[0]["supplier_type"]);

        if(object_invoce[0]["supplier_name"] == ""){
          $("#templatePreviewModal .pdfCustomerName").hide()
        }else{
          $("#templatePreviewModal .pdfCustomerName").show()
        }
        $("#templatePreviewModal .pdfCustomerName").empty();
        $("#templatePreviewModal .pdfCustomerName").append(object_invoce[0]["supplier_name"]);

        if(object_invoce[0]["supplier_addr"] == ""){
          $("#templatePreviewModal .pdfCustomerAddress").hide()
        }else{
          $("#templatePreviewModal .pdfCustomerAddress").show()
        }
        $("#templatePreviewModal .pdfCustomerAddress").empty();
        $("#templatePreviewModal .pdfCustomerAddress").append(object_invoce[0]["supplier_addr"]);


        $("#templatePreviewModal .print-header").text(object_invoce[0]["title"]);
        $("#templatePreviewModal .modal-title").text(
          object_invoce[0]["title"] + " " +object_invoce[0]["value"]+ " template"
        );

        if(object_invoce[0]["value"]=="")
        {
            $('.print-header-value').text('');

        }
        else{
           $('.print-header-value').text(object_invoce[0]["value"]);
        }

        if(object_invoce[0]["bsb"]=="")
        {
            $('#templatePreviewModal .field_payment').hide();

        }
        else{

            $('#templatePreviewModal .field_payment').show();
        }


        $("#templatePreviewModal .bsb").text( "BSB (Branch Number) : " + object_invoce[0]["bsb"]);
        $("#templatePreviewModal .account_number").text( "Account Number : " + object_invoce[0]["account"]);
        $("#templatePreviewModal .swift").text("Swift Code : " + object_invoce[0]["swift"]);


        if(object_invoce[0]["date"] == ""){
          $("#templatePreviewModal .dateNumber").hide();
        }else{
          $("#templatePreviewModal .dateNumber").show();
        }

        $("#templatePreviewModal .date").text(object_invoce[0]["date"]);

        if(object_invoce[0]["pqnumber"] == ""){
          $("#templatePreviewModal .pdfPONumber").hide();
        }else{
          $("#templatePreviewModal .pdfPONumber").show();
        }

        $("#templatePreviewModal .po").text(object_invoce[0]["pqnumber"]);

        if(object_invoce[0]["invoicenumber"] == ""){
          $("#templatePreviewModal .invoiceNumber").hide();
        }else{
          $("#templatePreviewModal .invoiceNumber").show();
        }
        $("#templatePreviewModal .io").text(object_invoce[0]["invoicenumber"]);

        if(object_invoce[0]["refnumber"] == ""){
          $("#templatePreviewModal .refNumber").hide();
        }else{
          $("#templatePreviewModal .refNumber").show();
        }
        $("#templatePreviewModal .ro").text(object_invoce[0]["refnumber"]);

        if(object_invoce[0]["duedate"] == ""){
          $("#templatePreviewModal .pdfTerms").hide();
        }else{
          $("#templatePreviewModal .pdfTerms").show();
        }
        $("#templatePreviewModal .due").text(object_invoce[0]["duedate"]);

        if (object_invoce[0]["paylink"] == "") {
              $("#templatePreviewModal .link").hide();
              $("#templatePreviewModal .linkText").hide();
        } else {
              $("#templatePreviewModal .link").show();
              $("#templatePreviewModal .linkText").show();
        }

        if (object_invoce[0]["showFX"] == "") {
              $("#templatePreviewModal .showFx").hide();
              $("#templatePreviewModal .showFxValue").hide();
       } else {
              $("#templatePreviewModal .showFx").show();
              $("#templatePreviewModal .showFxValue").show();
              $("#templatePreviewModal .showFxValue").text(object_invoce[0]["showFX"]);
       }


        if(object_invoce[0]["customfield1"] == "NA")
        {
                $('#customfieldtablenew').css('display', 'none');
                $('#customdatatablenew').css('display', 'none');
                $('#templatePreviewModal .customfield1').text('');
                $('#templatePreviewModal .customfield2').text('');
                $('#templatePreviewModal .customfield3').text('');


                $('#templatePreviewModal .customfield1data').text('');
                $('#templatePreviewModal .customfield2data').text('');
                $('#templatePreviewModal .customfield3data').text('');

        }
        else
        {
              $('#customfieldtablenew').css('display', 'block');
              $('#customdatatablenew').css('display', 'block');

              $('#templatePreviewModal .customfield1').text(object_invoce[0]["customfieldlabel1"]);
              $('#templatePreviewModal .customfield2').text(object_invoce[0]["customfieldlabel2"]);
              $('#templatePreviewModal .customfield3').text(object_invoce[0]["customfieldlabel3"]);

              if(object_invoce[0]["customfield1"] == '' || object_invoce[0]["customfield1"] == 0)
              {
                $('#templatePreviewModal .customfield1data').text('');
              }
              else
              {
                $('#templatePreviewModal .customfield1data').text(object_invoce[0]["customfield1"]);
              }

              if(object_invoce[0]["customfield2"] == '' || object_invoce[0]["customfield2"] == 0)
              {
                $('#templatePreviewModal .customfield2data').text('');
              }
              else
              {
                $('#templatePreviewModal .customfield2data').text( object_invoce[0]["customfield2"]);
              }

              if(object_invoce[0]["customfield3"] == '' || object_invoce[0]["customfield3"] == 0)
              {
                $('#templatePreviewModal .customfield3data').text('');
              }
              else
              {
                $('#templatePreviewModal .customfield3data').text( object_invoce[0]["customfield3"]);
              }



        }

        if(object_invoce[0]["customfield1"] == "NA")
        {
              $('#customfieldlable').css('display', 'none');
              $('#customfieldlabledata').css('display', 'none');
        }
        else
        {
              $('#customfieldlable').css('display', 'block');
              $('#customfieldlabledata').css('display', 'block');
        }

      //   table header
        var tbl_header = $("#templatePreviewModal .tbl_header")
        tbl_header.empty()
        for(const [key , value] of Object.entries(object_invoce[0]["fields"])){

              tbl_header.append("<th style='width:" + value + "%'; color: rgb(0 0 0);'>" + key + "</th>")
        }
      }

      // table content
       var tbl_content = $("#templatePreviewModal .tbl_content")
       tbl_content.empty()
       const data = object_invoce[0]["data"]

       for(item of data){
          tbl_content.append("<tr style='border-bottom: 1px solid rgba(0, 0, 0, .1);'>")
          var content = ""
           for(item_temp of item){
              content = content + "<td>" + item_temp + "</td>"
           }
           tbl_content.append(content)
           tbl_content.append("</tr>")
       }

      // total amount

      if(object_invoce[0]["subtotal"] == "")
      {
          $("#templatePreviewModal .field_amount").hide();
      }
      else
      {
          $("#templatePreviewModal .field_amount").show();
          if(object_invoce[0]["subtotal"] != ""){
            $('#templatePreviewModal #subtotal_total').text("Sub total");
            $("#templatePreviewModal #subtotal_totalPrint").text(object_invoce[0]["subtotal"]);
          }
          if(object_invoce[0]["gst"] != ""){


              $('#templatePreviewModal #grandTotal').text("Grand total");
              $("#templatePreviewModal #totalTax_totalPrint").text(object_invoce[0]["gst"]);
          }

          if(object_invoce[0]["total"] != ""){
              $("#templatePreviewModal #grandTotalPrint").text(object_invoce[0]["total"]);
          }

          if(object_invoce[0]["bal_due"] != ""){
              $("#templatePreviewModal #totalBalanceDuePrint").text(object_invoce[0]["bal_due"]);
          }

          if(object_invoce[0]["paid_amount"] != ""){
              $("#templatePreviewModal #paid_amount").text(object_invoce[0]["paid_amount"]);
          }

      }



    }

  // show bill data with dummy data
    function showBillData(template_title,number) {
      object_invoce = [];
      var array_data = [];
      array_data.push([
        "Accumlated Depreciation",
        "Accumlated Depreciation",
        "$0.00",
        "$900.00",
      ]);

      let item = '';


      if(number == 1)
      {


            item = {
              o_url: "vs1cloud.com",
              o_name: "Sample Company",
              o_address: "123 street",
              o_city: "Los Angeles",
              o_state: "Califonia 12345",
              o_reg: "",
              o_abn: "ABN : 5678905",
              o_phone: "Phone : 25151944",
              title: 'Bill',
              value:'751',
              date: "30 / 03 / 2022",
              invoicenumber:'751',
              refnumber: "",
              pqnumber: "",
              duedate:"",
              paylink: "",
              supplier_type: "Supplier",
              supplier_name : "Amar kumar",
              supplier_addr : "Antri, Gwalior, Madhya Pradesh",
              fields: {"Account Name" : "30", "Memo" : "30", "Tax" : "20", "Amount" : "20"},
              subtotal : "$900.00",
              gst : "$0.00",
              total : "$900.00",
              paid_amount : "$900.00",
              bal_due : "$0.00",
              bsb : "",
              account : "",
              swift : "",
              applied : "",
              data: array_data,
              customfield1:'NA',
              customfield2:'NA',
              customfield3:'NA',
              customfieldlabel1:'NA',
              customfieldlabel2:'NA',
              customfieldlabel3:'NA',
              showFX:"",
              comment:"Bill Template Preivew",
            };

      }
      else if(number == 2)
      {
            item = {
              o_url: "vs1cloud.com",
              o_name: "Sample Company",
              o_address: "123 street",
              o_city: "Los Angeles",
              o_state: "Califonia 12345",
              o_reg: "",
              o_abn: "ABN : 5678905",
              o_phone: "Phone : 25151944",
              title: 'Bill',
              value:'751',
              date: "30 / 03 / 2022",
              invoicenumber:'751',
              refnumber: "",
              pqnumber: "",
              duedate:"",
              paylink: "",
              supplier_type: "Supplier",
              supplier_name : "Amar kumar",
              supplier_addr : "Antri, Gwalior, Madhya Pradesh",
              fields: {"Account Name" : "30", "Memo" : "30", "Tax" : "20", "Amount" : "20"},
              subtotal : "$900.00",
              gst : "$0.00",
              total : "$900.00",
              paid_amount : "$900.00",
              bal_due : "$0.00",
              bsb : "",
              account : "",
              swift : "",
              applied : "",
              data: array_data,
              customfield1:'customfield1 data',
              customfield2:'customfield2 data',
              customfield3:'customfield3 data',
              customfieldlabel1:'customfield1',
              customfieldlabel2:'customfield2',
              customfieldlabel3:'customfield3',
              showFX:'',
              comment:"Bill Template Preivew",
            };
      }
      else{


        item = {
          o_url: "vs1cloud.com",
          o_name: "Sample Company",
          o_address: "123 street",
          o_city: "Los Angeles",
          o_state: "Califonia 12345",
          o_reg: "",
          o_abn: "ABN : 5678905",
          o_phone: "Phone : 25151944",
          title: 'Bill',
          value:'751',
          date: "30 / 03 / 2022",
          invoicenumber:'751',
          refnumber: "",
          pqnumber: "",
          duedate:"",
          paylink: "",
          supplier_type: "Supplier",
          supplier_name : "Amar kumar",
          supplier_addr : "Antri, Gwalior, Madhya Pradesh",
          fields: {"Account Name" : "30", "Memo" : "30", "Tax" : "20", "Amount" : "20"},
          subtotal : "$900.00",
          gst : "$0.00",
          total : "$900.00",
          paid_amount : "$900.00",
          bal_due : "$0.00",
          bsb : "",
          account : "",
          swift : "",
          applied : "",
          data: array_data,
          customfield1:'customfield1 data',
          customfield2:'customfield2 data',
          customfield3:'customfield3 data',
          customfieldlabel1:'customfield1',
          customfieldlabel2:'customfield2',
          customfieldlabel3:'customfield3',
          showFX:'AUD',
          comment:"Bill Template Preivew",

        };




      }

      object_invoce.push(item);
      $("#templatePreviewModal .field_payment").hide();
      $("#templatePreviewModal .field_amount").show();
      updateTemplate(object_invoce);

      saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
    }

  //show credit data with dummy data
    function showCreditData(template_title,number) {
      object_invoce = [];
      var array_data = [];
      array_data.push([
        "Coghlin Tools Loan",
        "Advance to purchase tools",
        "$0.00",
        "$55.00",
      ]);
      array_data.push([
        "Bank Charges",
        "Bank Charges and Fees",
        "$0.00",
        "$70.00",
      ]);

      let item_credits = '';

      if(number == 1)
      {
        item_credits = {
          o_url: "vs1cloud.com",
          o_name: "Sample Company",
          o_address: "123 street",
          o_city: "Los Angeles",
          o_state: "Califonia 12345",
          o_reg: "",
          o_abn: "ABN : 5678905",
          o_phone: "Phone : 25151944",
          title: 'Credit',
          value: "751",
          date: "17/03/2022",
          invoicenumber: "17/03/2022",
          refnumber: "",
          pqnumber: "",
          duedate: "",
          paylink: "",
          supplier_type: "Supplier",
          supplier_name : "<p>The interesting <br>Company</p>",
          supplier_addr : "<p>123 Street <br> PE Eastern 5115 <br> Australia</p>",
          fields: {"Account Name" : "30", "Memo" : "30", "Tax" : "20", "Amount" : "20"},
          subtotal : "$125.00",
          gst : "$0.00",
          total : "$125.00",
          paid_amount : "$0.00",
          bal_due : "$125.00",
          bsb : "",
          account : "",
          swift : "",
          data: array_data,
          applied : "",
          customfield1:'NA',
          customfield2:'NA',
          customfield3:'NA',
          customfieldlabel1:'NA',
          customfieldlabel2:'NA',
          customfieldlabel3:'NA',
          applied : "",
          showFX:"",
          comment:"Credit Template Preview",
        };

      }
      else if(number == 2)
      {
          item_credits = {
            o_url: "vs1cloud.com",
            o_name: "Sample Company",
            o_address: "123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg: "",
            o_abn: "ABN : 5678905",
            o_phone: "Phone : 25151944",
            title: 'Credit',
            value: "751",
            date: "17/03/2022",
            invoicenumber: "17/03/2022",
            refnumber: "",
            pqnumber: "",
            duedate: "",
            paylink: "",
            supplier_type: "Supplier",
            supplier_name : "<p>The interesting <br>Company</p>",
            supplier_addr : "<p>123 Street <br> PE Eastern 5115 <br> Australia</p>",
            fields: {"Account Name" : "30", "Memo" : "30", "Tax" : "20", "Amount" : "20"},
            subtotal : "$125.00",
            gst : "$0.00",
            total : "$125.00",
            paid_amount : "$0.00",
            bal_due : "$125.00",
            bsb : "",
            account : "",
            swift : "",
            data: array_data,
            applied : "",
            customfield1:'customfield1 data',
            customfield2:'customfield2 data',
            customfield3:'customfield3 data',
            customfieldlabel1:'customfield1',
            customfieldlabel2:'customfield2',
            customfieldlabel3:'customfield3',
            showFX:'',
            comment:"Credit Template Preview",
          };

      }
      else
      {

        item_credits = {
          o_url: "vs1cloud.com",
          o_name: "Sample Company",
          o_address: "123 street",
          o_city: "Los Angeles",
          o_state: "Califonia 12345",
          o_reg: "",
          o_abn: "ABN : 5678905",
          o_phone: "Phone : 25151944",
          title: 'Credit',
          value: "751",
          invoicenumber: "17/03/2022",
          date: "17/03/2022",
          refnumber: "",
          pqnumber: "",
          duedate: "",
          paylink: "",
          supplier_type: "Supplier",
          supplier_name : "<p>The interesting <br>Company</p>",
          supplier_addr : "<p>123 Street <br> PE Eastern 5115 <br> Australia</p>",
          fields: {"Account Name" : "30", "Memo" : "30", "Tax" : "20", "Amount" : "20"},
          subtotal : "$125.00",
          gst : "$0.00",
          total : "$125.00",
          paid_amount : "$0.00",
          bal_due : "$125.00",
          bsb : "",
          account : "",
          swift : "",
          data: array_data,
          applied : "",
          customfield1:'customfield1 data',
          customfield2:'customfield2 data',
          customfield3:'customfield3 data',
          customfieldlabel1:'customfield1',
          customfieldlabel2:'customfield2',
          customfieldlabel3:'customfield3',
          showFX:'AUD',
          comment:"Credit Template Preview",
        };


      }


      object_invoce.push(item_credits);

      $("#templatePreviewModal .field_payment").hide();
      $("#templatePreviewModal .field_amount").show();

      updateTemplate(object_invoce);
      saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])

    }

  //show customer payment info with DummyData
    function showCustomerPayment(template_title,number) {
      object_invoce = [];
      var array_data = [];
      array_data.push([
        "13/12/2021",
        "invoice",
        "710",
        "$50.00",
        "$50.00",
        "$50.00",
        "$0.00",
      ]);

      let item_payments = '';
      if(number == 1)
      {
            item_payments = {
              o_url: "vs1cloud.com",
              o_name: "Sample Company",
              o_address: "123 street",
              o_city: "Los Angeles",
              o_state: "Califonia 12345",
              o_reg: "",
              o_abn: "ABN : 5678905",
              o_phone: "Phone : 25151944",
              title: template_title,
              value: "786",
              date: "14/04/2022",
              invoicenumber: "",
              refnumber: "5677",
              pqnumber: "",
              duedate: "",
              paylink: "",
              supplier_type: "Customer",
              supplier_name : "<p>Brand New <br> Company </p>",
              supplier_addr : "<p> JHB <br> GA1515 <br> Australia",
              fields: {"Date" : "20", "Type" : "10", "Trans" : "10", "Original" : "20", "Due" : "10" , "Paid" : "10", "Outstanding" : "20"},
              subtotal : "",
              gst : "",
              total : "",
              paid_amount : "",
              bal_due : "",
              bsb : '',
              account : '',
              swift : '',
              data: array_data,
              applied : "$50.00",
              customfield1:'NA',
              customfield2:'NA',
              customfield3:'NA',
              customfieldlabel1:'NA',
              customfieldlabel2:'NA',
              customfieldlabel3:'NA',
              showFX:'',
              comment:"Customer Payment Template Preview"


            };

      }
      else if(number == 2)
      {
        item_payments = {
          o_url: "vs1cloud.com",
          o_name: "Sample Company",
          o_address: "123 street",
          o_city: "Los Angeles",
          o_state: "Califonia 12345",
          o_reg: "",
          o_abn: "ABN : 5678905",
          o_phone: "Phone : 25151944",
          title: template_title,
          value: "786",
          date: "14/04/2022",
          invoicenumber: "",
          refnumber: "5677",
          pqnumber: "",
          duedate: "",
          paylink: "",
          supplier_type: "Customer",
          supplier_name : "<p>Brand New <br> Company </p>",
          supplier_addr : "<p> JHB <br> GA1515 <br> Australia",
          fields: {"Date" : "20", "Type" : "10", "Trans" : "10", "Original" : "20", "Due" : "10" , "Paid" : "10", "Outstanding" : "20"},
          subtotal : "",
          gst : "",
          total : "",
          paid_amount : "",
          bal_due : "",
          bsb : '',
          account : '',
          swift : '',
          data: array_data,
          applied : "$50.00",
          customfield1:'customfield1 data',
          customfield2:'customfield2 data',
          customfield3:'customfield3 data',
          customfieldlabel1:'customfield1',
          customfieldlabel2:'customfield2',
          customfieldlabel3:'customfield3',
          showFX:'',
          comment:"Customer Payment Template Preview"
        };

      }
      else
      {

        item_payments = {
          o_url: "vs1cloud.com",
          o_name: "Sample Company",
          o_address: "123 street",
          o_city: "Los Angeles",
          o_state: "Califonia 12345",
          o_reg: "",
          o_abn: "ABN : 5678905",
          o_phone: "Phone : 25151944",
          title: template_title,
          value: "786",
          date: "14/04/2022",
          invoicenumber: "",
          refnumber: "5677",
          pqnumber: "",
          duedate: "",
          paylink: "",
          supplier_type: "Customer",
          supplier_name : "<p>Brand New <br> Company </p>",
          supplier_addr : "<p> JHB <br> GA1515 <br> Australia",
          fields: {"Date" : "20", "Type" : "10", "Trans" : "10", "Original" : "20", "Due" : "10" , "Paid" : "10", "Outstanding" : "20"},
          subtotal : "",
          gst : "",
          total : "",
          paid_amount : "",
          bal_due : "",
          bsb : '',
          account : '',
          swift : '',
          data: array_data,
          applied : "$50.00",
          customfield1:'customfield1 data',
          customfield2:'customfield2 data',
          customfield3:'customfield3 data',
          customfieldlabel1:'customfield1',
          customfieldlabel2:'customfield2',
          customfieldlabel3:'customfield3',
          showFX:'AUD',
          comment:"Customer Payment Template Preview"
        };

      }


      object_invoce.push(item_payments);

      $("#templatePreviewModal .field_payment").hide();
      $("#templatePreviewModal .field_amount").hide();

      updateTemplate(object_invoce);

      saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
    }

    //show customer payment info with DummyData
    function showCustomerStatments(template_title,number) {
          object_invoce = [];
          var array_data = [];
          array_data.push([
            "720",
            "15/03/2022",
            "Payment",
            "30/12/1899",
            "-$15,000.00",
            "$0.00",
            "-$15,000.00",
          ]);

          array_data.push([
              "712",
              "17/03/2022",
              "Payment",
              "30/12/1899",
              "-$7,000.00",
              "$0.00",
              "-$70,000.00",
            ]);

            array_data.push([
              "718",
              "17/03/2022",
              "Payment",
              "30/12/1899",
              "-$15,000.00",
              "$0.00",
              "-$15,000.00",
            ]);

          let item_statement = '';
          if(number == 1)
          {
            item_statement = {
                o_url: "vs1cloud.com",
                o_name: "Sample Company",
                o_address: "123 street",
                o_city: "",
                o_state: "",
                o_reg: "",
                o_abn: "ABN : 5678905",
                o_phone: "Phone : 25151944",
                title: template_title,
                value:"252",
                date: "11/04/2022",
                invoicenumber: "",
                refnumber: "",
                pqnumber: "",
                duedate: "",
                paylink: "Pay Now",
                supplier_type: "Customer",
                supplier_name : "John Wayne Inc",
                supplier_addr : "",
                fields: {"ID" : "10", "Date" : "10", "Type" : "10", "Due Date" : "20", "Total" : "20" , "Paid" : "10", "Balance" : "20"},
                subtotal : "$0.00",
                gst : "$0.00",
                total : "$0.00",
                paid_amount : "$0.00",
                bal_due : "$100,000.00",
                bsb : "",
                account : "",
                swift : "",
                data: array_data,
                applied : "$0.00",
                customfield1:'',
                customfield2:'',
                customfield3:'',
                customfieldlabel1:'',
                customfieldlabel2:'',
                customfieldlabel3:'',
                showFX:'',
                comment:"Customer statement template preview"
            };

          }
          else if(number == 2)
          {
            item_statement = {
              o_url: "vs1cloud.com",
              o_name: "Sample Company",
              o_address: "123 street",
              o_city: "",
              o_state: "",
              o_reg: "",
              o_abn: "ABN : 5678905",
              o_phone: "Phone : 25151944",
              title: template_title,
              value:"252",
              date: "11/04/2022",
              invoicenumber: "",
              refnumber: "",
              pqnumber: "",
              duedate: "",
              paylink: "Pay Now",
              supplier_type: "Customer",
              supplier_name : "John Wayne Inc",
              supplier_addr : "",
              fields: {"ID" : "10", "Date" : "10", "Type" : "10", "Due Date" : "20", "Total" : "20" , "Paid" : "10", "Balance" : "20"},
              subtotal : "$0.00",
              gst : "$0.00",
              total : "$0.00",
              paid_amount : "$0.00",
              bal_due : "$100,000.00",
              bsb : "",
              account : "",
              swift : "",
              data: array_data,
              applied : "$0.00",
              customfield1:'customfield1',
              customfield2:'customfield2',
              customfield3:'customfield3',
              customfieldlabel1:'customfield1 data',
              customfieldlabel2:'customfield2 data',
              customfieldlabel3:'customfield3 data',
              showFX:'',
              comment:"Customer statement template preview"
            };


          }
          else{

            item_statement = {
              o_url: "vs1cloud.com",
              o_name: "Sample Company",
              o_address: "123 street",
              o_city: "",
              o_state: "",
              o_reg: "",
              o_abn: "ABN : 5678905",
              o_phone: "Phone : 25151944",
              title: template_title,
              value:"252",
              date: "11/04/2022",
              invoicenumber: "",
              refnumber: "",
              pqnumber: "",
              duedate: "",
              paylink: "Pay Now",
              supplier_type: "Customer",
              supplier_name : "John Wayne Inc",
              supplier_addr : "",
              fields: {"ID" : "10", "Date" : "10", "Type" : "10", "Due Date" : "20", "Total" : "20" , "Paid" : "10", "Balance" : "20"},
              subtotal : "$0.00",
              gst : "$0.00",
              total : "$0.00",
              paid_amount : "$0.00",
              bal_due : "$100,000.00",
              bsb : "",
              account : "",
              swift : "",
              data: array_data,
              applied : "$0.00",
              customfield1:'customfield1',
              customfield2:'customfield2',
              customfield3:'customfield3',
              customfieldlabel1:'customfield1 data',
              customfieldlabel2:'customfield2 data',
              customfieldlabel3:'customfield3 data',
              showFX:'AUD',
              comment:"Customer statement template preview"
            };



          }


          object_invoce.push(item_statement);

          $("#templatePreviewModal .field_payment").hide();
          $("#templatePreviewModal .field_amount").hide();


          updateTemplate(object_invoce);

          saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
    }

  //show invoice payment info with DummyData
    function showInvoice(template_title,number) {
      object_invoce = [];
      var array_data = [];
      array_data.push([
        "Fanta Grape Can",
        "Fanta Grape Can SODA",
        "1",
        "$0.00",
        "$0.00",
        "$0.00",
      ]);

      array_data.push([
          "Fanta Grape Can",
          "Fanta Grape Can SODA",
          "1",
          "$0.00",
          "$0.00",
          "$0.00",
        ]);
      let item_invoices = '';
      if(number == 1)
      {
          item_invoices = {

              o_url: 'vs1cloud.com',
              o_name: "Sample Company",
              o_address:"123 street",
              o_city: "Los Angeles",
              o_state: "Califonia 12345",
              o_reg:"",
              o_abn: "ABN : 5678905",
              o_phone:"Phone : 25151944",
              title: 'Invoice',
              value: '751',
              date: '25/05/2022',
              invoicenumber:'751',
              refnumber: '1234',
              pqnumber: '1244',
              duedate: '07/07/2022',
              paylink: "Pay Now",
              supplier_type: "Customer",
              supplier_name : "Amar",
              supplier_addr : "Gwalior, Madhya Pradesh",
              fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
              subtotal :"500",
              gst : "15",
              total : "515",
              paid_amount : "400",
              bal_due : "115",
              bsb : "4654-454",
              account : "16161616",
              swift : "WPOCA5s",
              data: array_data,
              customfield1:'NA',
              customfield2:'NA',
              customfield3:'NA',
              customfieldlabel1:'NA',
              customfieldlabel2:'NA',
              customfieldlabel3:'NA',
              applied : "",
              showFX:"",
              comment:"Invoice Template Preview",
          };

      }
      else if(number == 2)
      {
          item_invoices = {
            o_url: 'vs1cloud.com',
            o_name: "Sample Company",
            o_address:"123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg:"",
            o_abn: "ABN : 5678905",
            o_phone:"Phone : 25151944",
            title: 'Invoice',
            value: '751',
            date: '25/05/2022',
            invoicenumber:'751',
            refnumber: '1234',
            pqnumber: '1244',
            duedate: '07/07/2022',
            paylink: "Pay Now",
            supplier_type: "Customer",
            supplier_name : "Amar",
            supplier_addr : "Gwalior, Madhya Pradesh",
            fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
            subtotal :"500",
            gst : "15",
            total : "515",
            paid_amount : "400",
            bal_due : "115",
            bsb : "4654-454",
            account : "16161616",
            swift : "WPOCA5s",
            data: array_data,
            customfield1:'Custom Field 1 Data',
            customfield2:'Custom Field 2 Data',
            customfield3:'Custom Field 3 Data',
            customfieldlabel1:'Custom Field 1',
            customfieldlabel2:'Custom Field 2',
            customfieldlabel3:'Custom Field 3',
            applied : "",
            showFX:"",
            comment:"Invoice Template Preview",
          };

      }
      else
      {
          item_invoices = {
            o_url: 'vs1cloud.com',
            o_name: "Sample Company",
            o_address:"123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg:"",
            o_abn: "ABN : 5678905",
            o_phone:"Phone : 25151944",
            title: 'Invoice',
            value: '751',
            date: '25/05/2022',
            invoicenumber:'751',
            refnumber: '1234',
            pqnumber: '1244',
            duedate: '07/07/2022',
            paylink: "Pay Now",
            supplier_type: "Customer",
            supplier_name : "Amar",
            supplier_addr : "Gwalior, Madhya Pradesh",
            fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
            subtotal :"500",
            gst : "15",
            total : "515",
            paid_amount : "400",
            bal_due : "115",
            bsb : "4654-454",
            account : "16161616",
            swift : "WPOCA5s",
            data: array_data,
            customfield1:'Custom Field 1 Data',
            customfield2:'Custom Field 2 Data',
            customfield3:'Custom Field 3 Data',
            customfieldlabel1:'Custom Field 1',
            customfieldlabel2:'Custom Field 2',
            customfieldlabel3:'Custom Field 3',
            applied : "",
            showFX:"AUD",
            comment:"Invoice Template Preview",
          };

      }



      object_invoce.push(item_invoices);

      $("#templatePreviewModal .field_payment").show();
      $("#templatePreviewModal .field_amount").show();

      updateTemplate(object_invoce);

      saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
    }

  //show invoice back  info with DummyData
    function showInvoiceBack(template_title,number) {
      object_invoce = [];
      var array_data = [];
      array_data.push([
          "Fanta Grape Can",
          "Fanta Grape Can SODA",
          "1",
          "$0.00",
          "$0.00",
          "$0.00",
        ]);

        array_data.push([
            "Fanta Grape Can",
            "Fanta Grape Can SODA",
            "1",
            "$0.00",
            "$0.00",
            "$0.00",
          ]);

      let item_invoices = '';

      if(number == 1)
      {
          item_invoices = {

              o_url: 'vs1cloud.com',
              o_name: "Sample Company",
              o_address:"123 street",
              o_city: "Los Angeles",
              o_state: "Califonia 12345",
              o_reg:"",
              o_abn: "ABN : 5678905",
              o_phone:"Phone : 25151944",
              title: 'Invoice Back Order',
              value: '751',
              date: '25/05/2022',
              invoicenumber:'751',
              refnumber: '1234',
              pqnumber: '1244',
              duedate: '07/07/2022',
              paylink: "Pay Now",
              supplier_type: "Customer",
              supplier_name : "Amar",
              supplier_addr : "Gwalior, Madhya Pradesh",
              fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
              subtotal :"500",
              gst : "15",
              total : "515",
              paid_amount : "400",
              bal_due : "115",
              bsb : "4654-454",
              account : "16161616",
              swift : "WPOCA5s",
              data: array_data,
              customfield1:'NA',
              customfield2:'NA',
              customfield3:'NA',
              customfieldlabel1:'NA',
              customfieldlabel2:'NA',
              customfieldlabel3:'NA',
              applied : "",
              showFX:"",
              comment:"Invoice Back Order Template Preview",
          };

      }
      else if(number == 2)
      {
          item_invoices = {
            o_url: 'vs1cloud.com',
            o_name: "Sample Company",
            o_address:"123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg:"",
            o_abn: "ABN : 5678905",
            o_phone:"Phone : 25151944",
            title: 'Invoice Back Order',
            value: '751',
            date: '25/05/2022',
            invoicenumber:'751',
            refnumber: '1234',
            pqnumber: '1244',
            duedate: '07/07/2022',
            paylink: "Pay Now",
            supplier_type: "Customer",
            supplier_name : "Amar",
            supplier_addr : "Gwalior, Madhya Pradesh",
            fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
            subtotal :"500",
            gst : "15",
            total : "515",
            paid_amount : "400",
            bal_due : "115",
            bsb : "4654-454",
            account : "16161616",
            swift : "WPOCA5s",
            data: array_data,
            customfield1:'Custom Field 1 Data',
            customfield2:'Custom Field 2 Data',
            customfield3:'Custom Field 3 Data',
            customfieldlabel1:'Custom Field 1',
            customfieldlabel2:'Custom Field 2',
            customfieldlabel3:'Custom Field 3',
            applied : "",
            showFX:"",
            comment:"Invoice Back Order Template Preview",
          };

      }
      else
      {
          item_invoices = {
            o_url: 'vs1cloud.com',
            o_name: "Sample Company",
            o_address:"123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg:"",
            o_abn: "ABN : 5678905",
            o_phone:"Phone : 25151944",
            title: 'Invoice Back Order',
            value: '751',
            date: '25/05/2022',
            invoicenumber:'751',
            refnumber: '1234',
            pqnumber: '1244',
            duedate: '07/07/2022',
            paylink: "Pay Now",
            supplier_type: "Customer",
            supplier_name : "Amar",
            supplier_addr : "Gwalior, Madhya Pradesh",
            fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
            subtotal :"500",
            gst : "15",
            total : "515",
            paid_amount : "400",
            bal_due : "115",
            bsb : "4654-454",
            account : "16161616",
            swift : "WPOCA5s",
            data: array_data,
            customfield1:'Custom Field 1 Data',
            customfield2:'Custom Field 2 Data',
            customfield3:'Custom Field 3 Data',
            customfieldlabel1:'Custom Field 1',
            customfieldlabel2:'Custom Field 2',
            customfieldlabel3:'Custom Field 3',
            applied : "",
            showFX:"AUD",
            comment:"Invoice Back Order Template Preview",
          };

      }




      object_invoce.push(item_invoices);
      $("#templatePreviewModal .field_payment").show();
      $("#templatePreviewModal .field_amount").show();

      updateTemplate(object_invoce);

      saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
      }


    //show purchase orders  info with DummyData
    function showPurchaseOrder(template_title,number) {
        object_invoce = [];
        var array_data = [];
        array_data.push([
          "ABC Product",
          "ABC Product",
          "5",
          "$5.00",
          "$0.00",
          "$0.00",
        ]);
        let item_purchase = '';
        if(number == 1)
        {
           item_purchase = {
            o_url: "vs1cloud.com",
            o_name: "Sample Company",
            o_address: "123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg: "",
            o_abn: "5678905",
            o_phone: "25151944",
            title: template_title,
            value:"287",
            date: "29/03/2022",
            invoicenumber: ".",
            refnumber: "",
            pqnumber: "",
            duedate: "",
            paylink: "",
            supplier_type: "Supplier",
            supplier_name : "<p>ABC Building Company</p>",
            supplier_addr : "<p> Dallas <br> Texas 8877 <br> United States",
            fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
            subtotal : "$0.00",
            gst : "$0.00",
            total : "$0.00",
            paid_amount : "$0.00",
            bal_due : "$0.00",
            bsb : "",
            account : "",
            swift : "",
            data: array_data,
            applied : "",
            customfield1:'NA',
            customfield2:'NA',
            customfield3:'NA',
            customfieldlabel1:'NA',
            customfieldlabel2:'NA',
            customfieldlabel3:'NA',
            applied : "",
            showFX:"",
            comment:"Purchases Order Template Preview",

          };


        }
        else if(number == 2)
        {

           item_purchase = {
            o_url: "vs1cloud.com",
            o_name: "Sample Company",
            o_address: "123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg: "",
            o_abn: "5678905",
            o_phone: "25151944",
            title: template_title,
            value:"287",
            date: "29/03/2022",
            invoicenumber: ".",
            refnumber: "",
            pqnumber: "",
            duedate: "",
            paylink: "",
            supplier_type: "Supplier",
            supplier_name : "<p>ABC Building Company</p>",
            supplier_addr : "<p> Dallas <br> Texas 8877 <br> United States",
            fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
            subtotal : "$0.00",
            gst : "$0.00",
            total : "$0.00",
            paid_amount : "$0.00",
            bal_due : "$0.00",
            bsb : "",
            account : "",
            swift : "",
            data: array_data,
            applied : "",
            customfield1:"customfield1",
            customfield2:"customfield2",
            customfield3:"customfield3",
            customfieldlabel1:"customfieldlabel1",
            customfieldlabel2:"customfieldlabel2",
            customfieldlabel3:"customfieldlabel3",
            showFX:'',
            comment:"Purchases Order Template Preview",
          };

        }
        else{


          item_purchase = {
            o_url: "vs1cloud.com",
            o_name: "Sample Company",
            o_address: "123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg: "",
            o_abn: "5678905",
            o_phone: "25151944",
            title: template_title,
            value:"287",
            date: "29/03/2022",
            invoicenumber: ".",
            refnumber: "",
            pqnumber: "",
            duedate: "",
            paylink: "",
            supplier_type: "Supplier",
            supplier_name : "<p>ABC Building Company</p>",
            supplier_addr : "<p> Dallas <br> Texas 8877 <br> United States",
            fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
            subtotal : "$0.00",
            gst : "$0.00",
            total : "$0.00",
            paid_amount : "$0.00",
            bal_due : "$0.00",
            bsb : "",
            account : "",
            swift : "",
            data: array_data,
            applied : "",
            customfield1:"customfield1",
            customfield2:"customfield2",
            customfield3:"customfield3",
            customfieldlabel1:"customfieldlabel1",
            customfieldlabel2:"customfieldlabel2",
            customfieldlabel3:"customfieldlabel3",
            showFX:'AUD',
            comment:"Purchases Order Template Preview",

          };


        }



        object_invoce.push(item_purchase);
        $("#templatePreviewModal .field_payment").hide();
        $("#templatePreviewModal .field_amount").show();
        updateTemplate(object_invoce);

        saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
      }


    //show Quotes  info with DummyData
    function showQuotes(template_title,number) {
        object_invoce = [];
        var array_data = [];
        array_data.push([
          "Fanta Grape Can",
          "Fanta Grape Can SODA",
          "1",
          "$0.00",
          "$0.00",
          "$0.00",
        ]);

        let item_quote = '';

        if(number == 1)
        {
           item_quote = {
            o_url: "vs1cloud.com",
            o_name: "Sample Company",
            o_address: "123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg: "",
            o_abn: "5678905",
            o_phone: "25151944",
            title: template_title,
            value: "287",
            date: "14/04/2022",
            invoicenumber: "147",
            refnumber: "456",
            pqnumber: "1234",
            duedate: "14/04/2022",
            paylink: "Pay Now",
            supplier_type: "Customer",
            supplier_name : "<p>Accenture Software Dev</p>",
            supplier_addr : "<p>Building 3 , Waterfall Corporate <br> South Africa</p>",
            fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
            subtotal : "$0.00",
            gst : "$0.00",
            total : "$0.00",
            paid_amount : "$0.00",
            bal_due : "$0.00",
            bsb : "4654-454",
            account : "151515",
            swift : "WPOCA5s",
            data: array_data,
            applied : "",
            customfield1:'NA',
            customfield2:'NA',
            customfield3:'NA',
            customfieldlabel1:'NA',
            customfieldlabel2:'NA',
            customfieldlabel3:'NA',
            showFX:'',
            comment:"Quote Template Preview",

          };

        }
        else if(number == 2)
        {
           item_quote = {
            o_url: "vs1cloud.com",
            o_name: "Sample Company",
            o_address: "123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg: "",
            o_abn: "5678905",
            o_phone: "25151944",
            title: template_title + " 287",
            date: "14/04/2022",
            invoicenumber: "",
            refnumber: "456",
            pqnumber: "1234",
            duedate: "14/04/2022",
            paylink: "Pay Now",
            supplier_type: "Customer",
            supplier_name : "<p>Accenture Software Dev</p>",
            supplier_addr : "<p>Building 3 , Waterfall Corporate <br> South Africa</p>",
            fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
            subtotal : "$0.00",
            gst : "$0.00",
            total : "$0.00",
            paid_amount : "$0.00",
            bal_due : "$0.00",
            bsb : "4654-454",
            account : "151515",
            swift : "WPOCA5s",
            data: array_data,
            applied : "",
            customfield1:'customfield1 data',
            customfield2:'customfield2 data',
            customfield3:'customfield3 data',
            customfieldlabel1:'customfield1',
            customfieldlabel2:'customfield2',
            customfieldlabel3:'customfield3',
            showFX:'',
            comment:"Quote Template Preview",
          };

        }
        else{

          item_quote = {
            o_url: "vs1cloud.com",
            o_name: "Sample Company",
            o_address: "123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg: "",
            o_abn: "5678905",
            o_phone: "25151944",
            title: template_title + " 287",
            date: "14/04/2022",
            invoicenumber: "",
            refnumber: "456",
            pqnumber: "1234",
            duedate: "14/04/2022",
            paylink: "Pay Now",
            supplier_type: "Customer",
            supplier_name : "<p>Accenture Software Dev</p>",
            supplier_addr : "<p>Building 3 , Waterfall Corporate <br> South Africa</p>",
            fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
            subtotal : "$0.00",
            gst : "$0.00",
            total : "$0.00",
            paid_amount : "$0.00",
            bal_due : "$0.00",
            bsb : "4654-454",
            account : "151515",
            swift : "WPOCA5s",
            data: array_data,
            applied : "",
            customfield1:'customfield1 data',
            customfield2:'customfield2 data',
            customfield3:'customfield3 data',
            customfieldlabel1:'customfield1',
            customfieldlabel2:'customfield2',
            customfieldlabel3:'customfield3',
            showFX:'AUD',
            comment:"Quote Template Preview",

          };


        }


        object_invoce.push(item_quote);
        $("#templatePreviewModal .field_payment").show();
        $("#templatePreviewModal .field_amount").show();
        updateTemplate(object_invoce);

        saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
      }


    //show refund  info with DummyData
    function showRefund(template_title,number) {
        object_invoce = [];
        var array_data = [];
        array_data.push([
          "Bank Stickers",
          "Bank Stickers",
          "1",
          "$50.00",
          "$0.00",
          "-$50.00",
        ]);
        let item_refund = '';

        if(number == 1)
        {
            item_refund = {
              o_url: "vs1cloud.com",
              o_name: "Sample Company",
              o_address: "123 street",
              o_city: "Los Angeles",
              o_state: "Califonia 12345",
              o_reg: "",
              o_abn: "5678905",
              o_phone: "25151944",
              title: template_title,
              value: "738",
              date: "14/04/2022",
              invoicenumber: "",
              refnumber: "4656",
              pqnumber: "9055",
              duedate: "29/03/2022",
              paylink: "Pay Now",
              supplier_type: "Customer",
              supplier_name : "<p>Accenture Software Dev</p>",
              supplier_addr : "<p>Building 3, Waterfall Corporate <br> South Africa</p>",
              fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
              subtotal : "-$50.00",
              gst : "$0.00",
              total : "-$50.00",
              paid_amount : "$0.00",
              bal_due : "-$50.00",
              bsb : "4654-454",
              account : "151515",
              swift : "WPOCA5s",
              data: array_data,
              applied : "",
              customfield1:'NA',
              customfield2:'NA',
              customfield3:'NA',
              customfieldlabel1:'NA',
              customfieldlabel2:'NA',
              customfieldlabel3:'NA',
              showFX:'',
              comment:"Refund Template Preview",
            };

        }
        else if(number == 2)
        {
             item_refund = {
              o_url: "vs1cloud.com",
              o_name: "Sample Company",
              o_address: "123 street",
              o_city: "Los Angeles",
              o_state: "Califonia 12345",
              o_reg: "",
              o_abn: "5678905",
              o_phone: "25151944",
              title: template_title,
              value: "738",
              date: "14/04/2022",
              invoicenumber: "",
              refnumber: "",
              pqnumber: "9055",
              duedate: "29/03/2022",
              paylink: "Pay Now",
              supplier_type: "Customer",
              supplier_name : "<p>Accenture Software Dev</p>",
              supplier_addr : "<p>Building 3, Waterfall Corporate <br> South Africa</p>",
              fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
              subtotal : "-$50.00",
              gst : "$0.00",
              total : "-$50.00",
              paid_amount : "$0.00",
              bal_due : "-$50.00",
              bsb : "4654-454",
              account : "151515",
              swift : "WPOCA5s",
              data: array_data,
              applied : "",
              customfield1:'customfield1 data',
              customfield2:'customfield2 data',
              customfield3:'customfield3 data',
              customfieldlabel1:'customfield1',
              customfieldlabel2:'customfield2',
              customfieldlabel3:'customfield3',
              showFX:'',
              comment:"Refund Template Preview",
            };


        }
        else
        {

            item_refund = {
                o_url: "vs1cloud.com",
                o_name: "Sample Company",
                o_address: "123 street",
                o_city: "Los Angeles",
                o_state: "Califonia 12345",
                o_reg: "",
                o_abn: "5678905",
                o_phone: "25151944",
                title: template_title,
                value: "738",
                date: "14/04/2022",
                invoicenumber: "",
                refnumber: "",
                pqnumber: "9055",
                duedate: "29/03/2022",
                paylink: "Pay Now",
                supplier_type: "Customer",
                supplier_name : "<p>Accenture Software Dev</p>",
                supplier_addr : "<p>Building 3, Waterfall Corporate <br> South Africa</p>",
                fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
                subtotal : "-$50.00",
                gst : "$0.00",
                total : "-$50.00",
                paid_amount : "$0.00",
                bal_due : "-$50.00",
                bsb : "4654-454",
                account : "151515",
                swift : "WPOCA5s",
                data: array_data,
                applied : "",
                customfield1:'customfield1 data',
                customfield2:'customfield2 data',
                customfield3:'customfield3 data',
                customfieldlabel1:'customfield1',
                customfieldlabel2:'customfield2',
                customfieldlabel3:'customfield3',
                showFX:'AUD',
                comment:"Refund Template Preview",

          };


        }


        object_invoce.push(item_refund);
        $("#templatePreviewModal .field_payment").hide();
        $("#templatePreviewModal .field_amount").show();
        updateTemplate(object_invoce);
        saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
      }

      //show selas order  info with DummyData
    function showSealsOrder(template_title,number) {
        object_invoce = [];
        var array_data = [];
        array_data.push([
          "",
          "",
          "",
          "$0",
          "$0.00",
          "$0.00",
        ]);

        let item_invoices = '';

        if(number == 1)
        {
          item_invoices = {

                o_url: 'vs1cloud.com',
                o_name: "Sample Company",
                o_address:"123 street",
                o_city: "Los Angeles",
                o_state: "Califonia 12345",
                o_reg:"",
                o_abn: "ABN : 5678905",
                o_phone:"Phone : 25151944",
                title: 'Sales Order',
                value: '751',
                date: '25/05/2022',
                invoicenumber:'751',
                refnumber: '1234',
                pqnumber: '1244',
                duedate: '07/07/2022',
                paylink: "Pay Now",
                supplier_type: "Customer",
                supplier_name : "Amar",
                supplier_addr : "Gwalior, Madhya Pradesh",
                fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
                subtotal :"500",
                gst : "15",
                total : "515",
                paid_amount : "400",
                bal_due : "115",
                bsb : "4654-454",
                account : "16161616",
                swift : "WPOCA5s",
                data: array_data,
                customfield1:'NA',
                customfield2:'NA',
                customfield3:'NA',
                customfieldlabel1:'NA',
                customfieldlabel2:'NA',
                customfieldlabel3:'NA',
                applied : "",
                showFX:"",
                comment:"Sales Order Template Preview",
            };

        }
        else if(number == 2)
        {
          item_invoices = {
              o_url: 'vs1cloud.com',
              o_name: "Sample Company",
              o_address:"123 street",
              o_city: "Los Angeles",
              o_state: "Califonia 12345",
              o_reg:"",
              o_abn: "ABN : 5678905",
              o_phone:"Phone : 25151944",
              title: 'Sales Order',
              value: '751',
              date: '25/05/2022',
              invoicenumber:'751',
              refnumber: '1234',
              pqnumber: '1244',
              duedate: '07/07/2022',
              paylink: "Pay Now",
              supplier_type: "Customer",
              supplier_name : "Amar",
              supplier_addr : "Gwalior, Madhya Pradesh",
              fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
              subtotal :"500",
              gst : "15",
              total : "515",
              paid_amount : "400",
              bal_due : "115",
              bsb : "4654-454",
              account : "16161616",
              swift : "WPOCA5s",
              data: array_data,
              customfield1:'Custom Field 1 Data',
              customfield2:'Custom Field 2 Data',
              customfield3:'Custom Field 3 Data',
              customfieldlabel1:'Custom Field 1',
              customfieldlabel2:'Custom Field 2',
              customfieldlabel3:'Custom Field 3',
              applied : "",
              showFX:"",
              comment:"Sales Order Template Preview",
            };

        }
        else
        {
          item_invoices = {
              o_url: 'vs1cloud.com',
              o_name: "Sample Company",
              o_address:"123 street",
              o_city: "Los Angeles",
              o_state: "Califonia 12345",
              o_reg:"",
              o_abn: "ABN : 5678905",
              o_phone:"Phone : 25151944",
              title: 'Sales Order',
              value: '751',
              date: '25/05/2022',
              invoicenumber:'751',
              refnumber: '1234',
              pqnumber: '1244',
              duedate: '07/07/2022',
              paylink: "Pay Now",
              supplier_type: "Customer",
              supplier_name : "Amar",
              supplier_addr : "Gwalior, Madhya Pradesh",
              fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
              subtotal :"500",
              gst : "15",
              total : "515",
              paid_amount : "400",
              bal_due : "115",
              bsb : "4654-454",
              account : "16161616",
              swift : "WPOCA5s",
              data: array_data,
              customfield1:'Custom Field 1 Data',
              customfield2:'Custom Field 2 Data',
              customfield3:'Custom Field 3 Data',
              customfieldlabel1:'Custom Field 1',
              customfieldlabel2:'Custom Field 2',
              customfieldlabel3:'Custom Field 3',
              applied : "",
              showFX:"AUD",
              comment:"Sales Order Template Preview",
            };

        }

        object_invoce.push(item_invoices);
        $("#templatePreviewModal .field_payment").show();
        $("#templatePreviewModal .field_amount").show();
        updateTemplate(object_invoce);

        saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
    }


    //show suppliers order  info with DummyData
    function showSuppliers(template_title,number) {
        object_invoce = [];

        var array_data = [];

        array_data.push([
            "30/03/2022",
            "Bill",
            "298",
            "$900.00",
            "$900.00",
            "$0.00",
        ]);

        let item_supplier = '';
        if(number == 1)
        {
               item_supplier = {
                o_url: "vs1cloud.com",
                o_name: "Sample Company",
                o_address: "123 street",
                o_city: "Los Angeles",
                o_state: "Califonia 12345",
                o_reg: "",
                o_abn: "5678905",
                o_phone: "25151944",
                title: template_title,
                value:"287",
                date: "11/04/2022",
                invoicenumber: "",
                refnumber: "67886",
                pqnumber: "",
                duedate: "",
                paylink: "",
                supplier_type: "Supplier",
                supplier_name : "Brand New Company",
                supplier_addr : "",
                fields: {"Date" : "20", "Type" : "10", "No" : "10", "Amount" : "20", "Due" : "10" , "Paid" : "10", "Outstanding" : "20"},
                subtotal : "",
                gst : "",
                total : "",
                paid_amount : "",
                bal_due : "",
                bsb : "",
                account : "",
                swift : "",
                data: array_data,
                applied : "",
                customfield1:'NA',
                customfield2:'NA',
                customfield3:'NA',
                customfieldlabel1:'NA',
                customfieldlabel2:'NA',
                customfieldlabel3:'NA',
                showFX:'',
                comment:"Supplier Payment Preview"

              };
        }
        else if(number == 2)
        {

            item_supplier = {
              o_url: "vs1cloud.com",
              o_name: "Sample Company",
              o_address: "123 street",
              o_city: "Los Angeles",
              o_state: "Califonia 12345",
              o_reg: "",
              o_abn: "5678905",
              o_phone: "25151944",
              title: template_title,
              value:"287",
              date: "11/04/2022",
              invoicenumber: "",
              refnumber: "67886",
              pqnumber: "",
              duedate: "",
              paylink: "",
              supplier_type: "Supplier",
              supplier_name : "Brand New Company",
              supplier_addr : "",
              fields: {"Date" : "20", "Type" : "10", "No" : "10", "Amount" : "20", "Due" : "10" , "Paid" : "10", "Outstanding" : "20"},
              subtotal : "",
              gst : "",
              total : "",
              paid_amount : "",
              bal_due : "",
              bsb : "",
              account : "",
              swift : "",
              data: array_data,
              applied : "",
              customfield1:'customfield1 data',
              customfield2:'customfield2 data',
              customfield3:'customfield3 data',
              customfieldlabel1:'customfield1',
              customfieldlabel2:'customfield2',
              customfieldlabel3:'customfield3 ',
              showFX:'',
              comment:"Supplier Payment Preview"
            };


        }
        else
        {
           item_supplier = {
                o_url: "vs1cloud.com",
                o_name: "Sample Company",
                o_address: "123 street",
                o_city: "Los Angeles",
                o_state: "Califonia 12345",
                o_reg: "",
                o_abn: "5678905",
                o_phone: "25151944",
                title: template_title,
                value:"287",
                date: "11/04/2022",
                invoicenumber: "",
                refnumber: "67886",
                pqnumber: "",
                duedate: "",
                paylink: "",
                supplier_type: "Supplier",
                supplier_name : "Brand New Company",
                supplier_addr : "",
                fields: {"Date" : "20", "Type" : "10", "No" : "10", "Amount" : "20", "Due" : "10" , "Paid" : "10", "Outstanding" : "20"},
                subtotal : "",
                gst : "",
                total : "",
                paid_amount : "",
                bal_due : "",
                bsb : "",
                account : "",
                swift : "",
                data: array_data,
                applied : "",
                customfield1:'customfield1 data',
                customfield2:'customfield2 data',
                customfield3:'customfield3 data',
                customfieldlabel1:'customfield1',
                customfieldlabel2:'customfield2',
                customfieldlabel3:'customfield3 ',
                showFX:'AUD',
                comment:"Supplier Payment Preview"
          };

        }



        object_invoce.push(item_supplier);

        $("#templatePreviewModal .field_payment").hide();
        $("#templatePreviewModal .field_amount").hide();


        updateTemplate(object_invoce);

        saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
    }

    function showStatements(template_title,number)
    {
        object_invoce = [];
        var array_data = [];
            array_data.push([
              "30/03/2022",
              "Statements",
              "298",
              "$900.00",
              "$900.00",
              "$0.00",
            ]);
        let item_statement = '';
        if(number == 1)
        {
           item_statement = {
            o_url: "vs1cloud.com",
            o_name: "Sample Company",
            o_address: "123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg: "",
            o_abn: "5678905",
            o_phone: "25151944",
            title: template_title,
            value: "287",
            date: "11/04/2022",
            invoicenumber: "",
            refnumber: "67886",
            pqnumber: "",
            duedate: "",
            paylink: "",
            supplier_type: "Customer",
            supplier_name : "Brand New Company",
            supplier_addr : "",
            fields: {"Date" : "20", "Type" : "10", "No" : "10", "Amount" : "20", "Due" : "10" , "Paid" : "10", "Outstanding" : "20"},
            subtotal : "$0.00",
            gst : "$0.00",
            total : "$0.00",
            paid_amount : "$0.00",
            bal_due : "$0.00",
            bsb : "",
            account : "",
            swift : "",
            data: array_data,
            applied : "",
            customfield1:'NA',
            customfield2:'NA',
            customfield3:'NA',
            customfieldlabel1:'NA',
            customfieldlabel2:'NA',
            customfieldlabel3:'NA',
            showFX:'',
            comment:"Statement Template Preview"
          };

        }
        else if(number == 2)
        {
           item_statement = {
            o_url: "vs1cloud.com",
            o_name: "Sample Company",
            o_address: "123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg: "",
            o_abn: "5678905",
            o_phone: "25151944",
            title: template_title,
            value: "287",
            date: "11/04/2022",
            invoicenumber: "",
            refnumber: "67886",
            pqnumber: "",
            duedate: "",
            paylink: "",
            supplier_type: "Customer",
            supplier_name : "Brand New Company",
            supplier_addr : "",
            fields: {"Date" : "20", "Type" : "10", "No" : "10", "Amount" : "20", "Due" : "10" , "Paid" : "10", "Outstanding" : "20"},
            subtotal : "$0.00",
            gst : "$0.00",
            total : "$0.00",
            paid_amount : "$0.00",
            bal_due : "$0.00",
            bsb : "",
            account : "",
            swift : "",
            data: array_data,
            applied : "",
            customfield1:'customfield1 data',
            customfield2:'customfield2 data',
            customfield3:'customfield3 data',
            customfieldlabel1:'customfield1',
            customfieldlabel2:'customfield2',
            customfieldlabel3:'customfield3',
            showFX:'',
            comment:"Statement Template Preview"
          };

        }
        else
        {
           item_statement = {
            o_url: "vs1cloud.com",
            o_name: "Sample Company",
            o_address: "123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg: "",
            o_abn: "5678905",
            o_phone: "25151944",
            title: template_title,
            value: "287",
            date: "11/04/2022",
            invoicenumber: "",
            refnumber: "67886",
            pqnumber: "",
            duedate: "",
            paylink: "",
            supplier_type: "Customer",
            supplier_name : "Brand New Company",
            supplier_addr : "",
            fields: {"Date" : "20", "Type" : "10", "No" : "10", "Amount" : "20", "Due" : "10" , "Paid" : "10", "Outstanding" : "20"},
            subtotal : "$0.00",
            gst : "$0.00",
            total : "$0.00",
            paid_amount : "$0.00",
            bal_due : "$0.00",
            bsb : "",
            account : "",
            swift : "",
            data: array_data,
            applied : "",
            customfield1:'customfield1 data',
            customfield2:'customfield2 data',
            customfield3:'customfield3 data',
            customfieldlabel1:'customfield1',
            customfieldlabel2:'customfield2',
            customfieldlabel3:'customfield3',
            showFX:'AUD',
            comment:"Statement Template Preview"
          };


        }


        object_invoce.push(item_statement);

        $("#templatePreviewModal .field_payment").hide();
        $("#templatePreviewModal .field_amount").hide();


        updateTemplate(object_invoce);

        saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])

    }

    function showDeliveryDocket(template_title,number)
    {

      object_invoce = [];
      var array_data = [];
      array_data.push([
        "Fanta Grape Can",
        "Fanta Grape Can SODA",
        "1",
        "",
        "",
        "",
      ]);

      array_data.push([
          "Fanta Grape Can",
          "Fanta Grape Can SODA",
          "1",
          "",
          "",
          "",
        ]);
      let item_invoices = '';
      if(number == 1)
      {
          item_invoices = {

              o_url: 'vs1cloud.com',
              o_name: "Sample Company",
              o_address:"123 street",
              o_city: "Los Angeles",
              o_state: "Califonia 12345",
              o_reg:"",
              o_abn: "ABN : 5678905",
              o_phone:"Phone : 25151944",
              title: 'Delivery DOcket',
              value: '751',
              date: '25/05/2022',
              invoicenumber:'751',
              refnumber: '1234',
              pqnumber: '1244',
              duedate: '07/07/2022',
              paylink: "Pay Now",
              supplier_type: "Customer",
              supplier_name : "Amar",
              supplier_addr : "Gwalior, Madhya Pradesh",
              fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
              subtotal :"",
              gst : "",
              total : "",
              paid_amount : "",
              bal_due : "",
              bsb : "",
              account : "",
              swift : "",
              data: array_data,
              customfield1:'NA',
              customfield2:'NA',
              customfield3:'NA',
              customfieldlabel1:'NA',
              customfieldlabel2:'NA',
              customfieldlabel3:'NA',
              applied : "",
              showFX:"",
              comment:"Delivery Docket Template Preview",
          };

      }
      else if(number == 2)
      {
          item_invoices = {
            o_url: 'vs1cloud.com',
            o_name: "Sample Company",
            o_address:"123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg:"",
            o_abn: "ABN : 5678905",
            o_phone:"Phone : 25151944",
            title: 'Delivery DOcket',
            value: '751',
            date: '25/05/2022',
            invoicenumber:'751',
            refnumber: '1234',
            pqnumber: '1244',
            duedate: '07/07/2022',
            paylink: "Pay Now",
            supplier_type: "Customer",
            supplier_name : "Amar",
            supplier_addr : "Gwalior, Madhya Pradesh",
            fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
            subtotal :"",
            gst : "",
            total : "",
            paid_amount : "",
            bal_due : "",
            bsb : "",
            account : "",
            swift : "",
            data: array_data,
            customfield1:'Custom Field 1 Data',
            customfield2:'Custom Field 2 Data',
            customfield3:'Custom Field 3 Data',
            customfieldlabel1:'Custom Field 1',
            customfieldlabel2:'Custom Field 2',
            customfieldlabel3:'Custom Field 3',
            applied : "",
            showFX:"",
            comment:"Delivery Docket Template Preview",
          };

      }
      else
      {
          item_invoices = {
            o_url: 'vs1cloud.com',
            o_name: "Sample Company",
            o_address:"123 street",
            o_city: "Los Angeles",
            o_state: "Califonia 12345",
            o_reg:"",
            o_abn: "ABN : 5678905",
            o_phone:"Phone : 25151944",
            title: 'Delivery DOcket',
            value: '751',
            date: '25/05/2022',
            invoicenumber:'751',
            refnumber: '1234',
            pqnumber: '1244',
            duedate: '07/07/2022',
            paylink: "Pay Now",
            supplier_type: "Customer",
            supplier_name : "Amar",
            supplier_addr : "Gwalior, Madhya Pradesh",
            fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
            subtotal :"",
            gst : "",
            total : "",
            paid_amount : "",
            bal_due : "",
            bsb : "",
            account : "",
            swift : "",
            data: array_data,
            customfield1:'Custom Field 1 Data',
            customfield2:'Custom Field 2 Data',
            customfield3:'Custom Field 3 Data',
            customfieldlabel1:'Custom Field 1',
            customfieldlabel2:'Custom Field 2',
            customfieldlabel3:'Custom Field 3',
            applied : "",
            showFX:"",
            comment:"Delivery Docket Template Preview",
          };

      }


      object_invoce.push(item_invoices);

      $("#templatePreviewModal .field_payment").show();
      $("#templatePreviewModal .field_amount").show();

      updateTemplate(object_invoce);

      saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
    }


     templateObject.generateInvoiceData = function (template_title,number) {
     object_invoce = [];
     switch (template_title) {
      case "Bills":
        showBillData(template_title,number);
        break;

      case "Credits":
        showCreditData(template_title,number);
        break;

      case "Customer Payments":
        showCustomerPayment(template_title,number);
        break;


    case "Customer Statements":
        showCustomerStatments(template_title,number);
        break;

      case "Invoices":
        showInvoice(template_title,number);
        break;

      case "Invoice Back Orders":
        showInvoiceBack(template_title,number);
        break;

      case "Purchase Orders":
        showPurchaseOrder(template_title,number)
        break;

      case "Quotes":
        showQuotes(template_title,number)
        break;

      case "Refunds":
        showRefund(template_title,number)
        break;

      case "Sales Orders":
        showSealsOrder(template_title,number)
        break;

      case "Supplier Payments":
        showSuppliers(template_title,number)
        break;

      case "Statements":
        showStatements(template_title,number);
        break;

      case "Delivery Docket":
        showDeliveryDocket(template_title,number);
        break;
    }

     };
  });

Template.templatesettings.helpers({
  getTemplateList: function () {
    return template_list;
  },

  getTemplateNumber: function () {
    let template_numbers = ["1", "2", "3"];
    return template_numbers;
  },
});

Template.templatesettings.events({

'click .btnTopGlobalSave':function(){

    var bill = $('input[name="Bills"]:checked').val();
    var credits = $('input[name="Credits"]:checked').val();
    var customer_payment = $('input[name="Customer Payments"]:checked').val();
    var customer_statement = $('input[name="Customer Statements"]:checked').val();
    var invoices = $('input[name="Invoices"]:checked').val();
    var invoices_back_order = $('input[name="Invoice Back Orders"]:checked').val();
    var purchase_order = $('input[name="Purchase Orders"]:checked').val();
    var quotes = $('input[name="Quotes"]:checked').val();
    var refunds = $('input[name="Refunds"]:checked').val();
    var sales_orders = $('input[name="Sales Orders"]:checked').val();
    var supplier_payments = $('input[name="Supplier Payments"]:checked').val();
    var statements = $('input[name="Statements"]:checked').val();
    var delivery_docket = $('input[name="Delivery Docket"]:checked').val();
    var current_company = loggedCompany;

    $('.fullScreenSpin').css('display','inline-block');

    var print_options  =  {
      type:"TemplateSettings",
      fields:{
                 client_id:loggedCompany,
                 bill:bill,
                 credits:credits,
                 customer_payment:customer_payment,
                 customer_statement:customer_statement,
                 invoices:invoices,
                 invoices_back_order:invoices_back_order,
                 purchase_order:purchase_order,
                 quotes:quotes,
                 refunds:refunds,
                 sales_orders:sales_orders,
                 supplier_payments:supplier_payments,
                 statements:statements,
                 delivery_docket:delivery_docket,
            }



    }

    addVS1Data("TemplateSettings", JSON.stringify(print_options)).then(function (datareturn) {
        $('.fullScreenSpin').css('display','none');
        swal({
        title: 'Success',
        text: 'Print Template Options saved successfully.',
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Done'

        }).then((result) => {
        if (result.value) {

        }else if (result.dismiss === 'cancel') {

        }
        });



    }).catch(function (err) {
        $('.fullScreenSpin').css('display','none');
        swal({
          title: 'Error',
          text: 'Template Setting Not Saved.',
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Done'

          }).then((result) => {
          if (result.value) {

          }else if (result.dismiss === 'cancel') {

          }
          });
    });

},


});
Template.registerHelper('equals', function(a, b) {
  return a === b;
});
