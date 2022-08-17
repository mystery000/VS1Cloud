export default class ApiService {
  constructor() {
    this.erpGet = erpDb();
    this.ERPObjects = ERPObjects();
  }

  /**
   * @param {string} endpoint my-endpoint
   * @returns {URL}
   */
  static getBaseUrl({ endpoint = null}) {
    const erp = erpDb();
    let url = new URL(
      URLRequest +
        erp.ERPIPAddress +
        ":" +
        erp.ERPPort +
        "/" +
        erp.ERPApi +
        "/"
    );

    if(endpoint != null) {
      url = new URL(
        URLRequest +
          erp.ERPIPAddress +
          ":" +
          erp.ERPPort +
          "/" +
          erp.ERPApi +
          "/" + endpoint
      );
    }

    // if (endpoint != null) {
    //   url = url + endpoint;
    // }

    return url;
  }

  /**
   *
   * @returns {HeadersInit}
   */
  static getHeaders() {
    var headers = {
      database: erpDb().ERPDatabase,
      username: erpDb().ERPUsername,
      password: erpDb().ERPPassword,
    };
    return headers;
  }

  /**
   *
   * @returns {HeadersInit}
   */
  static getPostHeaders() {
    postHeaders = {
      database: erpDb().ERPDatabase,
      username: erpDb().ERPUsername,
      password: erpDb().ERPPassword,
    };

    return postHeaders;
  }
}
