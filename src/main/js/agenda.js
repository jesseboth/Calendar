key = ""; /*key for dictionary*/
current = null; /*list for current event*/
now = null
current_i = -1;
next_i = -1;
next = null; /*list for next event*/
to_next = false; /*true if next false if current*/

_all_day = 0; /*index for all day events*/
rand = false; /*to find random for allday*/
all_day_current = -1; /*place holder index*/
to_tomorrow = false; /*true if all events are over for the day*/
current_tomorrow = 0; /*index for tomorrows events*/
event_key = null;
all_key = null;

link_clicked = false;
function link() {
  link_clicked = true;
}

sec = null; /*for delay*/

sec_reset = -1;

function updateTime() {
  var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ];
  var week = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", ];
  var datetime = new Date();

  var month_num = datetime.getMonth();
  var hour = datetime.getHours();
  var minutes = add_zero(datetime.getMinutes());
  var current_time = get_12_hour(hour, minutes, true);
  var time_24 = hour.toString() + minutes.toString();
  var month = months[month_num];
  var day = datetime.getDate();
  var year = datetime.getFullYear();
  var day_of_week = week[datetime.getDay()];
  var date = day_of_week + ", " + month + " " + day;
  key = add_zero(month_num + 1) + "/" + add_zero(day) + "/" + year.toString();
  var seconds = datetime.getSeconds();

  /*gives a 10 second delay*/
  if (sec === null) {
    sec = seconds;
  } else {
    if (sec + 10 >= 60 && seconds < 10) {
      sec -= 60;
    }
    if (sec + 10 <= seconds) {
      sec = seconds;
      rotate();
    }
  }

  document.getElementById("time").innerHTML = current_time;
  document.getElementById("time").style.fontFamily = "Orbitron";
  document.getElementById("month").innerHTML = date;
  document.getElementById("month").style.fontFamily = "Orbitron-light";

  if(current == null || (!to_tomorrow && parseInt(time_24) > now["end"])){
    get_events(key, time_24);
    listeners()
  }
  reset_toggleCal(seconds);
}

function get_12_hour(hour, minutes, check) {
  var new_hour = 0;
  var am_pm = "";
  if (parseInt(hour) > 12) {
    if (parseInt(hour) === 24) {
      new_hour = parse(hour) - 12;
      am_pm = " AM";
    } else {
      new_hour = parseInt(hour) - 12;
      am_pm = " PM";
    }
  } else {
    if (parseInt(hour) === 12) {
      new_hour = parseInt(hour);
      am_pm = " PM";
    } else {
      if (parseInt(hour) === 0) {
        new_hour = 12;
        am_pm = " AM";
      } else {
        new_hour = parseInt(hour);
        am_pm = " AM";
      }
    }
  }
  if (check) {
    am_pm = "";
  }
  return new_hour + ":" + minutes + am_pm;
}

function get_12_hour_int(time_24) {
  var str = add_zero(time_24);
  if (time_24 < 100) {
    str = add_zero_24(time_24);
  }
  time = get_12_hour(str[0] + str[1], str[2] + str[3]);
  return time;
}
function add_zero(i) {
  if (i >= 100) {
    return add_zero_24(i);
  } else if (i < 10) {
    return "0" + i.toString();
  } else {
    return i.toString();
  }
}

function add_zero_24(i) {
  if (i < 10) {
    return "000" + i.toString();
  }
  if (i < 100) {
    return "00" + i.toString();
  } else if (i < 1000) {
    return "0" + i.toString();
  } else {
    return i.toString();
  }
}

function get_events(key, time) {
  var dict = dictionary();
  var i = 0;
  var time_int = parseInt(time);
  event_key = key;
  if (current === null || time_int > dict[key][current_i]["end"]) {
    while (true) {
      if (
        dict[key].length > 0 &&
        dict[key].length > i &&
        dict[key][i]["all_day"]
      ) {
        i++;
      } else {
        _all_day = i;
        if (!rand) {
          rand = true;
          all_day_current = getRandomInt(_all_day);
        }
        //set_all_day()
        if (_all_day > 1) {
          to_pointer();
        }
        break;
      }
    }
    while (true) {
      if (
        i < dict[key].length &&
        parseInt(dict[key][i]["start"]) < parseInt(dict[key][i]["end"]) &&
        time_int > parseInt(dict[key][i]["end"])
      ) {
        i++;
      } else {
        break;
      }
    }
    if (i < dict[key].length) {
      current = dict[key][i];
      current_i = i;
      if (i + 1 < dict[key].length) {
        document.getElementById("calendar").style.cursor = "pointer";
      } else {
        next = null;
        document.getElementById("calendar").style.cursor = "default";
      }
      format_events();
    } else {
      current = tomorrow_key();
      to_tomorrow = true;
      event_key = tomorrow_key();
      set_tomorrow(tomorrow_key());
    }
  }
}

function format_events() {
  var name = "";
  var start = "";
  var end = "";
  var location = "";
  var all_day = false;
  var todo = false;

  dict = dictionary();
  if (!to_next && current_i != -1) {
    current = dict[key][current_i];
    now = current
    all_day = current["all_day"];
    todo = current["todo"];
    if (current["description"] !== null) {
      name = "<span class='dot_cont'><div id='dot_cur' class='dot' ></div></span>" + current["summary"];
    } else {
      name = current["summary"];
    }

    start = current["start"];
    end = current["end"];
    location = current["location"];
    set_event(all_day, todo, name, start, end, location);
  } else if (to_next) {
    next = dict[key][next_i];
    all_day = next["all_day"];
    todo = next["todo"];
    name = next["summary"];
    if (next["description"] !== null) {
      name =
        "<span class='dot_cont'><div id='dot_next' class='dot'></div></span>" + next["summary"];
    } else {
      name = next["summary"];
    }
    start = next["start"];
    end = next["end"];
    location = next["location"];
    set_event(all_day, todo, name, start, end, location);
  }
}

function set_event(all_day, todo, name, start, end, location) {
  let color = "#383838"
  let next_color = "#282828"
  if (!all_day) {
    var duration = get_12_hour_int(start) + " - " + get_12_hour_int(end);
  } else {
    if (todo == null) {
      duration = "All Day";
    } else if (todo == "TODO") {
      duration = "To Do";
    } else if (todo == "WORK") {
      duration = "Work";
    } else if (todo == "EXAM"){
      duration = "Exam"
    }

  }
  if (location != "Tomorrow" && todo == "TODO") {
    color = "#ff9900"
    next_color = "#c97900"
  } 
  else if (location != "Tomorrow" && todo == "EXAM"){
    color = "#bd0000"
    next_color = "#912727"
  }

  if (location === null) {
    document.getElementById("cal_name").innerHTML = "place_holder";
    document.getElementById("cal_location").innerHTML = name; /*shift down*/
    document.getElementById("start_end").innerHTML = duration;
    document.getElementById("cal_location").style.fontFamily = "Orbitron-bold";
  } else {
    document.getElementById("cal_name").innerHTML = name;
    document.getElementById("cal_name").style.opacity = "1";
    document.getElementById("cal_location").innerHTML = location; /*shift down*/
    document.getElementById("cal_location").style.opacity = "1";
    document.getElementById("start_end").innerHTML = duration;
    document.getElementById("start_end").style.opacity = "1";
    document.getElementById("cal_location").style.fontFamily = "Orbitron-light";
  }

  if (!to_next) {
    document.getElementById("cal_name").style.color = color;
    document.getElementById("cal_location").style.color = color;
    document.getElementById("start_end").style.color = color;
    if (document.getElementById("dot_cur") !== null) {
      document.getElementById("dot_cur").style.backgroundColor = color;
    }
  } else {
    document.getElementById("cal_name").style.color = next_color;
    document.getElementById("cal_location").style.color = next_color;
    document.getElementById("start_end").style.color = next_color;
    if (document.getElementById("dot_next") !== null) {
      document.getElementById("dot_next").style.backgroundColor = next_color;
    }
  }
  if (location === null) {
    document.getElementById("cal_name").style.color = "#0e0e0e";
    document.getElementById("cal_name").style.opacity = "0";
  }
}

function toggleCal() {
  if (!to_tomorrow && !link_clicked) {
    dict = dictionary();
    d = new Date();
    s = d.getSeconds();
    if (!to_next && dict[key].length > current_i + 1) {
      to_next = true;
      next_i = current_i + 1;
      sec_reset = add_15(s);
    } else if (to_next && dict[key].length > next_i + 1) {
      next_i += 1;
      sec_reset = add_15(s);
    } else {
      to_next = false;
      sec_reset = -1;
    }
    format_events();
    listeners()
  } else if (!to_tomorrow) {
    link_clicked = false;
  }
  else{
    tomorrow_toggle()
  }
}

function reset_toggleCal(seconds) {
  if (sec_reset == seconds) {
    sec_reset = -1;
    to_next = false;
    format_events();
  }
}

function add_15(t) {
  int = parseInt(t);
  if(int+15 > 59){
    int-=45
  }
  else{
    int+=15
  }
  return int;
}

function tomorrow_key() {
  today = new Date();
  tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  tomorrow_month = add_zero((tomorrow.getMonth() + 1).toString());
  tomorrow_day = add_zero(tomorrow.getDate().toString());
  tomorrow_year = tomorrow.getFullYear().toString();
  return tomorrow_month + "/" + tomorrow_day + "/" + tomorrow_year;
}
function tomorrow_toggle() {
  if (!link_clicked && to_tomorrow) {
    dict = dictionary();
    if (current_tomorrow + 1 < dict[tomorrow_key()].length) {
      current_tomorrow += 1;
    } else {
      current_tomorrow = 0;
    }
    current = null
  } else if (to_tomorrow) {
    link_clicked = false;
  }
}
function set_tomorrow(key) {
  var dict = dictionary();
  if (dict[key].length > 0) {
    document.getElementById("cal_name").style.color = "#383838";
    document.getElementById("cal_name").style.opacity = "1";
    document.getElementById("cal_location").style.color = "#383838";
    document.getElementById("cal_location").style.opacity = "1";
    document.getElementById("start_end").style.color = "#383838";
    document.getElementById("cal_location").style.opacity = "1";

    var all_day = dict[key][current_tomorrow]["all_day"];
    var todo = dict[key][current_tomorrow]["todo"];
    var name = "";
    if (dict[key][current_tomorrow]["description"] !== null) {
      name =
        "<span class='dot_cont'><div id='dot_cur' class='dot'></div></span>" + dict[key][current_tomorrow]["summary"];
    } else {
      name = dict[key][current_tomorrow]["summary"];
    }

    if ((current_i = -1)) {
      current_i = 0;
    }

    var start = "";
    var end = "";
    if (!dict[key][current_tomorrow]["all_day"]) {
      start = dict[key][current_tomorrow]["start"].toString();
      end = dict[key][current_tomorrow]["end"].toString();
    }

    var location = "Tomorrow";
    set_event(all_day, todo, name, start, end, location);

    if (dict[key].length > 1) {
      document.getElementById("calendar").style.cursor = "pointer";
    } else {
      document.getElementById("calendar").style.cursor = "default";
    }
  } else {
    document.getElementById("cal_name").innerHTML = "place_holder";
    document.getElementById("cal_name").style.color = "#0e0e0e";
    document.getElementById("cal_name").style.opacity = "0";
    document.getElementById("cal_location").innerHTML = "place_holder";
    document.getElementById("cal_location").style.color = "#0e0e0e";
    document.getElementById("cal_location").style.opacity = "0";
    document.getElementById("start_end").style.color = "#0e0e0e";
    document.getElementById("cal_location").style.opacity = "0";
  }
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function set_all_day() {
  dict = dictionary();
  if (_all_day !== 0 && dict[key].length != 0) {
    let summary = "";
    all_key = key;
    if (dict[key][all_day_current]["description"] !== null) {
      summary =
        "<span class='dot_cont'><div id='all_dot' class='dot'></div></span>" + dict[key][all_day_current]["summary"];
    } else {
      summary = dict[key][all_day_current]["summary"];
    }

    document.getElementById("summary").innerHTML = summary;
    document.getElementById("summary").style.opacity = "1";

    if (dict[key][all_day_current]["todo"] == "TODO") {
      document.getElementById("summary").style.color = "#ff9900";
      if (document.getElementById("all_dot") !== null) {
        document.getElementById("all_dot").style.backgroundColor = "#ff9900";
      }
    } else if (dict[key][all_day_current]["todo"] == "WORK") {
      document.getElementById("summary").style.color = "#ffee00";
      if (document.getElementById("all_dot") !== null) {
        document.getElementById("all_dot").style.backgroundColor = "#ffee00";
      }
    }
    else if (dict[key][all_day_current]["todo"] == "EXAM") {
      document.getElementById("summary").style.color = "#bd0000";
      if (document.getElementById("all_dot") !== null) {
        document.getElementById("all_dot").style.backgroundColor = "#bd0000";
      }
    } 
    else {
      document.getElementById("summary").style.color = "#383838";
      if (document.getElementById("all_dot") !== null) {
        document.getElementById("all_dot").style.backgroundColor = "#383838";
      }
    }
    if (dict[key][all_day_current]["location"] !== null) {
      document.getElementById("loc").innerHTML =
        dict[key][all_day_current]["location"];
      if (dict[key][all_day_current]["todo"] == "TODO") {
        document.getElementById("loc").style.color = "#ff9900";
      } else if (dict[key][all_day_current]["todo"] == "WORK") {
        document.getElementById("loc").style.color = "#ffee00";
      } 
      else if (dict[key][all_day_current]["todo"] == "EXAM") {
        document.getElementById("loc").style.color = "#bd0000";
      }else {
        document.getElementById("loc").style.color = "#383838";
      }
      document.getElementById("loc").style.opacity = "1";
    } else {
      document.getElementById("loc").innerHTML = "";
      document.getElementById("loc").style.color = "#0e0e0e";
      document.getElementById("loc").style.opacity = "0";
    }
  } else {
    document.getElementById("summary").style.color = "#0e0e0e";
    document.getElementById("summary").style.opacity = "0";
    document.getElementById("loc").style.opacity = "0";
  }
  listeners()
}
function rotate() {
  if (all_day_current + 1 < _all_day) {
    all_day_current += 1;
  } else if (_all_day === 0) {
    all_day_current = -1;
  } else {
    all_day_current = 0;
  }
  set_all_day();
}
function rotate_click() {
  if (!link_clicked) {
    sec = null;
    rotate();
  } else {
    link_clicked = false;
  }
}
function to_pointer() {
  document.getElementById("all_day").style.cursor = "pointer";
}

function show_description(i, all) {
  link()
  var dict = dictionary();
  if (!all) {
    var text =
      "<b>" +
      dict[event_key][i]["summary"] +
      "</b>" +
      "<br> <br>" +
      dict[event_key][i]["description"];
  } else {
    var text =
      "<b>" +
      dict[all_key][i]["summary"] +
      "</b>" +
      "<br> <br>" +
      dict[all_key][i]["description"];
      console.log(dict[all_key][i]["description"])
  }
  document.getElementById("description").innerHTML = text;
  document.getElementById("description_container").style.visibility = "visible";

  let h = parseInt(
    window
      .getComputedStyle(document.getElementById("description"))
      .getPropertyValue("height")
  );
  if (h <= 360) {
    document.getElementById("description_container").style.height =
      h + 40 + "px";
    document.getElementById("desc_con").style.height = h + "px";
    document.getElementById("desc_con").style.overflowY = "hidden";
  } else {
    document.getElementById("description_container").style.height = "400px";
    document.getElementById("desc_con").style.height = "360px";
    document.getElementById("desc_con").scrollTo(0, 0);
    document.getElementById("desc_con").style.overflowY = "auto";
  }
}
function hide_description(){
  document.getElementById('description_container').style.visibility = 'hidden'
}
function cur_desc(){
  description_clicked_on()
  if(!to_tomorrow){
    show_description(current_i, false)
  }
  else{
    show_description(current_tomorrow, false)
  }
}
function next_desc(){
  description_clicked_on()
  show_description(next_i, false)

}
function all_desc(){
  // link()
  description_clicked_on()
  show_description(all_day_current, true)
}

function listeners(){
  if(document.getElementById("link") != null){
    document.getElementById("link").addEventListener("click", link);
  }
  if(document.getElementById("loc") != null){
    document.getElementById("loc").addEventListener("click", link);
  }
  if(document.getElementById("dot_cur") != null){
    document.getElementById("dot_cur").addEventListener("click", cur_desc);
  }
  if(document.getElementById("dot_next") != null){
    document.getElementById("dot_next").addEventListener("click", next_desc);
  }
  if(document.getElementById("all_dot") != null){
    document.getElementById("all_dot").addEventListener("click", all_desc);
  }
}