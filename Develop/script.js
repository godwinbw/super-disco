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
    "<div class='hour col-2' hour-label='" + hourLabel + "'></div>"
  );

  //now append a time block
  $("<div class='time-block' id='" + hourLabel + "' ></div>")
    .text(hourLabel)
    .appendTo(thisCol);

  return thisCol;
};

var getDescriptionDiv = function (hourLabel, hourId) {
  // returns a div for the current description block
  console.log("getDescriptionDiv START...");
  console.log("   hourLabel -> " + hourLabel + " hourId -> " + hourId);

  var thisCol = $(
    "<div class='description col-8' hour-label='" + hourLabel + "' ></div>"
  );

  return thisCol;
};

var getSaveButtonDiv = function (hourLabel, hourId) {
  // returns a div for the current save button
  console.log("getSaveButtonDiv START...");
  console.log("   hourLabel -> " + hourLabel + " hourId -> " + hourId);

  var thisCol = $(
    "<div class='saveBtn col-2' hour-label='" + hourLabel + "'></div>"
  );

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
    var thisRow = $("<div class='row' hour-label='" + hours[i] + "' ></div>");

    // each row has 3 columns - time block, description, and save button
    getTimeBlockDiv(hours[i], i).appendTo(thisRow);
    getDescriptionDiv(hours[i], i).appendTo(thisRow);
    getSaveButtonDiv(hours[i], i).appendTo(thisRow);

    //add this row to today's planner
    thisRow.appendTo("#today-planner");
  }
};

var getPastPresentOrFutureClassName = function (currentHour, hourLabel) {
  //console.log("getPastPresentOrFutureClassName START...");

  // based on the hour label, returns either
  // "past", "present", or "future" based on current time of day
  //console.log("  hour label -> " + hourLabel);

  // convert the hourLabel to a moment object, then reformat for a comparison with current hour
  var labelHour = moment(hourLabel, "h A").format("HH");

  //console.log("  label hour -> " + labelHour);
  //console.log("  current hour -> " + currentHour);

  if (labelHour - currentHour > 0) {
    // the label hour is in the future
    //console.log("   labelHour " + labelHour + " is in the future");
    return "future";
  } else if (labelHour - currentHour == 0) {
    // the label hour is in the present
    //console.log("   labelHour " + labelHour + " is in the present");
    return "present";
  } else {
    // the label hour is in the past
    //console.log("   labelHour " + labelHour + " is in the past");
    return "past";
  }
};

var updateDescriptionRowBackgroundColor = function () {
  //console.log("updateDescriptionRowBackgroundColor START...");
  // update each description row background color based on past, present, or future

  // get current time of day in range of 0 -23
  var currentHour = moment().format("HH");
  //console.log("   currentHour -> " + currentHour);

  //loop through all the row elements in the #today-planner element
  // each one is a row.  get the attribute hour-label to see the hour of that row
  $("#today-planner")
    .children()
    .each((index, element) => {
      //get the hour-label attribute
      var hourLabel = $(element).attr("hour-label");
      //console.log("hour-label -> " + hourLabel);

      // see if this is past, present, or future
      var bgClass = getPastPresentOrFutureClassName(currentHour, hourLabel);
      //console.log("bgClass -> " + bgClass);

      // assign this bgClass to all descendents of this element with class = description
      $(element).children(".description").addClass(bgClass);
    });
};

var updateTick = function () {
  // this updates the description background colors everytime it gets called
  console.log("updateTick START!");
  updateDescriptionRowBackgroundColor();
};

// execute when page loads

// 1. first, update the banner with today's date
updateBannerWithTodaysDate();

// 2. create today's hours
createTodaysHours();

// 3. load the contents of the rows with any saved data

// 4. update the description row backgorund color
updateDescriptionRowBackgroundColor();

//5. start a timer, that updates the background color every 30 seconds
setInterval(updateTick, 1000 * 30);
