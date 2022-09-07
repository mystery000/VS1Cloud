import ApiService from "./Module/ApiService";
import ApiCollection from "./Module/ApiCollection";
import ApiCollectionHelper from "./Module/ApiCollectionHelper";
import ApiEndpoint from "./Module/ApiEndPoint";

/**
 * @param {ApiCollection} collection
 */
class JobSalesApi {
  constructor() {
    this.name = "jobsales";

    this.collectionNames = {
        TJobSalesSummary: "TJobSalesSummary"
    };

    this.collection = new ApiCollection([
        new ApiEndpoint({
            name: this.collectionNames.TJobSalesSummary,
            url: ApiService.getBaseUrl({ endpoint: this.collectionNames.TJobSalesSummary }),
            headers: ApiService.getHeaders()
        })
    ]);
  }
}


export default JobSalesApi = new JobSalesApi();