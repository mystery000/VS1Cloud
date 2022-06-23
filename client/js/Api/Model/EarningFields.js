export default class EarningFields {
    constructor({
      ID,
      Active,
      EarningsName,
      EarningsDisplayName,
      EarningsRateType,
      ExpenseAccount,
      EarningsExemptPaygWithholding,
      EarningsExemptSuperannuationGuaranteeCont,
      EarningsReportableW1onActivityStatement,
      EarningType,
    }) {
      this.ID = ID;
      this.Active = Active;
      this.EarningsName = EarningsName;
      this.EarningsDisplayName = EarningsDisplayName;
      this.EarningsRateType = EarningsRateType;
      this.ExpenseAccount = ExpenseAccount;
      this.EarningsExemptPaygWithholding = EarningsExemptPaygWithholding;
      this.EarningsExemptSuperannuationGuaranteeCont = EarningsExemptSuperannuationGuaranteeCont;
      this.EarningsReportableW1onActivityStatement = EarningsReportableW1onActivityStatement;
      this.EarningType = EarningType;
    }
}