/**
 * @type {{cronjob: CallableFunction, id: string, startAt: Date}}
 */
export default class CronSetting {
  constructor({
    type = "Monthly",
    id = "email",
    active = false,
    every = 1,
    employeeId,
    toParse,
    startAt = new date(),
    days = [],
    months = [],
    dayNumberOfMonth = 1,
    cronJob = () => {},
  }) {
    this.type = type;
    this.active = active;
    this.every = every;
    this.id = id;
    this.employeeId = employeeId;
    this.toParse = toParse;
    this.startAt = this.convertToDate(startAt);
    this.cronJob = cronJob;
    this.days = days;

    this.months = months;
    this.dayNumberOfMonth = this.dayNumberOfMonth;
  }

  buildParsedText() {
    let text = "";

    if (this.type == "Monthly") {
      if (this.months.length > 0) {
        // We on a monthly one
        text += "every " + this.dayNumberOfMonth + " day of the month";
        text += " " + this.months.join(",");

        const date = this.convertToDate(this.startAt);
        const minutes = this.convertToDate(this.startAt).getMinutes();
        const hours = this.convertToDate(this.startAt).getHours();

        text +=
          " at " +
          (hours < 10 ? "0" : "") +
          hours +
          ":" +
          (minutes < 10 ? "0" : "") +
          minutes;

        text +=
          " starting on the " +
          date.getDay() +
          " day of " +
          date.toDateString().split(" ")[1] +
          " in " +
          date.toDateString().split(" ")[3];
      }
    } else if (this.type == "Weekly") {
      console.log("It is weekly !!");

      text += "every " + this.every + " week";
      text += " on " + this.days;

      const date = this.convertToDate(this.startAt);
      const minutes = this.convertToDate(this.startAt).getMinutes();
      const hours = this.convertToDate(this.startAt).getHours();

      text +=
        " starting on the " +
        date.getDay() +
        " day of " +
        date.toDateString().split(" ")[1] +
        " in " +
        date.toDateString().split(" ")[3];
    } else if (this.type == "Daily") {
      console.log("It is daily");

      const date = this.convertToDate(this.startAt);
      const minutes = this.convertToDate(this.startAt).getMinutes();
      const hours = this.convertToDate(this.startAt).getHours();

      text +=
        "at " +
        (hours < 10 ? "0" : "") +
        hours +
        ":" +
        (minutes < 10 ? "0" : "") +
        minutes;

      if (this.days.length > 0) {
      
        // there are days
        text += " on " + this.days.join(",");
      } else {
        text += " every " + this.every + " day";
      }

      text +=
        " starting on the " +
        date.getDay() +
        " day of " +
        date.toDateString().split(" ")[1] +
        " in " +
        date.toDateString().split(" ")[3];
    } else if (this.type == "OneTime") {
      const date = this.convertToDate(this.startAt);
      const minutes = this.convertToDate(this.startAt).getMinutes();
      const hours = this.convertToDate(this.startAt).getHours();

      text +=
        " at " +
        (hours < 10 ? "0" : "") +
        hours +
        ":" +
        (minutes < 10 ? "0" : "") +
        minutes;

      text +=
        " starting on the " +
        date.getDay() +
        " day of " +
        date.toDateString().split(" ")[1] +
        " in " +
        date.toDateString().split(" ")[3];
    }

    this.toParse = text;
  }

  /**
   *  this will convert string into Date if is convertible
   * @param {string | Date} date
   * @returns {Date}
   */
  convertToDate(date) {
    // console.log("Converting Date");
    if (date instanceof Date) {
      // console.log("There is nothing to convert");
      return date;
    }
    date = new Date(date);
    // console.log("Converting date: ",date);
    return date;
  }
}
