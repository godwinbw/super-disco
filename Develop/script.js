// global variable to hold all values of hours we are tracking (work hours from 9 am to 5 pm)
var hourly_detail = {
  "9 AM": "",
  "10 AM": "",
  "11 AM": "",
  "12 PM": "",
  "1 PM": "",
  "2 PM": "",
  "3 PM": "",
  "4 PM": "",
  "5 PM": "",
};

var loadHourlyDetailFromLocalStorage = function () {
  // this function loads all the saved tasks from local storage
  // and returns as a list

  console.log("loadHourlyDetailFromLocalStorage START...");
  var hourlyDetailFromStorage = JSON.parse(
    localStorage.getItem("hourly-detail")
  );

  if (hourlyDetailFromStorage) {
    // we have some items from local storage, let's load them into the hourly_detail list
    console.log("  localStorage hourly detail...");
    for (var hourLabel in hourlyDetailFromStorage) {
      console.log("   hourLabel   -> " + hourLabel);
      console.log("   task detail -> " + hourlyDetailFromStorage[hourLabel]);

      //update our hourly_detail list
      hourly_detail[hourLabel] = hourlyDetailFromStorage[hourLabel];
    }
  }
};

var saveTaskDetailToLocalStorage = function (hourLabel, taskDetail) {
  // thsi function saves a task detail for a single hour
  // only that hour's task detail is saved, all others are unchanged

  console.log("saveTaskDetailToLocalStorage START...");
  console.log("     hourLabel  -> " + hourLabel);
  console.log("     taskDetail -> " + taskDetail);
};

// updates banner at top of page with today's date
var updateBannerWithTodaysDate = function () {
  console.log("updateBannerWithTodaysDate START...");

  var currentDay = moment(new Date()).format("dddd, MMMM Do");
  console.log("   current date -> " + currentDay);

  $("#currentDay").text(currentDay);
};

var getTimeBlockDiv = function (hourLabel) {
  // returns a div for the current time block
  console.log("getTimeBlockDiv START...");
  console.log("   hourLabel -> " + hourLabel);

  var thisCol = $(
    "<div class='hour col-2' hour-label='" + hourLabel + "'></div>"
  );

  //now append a time block
  $("<div class='time-block' id='" + hourLabel + "' ></div>")
    .text(hourLabel)
    .appendTo(thisCol);

  return thisCol;
};

var getDescriptionDiv = function (hourLabel) {
  // returns a div for the current description block
  console.log("getDescriptionDiv START...");
  console.log("   hourLabel -> " + hourLabel);

  var thisCol = $(
    "<div class='description col-8' hour-label='" + hourLabel + "' ></div>"
  );

  // set the description to the saved value
  thisCol.val(hourly_detail[hourLabel]);

  $("<p class='task-detail' hour-label='" + hourLabel + "'></p>").appendTo(
    thisCol
  );

  return thisCol;
};

var getSaveButtonDiv = function (hourLabel) {
  // returns a div for the current save button
  console.log("getSaveButtonDiv START...");
  console.log("   hourLabel -> " + hourLabel);

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

  // loop through hourly_detail and create a row for each hour
  for (var hourLabel in hourly_detail) {
    console.log("   hour -> " + hourLabel);

    //create a row
    var thisRow = $("<div class='row' hour-label='" + hourLabel + "' ></div>");

    // each row has 3 columns - time block, description, and save button
    getTimeBlockDiv(hourLabel).appendTo(thisRow);
    getDescriptionDiv(hourLabel).appendTo(thisRow);
    getSaveButtonDiv(hourLabel).appendTo(thisRow);

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
  // updates the background color of the rows, then schedules the next time
  // for this function to run to be at the start of the next hour, whenever that is

  console.log("updating description background color");
  updateDescriptionRowBackgroundColor();

  // now see when we need to run again
  // get current time, split into an array of hours, minutes, seconds, and milliseconds of current time
  var now = moment().format("HH:mm:ss:SSS");
  var splitNow = now.split(":");
  var minutes = parseInt(splitNow[1]);
  var seconds = parseInt(splitNow[2]);
  var ms = parseInt(splitNow[3]);

  console.log("   current time is -> " + now);
  console.log("    minutes -> " + minutes);
  console.log("    seconds -> " + seconds);
  console.log("    ms => " + ms);

  // determine the current ms past the hour
  var millisecondsPastTheHour = minutes * 60 * 1000 + seconds * 1000 + ms;
  console.log("   ms past the hour -> " + millisecondsPastTheHour);

  // calculate when we need to run again, for it to be top of the hour
  var totalMsInAnHour = 60 * 60 * 1000;
  console.log("   total ms in an hour -> " + totalMsInAnHour);

  var intervalForNextUpdate = totalMsInAnHour - millisecondsPastTheHour;
  console.log(
    "   will schedule next update at -> " +
      intervalForNextUpdate +
      " ms from now"
  );

  // set a timeout for this function to run again at the top of the next hour
  // where it will then calculate the next time it needs to run again, and set itself
  // to be called again
  setTimeout(updateTick, intervalForNextUpdate);
};

// ******
//
// execute when page loads
//
// ******

// 1. load saved data from local storage
loadHourlyDetailFromLocalStorage();

// 2. first, update the banner with today's date
updateBannerWithTodaysDate();

// 3. create today's hours
createTodaysHours();

// 4. start doing background update ticks
updateTick();

//5. wait for user clicks

// user clicks on a description, replace p with a form
$(".description").on("click", function () {
  console.log("description clicked!");
  //console.log(" this -> " + $(this).html());

  //find child p element and change to text input

  var text = $(this).children(".task-detail").text().trim();
  var hourLabel = $(this).attr("hour-label");

  var textInput = $("<textarea>")
    .addClass("textarea")
    .attr("hour-label", hourLabel)
    .val(text);

  $(this).children(".task-detail").replaceWith(textInput);

  textInput.trigger("focus");
});

// when the textarea area loses focus, convert textarea back to a p
$(".description").on("blur", "textarea", function () {
  console.log("description blurred!");

  // find the child element p current text
  var text = $(this).val().trim();
  console.log("   text -> " + text);

  // get the current hour label
  var hourLabel = $(this).attr("hour-label");
  console.log("   hourLabel -> " + hourLabel);

  // recreate the p element
  var taskDetailP = $("<p>")
    .addClass("task-detail")
    .attr("hour-label", hourLabel)
    .text(text);

  // replace textarea with p elemeent
  $(this).replaceWith(taskDetailP);
});
