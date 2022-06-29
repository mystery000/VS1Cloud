export class MonthlyFrequencyModel {
  constructor({ everyDay, ofMonths, startTime, startDate }) {
    this.everyDay = everyDay;
    this.ofMonths = ofMonths;
    this.startDate = startDate;
    this.startTime = startTime;
  }

  getDate() {
    const date = this.startDate;
    const time = this.startTime;

    const sDate = date
      ? moment(date + " " + time).format("YYYY-MM-DD HH:mm")
      : moment().format("YYYY-MM-DD HH:mm");

    return sDate;
  }
}

export class WeeklyFrequencyModel {
  constructor({ selectedDays, everyWeeks, startTime, startDate }) {
    this.selectedDays = selectedDays;
    this.everyWeeks = everyWeeks;
    this.startDate = startDate;
    this.startTime = startTime;
  }

  getDate() {
    const date = this.startDate;
    const time = this.startTime;

    const sDate = date
      ? moment(date + " " + time).format("YYYY-MM-DD HH:mm")
      : moment().format("YYYY-MM-DD HH:mm");

    return sDate;
  }
}

export class DailyFrequencyModel {
  constructor({ weekDays, every, startTime, startDate }) {
    this.weekDays = weekDays;
    this.every = every;
    this.startDate = startDate;
    this.startTime = startTime;
  }

  getDate() {
    const date = this.startDate;
    const time = this.startTime;

    const sDate = date
      ? moment(date + " " + time).format("YYYY-MM-DD HH:mm")
      : moment().format("YYYY-MM-DD HH:mm");

    return sDate;
  }
}

export class OneTimeOnlyFrequencyModel {
  constructor({ startTime, startDate }) {
    this.startDate = startDate;
    this.startTime = startTime;
  }

  getDate() {
    const date = this.startDate;
    const time = this.startTime;

    const sDate = date
      ? moment(date + " " + time).format("YYYY-MM-DD HH:mm")
      : moment().format("YYYY-MM-DD HH:mm");

    return sDate;
  }
}

export class OnEventFrequencyModel {
  constructor({ onLogin, onLogout }) {
    this.onLogin = onLogin;
    this.onLogout = onLogout;
  }
}
