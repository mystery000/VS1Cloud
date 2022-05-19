

export class MonthlyFrequencyModel {
    constructor({
        everyDay,
        ofMonths,
        startTime,
        startDate
    }) {
        this.everyDay = everyDay;
        this.ofMonths = ofMonths;
        this.startDate = startDate;
        this.startTime = startTime;
    }
}


export class WeeklyFrequencyModel {
    constructor({
        selectedDays,
        everyWeeks,
        startTime,
        startDate
    }) {
        this.selectedDays = selectedDays;
        this.everyWeeks = everyWeeks;
        this.startDate = startDate;
        this.startTime = startTime;
    }
}


export class DailyFrequencyModel {
    constructor({
        weekDays,
        every,
        startTime,
        startDate
    }) {
        this.weekDays = weekDays;
        this.every = every;
        this.startDate = startDate;
        this.startTime = startTime;
    }
}


export class OneTimeOnlyFrequencyModel {
    constructor({
        startTime,
        startDate
    }) {
        this.startDate = startDate;
        this.startTime = startTime;
    }
}


export class OnEventFrequencyModel {
    constructor({
        onLogin,
        onLogout
    }) {
        this.onLogin = onLogin;
        this.onLogout = onLogout;
    }
}