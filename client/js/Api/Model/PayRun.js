export default class PayRun {
  constructor({
    id = null,
    stpFilling = null, // draft, aproved, overdue
    calendar = {},
    netPay = 0.0,
    superAnnuation = 0.0,
    taxes = 0.0,
    earnings = 0.0,
    wages = 0.0,
    employees = [],
    selected = false
  }) {
    this.id = id;
    this.stpFilling = stpFilling;
    this.calendar = calendar;
    this.netPay = netPay;
    this.superAnnuation = superAnnuation;
    this.taxes = taxes;
    this.earnings = earnings;
    this.employees = employees;
    this.wages = wages;
  }

  static STPFilling = {
    draft: "draft",
    overdue: "overdue",
    notfilled: "notfilled"
  };
}