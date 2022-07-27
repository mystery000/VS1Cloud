export default class LeaveRequestFields {
    constructor({
        EmployeeID,
        TypeofRequest,
        Description,
        StartDate,
        EndDate,
        PayPeriod,
        Hours,
        Status,
        Leave,
        LeaveMethod
    }){
        this.EmployeeID = EmployeeID;
        this.TypeofRequest = TypeofRequest;
        this.Description = Description;
        this.StartDate = StartDate;
        this.EndDate = EndDate;
        this.PayPeriod = PayPeriod;
        this.Hours = Hours;
        this.Status = Status;
        this.Leave = Leave;
        this.LeaveMethod = LeaveMethod;
    }
}
  
  