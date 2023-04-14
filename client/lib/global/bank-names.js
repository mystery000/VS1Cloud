import { BaseService } from "../../js/base-service.js";
export class BankNameService extends BaseService {
    getBankNameList() {
        let options = {
            PropertyList: 'BankName,BankCode',
            select: "[Active]=true & [Region]='"+localStorage.getItem('ERPLoggedCountry')+"'",            
        };
        return this.getList(this.ERPObjects.TBankCode, options);        
    }


}