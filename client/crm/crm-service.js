import { BaseService } from '../js/base-service.js';
export class CRMService extends BaseService {
  getTTodoTaskList() {
    let employeeID = 3;  // tempcode
    let options = {
      orderby: '"CreatedDate desc"',
      ListType: "Detail",
      select: "[Active]=true and [Completed]=false and [Done]=false"
      // select: "[Active]=true and [Completed]=false and [EmployeeID]=" + employeeID
    }
    return this.getList(this.ERPObjects.TToDo, options);
  }

  getOneTTodoTask(id) {
    return this.getOneById(this.ERPObjects.TToDo, id);
  }
}
