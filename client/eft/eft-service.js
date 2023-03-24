import { BaseService } from "../js/base-service.js";
export class EftService extends BaseService {
  getTABADescriptiveRecord() {
    let options = {
      ListType: "Detail"
    };
    return this.getList(this.ERPObjects.TABADescriptiveRecord, options);
  }
  
  getTABADetailRecord() {
    let options = {
      ListType: "Detail"
    };
    return this.getList(this.ERPObjects.TABADetailRecord, options);
  }

  getTABADescriptiveRecordById(accountId) {
    let options = {
      ListType: "Detail",
      select: '[AccountID] = "' + accountId + '"',
    };
    return this.getList(this.ERPObjects.TABADescriptiveRecord, options);
  }
  
  getTABADetailRecordById(accountId) {
    let options = {
      ListType: "Detail",
      select: '[AccountID] = "' + accountId + '"',
    };
    return this.getList(this.ERPObjects.TABADetailRecord, options);
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

  updateTFixedAsset(data) {
    return this.POST(this.ERPObjects.TFixedAssets, data);
  } 

  saveTABADescriptiveRecord(data) {
    return this.POST(this.ERPObjects.TABADescriptiveRecord, data);
  }

  saveTABADetailRecord(data) {
      return this.POST(this.ERPObjects.TABADetailRecord, data);
  }

  getEftFilesCreated() {
    return new Promise(function(resolve, reject) {
      var splashArrayList = [
        ['1', 'Bank', 'ANZ', '03/16/2023', 'Dene Mills', 'Supplier'],
        ['2', 'Bank', 'BOQ', '03/17/2023', 'Dene Mills', 'Payroll'],
        ['3', 'Bank', 'JDO', '03/18/2023', 'Dene Mills', 'Insurance'],
      ]
      resolve({"teftfilescreated" : splashArrayList});
    })
  }

  getEftBankRuleList() {
    return new Promise(function(resolve, reject) {
      var splashArrayList = [
        ['1', 'ANZ', 'Australia and New Zealand Banking Group', true, true, false, true],
        ['2', 'BOQ', 'Bank of Queensland', true, false, false, true],
        ['3', 'JDO', 'Judo Bank', false, true, true, false],
      ]
      resolve({"teftbankrulelist" : splashArrayList});
    })
  }
}
