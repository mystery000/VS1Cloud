import { BaseService } from "../js/base-service";

export class ManufacturingService extends BaseService {
    getAllProcessData = (limitCount, limitfrom, deleteFilter) => {
      let options = "";
      if(deleteFilter == false) {
        if(limitCount == "All") {
          options = {
            ListType: 'Detail',
            select: "[Active] = true",
          }
        }else{
          options = {
            ListType: 'Detail',
            select: "[Active] = true",
            LimitCount: parseInt(limitCount),
            LimitFrom: parseInt(limitfrom)
          }
        }
      } else {
        if(limitCount == "All") {
          options = {
            ListType: 'Detail',
          }
        }else{
          options = {
            ListType: 'Detail',
            // select: "[Active] = true",
            LimitCount: parseInt(limitCount),
            LimitFrom: parseInt(limitfrom)
          }
        }
      }
        return this.getList(this.ERPObjects.TProcessStep, options);
    }  
    
    getProcessByName = (dataSearchName) => {
      let options = "";
      options = {
        ListType: 'Detail',
        select:'[KeyValue] f7like "' +dataSearchName +'" OR [ID] f7like "' +dataSearchName +'"'
      }
      return this.getList(this.ERPObjects.TProcessStep, options)
    }
    getOneProcessDataByID(id) {
      return this.getOneById(this.ERPObjects.TProcessStep, id);
    }

    saveProcessData(data) {
        return this.POST(this.ERPObjects.TProcessStep, data)
    }

    saveWorkOrder(data){
      return this.POST(this.ERPObjects.TVS1Workorder, data)
    }
  
}