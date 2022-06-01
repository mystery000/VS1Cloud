/**
 * @type {{type: string, fields: EarningFields}}
 */
 export default class Earning {
    constructor({ type, fields }) {
      this.type = type;
      this.fields = fields;
    }
  }
  
  export class EarningFields {
    constructor({
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