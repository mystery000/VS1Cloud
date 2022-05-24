Template.filterLabelsTab.inheritsHelpersFrom("alltaskdatatable");
Template.filterLabelsTab.inheritsEventsFrom("alltaskdatatable");
Template.filterLabelsTab.inheritsHooksFrom("alltaskdatatable");

import { CRMService } from "../crm-service";
let crmService = new CRMService();

Template.filterLabelsTab.onCreated(function () {
  let templateObject = Template.instance();
  templateObject.alllabels = new ReactiveVar([]);
  templateObject.allfilters = new ReactiveVar([]);
});

Template.filterLabelsTab.onRendered(function () {
  let templateObject = Template.instance();
  templateObject.getAllLabels = function () {
    crmService
      .getAllLabels()
      .then(function (data) {
        if (
          data.tprojecttask_tasklabel &&
          data.tprojecttask_tasklabel.length > 0
        ) {
          let alllabels = data.tprojecttask_tasklabel;
          templateObject.alllabels.set(alllabels);

          let label_dropdowns = "";
          let detail_label_dropdowns = "";
          alllabels.forEach((lbl) => {
            label_dropdowns += `<a class="dropdown-item add_label" data-id="${lbl.fields.ID}">
            <i class="fas fa-tag text-primary" style="margin-right: 8px;" data-id="${lbl.fields.ID}"></i>${lbl.fields.TaskLabelName}
              <div style="width: 20%; float: right;" data-id="${lbl.fields.ID}">
                <div class="custom-control custom-checkbox chkBox pointer"
                  style="width: 15px; float: right;" data-id="${lbl.fields.ID}">
                  <input class="custom-control-input chkBox chkAddLabel pointer" type="checkbox"
                    id="add_label_${lbl.fields.ID}" name="${lbl.fields.ID}" value="" data-id="${lbl.fields.ID}">
                  <label class="custom-control-label chkBox pointer" for="add_label_${lbl.fields.ID}" data-id="${lbl.fields.ID}"></label>
                </div>
              </div>
            </a>`;
            detail_label_dropdowns += `<a class="dropdown-item detail_label" data-id="${lbl.fields.ID}">
            <i class="fas fa-tag text-primary" style="margin-right: 8px;" data-id="${lbl.fields.ID}"></i>${lbl.fields.TaskLabelName}
              <div style="width: 20%; float: right;" data-id="${lbl.fields.ID}">
                <div class="custom-control custom-checkbox chkBox pointer"
                  style="width: 15px; float: right;" data-id="${lbl.fields.ID}">
                  <input class="custom-control-input chkBox chkDetailLabel pointer" type="checkbox"
                    id="detail_label_${lbl.fields.ID}" name="${lbl.fields.ID}" value="" data-id="${lbl.fields.ID}">
                  <label class="custom-control-label chkBox pointer" for="detail_label_${lbl.fields.ID}" data-id="${lbl.fields.ID}"></label>
                </div>
              </div>
            </a>`;
          });
          $("#addTaskLabelWrapper").html(label_dropdowns);
          $(".detailTaskLabelWrapper").html(detail_label_dropdowns);

          // setTimeout(() => {
          //   templateObject.initLabelsTable();
          // }, 100);
        } else {
          templateObject.alllabels.set([]);
        }
      })
      .catch(function (err) {});
  };

  setTimeout(() => {
    templateObject.initLabelsTable();
  }, 5000);

  templateObject.initLabelsTable = function () {
    $("#tblLabels").DataTable({
      columnDefs: [
        {
          orderable: false,
          targets: 2,
        },
      ],
      sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
      buttons: [
        {
          extend: "excelHtml5",
          text: "",
          download: "open",
          className: "btntabletocsv hiddenColumn",
          filename: "Label List" + moment().format(),
          orientation: "portrait",
          exportOptions: {
            columns: ":visible",
            format: {
              body: function (data, row, column) {
                if (data.includes("</span>")) {
                  var res = data.split("</span>");
                  data = res[1];
                }

                return column === 1 ? data.replace(/<.*?>/gi, "") : data;
              },
            },
          },
        },
        {
          extend: "print",
          download: "open",
          className: "btntabletopdf hiddenColumn",
          text: "",
          title: "Label List",
          filename: "Label List" + moment().format(),
          exportOptions: {
            columns: ":visible",
            stripHtml: false,
          },
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
      order: [[1, "desc"]],
      action: function () {
        $("#tblLabels").DataTable().ajax.reload();
      },
      fnInitComplete: function () {
        $(
          "<button class='btn btn-primary btnNewLabel' type='button' id='btnNewLabel' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus' style='margin-right: 5px'></i>New Label</button>"
        ).insertAfter("#tblLabels_filter");
        $(
          "<button class='btn btn-primary btnRefreshLabels' type='button' id='btnRefreshLabels' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
        ).insertAfter("#tblLabels_filter");
      },
    });
  };

  templateObject.getAllLabels();
});

// Template.filterLabelsTab.hooks({
//   created() {

//   },
//   rendered() {

//   }
// })

Template.filterLabelsTab.events({
  "click .btnEditLabel": function (e) {
    let id = e.target.dataset.id;
    if (id) {
      $("#editLabelID").val(id);

      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();
      crmService.getOneLabel(id).then(function (obj) {
        $("#editLabelName").val(obj.fields.TaskLabelName);
        // $('#editLabelColor').val();

        $("#editLabelModal").modal("toggle");

        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  "click .btnAddNewLabel": function (e) {
    let labelName = $("#newLabelName").val();
    let labelColor = $("#newLabelColor").val();

    if (labelName == "") {
      swal("Please put the Label Name", "", "warning");
      return;
    }

    var objDetails = {
      type: "Tprojecttask_TaskLabel",
      fields: {
        TaskLabelName: labelName,
        TaskID: 1, // tempcode. it should be removed after api is updated
      },
    };

    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    crmService.updateLabel(objDetails).then(function (objDetails) {
      templateObject.getAllLabels();
      $("#newLabelModal").modal("hide");
      $(".fullScreenSpin").css("display", "none");
    });
  },

  "click .btnSaveEditLabel": function (e) {
    let id = $("#editLabelID").val();
    let labelName = $("#editLabelName").val();
    let labelColor = $("#editLabelColor").val();

    if (labelName == "") {
      swal("Please put the Label Name", "", "warning");
      return;
    }

    if (id) {
      var objDetails = {
        type: "Tprojecttask_TaskLabel",
        fields: {
          ID: id,
          TaskLabelName: labelName,
        },
      };

      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();
      crmService.updateLabel(objDetails).then(function (objDetails) {
        templateObject.getAllLabels();
        $("#editLabelModal").modal("hide");
        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  "click .btnDeleteLabel": function (e) {
    let id = e.target.dataset.id;

    if (id) {
      var objDetails = {
        type: "Tprojecttask_TaskLabel",
        fields: {
          ID: id,
          Active: false,
        },
      };

      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();
      crmService.updateLabel(objDetails).then(function (objDetails) {
        templateObject.getAllLabels();
        $(".fullScreenSpin").css("display", "none");
      });
    }
  },
});
