import { SideBarService } from "../../js/sidebar-service";
export default class TableHandler {
  constructor() {
    this.bindEvents();
  }

  bindEvents() {
    // $(".dataTable").on("DOMSubtreeModified",  () => {
    //   this.refreshDatatableResizable();
    // });
    this.refreshDatatableResizable();

    $(".dataTable thead tr").on("mousedown",  () => {
      $('body').on('mouseup', () => {
        this.refreshDatatableResizable();
      })
    });
  }


  /**
   * this will refresh events related to resizing features
   */
  refreshDatatableResizable() {
    this.disableDatatableResizable();
    this.enableDatatableResizable();
  }

  /***
     * Then we need to add back the listeners
     *
     * By doing disabling and re-enabling, start fresh events
     * instead of cummulating multiple listeners which is causing issues
     */
  enableDatatableResizable() {
    $(".dataTable").colResizable({
      liveDrag: true,
      gripInnerHtml: "<div class='grip'></div>",
      draggingClass: "dragging",
      resizeMode: "overflow",
      minWidth: 100,
      onResize: e => {
        var table = $(e.currentTarget); //reference to the resized table
        let tableName = table.attr('id');
        if( tableName != 'tblBasReturnList' ){
          this.saveTableColumns( tableName );
        }
        let tableWidth = [];
        // $("#tblcontactoverview th").each(function () {
        //   tableWidth.push($(this).outerWidth());
        //   tableWidth.push($(this).index());
        // });
      }
      // disabledColumns: [2]
    });
  }

  /**
     * We first need to disable all previous events listeners related
     */
  disableDatatableResizable() {
    //$(".dataTable").colResizable({disable: true});
  }

  saveTableColumns( tableName ){
    let lineItems = [];
    $(".fullScreenSpin").css("display", "inline-block");
    $(`#${tableName} thead tr th`).each(function (index) {
      var $tblrow = $(this);
      var fieldID = $tblrow.attr("data-col-index") || 0;
      var colTitle = $tblrow.text().replace(/^\s+|\s+$/g, "")|| "";
      var colWidth = $tblrow.width() || 0;
      var colthClass = $tblrow.attr('data-class') || "";
      var colHidden = false;
      if ($tblrow.attr('data-col-active') == 'true') {
        colHidden = true;
      } else {
        colHidden = false;
      }
      let lineItemObj = {
        index: parseInt(fieldID),
        label: colTitle,
        active: colHidden,
        width: parseInt(colWidth),
        class: colthClass,
        display: true
      };

      lineItems.push(lineItemObj);
    });
    // lineItems.sort((a,b) => a.index - b.index);
    try {
      let erpGet = erpDb();
      let employeeId = parseInt(Session.get('mySessionEmployeeLoggedID'))||0;
      let sideBarService = new SideBarService();
      let added = sideBarService.saveNewCustomFields(erpGet, tableName, employeeId, lineItems);
      $(".fullScreenSpin").css("display", "none");
      if(added) {
          swal({
            title: 'SUCCESS',
            text: "Display settings is updated!",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
          }).then((result) => {
              if (result.value) {
                $(".fullScreenSpin").css("display", "none");
              }
          });
      } else {
        swal("Something went wrong!", "", "error");
      }
    } catch (error) {
      $(".fullScreenSpin").css("display", "none");
      swal("Something went wrong!", "", "error");
    }
  }

}
