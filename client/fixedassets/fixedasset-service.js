import { BaseService } from "../js/base-service.js";
export class FixedAssetService extends BaseService {
  getTFixedAssetsList() {
    let options = {
      ListType: "Detail",
      select: "[Active]=true"
    };
    return this.getList(this.ERPObjects.TFixedAssets, options);
  }

  getTFixedAssetByNameOrID(dataSearchName) {
    let options = {
      ListType: "Detail",
      select: '[AssetName] f7like "' + dataSearchName + '" OR [ID] f7like "' + dataSearchName + '"',
    };
    return this.getList(this.ERPObjects.TFixedAssets, options);
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
