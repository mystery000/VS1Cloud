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

    getWorkOrderList() {
       
        let workorders = [
          {
              "type": "TVS1Workorder",
              "fields": {
                  "LID": "1000",
                  "Customer": "Workshop",
                  "OrderTo": "Workshop\n \n\n ",
                  "PONumber": "",
                  "SaleDate": "09/03/2023",
                  "DueDate": "09/03/2023",
                  "BOMStructure": "{\"Id\":8077,\"MsTimeStamp\":\"2023-02-23 13:10:21\",\"MsUpdateSiteCode\":\"DEF\",\"GlobalRef\":\"DEF8077\",\"Caption\":\"Wagon\",\"CustomInputClass\":\"\",\"Description\":\"Childs Red Wagon\",\"Details\":\"[{\\\"productName\\\":\\\"Handle\\\",\\\"qty\\\":\\\"1\\\",\\\"changed_qty\\\":\\\"0\\\",\\\"process\\\":\\\"\\\",\\\"processNote\\\":\\\"\\\",\\\"attachments\\\":[],\\\"subs\\\":[]},{\\\"productName\\\":\\\"Tray\\\",\\\"qty\\\":\\\"1\\\",\\\"changed_qty\\\":\\\"0\\\",\\\"process\\\":\\\"Welding\\\",\\\"processNote\\\":\\\"\\\",\\\"attachments\\\":[],\\\"subs\\\":[]},{\\\"productName\\\":\\\"Hub\\\",\\\"qty\\\":\\\"1\\\",\\\"changed_qty\\\":\\\"0\\\",\\\"process\\\":\\\"\\\",\\\"processNote\\\":\\\"\\\",\\\"attachments\\\":[],\\\"subs\\\":[]},{\\\"productName\\\":\\\"Purple\\\",\\\"qty\\\":\\\"1\\\",\\\"changed_qty\\\":\\\"0\\\",\\\"process\\\":\\\"Painting\\\",\\\"processNote\\\":\\\"\\\",\\\"attachments\\\":[],\\\"subs\\\":[]},{\\\"productName\\\":\\\"Wheel Assembly\\\",\\\"qty\\\":\\\"4.00000\\\",\\\"changed_qty\\\":\\\"0\\\",\\\"process\\\":\\\"Assembly\\\",\\\"processNote\\\":\\\"\\\",\\\"attachments\\\":[],\\\"subs\\\":[]}]\",\"Info\":\"Assembly\",\"ProcStepItemRef\":\"vs1BOM\",\"QtyVariation\":5,\"TotalQtyOriginal\":636,\"Value\":\"\"}",
                  "OrderDate": "2023-03-09T08:08:01.218Z",
                  "StartTime": "",
                  "ProductName": "Wagon",
                  "ShipDate": "09/03/2023",
                  "Quantity": 1,
                  "ID": "1000",
                  "UpdateFromPO": false,
                  "POStatus": "not created",
                  "Status": "unscheduled",
                  "TrackedTime": 0,
                  "StartedTimes": "[]",
                  "PausedTimes": "[]",
                  "StoppedTime": "",
                  "EmployeeId"  : "",
                  "EmployeeName" : "",
              }
          },
          {
              "type": "TVS1Workorder",
              "fields": {
                  "LID": "1001",
                  "Customer": "Workshop",
                  "OrderTo": "Workshop\n \n\n ",
                  "PONumber": "",
                  "SaleDate": "09/03/2023",
                  "DueDate": "09/03/2023",
                  "BOMStructure": "{\"Id\":8076,\"MsTimeStamp\":\"2023-02-23 13:05:06\",\"MsUpdateSiteCode\":\"DEF\",\"GlobalRef\":\"DEF8076\",\"Caption\":\"Wheel Assembly\",\"CustomInputClass\":\"\",\"Description\":\"\",\"Details\":\"[{\\\"productName\\\":\\\"Bridgestone Wheels\\\",\\\"qty\\\":\\\"1\\\",\\\"changed_qty\\\":\\\"0\\\",\\\"process\\\":\\\"\\\",\\\"processNote\\\":\\\"\\\",\\\"attachments\\\":[],\\\"subs\\\":[]}]\",\"Info\":\"Assembly\",\"ProcStepItemRef\":\"vs1BOM\",\"QtyVariation\":1,\"TotalQtyOriginal\":-34,\"Value\":\"\"}",
                  "OrderDate": "2023-03-09T08:22:57.348Z",
                  "StartTime": "",
                  "ProductName": "Wheel Assembly",
                  "ShipDate": "09/03/2023",
                  "Quantity": 1,
                  "ID": "1001",
                  "UpdateFromPO": false,
                  "POStatus": "not created",
                  "Status": "unscheduled",
                  "TrackedTime": 0,
                  "StartedTimes": "[]",
                  "PausedTimes": "[]",
                  "StoppedTime": "",
                  "EmployeeId"  : "",
                  "EmployeeName" : ""
              }
          }
        ];

        return workorders;
    }

    getWorkOrder() {
      let options = "";
      options = {
          ListType: 'Detail',
      }
      return this.getList(this.ERPObjects.TVS1Workorder, options)
    }  
  
}