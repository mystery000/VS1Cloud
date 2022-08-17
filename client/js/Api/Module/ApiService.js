import { _ERP_BASE_API, _IPADDRESS, _PORT } from "../../../lib/global/erpconnection";

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
    let _url = `https://${_IPADDRESS}:${_PORT}/${_ERP_BASE_API}/`;
    let url = new URL(_url);
    if(endpoint != null) {
      url = new URL(`https://${_IPADDRESS}:${_PORT}/${_ERP_BASE_API}/${endpoint}`);
    }
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
