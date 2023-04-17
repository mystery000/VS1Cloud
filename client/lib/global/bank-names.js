import { BaseService } from "../../js/base-service.js";
export class BankNameService extends BaseService {
    getBankNameList(limitCount, limitFrom, deleteFilter) {
        let options = {
            //PropertyList: 'BankName,BankCode',
            ListType: 'Detail',
            LimitCount: parseInt(limitCount)||initialReportLoad,
            LimitFrom: parseInt(limitFrom)||0,
            select: "[Active]=true & [Region]='"+localStorage.getItem('ERPLoggedCountry')+"'",            
        };
        if(deleteFilter) options.select = "";
        return this.getList(this.ERPObjects.TBankCode, options);        
    }
}