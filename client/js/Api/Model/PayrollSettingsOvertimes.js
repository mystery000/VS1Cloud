import erpObject from "../../../lib/global/erp-objects";
import ObjectManager from "../../ObjectManager/ObjectManager";

/**
 * @param {CallableFunction} findRateTypeByRuleName
 */
export default class PayrollSettingsOvertimes {
  constructor({
    id = null,
    active = true,
    hours = 0,
    rateTypeId = null,
    hourlyMultiplier = 1,
    rule,
    day = null,
    rateType = null,
    isDefault = false,
    searchByRuleName = false,
    rate,
  }) {
    this.id = id || ObjectManager.init(erpObject.TPayrollSettingOvertimes);
    this.active = active;
    this.hours = hours;
    this.rateTypeId = rateTypeId;
    this.hourlyMultiplier = hourlyMultiplier;
    this.rule = rule;
    this.day = day;
    this.isDefault = isDefault;
    this.searchByRuleName = searchByRuleName;
    this.rate = rate;
    if (rateType) 
      this.setRateType(rateType);
    }
  
  setRateType(rateType = null) {
    this.rateType = rateType;
  }

  setRateTypeByRuleName(rateTypes  = [], ruleName  ="Weekend") {
    this.rateType = rateTypes.find(rate => rate.Description == ruleName);
    this.rateTypeId = this.rateType.ID;
  }

  getRateType(fromRateList = []) {
    if (fromRateList.length > 0) {
      return;
    }
  }

  buildForApi() {
    return {
      ...(
        !isNaN(this.id)
        ? {
          id: this.id
        }
        : {}),
      rateTypeId: this.rateTypeId,
      day: this.day,
      rule: this.rule,
      active: this.active,
      hours: this.hours,
      hourlyMultiplier: this.hourlyMultiplier
    };
  }

  static getDefaults() {
    return [
      new PayrollSettingsOvertimes({
        id:1,
        active: true,
        isDefault: true,
        hourlyMultiplier: 1,
        hours: 8,
        rateTypeId: 1,
        rule: "8hours",
        rate:"Normal",
      }),
      new PayrollSettingsOvertimes({
        id:2,
        active: true,
        isDefault: true,
        hourlyMultiplier: 1.5,
        hours: 1.5,
        rateTypeId: 1,
        rule: "Greater than 8 hours",
        rate:"Time & Half"
      }),
      new PayrollSettingsOvertimes({
        id:3,
        active: true,
        isDefault: true,
        hourlyMultiplier: 2,
        hours: 9.5,
        rateTypeId: 1,
        rule: "Greater than 12 hours",
        rate:"Double Time"
      }),
      new PayrollSettingsOvertimes({
        id:4,
        active: true,
        isDefault: true,
        hourlyMultiplier: 2,
        rateTypeId: 1,
        rule: "Saturday",
        day: "Saturday",
        searchByRuleName: true,
        rate:"Weekend"
      }),
      new PayrollSettingsOvertimes({
        id:5,
        active: true,
        isDefault: true,
        hourlyMultiplier: 3,
        rateTypeId: 1,
        rule: "Sunday",
        day: "Sunday",
        searchByRuleName: true,
        rate:"Weekend"
      })
    ];
  }

  /**
     *
     * @param {PayrollSettingsOvertimes} Overtime
     */
  calculateAmount(Overtime, workedHours = 10, productPrice = 1.5) {}
}

export class PayrollSettingOvertime {
  constructor() {}

  /**
     * @param {PayrollSettingsOvertimes} overtime
     */
  setOvertime(overtime) {
    this.overtime = overtime;
  }

  /**
   * This will find the matched overtime by RateType
   * @param {string} rateType 
   */
  static async findOneByEarningRateType(rateTypeId, overtimes = []) {
    return overtimes.find(o => o.rateTypeId == rateTypeId);
  }

  calculateDailyExtraHours(hours = 8) {
    const normalHours =  hours > this.overtime.hours ? this.overtime.hours * this.overtime.hourlyMultiplier: hours;
    const extraHours = hours > this.overtime.hours ? (hours - this.overtime.hours) : 0;

    return {
      normalHours: normalHours,
      extraHours: extraHours,
    }
  }
}
