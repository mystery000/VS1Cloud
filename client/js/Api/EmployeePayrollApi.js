import ApiService from "./Module/ApiService";
import ApiCollection from "./Module/ApiCollection";
import ApiCollectionHelper from "./Module/ApiCollectionHelper";
import ApiEndpoint from "./Module/ApiEndPoint";

/**
 * @param {ApiCollection} collection
 */
export default class EmployeePayrollApi {
  constructor() {
    this.name = "employeePayroll";

    this.collectionNames = {
        TEmployeepaysettings: "TEmployeepaysettings",
        TEarnings: "TEarnings",
        TDeduction: "TDeduction",
        TSuperannuation: "TSuperannuation",
        TReimbursement: "TReimbursement"
    };

    this.collection = new ApiCollection([
        new ApiEndpoint({
            name: this.collectionNames.TEmployeepaysettings,
            url: ApiService.getBaseUrl({ endpoint: "TEmployeepaysettings" }),
            headers: ApiService.getHeaders()
        }),
        new ApiEndpoint({
          name: this.collectionNames.TEarnings,
          url: ApiService.getBaseUrl({ endpoint: "TEarnings" }),
          headers: ApiService.getHeaders()
        }),
        new ApiEndpoint({
          name: this.collectionNames.TDeduction,
          url: ApiService.getBaseUrl({ endpoint: "TDeduction" }),
          headers: ApiService.getHeaders()
        }),
        new ApiEndpoint({
          name: this.collectionNames.TSuperannuation,
          url: ApiService.getBaseUrl({ endpoint: "TSuperannuation" }),
          headers: ApiService.getHeaders()
        }),
        new ApiEndpoint({
          name: this.collectionNames.TReimbursement,
          url: ApiService.getBaseUrl({ endpoint: "TReimbursement" }),
          headers: ApiService.getHeaders()
        })
    ]);
  }
}
