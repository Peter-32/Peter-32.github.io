document.getElementById("this_year").innerHTML = (new Date()).getYear() + 1900;
var date1 = (new Date("2014-06-15"));
var date2 = (new Date());
document.getElementById("days_in_data_science").innerHTML = Math.floor((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)).toLocaleString("en-US");;


