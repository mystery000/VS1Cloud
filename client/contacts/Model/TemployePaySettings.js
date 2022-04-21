/**
 * @type {{type: string, fields: EmployeePaySettingsFields}}
 */
export default class EmployeePaySettings {
  constructor({ type, fields }) {
    this.type = type;
    this.fields = fields;
  }
}

export class EmployeePaySettingsFields {
  constructor({
    Abn,
    DateLastActuallyPaid,
    Employee,
    Employeeid,
    Employeepaynotes,
    FirstPayDate,
    GlobalRef,
    ID,
    IsContractedOut,
    IsDirector,
    ISEmpty,
    IsMarriedWoman,
    Isontheroster,
    KeyStringFieldName,
    KeyValue,
    LastPaid,
    MsTimeStamp,
    MsUpdateSiteCode,
    NICTableLetter,
    NonWageIncome,
    Payperiod,
    PayPeriodInDays,
    Recno,
    STPJobkeeperFinishDateDesc,
    STPJobkeeperFinishFN,
    STPJobkeeperFinishFNDesc,
    STPJobkeeperStartDateDesc,
    STPJobkeeperStartFN,
    STPJobkeeperStartFNDesc,
    STPTier,
    STPTierDesc,
    Uknino,
    Uktaxcode,
  }) {
    this.Abn = Abn;
    this.DateLastActuallyPaid = DateLastActuallyPaid;
    this.Employee = Employee;
    this.Employeeid = Employeeid;
    this.Employeepaynotes = Employeepaynotes;
    this.FirstPayDate = FirstPayDate;
    this.GlobalRef = GlobalRef;
    this.ID = ID;
    this.IsContractedOut = IsContractedOut;
    this.IsDirector = IsDirector;
    this.ISEmpty = ISEmpty;
    this.IsMarriedWoman = IsMarriedWoman;
    this.Isontheroster = Isontheroster;
    this.KeyStringFieldName = KeyStringFieldName;
    this.KeyValue = KeyValue;
    this.LastPaid = LastPaid;
    this.MsTimeStamp = MsTimeStamp;
    this.MsUpdateSiteCode = MsUpdateSiteCode;
    this.NICTableLetter = NICTableLetter;
    this.NonWageIncome = NonWageIncome;
    this.Payperiod = Payperiod;
    this.PayPeriodInDays = PayPeriodInDays;
    this.Recno = Recno;
    this.STPJobkeeperFinishDateDesc = STPJobkeeperFinishDateDesc;
    this.STPJobkeeperFinishFN = STPJobkeeperFinishFN;
    this.STPJobkeeperFinishFNDesc = STPJobkeeperFinishFNDesc;
    this.STPJobkeeperStartDateDesc = STPJobkeeperStartDateDesc;
    this.STPJobkeeperStartFN = STPJobkeeperStartFN;
    this.STPJobkeeperStartFNDesc = STPJobkeeperStartFNDesc;
    this.STPTier = STPTier;
    this.STPTierDesc = STPTierDesc;
    this.Uknino = Uknino;
    this.Uktaxcode = Uktaxcode;
  }
}
