import {BaseService} from "../js/base-service";
export class ReceiptService extends BaseService {
    getAllTripGroups() {
        let options = {
            PropertyList: "ID,TripName,Description",
            select: "[active]=true"
        };
        return this.getList(this.ERPObjects.TTripGroup, options);
    }

    getOneTripGroupData(id) {
        return this.getOneById(this.ERPObjects.TTripGroup, id);
    }

    getOneTripGroupDataExByName(dataSearchName) {
        let options = '';
        options = {
            ListType: "Detail",
            select: '[TripName]="'+dataSearchName+'"'
        };
        return this.getList(this.ERPObjects.TTripGroup, options);
    }

    saveTripGroup(data) {
        return this.POST(this.ERPObjects.TTripGroup, data);
    }
}
