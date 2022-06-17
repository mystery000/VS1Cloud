class LoadingOverlay {
  /**
   * 
   * @param {number} timeout 
   */
  show(timeout = 0) {
    setTimeout(() => {
      $(".fullScreenSpin").css("display", "");
      console.log("Showing loading overlay");
    }, timeout);
  }

  /**
   * 
   * @param {number} timeout 
   */
  hide(timeout = 1000) {
    setTimeout(() => {
      $(".fullScreenSpin").css("display", "none");
      console.log("Hiding loading overlay");
    }, timeout);
  }
}

export default loadingOverlay = new LoadingOverlay();
