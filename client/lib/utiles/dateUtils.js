export const getDayNumber = function (day) {
    day = day.toLowerCase();
    if (day == "") {
      return;
    }
    if (day == "monday") {
      return 1;
    }
    if (day == "tuesday") {
      return 2;
    }
    if (day == "wednesday") {
      return 3;
    }
    if (day == "thursday") {
      return 4;
    }
    if (day == "friday") {
      return 5;
    }
    if (day == "saturday") {
      return 6;
    }
    if (day == "sunday") {
      return 0;
    }
  }
  export const getMonths = function (startDate, endDate) {
    let dateone = "";
    let datetwo = "";
    if (startDate != "") {
      dateone = moment(startDate).format('M');
    }
    if (endDate != "") {
      datetwo = parseInt(moment(endDate).format('M')) + 1;
    }
    if (dateone != "" && datetwo != "") {
      for (let x = dateone; x < datetwo; x++) {
        if (x == 1) {
          $("#formCheck-january").prop('checked', true);
        }
        if (x == 2) {
          $("#formCheck-february").prop('checked', true);
        }
        if (x == 3) {
          $("#formCheck-march").prop('checked', true);
        }
        if (x == 4) {
          $("#formCheck-april").prop('checked', true);
        }
        if (x == 5) {
          $("#formCheck-may").prop('checked', true);
        }
        if (x == 6) {
          $("#formCheck-june").prop('checked', true);
        }
        if (x == 7) {
          $("#formCheck-july").prop('checked', true);
        }
        if (x == 8) {
          $("#formCheck-august").prop('checked', true);
        }
        if (x == 9) {
          $("#formCheck-september").prop('checked', true);
        }
        if (x == 10) {
          $("#formCheck-october").prop('checked', true);
        }
        if (x == 11) {
          $("#formCheck-november").prop('checked', true);
        }
        if (x == 12) {
          $("#formCheck-december").prop('checked', true);
        }
      }
    }
    if (dateone == "") {
      $("#formCheck-january").prop('checked', true);
    }
  }