"use strict";

//// Angular //////////////////////

angular.module('theApp')
.directive('dirOne', function() {
  return {
    template: "", // this will be printed out
    restrict: "A"
  }
});
//////////////////////

//// Some important intitializations //////////////////////
// variables
// number from 1 to 57
let randomNumberStored = 1;
let currentLocationIdx = 0;
// button variables
let button_back_active = false;
let button_next_active = true;
let button_show_active = false;
let button_room_active = false;

// pages
let on_about_page = true;
let on_room_page = 0;
let on_randomize_page = false;
let on_topic_page = false;
// drawing shown
let show_room_drawing = false;
// nav bar
$("#navbarNavAltMarkup").find(".active").removeClass("active");
$("#nav_about").addClass("active");
// page content - show
$("#about").show();
populateContentFlashcard();
// page content - remove
$("#about2").hide();
$("#topic_content").hide()
$("#random_content_flashcard").hide();
// svg initializations
let svg_div = document.getElementById("svg_div");
let svg = d3.select("#svg_div").append("svg");
let line_breaks = { xLeft: 0, xRight: 0, yTop: 0, yBottom: 0, xMid: 0 };
let room_height=0;
let room_width=0;
let prev_width = 0; // set this to 0 to start.

//////////////////////

//// Nav Bar: Set the active class attribute and apply additional logic.
function clickedOnNavBar() {
  $("#navbarNavAltMarkup").find(".active").removeClass("active");
  $(this).addClass("active");
  let this_id = $(this).attr('id');
  // Make the right information visible and invisible.
  // bind/unbind clickable when nav changes.  Also the resize needs to bind/unbind.
  // Also set the dropdown as active for rooms
 if (this_id == "nav_about") {
   initAboutPage();
 } else if (this_id == "nav_randomize") {
   initRandomizePage();
 } else if (this_id.startsWith("nav_room")) {
   initRoomPage(this.id);
 }
}

////////// FUNCTIONS //////////////////////

// when a new button is created run this
function updateButton(button, text, boolean) {
  if (boolean) {
    button.show();
    text.show()
    button.unbind();
    button.click(clickedButton);
  } else {
    button.hide();
    text.hide();
    button.unbind();
  }
}

function populateTopicContent(locationIdx) {
  // 1-57 locationIdx values possible
  let topic_para = document.getElementById("topic_para");
  let topic_room_number = document.getElementById("topic_room_number");
  const roomIdx = getRoomNumGivenLocationIdx(locationIdx);
  const topicIdx1 = (3*locationIdx)-2;
  const topicIdx2 = (3*locationIdx)-1;
  const topicIdx3 = (3*locationIdx);
  if (locationIdx > 57) {
    topic_room_number.innerHTML = "No Content";
    topic_para.innerHTML = "";
  } else {
    topic_room_number.innerHTML = "Room " + roomIdx + "<br>" +
    "Location " +  + locationIdx + "<br>" +
    "Topics " + topicIdx1 + " - " + Math.min(topicIdx3,170);
    topic_para.innerHTML = topics[topicIdx1].verse + " " + topics[topicIdx1].verse_id + "<br><br>" +
    topics[topicIdx2].verse + " " + topics[topicIdx2].verse_id + "<br><br>" +
    topics[topicIdx3].verse + " " + topics[topicIdx3].verse_id;
  }
}

function changeTheRandomNumber() {
  randomNumberStored = Math.floor(Math.random() * 57) + 1;
}

function getRoomNumGivenLocationIdx(locationIdx) {
  return Math.floor((locationIdx-1) / 10) + 1;
}

function populateContentFlashcard() {
  let random_content_flashcard_room = document.getElementById("random_content_flashcard_room");
  const roomIdx = getRoomNumGivenLocationIdx(randomNumberStored);
  const topicIdx1 = (3*randomNumberStored)-2;
  const topicIdx2 = (3*randomNumberStored)-1;
  const topicIdx3 = (3*randomNumberStored);
  // fill the HTML
  random_content_flashcard_room.innerHTML = "Room " + roomIdx + "<br>" +
  "Location " +  + randomNumberStored + "<br>" +
  "Topics " + topicIdx1 + " - " + Math.min(topicIdx3,170);
}

//////////////////////

//////// ROOMS //////////////////////

function initAboutPage() {
  // nav bar
  $("#navbarNavAltMarkup").find(".active").removeClass("active");
  $("#nav_about").addClass("active");
  $("#nav_label_room").html("Room"); // Reset the dropdown name to Room
  // page content - show
  $("#about").show();
  $("#about1").show();
  // page content - remove
  $("#room_drawing").hide();
  $("#about2").hide();
  $("#topic_content").hide();
  $("#random_content_flashcard").hide();
  // page listeners
  $("#box_drawing").unbind();
  // variables
  on_about_page = true;
  on_room_page = 0;
  on_randomize_page = false;
  on_topic_page = false;
  // Buttons
  button_back_active = false;
  button_next_active = true;
  button_show_active = false;
  button_room_active = false;
  updateButton($("#button_back"), $("#drawing_button_text_Back"), button_back_active);
  updateButton($("#button_next"), $("#drawing_button_text_Next"), button_next_active);
  updateButton($("#button_show"), $("#drawing_button_text_Show"), button_show_active);
  updateButton($("#button_room"), $("#drawing_button_text_Room"), button_room_active);
}

function initRoomPage(roomId) {
  // nav bar
  let roomElem = document.getElementById(roomId);
  $("#navbarNavAltMarkup").find(".active").removeClass("active");
  $(roomId).addClass("active");
  $("#nav_dropdown_room").addClass("active");
  $("#nav_label_room").html(roomElem.innerHTML); // set the room number.  Example: Room 5
  // page content - show
  $("#room_drawing").show();
  // page content - remove
  $("#about").hide();
  $("#topic_content").hide();
  $("#random_content_flashcard").hide();
  // page listeners
  $("#box_drawing").click(clickedRoom);
  // variables
  on_about_page = false;
  on_room_page = roomElem.getAttribute("data-room-num");
  on_randomize_page = false;
  on_topic_page = false;
  // Buttons
  button_back_active = false;
  button_next_active = false;
  button_show_active = false;
  button_room_active = false;
  updateButton($("#button_back"), $("#drawing_button_text_Back"), button_back_active);
  updateButton($("#button_next"), $("#drawing_button_text_Next"), button_next_active);
  updateButton($("#button_show"), $("#drawing_button_text_Show"), button_show_active);
  updateButton($("#button_room"), $("#drawing_button_text_Room"), button_room_active);
}

function initRandomizePage() {
  // nav bar
  $("#navbarNavAltMarkup").find(".active").removeClass("active");
  $("#nav_randomize").addClass("active");
  $("#nav_label_room").html("Room"); // Reset the dropdown name to Room
  // page content - show
  changeTheRandomNumber();
  populateContentFlashcard();
  $("#random_content_flashcard").show();
  // page content - remove
  $("#about").hide();
  $("#room_drawing").hide();
  $("#room_drawing").hide();
  $("#topic_content").hide();
  $("#box_drawing").unbind();
  // page listeners
    // nothing yet
  // variables
  on_about_page = false;
  on_room_page = getRoomNumGivenLocationIdx(randomNumberStored);
  on_randomize_page = true;
  on_topic_page = false;
  // Buttons
  button_back_active = false;
  button_next_active = false;
  button_show_active = true;
  button_room_active = false;
  updateButton($("#button_back"), $("#drawing_button_text_Back"), button_back_active);
  updateButton($("#button_next"), $("#drawing_button_text_Next"), button_next_active);
  updateButton($("#button_show"), $("#drawing_button_text_Show"), button_show_active);
  updateButton($("#button_room"), $("#drawing_button_text_Room"), button_room_active);
}

function initTopicPage(locationIdx) {
  // nav bar   (no need to change the nav bar)
  // page content - show
  populateTopicContent(locationIdx);
  $("#topic_content").show()
  // page content - remove
  $("#room_drawing").hide();
  $("#random_content_flashcard").hide();
  // page listeners
  $("#box_drawing").unbind();
  // variables
  currentLocationIdx = Math.min(locationIdx,58);
  on_room_page = getRoomNumGivenLocationIdx(currentLocationIdx);
  on_about_page = false;
  on_randomize_page = false;
  on_topic_page = true;
  // Buttons
  button_back_active = true;
  button_next_active = true;
  button_show_active = false;
  button_room_active = true;
  updateButton($("#button_back"), $("#drawing_button_text_Back"), button_back_active);
  updateButton($("#button_next"), $("#drawing_button_text_Next"), button_next_active);
  updateButton($("#button_show"), $("#drawing_button_text_Show"), button_show_active);
  updateButton($("#button_room"), $("#drawing_button_text_Room"), button_room_active);
}

//////////////////////

////////// CALLBACK FUNCTIONS //////////////////////////////////////////////////////

/////// Clickable SVG room elements
// Need: size of svg, line_breaks object values
function clickedRoom(evt){
  const e = evt.target;
  const dim = e.getBoundingClientRect();
  const x = evt.clientX - dim.left;
  const y = evt.clientY - dim.top;
  const tens_place_of_idx = 10*(on_room_page-1); // room 1 is 1-10 so do "-1"

  if (x <= line_breaks.xLeft) {
    if (y <= line_breaks.yTop) {
      currentLocationIdx = tens_place_of_idx + 8;
    } else if (y <= line_breaks.yBottom) {
      currentLocationIdx = tens_place_of_idx + 7;
    } else {
      currentLocationIdx = tens_place_of_idx + 6;
    }
  } else if (x <= line_breaks.xRight) {
    if (y <= line_breaks.yTop) {
      currentLocationIdx = tens_place_of_idx + 1;
    } else if (y <= line_breaks.yBottom) {
      if (x <= line_breaks.xMid) {
        currentLocationIdx = tens_place_of_idx + 9;
      } else {
        currentLocationIdx = tens_place_of_idx + 10;
      }
    } else {
      currentLocationIdx = tens_place_of_idx + 5;
    }
  } else {
    if (y <= line_breaks.yTop) {
      currentLocationIdx = tens_place_of_idx + 2;
    } else if (y <= line_breaks.yBottom) {
      currentLocationIdx = tens_place_of_idx + 3;
    } else {
      currentLocationIdx = tens_place_of_idx + 4;
    }
  }
  initTopicPage(currentLocationIdx);
}

// Respond to button clicks
function clickedButton(evt){
  let evt_id = $(evt.target)[0].id;

  //// ABOUT PAGE
  if (on_about_page) {
    if (evt_id == "button_next") {
        $("#about1").hide();
        $("#about2").show();
        button_back_active = true;
        button_next_active = false;
        updateButton($("#button_back"), $("#drawing_button_text_Back"), button_back_active);
        updateButton($("#button_next"), $("#drawing_button_text_Next"), button_next_active);
    } else if (evt_id == "button_back") {
        initAboutPage();
    } else if (evt_id == "button_show") {
      // Show Button Pressed
    } else if (evt_id == "button_room") {
      // Room Button Pressed
    }
  }
  //// RANDOMIZE PAGE
  else if (on_randomize_page) {
      if (evt_id == "button_next") {
        // Next Button Pressed
      } else if (evt_id == "button_back") {
        // Back Button Pressed
      } else if (evt_id == "button_show") {
        // Show Button Pressed
        // random number 1 to 67
        $("#random_content_flashcard").hide();
        initTopicPage(randomNumberStored);
      } else if (evt_id == "button_room") {
        // Room Button Pressed
      }
  }
  //// TOPIC PAGE
   else if (on_topic_page) {
    if (evt_id == "button_next") {
      // Next Button Pressed
      currentLocationIdx = currentLocationIdx + 1;
      initTopicPage(currentLocationIdx);
    } else if (evt_id == "button_back") {
      // Back Button Pressed
      currentLocationIdx = Math.max(currentLocationIdx - 1,1);
      initTopicPage(currentLocationIdx);
    } else if (evt_id == "button_show") {
      // Show Button Pressed
    } else if (evt_id == "button_room") {
      // Room Button Pressed
      initRoomPage("nav_room_" + on_room_page);
    }

  }
  //// ROOM PAGE
  else if (on_room_page != 0) {
      if (evt_id == "button_next") {
        // Next Button Pressed
      } else if (evt_id == "button_back") {
        // Back Button Pressed
      } else if (evt_id == "button_show") {
        // Show Button Pressed
      } else if (evt_id == "button_room") {
        // Room Button Pressed
      }
    }
}

//////////////////////////////////////////////////////



//////////// SVG DRAWINGS //////////////////////////////////////////////////////
function redraw(){
  /*
  if ((window.outerHeight - window.innerHeight) > 100) {
      // console was open.  Not the type of event we want to redraw.
      return;
  }
*/
  // window size.  Don't resize less than 400px.
  let windowSize = Math.max($(window).width(),400)

  if (prev_width == windowSize) {
    // no redraw necessary unless width changed.
    return;
  }
  // safe to set the previous with to this width now.
  prev_width = windowSize

  // get the room width and height
  // set a different height for different width sizes
  let container_padding_left = window.getComputedStyle(svg_div, null).getPropertyValue('padding-left'); // remove this and hard code 15px if you want.
  room_width = svg_div.clientWidth - (parseInt(container_padding_left)*2);

  if (prev_width < 768) {
      room_height = 740;
  }
  // removing these lines because the height is the same for each.
  // else if (prev_width >= 768 &&  prev_width <= 992) {
  //    room_height = 475;
  //}
  //else if (prev_width > 992 &&  prev_width <= 1200) {
  //    room_height = 475;
  //}
  else  {
      room_height = 475;
  }
  // Set content width
  $("#topic_content").width(room_width);

  //let room_height = screen.height;
 // Use the extracted size to set the size of an SVG element.
 svg
      .attr("width", room_width)
      .attr("height", room_height)
      .attr("id", "svg_rect");
  // remove the old drawing
  svg.selectAll("*").remove()
 let box_drawing = svg.selectAll("box_drawing_nonexistent").data([
   {x: 0, y: 0, rx: 20, ry: 20, width: room_width, height: room_height}
 ]);
 // if enter finds more datapoints than objects it will create the new elements in the DOM.
 // append puts the selectionc reated by enter and puts it in the DOM.
 box_drawing
   .enter().append("rect")
     .style("fill", "#86B6ED") // red is a choice
     .style("stroke", "black")
     .style("stroke-width", 5)
     .style("opacity", 0.5)
     // not sure what merge does.
   .merge(box_drawing)
     .attr("x", function (d) { return d.x; })
     .attr("y", function (d) { return d.y; })
     .attr("rx", function (d) { return d.rx; })
     .attr("ry", function (d) { return d.ry; })
     .attr("width", function (d) { return d.width; })
     .attr("height", function (d) { return d.height; })
     .attr("id", function(d) { return "box_drawing"})
  ;
  $("#box_drawing").click(clickedRoom)
  ///////////// Add a div that holds lines and text.
  let room_drawing = d3.select("#svg_rect").append("svg");
  room_drawing.attr("id", "room_drawing");
  // logic whether to show this element or hide it.
  if (!show_room_drawing) {
    $("#room_drawing").hide();
    $("#box_drawing").unbind();
  }

  /////////////// Draw the lines ////////////////////////////////////////////
  line_breaks = { xLeft: room_width/3, xRight: room_width*2/3, yTop: room_height/3, yBottom: room_height*2/3, xMid: room_width/2};
  let lines = room_drawing.selectAll("line_nonexistent").data([
    {x1: line_breaks.xLeft, y1: 0, x2: line_breaks.xLeft, y2: room_height, stroke_width: 2, stroke: "black"},
    {x1: line_breaks.xRight, y1: 0, x2: line_breaks.xRight, y2: room_height, stroke_width: 2, stroke: "black"},
    {x1: 0, y1: line_breaks.yTop, x2: room_width, y2: line_breaks.yTop, stroke_width: 2, stroke: "black"},
    {x1: 0, y1: line_breaks.yBottom, x2: room_width, y2: line_breaks.yBottom, stroke_width: 2, stroke: "black"},
    {x1: line_breaks.xMid, y1: line_breaks.yTop, x2: line_breaks.xMid, y2: line_breaks.yBottom, stroke_width: 2, stroke: "black"},
  ]);
  lines
    .enter().append("line")
      // not sure what merge does.
    .merge(box_drawing)
      .attr("x1", function (d) { return d.x1; })
      .attr("y1", function (d) { return d.y1; })
      .attr("x2", function (d) { return d.x2; })
      .attr("y2", function (d) { return d.y2; })
      .attr("stroke-width", function (d) { return d.stroke_width; })
      .attr("stroke", function (d) { return d.stroke; })
   ;
/////////////// Draw Text ////////////////////////////////////////////
let adjustment_xs1;
let adjustment_xs2;
if (prev_width < 768) {
  adjustment_xs1 = .02;
  adjustment_xs2 = .04;
} else {
  adjustment_xs1 = 0;
  adjustment_xs2 = 0;
}

let drawing_text = room_drawing.selectAll("drawing_text_nonexistent").data([
  {x: room_width*.49, y: room_height*.186, font_family: "Verdana", font_size: 35, text: 1},
  {x: room_width*.823, y: room_height*.186, font_family: "Verdana", font_size: 35, text: 2},
  {x: room_width*.823, y: room_height*.52, font_family: "Verdana", font_size: 35, text: 3},
  {x: room_width*.823, y: room_height*.853, font_family: "Verdana", font_size: 35, text: 4},
  {x: room_width*.49, y: room_height*.853, font_family: "Verdana", font_size: 35, text: 5},
  {x: room_width*.156, y: room_height*.853, font_family: "Verdana", font_size: 35, text: 6},
  {x: room_width*.156, y: room_height*.52, font_family: "Verdana", font_size: 35, text: 7},
  {x: room_width*.156, y: room_height*.186, font_family: "Verdana", font_size: 35, text: 8},
  {x: room_width*(.406-adjustment_xs1), y: room_height*.52, font_family: "Verdana", font_size: 35, text: 9},
  {x: room_width*(.563-adjustment_xs2), y: room_height*.52, font_family: "Verdana", font_size: 35, text: 10}

]);
drawing_text
  .enter().append("text")
    // not sure what merge does.
  .merge(box_drawing)
    .attr("x", function (d) { return d.x; })
    .attr("y", function (d) { return d.y; })
    .attr("font-family", function (d) { return d.font_family; })
    .attr("font-size", function (d) { return d.font_size; })
    .attr("id", function (d, i) {return "drawing_text" + d.text; })
 ;
 for (let i = 1; i < 11; i++) {
   document.getElementById("drawing_text"+i).innerHTML = i;
 }

/////////////// Draw Buttons ////////////////////////////////////////////
// visible on about page 2 and on each topic but not randomize pages

// Different locations based on whether the width is extra small
let xLocation1;
let xLocation2;
let xLocation3;
let xLocation4;
let yLocation1;
let yLocation2;
let yLocation3;
let yLocation4;
let showSizeAdjust = 1;
// XS width
if (prev_width < 768) {
  xLocation1 = room_width*.37;
  xLocation2 = room_width*.37;
  xLocation4 = room_width*.37;
  xLocation3 = room_width*.37;

  yLocation2 = room_height*.88;
  yLocation4 = yLocation2 - 85;
  yLocation1 = yLocation4 - 85;
  yLocation3 = room_height*.35;

}
// Small plus width
else  {
    xLocation4 = room_width*.43;
    xLocation1 = xLocation4 - 150;
    xLocation2 = xLocation4 + 150;
    xLocation3 = room_width*.32;

    yLocation1 = room_height*.75;
    yLocation2 = room_height*.75;
    yLocation3 = room_height*.35;
    yLocation4 = room_height*.75;
}
// small adjustment for the show button
if (prev_width < 768) {
  xLocation3 = room_width*.11;
  if (prev_width < 555) {
    showSizeAdjust = .8;
    let centeringX = (prev_width - 384) / 2;
    xLocation3 = 10 + centeringX;
  }
} else if (prev_width >= 768 &&  prev_width <= 992) {
  xLocation3 = room_width*.21;
}

let svg_buttons = svg.selectAll("back_button_nonexistent").data([
  {x: xLocation1, y: yLocation1, rx: 50, ry: 50, width: 140, height: 75, id: "button_back"},
  {x: xLocation2, y: yLocation2, rx: 50, ry: 50, width: 140, height: 75, id: "button_next"},
  {x: xLocation3, y: yLocation3, rx: 150*showSizeAdjust, ry: 150*showSizeAdjust, width: 420*showSizeAdjust, height: 225*showSizeAdjust, id: "button_show"},
  {x: xLocation4, y: yLocation4, rx: 50, ry: 50, width: 140, height: 75, id: "button_room"}
]);
// if enter finds more datapoints than objects it will create the new elements in the DOM.
// append puts the selectionc reated by enter and puts it in the DOM.
svg_buttons
  .enter().append("rect")
    .style("fill", "#7BCE8C") // red is a choice
    .style("stroke", "#64A47E")
    .style("stroke-width", 1)
    .style("opacity", 0.8)
    // not sure what merge does.
  .merge(box_drawing)
    .attr("x", function (d) { return d.x; })
    .attr("y", function (d) { return d.y; })
    .attr("rx", function (d) { return d.rx; })
    .attr("ry", function (d) { return d.ry; })
    .attr("width", function (d) { return d.width; })
    .attr("height", function (d) { return d.height; })
    .attr("id", function(d) { return d.id; })
    .attr("class", function(d) { return "svg_button"; })
 ;

// draw button text
let xAdjust = 30;
let xAdjust3 = 23;
let yAdjust = 50;
let xAdjust2 = 75;
let yAdjust2 = 140;
if (prev_width < 555) {
  xAdjust2 = 32;
  yAdjust2 = 125;
}

let drawing_text2 = svg.selectAll("drawing_text_nonexistent2").data([
  {x: parseInt($("#button_back").attr("x")) + xAdjust, y: parseInt($("#button_back").attr("y")) + yAdjust, font_family: "Verdana", font_size: 35, text: "Back"},
  {x: parseInt($("#button_next").attr("x")) + xAdjust, y: parseInt($("#button_next").attr("y")) + yAdjust, font_family: "Verdana", font_size: 35, text: "Next"},
  {x: parseInt($("#button_show").attr("x")) + xAdjust2, y: parseInt($("#button_show").attr("y")) + yAdjust2, font_family: "Verdana", font_size: 105, text: "Show"},
  {x: parseInt($("#button_room").attr("x")) + xAdjust3, y: parseInt($("#button_room").attr("y")) + yAdjust, font_family: "Verdana", font_size: 35, text: "Room"}

]);
drawing_text2
  .enter().append("text")
  .style("fill", "white")
  .style("stroke", "none")
    // not sure what merge does.
  .merge(box_drawing)
    .attr("x", function (d) { return d.x; })
    .attr("y", function (d) { return d.y; })
    .attr("font-family", function (d) { return d.font_family; })
    .attr("font-size", function (d) { return d.font_size; })
    .attr("id", function (d, i) {return "drawing_button_text_" + d.text; })
    .attr("class", function(d) {return "noPointerE"; })
 ;
 document.getElementById("drawing_button_text_Back").innerHTML = "Back";
 document.getElementById("drawing_button_text_Next").innerHTML = "Next";
 document.getElementById("drawing_button_text_Show").innerHTML = "Show";
 document.getElementById("drawing_button_text_Room").innerHTML = "Room";

updateButton($("#button_back"), $("#drawing_button_text_Back"), button_back_active);
updateButton($("#button_next"), $("#drawing_button_text_Next"), button_next_active);
updateButton($("#button_show"), $("#drawing_button_text_Show"), button_show_active);
updateButton($("#button_room"), $("#drawing_button_text_Room"), button_room_active);





}

// First drawing
redraw();
// Redraw based on the new size whenever the browser window is resized.


////////// SET SOME CALLBACKS //////////////////////////////////////////////////////


window.addEventListener("resize", redraw);

// set callback on nav bar
$("#navbarNavAltMarkup a").on("click", clickedOnNavBar);



//////////////////////////////////////////////////////
