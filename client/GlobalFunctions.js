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

  /**
   * 
   * @param {string} myString 
   * @returns {boolean}
   */
  static hasNumber(myString) {
    return /\d/.test(myString);
  }
}