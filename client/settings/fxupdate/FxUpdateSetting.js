/**
 *
 *
 * @type {{transactionType: string, reportNames: Array, frequency: FxFrequency, send: string, recipients: string}}
 */
export default class FxUpdateSetting {
  constructor({ transactionType, reportNames, frequency, send, recipients }) {
    this.transactionType = transactionType;
    this.reportNames = reportNames;
    this.frequency = frequency; // FxFrequency
    this.send = send;
    this.recipients = recipients;
  }
}

export class FxFrequency {
  constructor({ type, rythm }) {
    this.type = type;
    this.rythm = rythm;
  }
}



export class FxFrequencyMonthly {
  constructor({ everyDay, ofMonths, startTime, startDate }) {
    this.name = "monthly";
    this.everyDay = everyDay;
    this.ofMonths = ofMonths;
    this.startTime = startTime;
    this.startDate = startDate;
  }
}

export class FxFrequencyWeekly {
  constructor({ days, every, startDate, startTime }) {
    this.days = days;
    this.every = every;
    this.startTime = startTime;
    this.startDate = startDate;
  }
}

export class FxFrequencyDaily {
  constructor({ days, every, startDate, startTime }) {
    this.days = days;
    this.every = every;
    this.startTime = startTime;
    this.startDate = startDate;
  }
}

export class FxFrequencyOnTime {
  constructor({startDate, startTime }) {
   
    this.startTime = startTime;
    this.startDate = startDate;
  }
}


export class FxFrequencyOnTime {
  constructor({onEvent}) {
    this.onEvent;
  }
}
