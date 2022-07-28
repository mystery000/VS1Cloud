import {BaseService} from '../js/base-service.js';
export class CountryService extends BaseService {
    getCountry() {
        let codes = require('../contacts/Model/phoneCodes.json'); 
        // return this.GET(this.erpGet.ERPCountries);
        let countries = [];
        codes.map(item=>{
            countries.push(item.name)
        })
        return countries
    }

}
