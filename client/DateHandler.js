import moment from "moment";

export default class Datehandler {
  static domDateFromUpdate(date, format = "DD/MM/YYYY") {
    $("#dateFrom").val(moment(date).format(format));
  }

  static domDateToUpdate(date, format = "DD/MM/YYYY") {
    $("#dateTo").val(moment(date).format(format));
    $("#dateTo").trigger("change");
  }

  static lastMonth(format = "DD/MM/YYYY") {
    let dateFrom = moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD");
    let dateTo = moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD");

    this.domDateFromUpdate(dateFrom, format);
    this.domDateToUpdate(dateTo, format);
  }

  static lastQuarter(format = "DD/MM/YYYY") {
    let dateFrom = moment().subtract(1, "Q").startOf("Q").format("YYYY-MM-DD");
    let dateTo = moment().subtract(1, "Q").endOf("Q").format("YYYY-MM-DD");

    this.domDateFromUpdate(dateFrom, format);
    this.domDateToUpdate(dateTo, format);
  }

  static last12Months(format = "DD/MM/YYYY") {
    const dateTo = moment(new Date()).format(format);
    const dateFrom = moment(dateTo).subtract(1, "year");

    this.domDateFromUpdate(dateFrom, format);
    this.domDateToUpdate(dateTo, format);
  }

  static finYearToDate(format = "DD/MM/YYYY") {
    const dateFrom = moment().month("january").startOf("month").format("YYYY-MM-DD");
    const dateTo = moment().format("YYYY-MM-DD");

    this.domDateFromUpdate(dateFrom, format);
    this.domDateToUpdate(dateTo, format);
  }

  static quaterToDate(format = "DD/MM/YYYY") {
    const dateFrom = moment().startOf("Q").format("YYYY-MM-DD");
    const dateTo = moment().format("YYYY-MM-DD");

    this.domDateFromUpdate(dateFrom, format);
    this.domDateToUpdate(dateTo, format);
  }

  static monthToDate(format = "DD/MM/YYYY") {
    const dateFrom = moment().startOf("M").format("YYYY-MM-DD");
    const dateTo = moment().format("YYYY-MM-DD");

    this.domDateFromUpdate(dateFrom, format);
    this.domDateToUpdate(dateTo, format);
  }

  static lastFinYear(format = "DD/MM/YYYY") {
    let dateFrom = null;
    let dateTo = null;
    if (moment().quarter() == 4) {
      dateFrom = moment().subtract(1, "year").month("July").startOf("month").format("YYYY-MM-DD");
      dateTo = moment().month("June").endOf("month").format("YYYY-MM-DD");
    } else {
      dateFrom = moment().subtract(2, "year").month("July").startOf("month").format("YYYY-MM-DD");
      dateTo = moment().subtract(1, "year").month("June").endOf("month").format("YYYY-MM-DD");
    }

    this.domDateFromUpdate(dateFrom, format);
    this.domDateToUpdate(dateTo, format);
  }

  static thisFinYear(format = "DD/MM/YYYY") {
    let dateFrom = null;
    let dateTo = null;
    if (moment().quarter() == 4) {
      dateFrom = moment().month("July").startOf("month").format("YYYY-MM-DD");
      dateTo = moment().add(1, "year").month("June").endOf("month").format("YYYY-MM-DD");
    } else {
      dateFrom = moment().subtract(1, "year").month("July").startOf("month").format("YYYY-MM-DD");
      dateTo = moment().month("June").endOf("month").format("YYYY-MM-DD");
    }

    this.domDateFromUpdate(dateFrom, format);
    this.domDateToUpdate(dateTo, format);
  }

  static thisMonth(format = "DD/MM/YYYY") {
    let dateFrom = moment().startOf("month").format("YYYY-MM-DD");
    let dateTo = moment().endOf("month").format("YYYY-MM-DD");

    this.domDateFromUpdate(dateFrom, format);
    this.domDateToUpdate(dateTo, format);
  }

  static thisQuarter(format = "DD/MM/YYYY") {
    let dateFrom = moment().startOf("Q").format("YYYY-MM-DD");
    let dateTo = moment().endOf("Q").format("YYYY-MM-DD");

    this.domDateFromUpdate(dateFrom, format);
    this.domDateToUpdate(dateTo, format);
  }

  /**
     * Use this to avoid copy pasting a lot of codes
     *
     */
  static getDateRangeEvents() {
    return {
    
    //   "click #last12Months": (e, templateObject) => {
    //     Datehandler.last12Months();
    //   },
      "click #thisMonth": (e, templateObject) => {
        Datehandler.thisMonth();
      },
      "click #thisQuarter": (e, templateObject) => {
        Datehandler.thisQuarter();
      },
      "click #thisFinYear": (e, templateObject) => {
        Datehandler.thisFinYear();
      },
      "click #lastMonth": (e, templateObject) => {
        Datehandler.lastMonth();
      },
      "click #lastQuarter": (e, templateObject) => {
        Datehandler.lastQuarter();
      },
      "click #lastFinYear": (e, templateObject) => {
        Datehandler.lastFinYear();
      },
      "click #monthToDate": (e, templateObject) => {
        Datehandler.monthToDate();
      },
      "click #quarterToDate": (e, templateObject) => {
        Datehandler.quaterToDate();
      },
      "click #finYearToDate": (e, templateObject) => {
        Datehandler.finYearToDate();
      }
    };
  }
}