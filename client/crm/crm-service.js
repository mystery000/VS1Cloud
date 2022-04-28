import { BaseService } from '../js/base-service.js';
export class CRMService extends BaseService {
  getTTodoTaskList() {
    let employeeID = 3;  // tempcode
    let options = {
      orderby: '"ToDoByDate asc"',
      ListType: "Detail",
      select: "[Active]=true and [Completed]=false and [Done]=false"
      // select: "[Active]=true and [Completed]=false and [EmployeeID]=" + employeeID
    }
    return this.getList(this.ERPObjects.TToDo, options);
  }

  getTProjectList() {
    let options = {
      ListType: "Detail"
      // select: "[Active]=true" 
    }
    return this.getList(this.ERPObjects.Tprojectlist, options);
  }

  getTProjectDetail(id) {
    return this.getOneById(this.ERPObjects.Tprojectlist, id);
  }

  updateProject(data) {
    return this.POST(this.ERPObjects.Tprojectlist, data);
  }

  getOneTTodoTask(id) {
    return this.getOneById(this.ERPObjects.TToDo, id);
  }

  saveNewTask(data) {
    return this.POST(this.ERPObjects.TToDo, data);
  }
}
