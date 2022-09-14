export default class FormFrequencyModel {
  constructor({
    MonthlyEveryDay = null,
    MonthlyOfMonths = null,
    MonthlyStartDate = null,
    MonthlyStartTime = null,

    WeeklySelectDays = null,
    WeeklyEvery = null,
    WeeklyStartDate = null,
    WeeklyStartTime = null,

    DailyEveryDay = null,
    DailyWeekDays = null,
    DailyEvery = null,
    DailyStartTime = null,
    DailyStartDate = null,

    OneTimeStartTime = null,
    OneTimeStartDate = null,

    OnEventLogIn = null,
    OnEventLogOut = null,

    EmployeeId = null
  }) {
    this.MonthlyEveryDay = MonthlyEveryDay;
    this.MonthlyOfMonths = MonthlyOfMonths;
    this.MonthlyStartDate = MonthlyStartDate;
    this.MonthlyStartTime = MonthlyStartTime;

    this.WeeklyEvery = WeeklyEvery;
    this.WeeklySelectDays = WeeklySelectDays;
    this.WeeklyStartDate = WeeklyStartDate;
    this.WeeklyStartTime = WeeklyStartTime;

    this.DailyEvery = DailyEvery;
    this.DailyEveryDay = DailyEveryDay;
    this.DailyStartDate = DailyStartDate;
    this.DailyStartTime = DailyStartTime;
    this.DailyWeekDays = DailyWeekDays;

    this.OneTimeStartDate = OneTimeStartDate;
    this.OneTimeStartTime = OneTimeStartTime;

    this.OnEventLogOut = OnEventLogOut;
    this.OnEventLogIn = OnEventLogIn;

    this.EmployeeId = EmployeeId;
  }

  async save() {
    try {
      await addVS1Data("TFrequencyForm", JSON.stringify(this));
    } catch (e) {
      // Handle error
    }
  }
}