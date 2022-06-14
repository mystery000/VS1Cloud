import "jQuery.print/jQuery.print.js";
import { ReactiveVar } from "meteor/reactive-var";
import { SideBarService } from "../js/sidebar-service";
import { Random } from "meteor/random";
import { OrganisationService } from "../js/organisation-service";
// import { OrganisationService } from '../../js/organisation-service';
let sideBarService = new SideBarService();
let isDropdown = false;
let clickedInput = "";
Template.customfieldpop.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.custfields = new ReactiveVar([]);
});

Template.customfieldpop.onRendered(() => {
  const templateObject = Template.instance();
  $("#customField2,#customdateone").datepicker({
    showOn: "button",
    buttonText: "Show Date",
    buttonImageOnly: true,
    buttonImage: "/img/imgCal2.png",
    constrainInput: false,
    dateFormat: "d/mm/yy",
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
  });

  const custField = [];
  let count = 1;

  $("#sltCustomOne1").editableSelect();
  $("#sltCustomOne2").editableSelect();
  $("#sltCustomOne3").editableSelect();
  var splashArrayClientTypeList1 = new Array();

  $(document).ready(function () {
    $("#formCheck-customOne").click(function () {
      if ($(event.target).is(":checked")) {
        $(".checkbox1div").css("display", "block");
      } else {
        $(".checkbox1div").css("display", "none");
      }
    });

    $("#formCheck-customTwo").click(function () {
      if ($(event.target).is(":checked")) {
        $(".checkbox2div").css("display", "block");
      } else {
        $(".checkbox2div").css("display", "none");
      }
    });

    $("#formCheck-customThree").click(function () {
      if ($(event.target).is(":checked")) {
        $(".checkbox3div").css("display", "block");
      } else {
        $(".checkbox3div").css("display", "none");
      }
    });

    $(".customField1Text").blur(function () {
      var inputValue1 = $(".customField1Text").text();
      $(".lblCustomField1").text(inputValue1);
    });

    $(".customField2Text").blur(function () {
      var inputValue2 = $(".customField2Text").text();
      $(".lblCustomField2").text(inputValue2);
    });
  });

  templateObject.getSalesCustomFieldsList = function () {
    var url = FlowRouter.current().path;
    getVS1Data("TCustomFieldList")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          sideBarService
            .getAllCustomFields()
            .then(function (data) {
              addVS1Data("TCustomFieldList", JSON.stringify(data));
              let customData = {};
              for (let x = 0; x < data.tcustomfieldlist.length; x++) {
                if (
                  url.includes("/invoicecard") ||
                  url.includes("/salesordercard") ||
                  url.includes("/quotecard") ||
                  url.includes("/refundcard")
                ) {
                  if (data.tcustomfieldlist[x].fields.ListType == "ltSales") {
                    customData = {
                      active: data.tcustomfieldlist[x].fields.Active || false,
                      id: data.tcustomfieldlist[x].fields.ID,
                      custfieldlabel:
                        data.tcustomfieldlist[x].fields.Description,
                      isEmpty: data.tcustomfieldlist[x].fields.ISEmpty,
                      dropdown: data.tcustomfieldlist[x].fields.Dropdown,
                      isCombo: data.tcustomfieldlist[x].fields.IsCombo,
                    };
                    custField.push(customData);
                  }
                } else if (url.includes("/chequecard")) {
                  if (
                    data.tcustomfieldlist[x].fields.ListType == "ltOrderLines"
                  ) {
                    customData = {
                      active: data.tcustomfieldlist[x].fields.Active || false,
                      id: data.tcustomfieldlist[x].fields.ID,
                      custfieldlabel:
                        data.tcustomfieldlist[x].fields.Description,
                      isEmpty: data.tcustomfieldlist[x].fields.ISEmpty,
                      dropdown: data.tcustomfieldlist[x].fields.Dropdown,
                      isCombo: data.tcustomfieldlist[x].fields.IsCombo,
                    };
                    custField.push(customData);
                  }
                }
              }

              if (custField.length < 4) {
                let remainder = 4 - custField.length;
                count = count + remainder;
                for (let r = 0; r < remainder; r++) {
                  customData = {
                    active: false,
                    id: "",
                    custfieldlabel: "Custom Field " + count,
                    dropdown: "",
                  };
                  count++;
                  custField.push(customData);
                }
              }

              templateObject.custfields.set(custField);
            })
            .catch(function (err) {});
        } else {
          let data = JSON.parse(dataObject[0].data);
          let customData = {};
          for (let x = 0; x < data.tcustomfieldlist.length; x++) {
            if (
              url.includes("/invoicecard") ||
              url.includes("/salesordercard") ||
              url.includes("/quotecard") ||
              url.includes("/refundcard")
            ) {
              if (data.tcustomfieldlist[x].fields.ListType == "ltSales") {
                customData = {
                  active: data.tcustomfieldlist[x].fields.Active || false,
                  id: data.tcustomfieldlist[x].fields.ID,
                  custfieldlabel: data.tcustomfieldlist[x].fields.Description,
                  isEmpty: data.tcustomfieldlist[x].fields.ISEmpty,
                  dropdown: data.tcustomfieldlist[x].fields.Dropdown,
                  isCombo: data.tcustomfieldlist[x].fields.IsCombo,
                };
                custField.push(customData);
              }
            } else if (url.includes("/chequecard")) {
              if (data.tcustomfieldlist[x].fields.ListType == "ltOrderLines") {
                customData = {
                  active: data.tcustomfieldlist[x].fields.Active || false,
                  id: data.tcustomfieldlist[x].fields.ID,
                  custfieldlabel: data.tcustomfieldlist[x].fields.Description,
                  isEmpty: data.tcustomfieldlist[x].fields.ISEmpty,
                  dropdown: data.tcustomfieldlist[x].fields.Dropdown,
                  isCombo: data.tcustomfieldlist[x].fields.IsCombo,
                };
                custField.push(customData);
              }
            }
          }

          if (custField.length < 4) {
            let remainder = 4 - custField.length;
            count = count + remainder;
            for (let r = 0; r < remainder; r++) {
              customData = {
                active: false,
                id: "",
                custfieldlabel: "Custom Field " + count,
                dropdown: "",
              };
              count++;
              custField.push(customData);
            }
          }

          templateObject.custfields.set(custField);
        }
      })
      .catch(function (err) {
        sideBarService
          .getAllCustomFields()
          .then(function (data) {
            addVS1Data("TCustomFieldList", JSON.stringify(data));
            let customData = {};
            for (let x = 0; x < data.tcustomfieldlist.length; x++) {
              if (
                url.includes("/invoicecard") ||
                url.includes("/salesordercard") ||
                url.includes("/quotecard") ||
                url.includes("/refundcard")
              ) {
                if (data.tcustomfieldlist[x].fields.ListType == "ltSales") {
                  customData = {
                    active: data.tcustomfieldlist[x].fields.Active || false,
                    id: data.tcustomfieldlist[x].fields.ID,
                    custfieldlabel: data.tcustomfieldlist[x].fields.Description,
                    isEmpty: data.tcustomfieldlist[x].fields.ISEmpty,
                    dropdown: data.tcustomfieldlist[x].fields.Dropdown,
                    isCombo: data.tcustomfieldlist[x].fields.IsCombo,
                  };
                  custField.push(customData);
                }
              } else if (url.includes("/chequecard")) {
                if (
                  data.tcustomfieldlist[x].fields.ListType == "ltOrderLines"
                ) {
                  customData = {
                    active: data.tcustomfieldlist[x].fields.Active || false,
                    id: data.tcustomfieldlist[x].fields.ID,
                    custfieldlabel: data.tcustomfieldlist[x].fields.Description,
                    isEmpty: data.tcustomfieldlist[x].fields.ISEmpty,
                    dropdown: data.tcustomfieldlist[x].fields.Dropdown,
                    isCombo: data.tcustomfieldlist[x].fields.IsCombo,
                  };
                  custField.push(customData);
                }
              }
            }

            if (custField.length < 4) {
              let remainder = 4 - custField.length;
              count = count + remainder;
              for (let r = 0; r < remainder; r++) {
                customData = {
                  active: false,
                  id: "",
                  custfieldlabel: "Custom Field " + count,
                  dropdown: "",
                };
                count++;
                custField.push(customData);
              }
            }

            templateObject.custfields.set(custField);
          })
          .catch(function (err) {});
      });
  };

  setTimeout(function () {
    templateObject.getSalesCustomFieldsList();
  }, 500);

  templateObject.drawDropDownListTable = function (data_id) {
    let fieldsData = templateObject.custfields.get();
    splashArrayClientTypeList1 = [];

    // console.log("drawDropDownListTable---", data_id, fieldsData);
    $("#isdropDown" + data_id).val(true);

    if (fieldsData.length > 0) {
      for (let i = 0; i < fieldsData.length; i++) {
        if (Array.isArray(fieldsData[i].dropdown)) {
          if (fieldsData[i].dropdown.length > 0) {
            if (data_id - 1 == i) {
              for (let x = 0; x < fieldsData[i].dropdown.length; x++) {
                var dataList = [
                  fieldsData[i].dropdown[x].fields.ID || "",
                  fieldsData[i].dropdown[x].fields.Text || "",
                ];
                splashArrayClientTypeList1.push(dataList);
              }

              //}
            }
          }
        } else if (
          fieldsData[i].dropdown &&
          !Array.isArray(fieldsData[i].dropdown) &&
          Object.keys(fieldsData[i].dropdown).length > 0
        ) {
          if (data_id - 1 == i) {
            var dataList = [
              fieldsData[i].dropdown.fields.ID || "",
              fieldsData[i].dropdown.fields.Text || "",
            ];
            splashArrayClientTypeList1.push(dataList);
          }
        }
      }
    }

    //templateObject.datatablerecords.set(dataTableList);

    $(".fullScreenSpin").css("display", "none");
    setTimeout(function () {
      $("#customFieldDropdownTable" + data_id)
        .DataTable({
          data: splashArrayClientTypeList1,
          sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
          paging: true,
          aaSorting: [],
          orderMulti: true,
          columnDefs: [
            {
              orderable: false,
              targets: -1,
            },
            {
              className: "colCustField",
              targets: [0],
            },
            {
              className: "colFieldName pointer",
              targets: [1],
            },
          ],
          select: true,
          destroy: true,
          colReorder: true,
          pageLength: initialDatatableLoad,
          lengthMenu: [
            [initialDatatableLoad, -1],
            [initialDatatableLoad, "All"],
          ],
          info: true,
          responsive: true,
          fnInitComplete: function () {
            $(
              "<button class='btn btn-primary btnAddNewCustField' data-id='" +
                data_id +
                "' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus' data-id='" +
                data_id +
                "'></i></button>"
            ).insertAfter("#customFieldDropdownTable" + data_id + "_filter");
            $(
              "<button class='btn btn-primary btnRefreshCustomField' type='button' id='btnRefreshCustomField' data-id='" +
                data_id +
                "' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' data-id='" +
                data_id +
                "' style='margin-right: 5px'></i>Search</button>"
            ).insertAfter("#customFieldDropdownTable" + data_id + "_filter");
          },
        })
        .on("page", function () {
          setTimeout(function () {
            // MakeNegative();
          }, 100);
          let draftRecord = templateObject.datatablerecords.get();
          templateObject.datatablerecords.set(draftRecord);
        })
        .on("column-reorder", function () {})
        .on("length.dt", function (e, settings, len) {
          setTimeout(function () {
            // MakeNegative();
          }, 100);
        });
      $(".fullScreenSpin").css("display", "none");
    }, 10);

    setTimeout(() => {
      let custFieldNo = data_id;
      let custField = fieldsData[data_id - 1];
      $("#edtSaleCustField" + custFieldNo).editableSelect();
      $("#edtSaleCustField" + custFieldNo)
        .editableSelect()
        .on("click.editable-select", function (e, li) {
          // console.log("EDIT => edtSaleCustField select", custFieldNo);
          var $earch = $(this);
          var offset = $earch.offset();
          var fieldDataName = e.target.value || "";
          var fieldDataID =
            $("#edtSaleCustField" + custFieldNo).attr("custfieldid") || "";
          $("#selectCustFieldID").val(fieldDataID);
          if (e.pageX > offset.left + $earch.width() - 8) {
            // X button 16px wide?
            $("#customFieldDropdownListModal" + custFieldNo).modal("toggle");
          } else {
            if (fieldDataName.replace(/\s/g, "") != "") {
              // console.log("edit custom field dropdown field");
              $("#newStatusHeader" + custFieldNo).text(
                "Edit " + custField.custfieldlabel
              );
              getVS1Data("TCustomFieldList")
                .then(function (dataObject) {
                  //edit to test indexdb
                  if (dataObject.length == 0) {
                    $(".fullScreenSpin").css("display", "inline-block");
                    sideBarService.getAllCustomFields().then(function (data) {
                      for (let i in data.tcustomfieldlist) {
                        if (
                          data.tcustomfieldlist[i].fields.Description ===
                          fieldDataName
                        ) {
                          $("#statusId").val(
                            data.tcustomfieldlist[i].fields.ID
                          );
                          $("#newStatus").val(
                            data.tcustomfieldlist[i].fields.Description
                          );
                        }
                      }
                      // setTimeout(function () {
                      $(".fullScreenSpin").css("display", "none");
                      $("#newCustomFieldPop").modal("toggle");
                      // }, 200);
                    });
                  } else {
                    let data = JSON.parse(dataObject[0].data);
                    for (let i in data.tcustomfieldlist) {
                      if (
                        data.tcustomfieldlist[i].fields.Description ===
                        fieldDataName
                      ) {
                        $("#statusId").val(data.tcustomfieldlist[i].fields.ID);
                        $("#newStatus").val(
                          data.tcustomfieldlist[i].fields.Description
                        );
                      }
                    }
                    // setTimeout(function () {
                    $(".fullScreenSpin").css("display", "none");
                    $("#newCustomFieldPop").modal("newCustomFieldPop");
                    // }, 200);
                  }
                })
                .catch(function (err) {
                  $(".fullScreenSpin").css("display", "inline-block");
                  sideBarService.getAllCustomFields().then(function (data) {
                    for (let i in data.tcustomfieldlist) {
                      if (
                        data.tcustomfieldlist[i].fields.Description ===
                        fieldDataName
                      ) {
                        $("#statusId" + custFieldNo).val(
                          data.tcustomfieldlist[i].fields.ID
                        );
                        $("#newStatus" + custFieldNo).val(
                          data.tcustomfieldlist[i].fields.Description
                        );
                      }
                    }
                    // setTimeout(function () {
                    $(".fullScreenSpin").css("display", "none");
                    $("#newCustomFieldPop").modal("toggle");
                    // }, 200);
                  });
                });
            } else {
              $("#customFieldDropdownListModal").modal();
              // setTimeout(function () {
              //   $("#tblStatusPopList_filter .form-control-sm").focus();
              //   $("#tblStatusPopList_filter .form-control-sm").val("");
              //   $("#tblStatusPopList_filter .form-control-sm").trigger("input");
              //   var datatable = $("#tblStatusPopList").DataTable();

              //   datatable.draw();
              //   $("#tblStatusPopList_filter .form-control-sm").trigger("input");
              // }, 500);
            }
          }
        });
    }, 500);
  };

  // templateObject.tableheaderrecords.set(tableHeaderList);
  // $('div.dataTables_filter input').addClass('form-control form-control-sm')
});

Template.customfieldpop.events({
  "click .btnSaveCustomField": function () {
    // console.log("btnSaveCustomField-");
    const templateObject = Template.instance();

    let data_id = $("#currentCustomField").val();

    let organisationService = new OrganisationService();
    var url = FlowRouter.current().path;
    let fieldID = parseInt($("#statusId" + data_id).val()) || "";
    let termsName = $("#newStatus" + data_id).val() || "";
    let clickedInput = $("#clickedControl").val();
    let dropDownStatus = $("#isdropDown" + data_id).val();
    let dropDownData = [];
    let dropObj = "";
    let listType = "";
    let objDetails1 = "";
    $(".fullScreenSpin").css("display", "inline-block");
    if (
      url.includes("/invoicecard") ||
      url.includes("/salesordercard") ||
      url.includes("/quotecard") ||
      url.includes("/refundcard")
    ) {
      listType = "ltSales";
    } else if (url.includes("/chequecard")) {
      // customfield tempcode
      listType = "ltOrderLines";
    }

    if (fieldID == "") {
      // taxRateService.checkTermByName(termsName).then(function(data) {
      if (dropDownStatus == "true") {
        let countCustom = 0;
        $(".customText").each(function () {
          countCustom++;
          if ($(this).val()) {
            dropObj = {
              type: "TCustomFieldListDropDown",
              fields: {
                //Recno: parseInt(countCustom) || 0,
                Text: $(this).val(),
              },
            };
            dropDownData.push(dropObj);
          }
        });

        if (termsName !== "") {
          objDetails1 = {
            type: "TCustomFieldList",
            fields: {
              Active: true,
              DataType: "ftString",
              Description: termsName,
              Dropdown: dropDownData,
              IsCombo: true,
              ListType: listType,
            },
          };
        } else {
          objDetails1 = {
            type: "TCustomFieldList",
            fields: {
              Active: true,
              DataType: "ftString",
              //Description: termsName,
              Dropdown: dropDownData,
              IsCombo: true,
              ListType: listType,
            },
          };
        }
      } else {
        objDetails1 = {
          type: "TCustomFieldList",
          fields: {
            DataType: "ftString",
            Description: termsName,
            Dropdown: null,
            IsCombo: false,
            ListType: listType,
          },
        };
      }
      organisationService
        .saveCustomField(objDetails1)
        .then(function (objDetails) {
          sideBarService.getAllCustomFields().then(function (data) {
            addVS1Data("TCustomFieldList", JSON.stringify(data));
          });
          if (clickedInput == "one") {
            $(".lblCustomField1").text(termsName);
            // $('#edtSaleCustField1').val(termsName);
            $("#customFieldText1").val(termsName);
          } else if (clickedInput == "two") {
            $(".lblCustomField2").text(termsName);
            // $('#edtSaleCustField2').val(termsName);
            $("#customFieldText2").val(termsName);
          } else if (clickedInput == "three") {
            $(".lblCustomField3").text(termsName);
            // $('#edtSaleCustField3').val(termsName);
            $("#customFieldText3").val(termsName);
          }
          // addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
          $("#newCustomFieldPop").modal("toggle");
          $("#myModal4").modal("toggle");
          $(".fullScreenSpin").css("display", "none");
        })
        .catch(function (err) {
          swal({
            title: "Oooops...",
            text: err,
            type: "error",
            showCancelButton: false,
            confirmButtonText: "Try Again",
          }).then((result) => {
            if (result.value) {
              $(".fullScreenSpin").css("display", "none");
            } else if (result.dismiss === "cancel") {
            }
          });
          $(".fullScreenSpin").css("display", "none");
        });
    } else {
      if (dropDownStatus == "true") {
        let countCustom = 0;
        $(".customText").each(function () {
          countCustom++;
          if ($(this).val()) {
            dropObj = {
              type: "TCustomFieldListDropDown",
              fields: {
                ID: parseInt($(this).attr("token")) || 0,
                Text: $(this).val() || "",
              },
            };
            dropDownData.push(dropObj);
          }
        });

        if (termsName !== "") {
          objDetails1 = {
            type: "TCustomFieldList",
            fields: {
              DataType: "ftString",
              Description: termsName,
              Dropdown: dropDownData,
              ID: fieldID,
              IsCombo: true,
              ListType: listType,
            },
          };
        } else {
          objDetails1 = {
            type: "TCustomFieldList",
            fields: {
              DataType: "ftString",
              //Description: termsName,
              Dropdown: dropDownData,
              ID: fieldID,
              IsCombo: true,
              ListType: listType,
            },
          };
        }
      } else {
        objDetails1 = {
          type: "TCustomFieldList",
          fields: {
            DataType: "ftString",
            Description: termsName,
            ID: fieldID,
            Dropdown: null,
            IsCombo: false,
            ListType: listType,
          },
        };
      }

      organisationService
        .saveCustomField(objDetails1)
        .then(function (objDetails) {
          // sideBarService.getTermsVS1().then(function(dataReload) {
          sideBarService.getAllCustomFields().then(function (data) {
            addVS1Data("TCustomFieldList", JSON.stringify(data));
          });
          if (clickedInput == "one") {
            $(".lblCustomField1").text(termsName);
            // $('#edtSaleCustField1').val(termsName);
            $("#customFieldText1").val(termsName);
          } else if (clickedInput == "two") {
            $(".lblCustomField2").text(termsName);
            // $('#edtSaleCustField2').val(termsName);
            $("#customFieldText2").val(termsName);
          } else if (clickedInput == "three") {
            $(".lblCustomField3").text(termsName);
            // $('#edtSaleCustField3').val(termsName);
            $("#customFieldText3").val(termsName);
          }
          templateObject.drawDropDownListTable(data_id);
          // addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
          $("#newCustomFieldPop").modal("toggle");
          $("#myModal4").modal("toggle");
          $(".fullScreenSpin").css("display", "none");
          // }).catch(function(err) {
          //     $('#newTermsModal').modal('toggle');
          //     $('.fullScreenSpin').css('display', 'none');
          // });
          // }).catch(function(err) {
          //     $('#newTermsModal').modal('toggle');
          //     $('.fullScreenSpin').css('display', 'none');
          // });
        })
        .catch(function (err) {
          swal({
            title: "Oooops...",
            text: err,
            type: "error",
            showCancelButton: false,
            confirmButtonText: "Try Again",
          }).then((result) => {
            if (result.value) {
              $(".fullScreenSpin").css("display", "none");
            } else if (result.dismiss === "cancel") {
            }
          });
          $(".fullScreenSpin").css("display", "none");
        });
    }
  },

  "click .btnRefreshCustomField": function (event) {
    $(".fullScreenSpin").css("display", "inline-block");
    sideBarService
      .getAllCustomFields()
      .then(function (data) {
        //addVS1Data('TCustomFieldList', JSON.stringify(data));
        addVS1Data("TCustomFieldList", JSON.stringify(data))
          .then(function (datareturn) {
            Meteor._reload.reload();
          })
          .catch(function (err) {
            Meteor._reload.reload();
          });

        $(".fullScreenSpin").css("display", "none");
      })
      .catch(function (err) {
        $(".fullScreenSpin").css("display", "none");
      });
  },

  "click .btnCustomFieldToggleText": function (e) {
    const templateObject = Template.instance();
    let data_id = e.target.dataset.id;
    $("#isdropDown" + data_id).val(false);

    let custfieldarr = templateObject.custfields.get();
    let selected_data = custfieldarr[data_id - 1];
    if (data_id == 1) {
      clickedInput = "one";
    } else if (data_id == 2) {
      clickedInput = "two";
    } else {
      clickedInput = "three";
    }
    $("#clickedControl").val(clickedInput);
    $("#currentCustomField").val(data_id);

    isDropdown = false;
    $("#customFieldText" + data_id).attr("datatype", "ftString");
    $("#isdropDown" + data_id).val(isDropdown);
    var url = FlowRouter.current().path;
    let custfield1 = "";
    if (
      url.includes("/invoicecard") ||
      url.includes("/salesordercard") ||
      url.includes("/quotecard") ||
      url.includes("/refundcard")
    ) {
      custfield1 = selected_data.custfieldlabel || "Custom Field " + data_id;
    } else if (url.includes("/chequecard")) {
      custfield1 = selected_data.custfieldlabel || "Custom Field " + data_id;
    } else {
      custfield1 = "Custom Field " + data_id;
    }
    $(".custField" + data_id + "Text").css("display", "block");
    $(".custField" + data_id + "Date").css("display", "none");
    $(".custField" + data_id + "Dropdown").css("display", "none");

    $("#statusId" + data_id).val(selected_data.id);

    $(".checkbox" + data_id + "div").empty();
    $(".checkbox" + data_id + "div").append(
      '<div class="form-group"><label class="lblCustomField' +
        data_id +
        '">' +
        custfield1 +
        "</label>" +
        '<input class="form-control form-control" type="text" id="edtSaleCustField' +
        data_id +
        '" name="edtSaleCustField' +
        data_id +
        '" value=""> </div>'
    );
    $("#edtSaleCustField" + data_id).attr("datatype", "ftString");
  },

  "click .btnCustomFieldToggleDate": function (e) {
    const templateObject = Template.instance();
    let data_id = e.target.dataset.id;
    $("#isdropDown" + data_id).val(false);

    let custfieldarr = templateObject.custfields.get();
    let selected_data = custfieldarr[data_id - 1];
    $("#currentCustomField").val(data_id);

    isDropdown = false;
    $("#isdropDown" + data_id).val(isDropdown);
    $("#statusId" + data_id).val(selected_data.id || "");
    if (data_id == 1) {
      clickedInput = "one";
    } else if (data_id == 2) {
      clickedInput = "two";
    } else {
      clickedInput = "three";
    }
    $("#clickedControl").val(clickedInput);
    var url = FlowRouter.current().path;
    let custfield1 = "";
    if (
      url.includes("/invoicecard") ||
      url.includes("/salesordercard") ||
      url.includes("/quotecard") ||
      url.includes("/refundcard")
    ) {
      custfield1 = selected_data.custfieldlabel || "Custom Field " + data_id;
    } else if (url.includes("/chequecard")) {
      custfield1 = selected_data.custfieldlabel || "Custom Field " + data_id;
    } else {
      custfield1 = "Custom Field " + data_id;
    }

    $(".custField" + data_id + "Text").css("display", "none");
    $(".custField" + data_id + "Date").css("display", "block");
    $(".custField" + data_id + "Dropdown").css("display", "none");
    $("#customFieldText" + data_id).attr("datatype", "ftDateTime");

    $(".checkbox" + data_id + "div").empty();
    $(".checkbox" + data_id + "div").append(
      '<div class="form-group" data-placement="bottom" title="Date format: DD/MM/YYYY"><label class="lblCustomField' +
        data_id +
        '">' +
        custfield1 +
        "<br></label>" +
        '<div class="input-group date" style="cursor: pointer;"><input type="text" class="form-control customField' +
        data_id +
        '" style="width: 86% !important; display: inline-flex;" id="edtSaleCustField' +
        data_id +
        '" name="edtSaleCustField' +
        data_id +
        '" value="">' +
        '<div class="input-group-addon" style=""><span class="glyphicon glyphicon-th" style="cursor: pointer;"></span>' +
        "</div> </div></div>"
    );
    $("#edtSaleCustField" + data_id).attr("datatype", "ftDateTime");

    setTimeout(function () {
      $("#edtSaleCustField" + data_id).datepicker({
        showOn: "button",
        buttonText: "Show Date",
        buttonImageOnly: true,
        buttonImage: "/img/imgCal2.png",
        constrainInput: false,
        dateFormat: "d/mm/yy",
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
      });

      var currentDate = new Date();
      var begunDate = moment(currentDate).format("DD/MM/YYYY");
      $("#edtSaleCustField" + data_id).val(begunDate);
    }, 1500);
  },

  "click .btnCustomFieldToggleDrop": function (e) {
    const templateObject = Template.instance();
    let data_id = e.target.dataset.id;
    let custfieldarr = templateObject.custfields.get();

    // console.log("custfieldarr-->", custfieldarr);
    custfieldarr[data_id - 1].datatype = "ftString";
    custfieldarr[data_id - 1].isCombo = true;

    // console.log("custfieldarr custfields-->", custfieldarr);
    templateObject.custfields.set(custfieldarr);

    let selected_data = custfieldarr[data_id - 1];
    isDropdown = true;
    $("#isdropDown" + data_id).val(isDropdown);
    $("#statusId" + data_id).val(selected_data.id || "");
    $(".custField" + data_id + "Text").css("display", "none");
    $(".custField" + data_id + "Date").css("display", "none");
    $(".custField" + data_id + "Dropdown").css("display", "block");
    $("#currentCustomField").val(data_id);

    let tokenid = Random.id();

    if (data_id == 1) {
      clickedInput = "one";
    } else if (data_id == 2) {
      clickedInput = "two";
    } else {
      clickedInput = "three";
    }
    $("#clickedControl").val(clickedInput);
    var url = FlowRouter.current().path;
    let custfield1 = "";
    if (
      url.includes("/invoicecard") ||
      url.includes("/salesordercard") ||
      url.includes("/quotecard") ||
      url.includes("/refundcard")
    ) {
      custfield1 = selected_data.custfieldlabel || "Custom Field " + data_id;
    } else if (url.includes("/chequecard")) {
      custfield1 = selected_data.custfieldlabel || "Custom Field " + data_id;
    } else {
      custfield1 = "Custom Field " + data_id;
    }
    $("#customFieldText" + data_id).attr("datatype", "ftString");
    $(".checkbox" + data_id + "div").empty();
    if (Array.isArray(selected_data.dropdown)) {
      $(".btnAddNewTextBox").nextAll().remove();
      for (let x = 0; x < selected_data.dropdown.length; x++) {
        $(".dropDownSection").append(
          '<div class="row textBoxSection" id="textBoxSection" style="padding:5px">' +
            '<div class="col-10">' +
            '<input type="text" style="" name="customText" class="form-control customText" token="' +
            selected_data.dropdown[x].fields.ID +
            '" value="' +
            selected_data.dropdown[x].fields.Text +
            '" autocomplete="off">' +
            "</div>" +
            '<div class="col-2">' +
            '<button type="button" class="btn btn-danger btn-rounded btnRemoveDropOptions" autocomplete="off"><i class="fa fa-remove"></i></button>' +
            "</div>" +
            "</div>"
        );
      }
    } else if (
      selected_data.dropdown &&
      !Array.isArray(selected_data.dropdown) &&
      Object.keys(selected_data.dropdown).length > 0
    ) {
      $(".btnAddNewTextBox").nextAll().remove();
      $(".dropDownSection").append(
        '<div class="row textBoxSection" id="textBoxSection" style="padding:5px">' +
          '<div class="col-10">' +
          '<input type="text" style="" name="customText" class="form-control customText" token="' +
          selected_data.dropdown.fields.ID +
          '" value="' +
          selected_data.dropdown.fields.Text +
          '" autocomplete="off">' +
          "</div>" +
          '<div class="col-2">' +
          '<button type="button" class="btn btn-danger btn-rounded btnRemoveDropOptions" autocomplete="off"><i class="fa fa-remove"></i></button>' +
          "</div>" +
          "</div>"
      );
    }
    $(".dropDownSection").show();
    $("#newStatus" + data_id).val($("#customFieldText" + data_id).val());
    $("#newCustomFieldPop").modal("toggle");
    templateObject.drawDropDownListTable(data_id);

    $(".checkbox" + data_id + "div").append(
      '<div class="form-group"><label class="lblCustomField' +
        data_id +
        '">' +
        custfield1 +
        "<br></label>" +
        ' <select type="search" class="form-control pointer customField' +
        data_id +
        '" id="edtSaleCustField' +
        data_id +
        '" name="edtSaleCustField' +
        data_id +
        '" style="background-color:rgb(255, 255, 255); border-top-left-radius: 0.35rem; border-bottom-left-radius: 0.35rem;"></select></div>'
    );
    $("#edtSaleCustField" + data_id).attr("datatype", "ftString");
    setTimeout(function () {
      $("#edtSaleCustField" + data_id).editableSelect();
      $("#edtSaleCustField" + data_id)
        .editableSelect()
        .on("click.editable-select", function (e, li) {
          var $earch = $(this);
          var offset = $earch.offset();
          var fieldDataName = e.target.value || "";
          if (e.pageX > offset.left + $earch.width() - 8) {
            // X button 16px wide?
            $("#customFieldList").modal("toggle");
          } else {
            if (fieldDataName.replace(/\s/g, "") != "") {
              $("#newStatusHeader" + data_id).text("Edit Custom Field");
              getVS1Data("TCustomFieldList")
                .then(function (dataObject) {
                  //edit to test indexdb
                  if (dataObject.length == 0) {
                    $(".fullScreenSpin").css("display", "inline-block");
                    sideBarService.getAllCustomFields().then(function (data) {
                      for (let i in data.tcustomfieldlist) {
                        if (
                          data.tcustomfieldlist[i].fields.Description ===
                          fieldDataName
                        ) {
                          $("#statusId" + data_id).val(
                            data.tcustomfieldlist[i].fields.ID
                          );
                          $("#newStatus" + data_id).val(
                            data.tcustomfieldlist[i].fields.Description
                          );
                        }
                      }
                      setTimeout(function () {
                        $(".fullScreenSpin").css("display", "none");
                        $("#newCustomFieldPop").modal("toggle");
                      }, 200);
                    });
                  } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tcustomfieldlist;
                    for (let i in useData) {
                      if (
                        data.tcustomfieldlist[i].fields.Description ===
                        fieldDataName
                      ) {
                        $("#statusId" + data_id).val(useData[i].fields.ID);
                        $("#newStatus" + data_id).val(
                          useData[i].fields.Description
                        );
                      }
                    }
                    setTimeout(function () {
                      $(".fullScreenSpin").css("display", "none");
                      $("#newCustomFieldPop").modal("newCustomFieldPop");
                    }, 200);
                  }
                })
                .catch(function (err) {
                  $(".fullScreenSpin").css("display", "inline-block");
                  sideBarService.getAllCustomFields().then(function (data) {
                    for (let i in data.tcustomfieldlist) {
                      if (
                        data.tcustomfieldlist[i].fields.Description ===
                        fieldDataName
                      ) {
                        $("#statusId" + data_id).val(
                          data.tcustomfieldlist[i].fields.ID
                        );
                        $("#newStatus" + data_id).val(
                          data.tcustomfieldlist[i].fields.Description
                        );
                      }
                    }
                    setTimeout(function () {
                      $(".fullScreenSpin").css("display", "none");
                      $("#newCustomFieldPop").modal("toggle");
                    }, 200);
                  });
                });
            } else {
              $("#customFieldList").modal("toggle");
            }
          }
        });
    }, 1500);
  },

  "click .btnCustomFieldResetSettings": function (event) {
    var url = FlowRouter.current().path;
    let organisationService = new OrganisationService();
    var url = FlowRouter.current().path;
    let fieldData = [];
    let checkChckBox = false;

    $("#formCheck-customOne").prop("checked", false);
    $(".checkbox1div").css("display", "none");
    $("#formCheck-customTwo").prop("checked", false);
    $(".checkbox2div").css("display", "none");
    $("#formCheck-customThree").prop("checked", false);
    $(".checkbox3div").css("display", "none");

    $(".custField1Text").css("display", "block");
    $(".custField1Date").css("display", "none");
    $(".custField1Dropdown").css("display", "none");

    $(".custField2Text").css("display", "block");
    $(".custField2Date").css("display", "none");
    $(".custField2Dropdown").css("display", "none");

    $(".custField3Text").css("display", "block");
    $(".custField3Date").css("display", "none");
    $(".custField3Dropdown").css("display", "none");

    let field_no = 1;
    $(".customfieldcommon").each(function () {
      dropObj = {
        active: checkChckBox,
        id: $(this).attr("custid") || "",
        name: "Custom Field" + field_no,
        datatype: "ftString",
      };
      fieldData.push(dropObj);
      field_no++;
    });

    let listType = "";
    let objDetails1 = "";
    $(".fullScreenSpin").css("display", "inline-block");
    if (
      url.includes("/invoicecard") ||
      url.includes("/salesordercard") ||
      url.includes("/quotecard") ||
      url.includes("/refundcard")
    ) {
      listType = "ltSales";
    } else if (url.includes("/chequecard")) {
      // customfield tempcode
      listType = "ltOrderLines";
    }

    for (let i = 0; i < fieldData.length; i++) {
      let fieldID = fieldData[i].id || 0;
      let name = fieldData[i].name || "";

      if (fieldID == "") {
        if (i == 0) {
          $(".lblCustomField1").text("Text Field");
          $("#customFieldText1").val("Custom Field1");
        }

        if (i == 1) {
          $(".lblCustomField2").text("Text Field");
          $("#customFieldText2").val("Custom Field2");
        }

        if (i == 2) {
          $(".lblCustomField3").text("Text Field");
          $("#customFieldText3").val("Custom Field3");
          $("#myModal4").modal("toggle");
          $(".fullScreenSpin").css("display", "none");
        }
      } else {
        objDetails1 = {
          type: "TCustomFieldList",
          fields: {
            Active: false,
            ID: fieldID,
            DataType: "ftString",
            Description: name,
            ListType: listType,
            IsCombo: "false",
          },
        };

        organisationService
          .saveCustomField(objDetails1)
          .then(function (objDetails) {
            if (i == 0) {
              $(".lblCustomField1").text("Text Field");
              $("#customFieldText1").val(fieldData[i].name);
            }

            if (i == 1) {
              $(".lblCustomField2").text("Text Field");
              $("#customFieldText2").val(fieldData[i].name);
            }

            if (i == 2) {
              $(".lblCustomField3").text("Text Field");
              $("#customFieldText3").val(fieldData[i].name);
              $("#myModal4").modal("toggle");
              $(".fullScreenSpin").css("display", "none");
            }
          })
          .catch(function (err) {
            swal({
              title: "Oooops...",
              text: err,
              type: "error",
              showCancelButton: false,
              confirmButtonText: "Try Again",
            }).then((result) => {
              if (result.value) {
                $(".fullScreenSpin").css("display", "none");
              } else if (result.dismiss === "cancel") {
              }
            });
            $(".fullScreenSpin").css("display", "none");
          });
      }
    }

    setTimeout(function () {
      sideBarService.getAllCustomFields().then(function (data) {
        addVS1Data("TCustomFieldList", JSON.stringify(data));
      });
    }, 1500);
  },

  "click .btnCustomFieldSaveSettings": function (event) {
    var url = FlowRouter.current().path;
    let organisationService = new OrganisationService();
    var url = FlowRouter.current().path;
    let fieldData = [];
    let checkChckBox = false;
    $(".customfieldcommon").each(function () {
      if (
        $(this).closest(".custom-switch").find("[type=checkbox]").is(":checked")
      ) {
        checkChckBox = true;
      } else {
        checkChckBox = false;
      }
      dropObj = {
        active: checkChckBox,
        id: $(this).attr("custid") || "",
        name: $(this).val() || "",
        datatype: $(this).attr("datatype") || "",
      };
      fieldData.push(dropObj);
    });

    let listType = "";
    let objDetails1 = "";
    $(".fullScreenSpin").css("display", "inline-block");
    if (
      url.includes("/invoicecard") ||
      url.includes("/salesordercard") ||
      url.includes("/quotecard") ||
      url.includes("/refundcard")
    ) {
      listType = "ltSales";
    } else if (url.includes("/chequecard")) {
      // customfield tempcode
      listType = "ltOrderLines";
    }

    for (let i = 0; i < fieldData.length; i++) {
      let fieldID = fieldData[i].id || 0;
      let name = fieldData[i].name || "";
      let dataType = fieldData[i].datatype || "";
      let isdropDown = $("#isdropDown" + (1 + parseInt(i))).val() || false;

      if (fieldID == "") {
        if (dataType == "ftDateTime") {
          objDetails1 = {
            type: "TCustomFieldList",
            fields: {
              Active: fieldData[i].active || false,
              DataType: "ftDateTime",
              Description: name,
              ListType: listType,
              IsCombo: false,
            },
          };
        } else {
          objDetails1 = {
            type: "TCustomFieldList",
            fields: {
              Active: fieldData[i].active || false,
              DataType: "ftString",
              Description: name,
              ListType: listType,
              IsCombo: isdropDown,
            },
          };
        }

        organisationService
          .saveCustomField(objDetails1)
          .then(function (objDetails) {
            if (i == 0) {
              $(".lblCustomField1").text(fieldData[i].name);
              $("#customFieldText1").val(fieldData[i].name);
            }

            if (i == 1) {
              $(".lblCustomField2").text(fieldData[i].name);
              $("#customFieldText2").val(fieldData[i].name);
            }

            if (i == 2) {
              $(".lblCustomField3").text(fieldData[i].name);
              $("#customFieldText3").val(fieldData[i].name);
              $("#myModal4").modal("toggle");
              $(".fullScreenSpin").css("display", "none");
            }
          })
          .catch(function (err) {
            swal({
              title: "Oooops...",
              text: err,
              type: "error",
              showCancelButton: false,
              confirmButtonText: "Try Again",
            }).then((result) => {
              if (result.value) {
                $(".fullScreenSpin").css("display", "none");
              } else if (result.dismiss === "cancel") {
              }
            });
            $(".fullScreenSpin").css("display", "none");
          });
      } else {
        if (dataType == "ftDateTime") {
          objDetails1 = {
            type: "TCustomFieldList",
            fields: {
              Active: fieldData[i].active || false,
              ID: fieldID,
              DataType: "ftDateTime",
              Description: name,
              ListType: listType,
              IsCombo: false,
            },
          };
        } else {
          objDetails1 = {
            type: "TCustomFieldList",
            fields: {
              Active: fieldData[i].active || false,
              ID: fieldID,
              DataType: "ftString",
              Description: name,
              ListType: listType,
              IsCombo: isdropDown,
            },
          };
        }

        organisationService
          .saveCustomField(objDetails1)
          .then(function (objDetails) {
            if (i == 0) {
              $(".lblCustomField1").text(fieldData[i].name);
              $("#customFieldText1").val(fieldData[i].name);
            }

            if (i == 1) {
              $(".lblCustomField2").text(fieldData[i].name);
              $("#customFieldText2").val(fieldData[i].name);
            }

            if (i == 2) {
              $(".lblCustomField3").text(fieldData[i].name);
              $("#customFieldText3").val(fieldData[i].name);
              $("#myModal4").modal("toggle");
              $(".fullScreenSpin").css("display", "none");
            }
          })
          .catch(function (err) {
            swal({
              title: "Oooops...",
              text: err,
              type: "error",
              showCancelButton: false,
              confirmButtonText: "Try Again",
            }).then((result) => {
              if (result.value) {
                $(".fullScreenSpin").css("display", "none");
              } else if (result.dismiss === "cancel") {
              }
            });
            $(".fullScreenSpin").css("display", "none");
          });
      }
    }

    setTimeout(function () {
      sideBarService.getAllCustomFields().then(function (data) {
        addVS1Data("TCustomFieldList", JSON.stringify(data));
      });
    }, 1500);
  },

  "click .btnAddNewTextBox": function (event) {
    var textBoxData = $("#textBoxSection:last").clone(true);
    let tokenid = Random.id();
    textBoxData.find("input:text").val("");
    textBoxData.find("input:text").attr("token", "0");
    $(".dropDownSection").append(textBoxData);
  },

  "click .btnRemoveDropOptions": function (event) {
    if ($(".textBoxSection").length > 1) {
      $(event.target).closest(".textBoxSection").remove();
    } else {
      $("input[name='customText']").val("");
    }
  },
});

Template.customfieldpop.helpers({
  custfield1: () => {
    let url = FlowRouter.current().path;
    if (url.includes("/salesordercard")) {
      return localStorage.getItem("custfield1salesorder") || "Custom Field 1";
    } else if (url.includes("/invoicecard")) {
      return localStorage.getItem("custfield1invoice") || "Custom Field 1";
    } else if (url.includes("/quotecard")) {
      return localStorage.getItem("custfield1quote") || "Custom Field 1";
    } else if (url.includes("/refundcard")) {
      return localStorage.getItem("custfield1refund") || "Custom Field 1";
    } else if (url.includes("/chequecard")) {
      return localStorage.getItem("custfield1cheque") || "Custom Field 1";
    }
  },
  custfield2: () => {
    let url = FlowRouter.current().path;
    if (url.includes("/salesordercard")) {
      return localStorage.getItem("custfield2salesorder") || "Custom Field 2";
    } else if (url.includes("/invoicecard")) {
      return localStorage.getItem("custfield2invoice") || "Custom Field 2";
    } else if (url.includes("/quotecard")) {
      return localStorage.getItem("custfield2quote") || "Custom Field 2";
    } else if (url.includes("/refundcard")) {
      return localStorage.getItem("custfield2refund") || "Custom Field 2";
    } else if (url.includes("/chequecard")) {
      return localStorage.getItem("custfield2cheque") || "Custom Field 2";
    }
  },
  custfield3: () => {
    let url = FlowRouter.current().path;
    if (url.includes("/salesordercard")) {
      return localStorage.getItem("custfield3salesorder") || "Custom Field 3";
    } else if (url.includes("/invoicecard")) {
      return localStorage.getItem("custfield3invoice") || "Custom Field 3";
    } else if (url.includes("/quotecard")) {
      return localStorage.getItem("custfield3quote") || "Custom Field 3";
    } else if (url.includes("/refundcard")) {
      return localStorage.getItem("custfield3refund") || "Custom Field 3";
    } else if (url.includes("/chequecard")) {
      return localStorage.getItem("custfield3cheque") || "Custom Field 3";
    }
  },
  custfields: () => {
    return Template.instance().custfields.get();
  },
});
Template.registerHelper("equals", function (a, b) {
  return a === b;
});

Template.registerHelper("notEquals", function (a, b) {
  return a != b;
});

Template.registerHelper("containsequals", function (a, b) {
  return a.indexOf(b) >= 0;
});
