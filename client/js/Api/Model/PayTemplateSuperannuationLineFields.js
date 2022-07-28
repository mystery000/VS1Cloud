export default class PayTemplateSuperannuationLineFields {
    constructor({
        ID,
        EmployeeID,
        Fund,
        ContributionType,
        ReducesSGC,
        CalculationType,
        MinimumMonthlyEarnings,
        ExpenseAccount,
        LiabilityAccount,
        PaymentFrequency,
        PeriodPaymentDate,
        Active
    }){
        this.ID = ID;
        this.EmployeeID = EmployeeID;
        this.Fund = Fund;
        this.ContributionType = ContributionType;
        this.ReducesSGC = ReducesSGC;
        this.CalculationType = CalculationType;
        this.MinimumMonthlyEarnings = MinimumMonthlyEarnings;
        this.ExpenseAccount = ExpenseAccount;
        this.LiabilityAccount = LiabilityAccount;
        this.PaymentFrequency = PaymentFrequency;
        this.PeriodPaymentDate = PeriodPaymentDate;
        this.Active = Active;
    }
}
  
  