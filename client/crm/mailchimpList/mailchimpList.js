
Template.mailchimpList.onRendered(function () {
  const templateObject = Template.instance();
  function getCampaignOpenReports() {
    try {
      var erpGet = erpDb();
      Meteor.call('getCampaignOpenReports', erpGet, function (error, result) {
        if (error !== undefined) {
          swal("Something went wrong!", "", "error");
        } else {
          initDatatable(result);
        }
        $(".fullScreenSpin").css("display", "none");
      });
    } catch (error) {
      swal("Something went wrong!", "", "error");
      $(".fullScreenSpin").css("display", "none");
    }
  }
  getCampaignOpenReports();

  function initDatatable(data) {
    var reportArray = templateObject.makeEmailTableRows(data);
    $("#tblEmailList").DataTable({
      data: reportArray,
      columnDefs: [
        // {
        //   targets: 0,
        //   className: "colLabelCreatedDate",
        //   createdCell: function (td, cellData, rowData, row, col) {
        //     $(td).closest("tr").attr("data-id", rowData[3]);
        //     $(td).attr("data-id", rowData[3]);
        //   },
        // },
        // {
        //   targets: 1,
        //   className: "colLabel",
        //   createdCell: function (td, cellData, rowData, row, col) {
        //     $(td).attr("data-id", rowData[3]);
        //   },
        //   width: "100%",
        // },
        // {
        //   orderable: false,
        //   targets: 2,
        //   className: "colLabelActions",
        //   createdCell: function (td, cellData, rowData, row, col) {
        //     $(td).attr("data-id", rowData[3]);
        //   },
        //   width: "50px",
        // },
      ],
      sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
      buttons: [
        {
          extend: "excelHtml5",
          text: "",
          download: "open",
          className: "btntabletocsv hiddenColumn",
          filename: "Email Report List" + moment().format(),
          title: "Email Report",
          orientation: "portrait",
          exportOptions: {
            // columns: function (idx, data, node) {
            //   if (idx == 2) {
            //     return false;
            //   }
            //   return true;
            // },
          },
        },
        {
          extend: "print",
          download: "open",
          className: "btntabletopdf hiddenColumn",
          text: "",
          title: "Email Report List",
          filename: "Email Report List" + moment().format(),
          exportOptions: {
            // columns: function (idx, data, node) {
            //   if (idx == 2) {
            //     return false;
            //   }
            //   return true;
            // },
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
        $("#tblEmailList").DataTable().ajax.reload();
      },
      fnInitComplete: function () {
        $(
          "<button class='btn btn-primary btnSearchCrm btnSearchLabelsDatatable' type='button' id='btnRefreshLabels' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
        ).insertAfter("#tblEmailList_filter");
      },
    });
  }

  templateObject.makeEmailTableRows = function (data) {
    let taskRows = new Array();
    let td0 = (td1 = td2 = "");

    data.forEach((item) => {
      td0 = item.opens.length ? moment(item.opens[item.opens.length - 1].timestamp).format("YYYY-MM-DD HH:mm'") : '-';
      td1 = item.contact_status;

      td2 = item.opens_count;
      taskRows.push([item.email_address, td0, td1, td2]);
    });
    return taskRows;
  };
})