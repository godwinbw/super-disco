var updateBannerWithTodaysDate = function () {
  console.log("updateBannerWithTodaysDate START...");

  var currentDay = moment(new Date()).format("dddd, MMMM Do");
  console.log("   current date -> " + currentDay);

  $("#currentDay").text(currentDay);
};

var getTimeBlockDiv = function (hourLabel, hourId) {
  // returns a div for the current time block
  console.log("getTimeBlockDiv START...");
  console.log("   hourLabel -> " + hourLabel + " hourId -> " + hourId);

  var thisCol = $(
    "<div class='time-block col-2' id='" + hourLabel + "'></div>"
  );
  thisCol.text(hourLabel);

  return thisCol;
};

var getDescriptionDiv = function (hourLabel, hourId) {
  // returns a div for the current description block
  console.log("getDescriptionDiv START...");
  console.log("   hourLabel -> " + hourLabel + " hourId -> " + hourId);

  var thisCol = $(
    "<div class='description col-8' id='" + hourLabel + "' ></div>"
  );

  return thisCol;
};

var getSaveButtonDiv = function (hourLabel, hourId) {
  // returns a div for the current save button
  console.log("getSaveButtonDiv START...");
  console.log("   hourLabel -> " + hourLabel + " hourId -> " + hourId);

  var thisCol = $("<div class='saveBtn col-2' id='" + hourLabel + "'></div>");

  // add the fontawesome save icon to this div
  $("<i class='fas fa-save'></i>").appendTo(thisCol);

  return thisCol;
};

var createTodaysHours = function () {
  console.log("createTodayHours START...");
  // remove all existing hours from the #today-planner element
  $("#today-planner").empty();

  // create hourly rows in the #today-planner element
  var hours = [
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
  ];

  // loop through hours and create a row for each hour
  for (var i = 0; i < hours.length; i++) {
    console.log("   hour -> " + hours[i]);

    //create a row
    var thisRow = $("<div class='row' id='" + i + "' ></div>");

    // each row has 3 columns - time block, description, and save button
    getTimeBlockDiv(hours[i], i).appendTo(thisRow);
    getDescriptionDiv(hours[i], i).appendTo(thisRow);
    getSaveButtonDiv(hours[i], i).appendTo(thisRow);

    //add this row to today's planner
    thisRow.appendTo("#today-planner");
  }
};

var getPastPresentOrFutureClassName = function (hourLabel) {
  console.log("getPastPresentOrFutureClassName START...");

  // based on the hour label, returns either
  // "past", "present", or "future" based on current time of day
  console.log("  hour label -> " + hourLabel);

  // convert the hourLabel to a moment object, then reformat for a comparison with current hour
  var labelHour = moment(hourLabel, "h A").format("HH");

  console.log("  label hour -> " + labelHour);

  // get current time of day in form of "H AM/PM"
  var currentHour = moment().format("HH");

  console.log("  current hour -> " + currentHour);

  if (labelHour - currentHour > 0) {
    // the label hour is in the future
    console.log("   labelHour " + labelHour + " is in the future");
    return "future";
  } else if (labelHour - currentHour == 0) {
    // the label hour is in the present
    console.log("   labelHour " + labelHour + " is in the present");
    return "present";
  } else {
    // the label hour is in the past
    console.log("   labelHour " + labelHour + " is in the past");
    return "past";
  }
};

// execute when page loads
updateBannerWithTodaysDate();

createTodaysHours();

getPastPresentOrFutureClassName("10 AM");
