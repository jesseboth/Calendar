/*calendar*/
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

function sendRedirect(url) {
  if (window == window.parent) {
    window.open(url, "_self");
  }
  else{
    window.parent.postMessage(url, "*");
  }
}

function clickyClick() {
  var keycode = event.keyCode ? event.keyCode : event.which;
  if (keycode == 13) {
    if(document.getElementById("comment").value.startsWith("http")){
      chrome.tabs.update({active: true, url: document.getElementById("comment").value})
    }
    else if (document.getElementById("comment").value !== "") {
      url =
        "http://google.com/search?q=" +
        document.getElementById("comment").value;
        sendRedirect(url)
    }
  }
}


function search() {
  if(document.getElementById("comment").value.startsWith("http")){
    chrome.tabs.update({active: true, url: document.getElementById("comment").value})
  }
  else if (document.getElementById("comment").value !== "") {
    url =
      "http://google.com/search?q=" + document.getElementById("comment").value;
      sendRedirect(url)
  }
}

var user = false;
var user_clicked = false;

function userToggle() {
  var x = document.getElementById("logins");
  if (x.style.visibility === "hidden") {
    if (app === true) {
      undo_appToggle();
    }
    user = true;
    user_clicked = true;
    document.getElementById("pic").style.height = "34.5px";
    document.getElementById("pic").style.width = "34.5px";

    sleep(50).then(() => {
      x.style.visibility = "visible";
      document.getElementById("pic").style.height = "36px";
      document.getElementById("pic").style.width = "36px";
    });
  } else {
    document.getElementById("pic").style.height = "34.5px";
    document.getElementById("pic").style.width = "34.5px";
    sleep(50).then(() => {
      x.style.visibility = "hidden";
      document.getElementById("pic").style.height = "36px";
      document.getElementById("pic").style.width = "36px";
    });
    user = false;
  }
}
function user_clicked_on() {
  user_clicked = true;
}

function undo_userToggle() {
  var x = document.getElementById("logins");
  if (x.style.visibility === "visible") {
    x.style.visibility = "hidden";
    app = false;
  }
}

var app = false;
var app_clicked;
var desc_clicked = false;

function appToggle() {
  var x = document.getElementsByClassName("active")[0];
  // var x = document.getElementById("Mydiv");
  if (x.style.display === "none") {
    x.style.display = "grid";
    if (user === true) {
      undo_userToggle();
    }
    app = true;
    app_clicked;
    document.getElementById("apps").style.height = "30.5px";
    document.getElementById("apps").style.width = "30.5px";

    sleep(50).then(() => {
      x.style.display = "grid";
      document.getElementById("apps").style.height = "33px";
      document.getElementById("apps").style.width = "33px";
    });
  } else {
    document.getElementById("apps").style.height = "30.5px";
    document.getElementById("apps").style.width = "30.5px";
    sleep(50).then(() => {
      x.style.display = "none";
      document.getElementById("apps").style.height = "33px";
      document.getElementById("apps").style.width = "33px";
    });
    app = false;
  }
}

function undo_appToggle() {
  var x = document.getElementsByClassName("active")[0];
  if (x.style.display === "grid") {
    x.style.display = "none";
    user = false;
  }
}

function app_clicked_on() {
  app_clicked = true;
}
function description_clicked_on() {
  desc_clicked = true;
}
document.addEventListener("click", back_clicked);
function back_clicked() {
  if (user_clicked) {
    user_clicked = false;
  } else {
    undo_userToggle();
  }
  if (app_clicked) {
    app_clicked = false;
  } else {
    undo_appToggle();
  }

  if (desc_clicked) {
    desc_clicked = false;
  } else {
    document.getElementById("description_container").style.visibility =
      "hidden";
  }
}

function wind() {
  if (window.innerHeight <= 584 && window.innerWidth <= 1080) {
    document.getElementById("l").style.visibility = "hidden";
  } else {
    if (window.innerHeight <= 455) {
      document.getElementById("l").style.visibility = "hidden";
    } else {
      document.getElementById("l").style.visibility = "visible";
    }
  }
  sleep(1).then(() => {
    //update every 5 seconds
    wind();
  });
}

function cal_icon() {
  if(window.navigator.onLine){
    let date = new Date().getDate();
    if (date < 10) {
      string_date = "0" + date.toString();
    } else {
      string_date = date.toString();
    }
    document.getElementsByClassName("calendarimg")[0].src =
    "https://ssl.gstatic.com/calendar/images/dynamiclogo/2x/cal_" +
    string_date +
    "_v1.png";
    document.getElementsByClassName("calendarimg")[1].src =
    "https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_" +
    date.toString() +
    "_2x.png";
    document.getElementsByClassName("calendarimg")[2].src =
    "https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_" +
    date.toString() +
    "_2x.png";
  }
}
color = "#0f99e3";
function ub_color() {
  color = "#015bbc";
}
function start_color() {
  /*date/time*/
  document.getElementById("time").style.color = color;
  document.getElementById("month").style.color = color;
}

profiles = ["img/profile.png", "img/biamp.png", "img/anon.png"];
profile_info = {
  "img/profile.png":
    "<img id='img_main' src='img/profile.png' width='36' height='36'/>",
  "img/biamp.png":
    "<img id='img_user1' src='img/biamp.png' width='36' height='36'/>",
  "img/anon.png":
    "<img id='img_user2' src='img/anon.png' width='36' height='36'/>",
  // "img/ub.png":
  //   "<img id='img_userx' src='img/ub.png' width='36' height='36'/>",
};
function main_tab() {
  document.getElementById("google").classList.remove("virus");
  color = "#0f99e3";
  img = "img/google.png";
  height = "100px";
  width = "300px";
  email = "img/gmail.png";
  email_link = "https://mail.google.com/mail/u/0/#inbox";
  drive_link = "https://drive.google.com/drive/u/1/"
  cal_link = "https://calendar.google.com/calendar/u/1/r/week"
  icon_drawer = "img/app_drawer.png";
  profile = "img/profile.png";
  _top = "-470px";
  _left = "0px";
  app_top = "-86px";
  mail_top = "-44px";
  l = "0";
  all_day = "-470px";
  all_day_left = "20px";
  drawthing(false);
  set_tab(color, img, height, width, profile, email, email_link, drive_link, cal_link, icon_drawer, all_day);
  document.getElementById("img_user1").addEventListener("click", first_tab);
  document.getElementById("img_user2").addEventListener("click", second_tab);
  document.getElementById("apps").addEventListener("click", appToggle);
  document.querySelectorAll('.app').forEach(item => {
      item.addEventListener('click', event => {
        app_clicked_on()
      })
    })
    flip_apps("app_select_1", "app_select_2")
    history.replaceState(null,'');
}

function first_tab() {
  document.getElementById("google").classList.remove("virus");
  color = "#0f99e3";
  img = "img/biamp_logo.png";
  height = "100px";
  width = "300px";
  email = "img/gmail.png";
  email_link = "https://mail.google.com/mail/u/1/#inbox";
  drive_link = "https://drive.google.com/drive/u/1/"
  cal_link = "https://calendar.google.com/calendar/u/1/r/week"
  icon_drawer = "img/app_drawer.png";
  profile = "img/biamp.png";
  _top = "-470px";
  _left = "0px";
  app_top = "-86px";
  mail_top = "-44px";
  l = "0";
  all_day = "-470px";
  all_day_left = "20px";
  drawthing(false);
  set_tab(color, img, height, width, profile, email, email_link, drive_link, cal_link, icon_drawer, all_day); 
  document.getElementById("img_main").addEventListener("click", main_tab);
  document.getElementById("img_user2").addEventListener("click", second_tab);
  document.getElementById("apps").addEventListener("click", appToggle);
  document.querySelectorAll('.app').forEach(item => {
      item.addEventListener('click', event => {
        app_clicked_on()
      })
    })
  flip_apps("app_select_2", "app_select_1")
  history.replaceState({"user": "profile"},'');
}

// function first_tab() {
//   document.getElementById("google").classList.remove("virus");
//   color = "#015bbc";
//   img = "img/ub_logo.png";
//   height = "120px";
//   width = "250px";
//   email = "img/gmail_1.png";
//   email_link = "https://mail.google.com/mail/u/1/#inbox";
//   drive_link = "https://drive.google.com/drive/u/1/"
//   cal_link = "https://calendar.google.com/calendar/u/1/r/week"
//   icon_drawer = "img/app_drawer_UB.png";
//   profile = "img/ub.png";
//   _top = "-490px";
//   _left = "0px";
//   app_top = "-86px";
//   mail_top = "-44px";
//   l = "0";
//   all_day = "-490px";
//   all_day_left = "20px";
//   drawthing(false);
//   set_tab(color, img, height, width, profile, email, email_link, drive_link, cal_link, icon_drawer, all_day); 
//   document.getElementById("img_main").addEventListener("click", main_tab);
//   document.getElementById("img_user2").addEventListener("click", second_tab);
//   document.getElementById("apps").addEventListener("click", appToggle);
//   document.querySelectorAll('.app').forEach(item => {
//       item.addEventListener('click', event => {
//         app_clicked_on()
//       })
//     })
//   flip_apps("app_select_2", "app_select_1")
//   history.replaceState({"user": "ub"},'');
// }

function second_tab() {
  document.getElementById("google").classList.add("virus");
  color = "#393939";
  img = "img/glitch.png";
  height = "175px";
  width = "137px";
  email = "img/gmail_2.png";
  email_link = "https://mail.google.com/mail/u/2/#inbox";
  drive_link = "https://drive.google.com/drive/u/2/"
  cal_link = "https://calendar.google.com/calendar/u/2/r/week"
  icon_drawer = "img/app_drawer_glitch.png";
  profile = "img/anon.png";
  _top = "-545px";
  _left = "-8px";
  app_top = "-62px";
  mail_top = "-32px";
  l = "0px";
  all_day = "-545px";
  a_d_left = "20px";
  set_tab(color, img, height, width, profile, email, email_link, drive_link, cal_link, icon_drawer, all_day);
  document.getElementById("img_main").addEventListener("click", main_tab);
  document.getElementById("img_user1").addEventListener("click", first_tab);
      document.getElementById("apps").addEventListener("click", appToggle);
    document.querySelectorAll('.app').forEach(item => {
        item.addEventListener('click', event => {
          app_clicked_on()
        })
      })


  document.getElementById("img_google").style.position = "unset";
  drawthing(true);
  flip_apps("app_select_2", "app_select_1")
  history.replaceState({"user": "anon"},'');
}

function set_tab(
  color, img, height, width, profile, email, email_link, drive_link, cal_link, icon_drawer, all_day) {
  dim = " id='img_google' style=height:" + height + ";width:" + width;
  document.getElementById("google").innerHTML =
    "<img src=" + img + dim + "></img>";
  document.getElementById("google").style.height = height;
  document.getElementById("google").style.width = width;
  document.getElementById("google").style.marginLeft = "auto";
  document.getElementById("google").style.marginRight = "auto";

  document.getElementsByClassName("searchTerm")[0].style.borderColor = color;
  document.getElementsByClassName("searchTerm")[0].style.color = color;
  document.getElementsByClassName("searchButton")[0].style.background = color;
  document.getElementsByClassName("searchButton")[0].style.borderColor = color;
  swap(profile);
  document.getElementById("pic").src = profile;
  document.getElementById("user1").innerHTML = profile_info[profiles[1]];
  document.getElementById("user2").innerHTML = profile_info[profiles[2]];
  document.getElementById("apps").src = icon_drawer;
  document.getElementById("email").src = email;
  document.getElementById("email_link").setAttribute("onclick", "sendRedirect('" + email_link + "')");
  document.getElementById("drive_link").setAttribute("onclick", "sendRedirect('" + drive_link + "')");
  document.getElementById("cal_link").setAttribute("onclick", "sendRedirect('" + cal_link + "')");
  cal_icon();
  document.getElementById("time").style.color = color;
  document.getElementById("month").style.color = color;
  // document.getElementById("appDrawer").style.top = app_top;
  // document.getElementById("gmail").style.top = mail_top;
  // document.getElementById("l").style.marginLeft = l; 
  document.getElementById("all_day").style.marginTop = all_day;
  // document.getElementById("all_day").style.marginLeft = all_day_left;
}

function swap(profile) {
  i = 0;
  while (profiles[i] != profile) {
    i++;
  }
  if (i == 1) {
    cur = profiles[0];
    profiles[0] = profiles[i];
    profiles[i] = cur;
  } else if (i == 2) {
    cur = profiles[0];
    next_ = profiles[1];
    profiles = [profiles[i], cur, next_];
  }
}
var interval_set = false;
function drawthing(check) {
  if (check) {
    interval_set = true;
    document.getElementById("c").style.visibility = "visible";

    // geting canvas by id c
    var c = document.getElementById("c");
    var ctx = c.getContext("2d");

    //making the canvas full screen
    c.height = window.innerHeight * 2;
    c.width = window.innerWidth * 2;

    //chinese characters - taken from the unicode charset
    // var matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
    var matrix = "01";
    //converting the string into an array of single characters
    matrix = matrix.split("");

    var font_size = 10;
    var columns = c.width / font_size; //number of columns for the rain
    //an array of drops - one per column
    var drops = [];
    //x below is the x coordinate
    //1 = y co-ordinate of the drop(same for every drop initially)
    for (var x = 0; x < columns; x++) drops[x] = 1;

    //drawing the characters
    function draw() {
      //Black BG for the canvas
      //translucent BG to show trail
      ctx.fillStyle = "rgba(5, 5, 5, .06)";
      // ctx.fillStyle = "rgba(0,0,0,.06)";
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.fillStyle = "#3366ff"; //blue text
      ctx.font = font_size + "px arial";
      //looping over drops
      for (var i = 0; i < drops.length; i++) {
        //a random chinese character to print
        var text = matrix[Math.floor(Math.random() * matrix.length)];
        //x = i*font_size, y = value of drops[i]*font_size
        ctx.fillText(text, i * font_size, drops[i] * font_size);

        //sending the drop back to the top randomly after it has crossed the screen
        //adding a randomness to the reset to make the drops scattered on the Y axis
        if (drops[i] * font_size > c.height && Math.random() > 0.975)
          drops[i] = 0;

        //incrementing Y coordinate
        drops[i]++;
      }
    }

    d = setInterval(draw, 35);

    function size() {
      if (c.height < window.innerHeight*2) {
        c.height = window.innerHeight*4;
      }
      if (c.width < window.innerWidth*2) {
        c.width = window.innerWidth*4;
        columns = c.width / font_size;
        for (var x = 0; x < columns; x++) drops[x] = 1;
      }
    }
    s = setInterval(size, 100);
  } else {
    c = document.getElementById("c");
    if (interval_set) {
      clearInterval(d);
      clearInterval(s);
      const context = c.getContext("2d");
      context.clearRect(0, 0, c.width, c.height);
      c.style.visibility = "hidden";
    }
  }
}

function get_user(){
  if(history.state != null){
    if(history.state["user"] == "ub"){
      first_tab()
    }
    else if(history.state["user"] == "profile"){
      first_tab()
    }
    else if(history.state["user"] == "anon"){
      second_tab()
    }
  }
}

function flip_apps(flip, flop){
  undo_appToggle()
  document.getElementById(flop).classList.add("inactive");
  document.getElementById(flop).classList.remove("active");
  document.getElementById(flip).classList.add("active");
  document.getElementById(flip).classList.remove("inactive");
}