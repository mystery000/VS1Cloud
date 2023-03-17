import { BaseService } from "../js/base-service.js";
export class FixedAssetService extends BaseService {
  getTFixedAssetsList(limitcount, limitfrom, deleteFilter) {
    let options = {
      ListType: "Detail",
      Search: "Active=true",
      LimitCount: parseInt(limitcount),
      LimitFrom: parseInt(limitfrom),
    };
    if(deleteFilter) options.Search = "";
    return this.getList(this.ERPObjects.TFixedAssetsList, options);
  }

  getTFixedAssetByNameOrID(dataSearchName) {
    let options = {
      ListType: "Detail",
      Search: 'AssetName like "' + dataSearchName + '" OR AssetID like "' + dataSearchName + '"',
    };
    return this.getList(this.ERPObjects.TFixedAssetsList, options);
  }

  getTFixedAssetDetail(id) {
    return this.getOneById(this.ERPObjects.TFixedAssets, id);
  }

  saveTFixedAsset(data) {
    return this.POST(this.ERPObjects.TFixedAssets, data);
  }

  updateTFixedAsset(data) {
    return this.POST(this.ERPObjects.TFixedAssets, data);
  }

  getFixedAssetTypes() {
    let options = {
      ListType: "Detail",
      select: "[Active]=true"
    };
    return this.getList(this.ERPObjects.TFixedAssetType, options);
  }

  getFixedAssetType(id) {
    return this.getOneById(this.ERPObjects.TFixedAssetType, id);
  }

  saveTFixedAssetType(data) {
    return this.POST(this.ERPObjects.TFixedAssetType, data);
  }

  getServiceLogList() {
    let options = {
      ListType: "Detail",
      select: "[Active]=true"
    };
    return this.GET(this.ERPObjects.TServiceLogList);
  }


  getServiceLogDetail(ID) {
    let options = {
      ListType: "Detail",
      select: '[ServiceID]="' + ID + '"',
    };
    return this.getList(this.ERPObjects.TServiceLogList, options);
  }

  saveServiceLog(data) {
    return this.POST(this.ERPObjects.TServiceLog, data);
  }

  getCostTypeList() {
    let options = {
      ListType: "Detail"
    };
    return this.getList(this.ERPObjects.TCostTypes, options);
  }
}
