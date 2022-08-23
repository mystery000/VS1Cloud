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
      onResize: e => {
        var table = $(e.currentTarget); //reference to the resized table
        let tableWidth = [];
        $("#tblcontactoverview th").each(function () {
          tableWidth.push($(this).outerWidth());
          tableWidth.push($(this).index());
        });
      }
      // disabledColumns: [2]
    });
  }

  /**
     * We first need to disable all previous events listeners related
     */
  disableDatatableResizable() {
    $(".dataTable").colResizable({disable: true});
  }
}
