export default class GlobalFunctions {
  /**
   *
   * @param {string} timestamp
   * @returns {Date}
   */
  static timestampToDate(timestamp) {
    const date = new Date(timestamp);
    return date;
  }
}