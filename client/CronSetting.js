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
    cronJob = () => {}
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
        let lastMonth = this.months.pop();
        // We on a monthly one
        text += "every " + this.dayNumberOfMonth + " day of the month";
        text += " of " + this.months.join(",") + " and " + lastMonth;

        const date = this.convertToDate(this.startAt);
        const minutes = this.convertToDate(this.startAt).getMinutes();
        const hours = this.convertToDate(this.startAt).getHours();

        text += " at " + (
          hours < 10
          ? "0"
          : "") + hours + ":" + (
          minutes < 10
          ? "0"
          : "") + minutes;

        // text +=
        //   " starting on the " +
        //   date.getDay() +
        //   " day of " +
        //   date.toDateString().split(" ")[1] +
        //   " in " +
        //   date.toDateString().split(" ")[3];
      }
    } else if (this.type == "Weekly") {
      text += "every " + this.every + " week";
      text += " on " + this.days;

      const date = this.convertToDate(this.startAt);
      const minutes = this.convertToDate(this.startAt).getMinutes();
      const hours = this.convertToDate(this.startAt).getHours();

      // text +=
      //   " starting on the " +
      //   date.getDay() +
      //   " day of " +
      //   date.toDateString().split(" ")[1] +
      //   " in " +
      //   date.toDateString().split(" ")[3];
    } else if (this.type == "Daily") {
      const date = this.convertToDate(this.startAt);
      const minutes = this.convertToDate(this.startAt).getMinutes();
      const hours = this.convertToDate(this.startAt).getHours();

      console.log("days lenght", this.days.length);
      console.log(this.days);
      // this.days = this.days.filter(Boolean);
      // console.log(this.days);
      if (this.days.length >= 1 && this.days.length < 7) {
        const lastDay = this.days[this.days.length - 1];

        if (this.days.length == 1) {
          text += " at " + (
            hours < 10
            ? "0"
            : "") + hours + ":" + (
            minutes < 10
            ? "0"
            : "") + minutes;

          text += " every " + lastDay;

          text += " starting on the " + this.convertDayNumberToString(date.getDate()) + " day in " + date.toDateString().split(" ")[1] + " in " + date.toDateString().split(" ")[3];
        } else {
          //this.days.pop();  remove the last day
          //text += " on " + this.days.join(",") + " and " + lastDay;
          //text += " every week";
          //text += " starting on the " + this.convertDayNumberToString(date.getDate()) + " day in " + date.toDateString().split(" ")[1] + " in " + date.toDateString().split(" ")[3];

          this.days.forEach((_day, index) => {
            if (index > 0) {
              text += " also ";
            }
            text += " at " + (
              hours < 10
              ? "0"
              : "") + hours + ":" + (
              minutes < 10
              ? "0"
              : "") + minutes;

            text += ` every ${this.convertDayNumberToString(this.getDayIndexOfTheWeek(_day))} day of the week`;
            text += " starting on the " + this.convertDayNumberToString(date.getDate()) + " day in " + date.toDateString().split(" ")[1] + " in " + date.toDateString().split(" ")[3];
          });
        } // multiple days
      } else if (this.days.length == 7) {
        // This is for every day
        // Works as expected

        text += " at " + (
          hours < 10
          ? "0"
          : "") + hours + ":" + (
          minutes < 10
          ? "0"
          : "") + minutes;

        text += " every day";

        text += " starting on the " + this.convertDayNumberToString(date.getDate()) + " day in " + date.toDateString().split(" ")[1] + " in " + date.toDateString().split(" ")[3];
      } else {
        text += " every " + this.convertDayNumberToString(this.every) + " day";
        // text += " starting on the " + this.convertDayNumberToString(date.getDate()) + " day in " + date.toDateString().split(" ")[1] + " in " + date.toDateString().split(" ")[3];
      }

      // text += " also at " + (
      //   hours < 10
      //   ? "0"
      //   : "") + hours + ":" + (
      //   minutes < 10
      //   ? "0"
      //   : "") + minutes;
    } else if (this.type == "OneTime") {
      const date = this.convertToDate(this.startAt);
      const minutes = this.convertToDate(this.startAt).getMinutes();
      const hours = this.convertToDate(this.startAt).getHours();

      text += " at " + (
        hours < 10
        ? "0"
        : "") + hours + ":" + (
        minutes < 10
        ? "0"
        : "") + minutes;

      // text +=
      //   " starting on the " +
      //   date.getDay() +
      //   " day of " +
      //   date.toDateString().split(" ")[1] +
      //   " in " +
      //   date.toDateString().split(" ")[3];
    }

    this.toParse = text;

    console.log("Cron: ", this.toParse);
  }

  /**
     *  this will convert string into Date if is convertible
     * @param {string | Date} date
     * @returns {Date}
     */
  convertToDate(date) {
    if (date instanceof Date) {
      return date;
    }
    date = new Date(date);
    return date;
  }

  convertDayNumberToString(number) {
    let lastNumber = number.toString().slice(-1);
    let suffixe = "st";

    if (lastNumber == 1) {
      suffixe = "st";
    } else if (lastNumber == 2) {
      suffixe = "nd";
    } else if (lastNumber == 3) {
      suffixe = "rd";
    } else {
      suffixe = "th";
    }

    return number + suffixe;
  }

  getStartAt() {
    return this.convertToDate(this.startAt);
  }

  isFuture() {
    if (this.getStartAt() > new Date()) {
      return true;
    }
    return false;
  }

 
  /**
   * This will find the index of the day
   * @param {String} day 
   * @returns 
   */
  getDayIndexOfTheWeek(day = "monday") {
    if (day == "monday") {
      return 1;
    } else if (day == "tuesday") {
      return 2;
    } else if (day == "wednesday") {
      return 3;
    } else if (day == "thursday") {
      return 4;
    } else if (day == "friday") {
      return 5;
    } else if (day == "saturday") {
      return 6;
    } else if (day == "sunday") {
      return 7;
    }
  }
}
