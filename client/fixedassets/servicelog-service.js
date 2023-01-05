import { BaseService } from "../js/base-service.js";
export class ServiceLogService extends BaseService {
  getServiceLogList() {
    let options = {
      PropertyList: "*",
      select: "[Active]=true"
    };
    return this.GET(this.ERPObjects.TServiceLogList);
  }
  saveServiceLog(data) {
    return this.POST(this.ERPObjects.TServiceLogList, data);
  }
}
