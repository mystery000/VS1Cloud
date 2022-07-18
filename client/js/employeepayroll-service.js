import {BaseService} from "../js/base-service";
import EmployeePayrollApi from "./Api/EmployeePayrollApi";
const employeePayrolApis = new EmployeePayrollApi();
export class EmployeePayrollService extends BaseService {
  
  getAllEmployeePaySettings(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail"
          //select: '[Active]=true'
        };
    }else{
      options = {
        ListType: "Detail",
        //select: '[Active]=true',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    };
    return this.getList(this.ERPObjects.TEmployeepaysettings, options);
  }
  
  saveTEmployeepaysettings(data) {
    return this.POST(this.ERPObjects.TEmployeepaysettings, data);
  }
  
  getAllTLeaveTypes(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail"
          //select: '[Active]=true'
        };
    }else{
      options = {
        ListType: "Detail",
        //select: '[Active]=true',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    };
    return this.getList(this.ERPObjects.TLeavetypes, options);
  }

  getAllTBankAccounts(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail"
          //select: '[Active]=true'
        };
    }else{
      options = {
        ListType: "Detail",
        //select: '[Active]=true',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    };
    return this.getList(this.ERPObjects.TBankAccounts, options);
  }
  saveTBankAccounts(data) {
    return this.POST(this.ERPObjects.TBankAccounts, data);
  }

  saveTLeavRequest( data ){
    return this.POST(this.ERPObjects.TLeavRequest, data);
  }

  async saveAssignLeaveType() {    
    // now we have to make the post request to save the data in database
    const employeePayrolEndpoint = employeePayrolApis.collection.findByName(
        employeePayrolApis.collectionNames.TAssignLeaveType
    );

    employeePayrolEndpoint.url.searchParams.append(
        "ListType",
        "'Detail'"
    );                
    
    const employeePayrolEndpointResponse = await employeePayrolEndpoint.fetch(); // here i should get from database all charts to be displayed

    if (employeePayrolEndpointResponse.ok == true) {
        let employeePayrolEndpointJsonResponse = await employeePayrolEndpointResponse.json();
        if( employeePayrolEndpointJsonResponse.tassignleavetype.length ){
            await addVS1Data('TAssignLeaveType', JSON.stringify(employeePayrolEndpointJsonResponse))
        }
        return employeePayrolEndpointJsonResponse
    }  
    return '';
  }

  getAssignLeaveType(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail"
          //select: '[Active]=true'
        };
    }else{
      options = {
        ListType: "Detail",
        //select: '[Active]=true',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    };
    return this.getList(employeePayrolApis.collectionNames.TAssignLeaveType, options);
  }

}