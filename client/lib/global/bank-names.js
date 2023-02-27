import { BaseService } from "../../js/base-service.js";
export const BankNameList = [
    ['CBA', 'Commonwealth Bank'],
    ['NAB', 'National Australian Bank'],
    ['WBC', 'Westpac Bank'],
    ['MQG', 'Macquarie Bank'],
    ['ANZ', 'Australia and New Zealand Banking Group'],
    ['BEN', 'Bendigo Bank'],
    ['BOQ', 'Bank of Queensland'],
    ['VUK', 'Virgin Money'],
    ['BFL', 'BSP Financial Group'],
    ['JDO', 'Judo Bank']
];

let bankNameObjList = [];
for (let i = 0; i < BankNameList.length; i++) {
    bankNameObjList.push({name: BankNameList[i][0], description: BankNameList[i][1]});
};

export class BankNameService {
    getBankNameList() {
        let options = {};
        //return this.getList(this.ERPObjects.TSuperType, options);
        return this.getManualBankList();
    }
    getManualBankList() {
        return this.Wow();
    }
    Wow() {
        var that = this;
        var promise = new Promise(function(resolve, reject) {
            resolve({"tbanknamelist" : BankNameList});
        });
        return promise;
    }
}

export const bankNameList = bankNameObjList;


// import { BaseService } from "../js/base-service.js";
// import { HTTP } from "meteor/http";
// import { Session } from 'meteor/session';
// export class BankNameService extends BaseService {
//
//     getRegionalOptionInfo() {
//
//         let options = {
//             ListType:"Detail",
//             select: "[Region]=" + localStorage.getItem('ERPLoggedCountry'),
//         };
//
//         return this.getList(this.ERPObjects.TRegionalOptions, options);
//     }
// }
