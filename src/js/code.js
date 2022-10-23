/*calendar*/
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

function clickyClick() {
  var keycode = event.keyCode ? event.keyCode : event.which;
  if (keycode == 13) {
    if (document.getElementById("comment").value !== "") {
      url =
        "http://google.com/search?q=" +
        document.getElementById("comment").value;
      window.open(url, "_self");
    }
  }
}


function search() {
  if (document.getElementById("comment").value !== "") {
    url =
      "http://google.com/search?q=" + document.getElementById("comment").value;
    window.open(url, "_self");
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
  var x = document.getElementById("Mydiv");
  if (x.style.display === "none") {
    x.style.display = "block";
    if (user === true) {
      undo_userToggle();
    }
    app = true;
    app_clicked;
    document.getElementById("apps").style.height = "30.5px";
    document.getElementById("apps").style.width = "30.5px";

    sleep(50).then(() => {
      x.style.display = "block";
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
  var x = document.getElementById("Mydiv");
  if (x.style.display === "block") {
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
  let date = new Date().getDate();
  if (date < 10) {
    string_date = "0" + date.toString();
  } else {
    string_date = date.toString();
  }

  document.getElementsByClassName("calendarimg")[0].src =
    "https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_" +
    date.toString() +
    "_2x.png";
  if (document.getElementsByClassName("calendarimg")[1] !== undefined) {
    document.getElementsByClassName("calendarimg")[0].src =
      "https://ssl.gstatic.com/calendar/images/dynamiclogo/2x/cal_" +
      string_date +
      "_v1.png";
    document.getElementsByClassName("calendarimg")[1].src =
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

profiles = ["../images/profile.png", "../images/ub.png", "../images/anon.png"];
profile_info = {
  "../images/profile.png":
    "<img id='img_main' src='../images/profile.png' width='36' height='36'/>",
  "../images/ub.png":
    "<img id='img_user1' src='../images/ub.png' width='36' height='36'/>",
  "../images/anon.png":
    "<img id='img_user2' src='../images/anon.png' width='36' height='36'/>",
};
function main_tab() {
  icons =
    "        <input type='image' src='../images/app_drawer.png' id='apps' height='33' width='33'> \n" +
    "\n" +
    "        <div id='Mydiv' style='display:none'>\n" +
    "\n" +
    "            <div id='app_1'>\n" +
    "                <div id='custom_cal'>\n" +
    "                    <img class='calendarimg' src='https://ssl.gstatic.com/calendar/images/dynamiclogo/2x/cal_31_v1.png'\n" +
    "                         width='38' height='38'/>\n" +
    "                </div>\n" +
    "                <div id='cal'>\n" +
    "                    <a href='https://calendar.google.com/calendar/' type='checkbox' class='app'/>\n" +
    "                    <img class='calendarimg' src='https://ssl.gstatic.com/calendar/images/dynamiclogo/2x/cal_31_v1.png'\n" +
    "                         width='38' height='38'/>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div id='app_2'>\n" +
    "                <div id='youtube'>\n" +
    "                    <a href='https://www.youtube.com/' type='checkbox' class='app'/>\n" +
    "                    <img alt='youtube' src='../images/youtube.png' width='33' height='33'/>\n" +
    "                </div>\n" +
    "                <div id='TV'>\n" +
    "                    <a href='https://tv.youtube.com/' type='checkbox' class='app'/>\n" +
    "                    <img alt='TV' src='../images/youtube_tv.png' width='36' height='36'/>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div id='app_3'>\n" +
    "                <div id='drive'>\n" +
    "                    <a href='https://drive.google.com/drive/u/0/my-drive' type='checkbox' class='app'/>\n" +
    "                    <img src='../images/drive.png' width='33' height='33'/>\n" +
    "                </div>\n" +
    "                <div id='password'>\n" +
    "                    <a href='https://passwords.google.com/' type='checkbox' class='app'/>\n" +
    "                    <img src='../images/password.png' width='36' height='36'/>\n" +
    "                </div>\n" +
    "                <div id='space'>\n" +
    "                    <a> </a>\n" +
    "                    <!--Do not get rid of this-->\n" +
    "                    <img alt='space' src='../images/space.png' width='0' height='0'>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <style>\n" +
    "            #appDrawer {\n" +
    "                display: block;\n" +
    "                position: relative;\n" +
    "                width: 33px;\n" +
    "                height: 33px;\n" +
    "                top: -80px;\n" +
    "                margin-left: 47px;\n" +
    "                -webkit-user-drag: none;\n" +
    "\n" +
    "            }\n" +
    "\n" +
    "            #space {\n" +
    "                display: block;\n" +
    "                width: 2px;\n" +
    "                height: 10px;\n" +
    "                position: relative;\n" +
    "            }\n" +
    "\n" +
    "            #space1 {\n" +
    "                display: block;\n" +
    "                width: 2px;\n" +
    "                height: 5px;\n" +
    "                position: relative;\n" +
    "            }\n" +
    "\n" +
    "            #apps {\n" +
    "                outline: none;\n" +
    "                -webkit-user-drag: none;\n" +
    "\n" +
    "            }\n" +
    "\n" +
    "            #drive {\n" +
    "                -webkit-user-drag: none;\n" +
    "                /*margin-left: -20px;*/\n" +
    "            }\n" +
    "\n" +
    "            #cal {\n" +
    "                margin-top: -42.5px;\n" +
    "                -webkit-user-drag: none;\n" +
    "                margin-left: 20px;\n" +
    "            }\n" +
    "\n" +
    "            #youtube {\n" +
    "                margin-top: 3px;\n" +
    "                -webkit-user-drag: none;\n" +
    "                 margin-left: -20px;\n" +
    "            }\n" +
    "\n" +
    "            #TV {\n" +
    "                margin-top: -38px;\n" +
    "                -webkit-user-drag: none;\n" +
    "                margin-left: 20px;\n" +
    "            }\n" +
    "            #custom_cal{\n" +
    "                margin-left: -20px;\n" +
    "                -webkit-user-drag: none;\n" +
    "                filter: saturate(8);\n" +
    "                cursor: pointer;\n" +
    "            }\n" +
    "            #drive{\n" +
    "                -webkit-user-drag: none;\n" +
    "                margin-left: -20px;\n" +
    "            }\n" +
    "            #password{\n" +
    "                margin-top: -40px;\n" +
    "                -webkit-user-drag: none;\n" +
    "                margin-left: 20px;\n" +
    "            }\n" +
    "            #app_1{\n" +
    "                margin-top: 5px;\n" +
    "            }\n" +
    "            #app_2{\n" +
    "                margin-top: -5px;\n" +
    "            }\n" +
    "            #app_3{\n" +
    "                margin-top: -0px;\n" +
    "            }\n" +
    "\n" +
    "        </style>";
  color = "#0f99e3";
  img = "../images/google.png";
  height = "100px";
  width = "300px";
  email = "../images/gmail.png";
  email_link = "https://mail.google.com/mail/u/0/#inbox";
  icon_drawer = "../images/app_drawer.png";
  profile = "../images/profile.png";
  _top = "-470px";
  _left = "0px";
  app_top = "-86px";
  mail_top = "-44px";
  l = "0";
  all_day = "-470px";
  all_day_left = "20px";
  drawthing(false);
  set_tab( icons, color, img, height, width, profile, email, email_link, icon_drawer, _top, _left, app_top, mail_top, l, all_day, all_day_left );
  document.getElementById("img_user1").addEventListener("click", first_tab);
  document.getElementById("img_user2").addEventListener("click", second_tab);
  document.getElementById("apps").addEventListener("click", appToggle);
  document.getElementById("custom_cal").addEventListener("click", calredirect);
  document.querySelectorAll('.app').forEach(item => {
      item.addEventListener('click', event => {
        app_clicked_on()
      })
    })

    history.replaceState(null,'');
}

function first_tab() {
  icons =
    '        <input type="image" src="../images/app_drawer_UB.png" id="apps" height="33" width="33"/>\n' +
    "\n" +
    '        <div id="Mydiv" style="display:none">\n' +
    "\n" +
    '            <div id="drive">\n' +
    '                <a href="https://drive.google.com/drive/u/1/my-drive" type="checkbox" class="app"/>\n' +
    '                <img src="../images/drive.png" width="33" height="33"/>\n' +
    "            </div>\n" +
    '            <div id="cal">\n' +
    '                <a href="https://calendar.google.com/calendar/b/1/r" type="checkbox" class="app"/>\n' +
    '                <img class="calendarimg" src="https://ssl.gstatic.com/calendar/images/dynamiclogo/2x/cal_31_v1.png" width="38" height="38"/>\n' +
    "            </div>\n" +
    '            <div id="space">\n' +
    "                <a> </a>\n" +
    '                <img alt="space" src="../images/space.png" , width="0" , height="0">\n' +
    "            </div>\n" +
    "        </div>\n" +
    "        <style>\n" +
    "            #appDrawer {\n" +
    "                display: block;\n" +
    "                position: relative;\n" +
    "                width: 33px;\n" +
    "                height: 33px;\n" +
    "                top: -86px;\n" +
    "                margin-left: 47px;\n" +
    "                -webkit-user-drag: none;\n" +
    "\n" +
    "            }\n" +
    "            #space {\n" +
    "                display: block;\n" +
    "                width: 2px;\n" +
    "                height: 10px;\n" +
    "                position: relative;\n" +
    "            }\n" +
    "\n" +
    "            #space1 {\n" +
    "                display: block;\n" +
    "                width: 2px;\n" +
    "                height: 5px;\n" +
    "                position: relative;\n" +
    "            }\n" +
    "\n" +
    "            #apps {\n" +
    "                outline: none;\n" +
    "                -webkit-user-drag: none;\n" +
    "\n" +
    "            }\n" +
    "            #drive{\n" +
    "                margin-top: 3.5px;\n" +
    "                -webkit-user-drag: none;\n" +
    "\n" +
    "            }\n" +
    "            #cal{\n" +
    "                margin-top: 4px;\n" +
    "                margin-left: -2px;\n" +
    "                -webkit-user-drag: none;\n" +
    "\n" +
    "            }\n" +
    "\n" +
    "        </style>";
  color = "#015bbc";
  img = "../images/UB_logo.png";
  height = "120px";
  width = "250px";
  email = "../images/gmail_1.png";
  email_link = "https://mail.google.com/mail/u/1/#inbox";
  icon_drawer = "../images/app_drawer_UB.png";
  profile = "../images/ub.png";
  _top = "-490px";
  _left = "0px";
  app_top = "-86px";
  mail_top = "-44px";
  l = "0";
  all_day = "-490px";
  all_day_left = "20px";
  drawthing(false);
  set_tab( icons, color, img, height, width, profile, email, email_link, icon_drawer, _top, _left, app_top, mail_top, l, all_day, all_day_left ); 
  document.getElementById("img_main").addEventListener("click", main_tab);
  document.getElementById("img_user2").addEventListener("click", second_tab);
  document.getElementById("apps").addEventListener("click", appToggle);
  document.querySelectorAll('.app').forEach(item => {
      item.addEventListener('click', event => {
        app_clicked_on()
      })
    })

    history.replaceState({"user": "ub"},'');
}

function second_tab() {
  icons =
    '        <input type="image" src="../images/app_drawer_glitch.png" id="apps" height="33" width="33"/>\n' +
    "\n" +
    '        <div id="Mydiv" style="display:none">\n' +
    "\n" +
    '            <div id="drive">\n' +
    '                <a href="https://drive.google.com/drive/u/2/my-drive" type="checkbox" class="app"/>\n' +
    '                <img src="../images/drive.png" width="33" height="33"/>\n' +
    "            </div>\n" +
    '            <div id="cal">\n' +
    '                <a href="https://calendar.google.com/calendar/b/2/r" type="checkbox" class="app"/>\n' +
    '                <img class="calendarimg" src="https://ssl.gstatic.com/calendar/images/dynamiclogo/2x/cal_31_v1.png" width="38" height="38"/>\n' +
    "            </div>\n" +
    '            <div id="space">\n' +
    "                <a> </a>\n" +
    '                <img alt="space" src="../images/space.png" , width="0" , height="0">\n' +
    "            </div>\n" +
    "        </div>\n" +
    "        <style>\n" +
    "            #appDrawer {\n" +
    "                display: block;\n" +
    "                position: relative;\n" +
    "                width: 33px;\n" +
    "                height: 33px;\n" +
    "                top: -94.75px;\n" +
    "                margin-left: 47px;\n" +
    "                -webkit-user-drag: none;\n" +
    "\n" +
    "            }\n" +
    "\n" +
    "            }\n" +
    "            #space {\n" +
    "                display: block;\n" +
    "                width: 2px;\n" +
    "                height: 10px;\n" +
    "                position: relative;\n" +
    "            }\n" +
    "\n" +
    "            #space1 {\n" +
    "                display: block;\n" +
    "                width: 2px;\n" +
    "                height: 5px;\n" +
    "                position: relative;\n" +
    "            }\n" +
    "\n" +
    "            #apps {\n" +
    "                outline: none;\n" +
    "                -webkit-user-drag: none;\n" +
    "\n" +
    "            }\n" +
    "            #drive{\n" +
    "                margin-top: 3.5px;\n" +
    "                -webkit-user-drag: none;\n" +
    "\n" +
    "            }\n" +
    "            #cal{\n" +
    "                margin-top: 4px;\n" +
    "                margin-left: -2px;\n" +
    "                -webkit-user-drag: none;\n" +
    "\n" +
    "            }\n" +
    "        </style>\n" +
    "        <style>\n" +
    "\n" +
    "            #google {\n" +
    "                color: white;\n" +
    "                margin-left: auto;\n" +
    "                margin-right: auto;\n" +
    "                font-size: 100px;\n" +
    "                position: relative;\n" +
    "                user-select: none;\n" +
    "                -webkit-user-drag: none;\n" +
    "                width: 137px;\n" +
    "                height: 175px;\n" +
    "                top: -220px;\n" +
    "                filter: brightness(25%);\n" +
    "            }\n" +
    "            @keyframes noise-anim {\n" +
    "                0% {\n" +
    "                    clip-path: inset(10% 0 50% 0);\n" +
    "                }\n" +
    "                5% {\n" +
    "                    clip-path: inset(86% 0 9% 0);\n" +
    "                }\n" +
    "                10% {\n" +
    "                    clip-path: inset(94% 0 1% 0);\n" +
    "                }\n" +
    "                15% {\n" +
    "                    clip-path: inset(19% 0 61% 0);\n" +
    "                }\n" +
    "                20% {\n" +
    "                    clip-path: inset(85% 0 5% 0);\n" +
    "                }\n" +
    "                25% {\n" +
    "                    clip-path: inset(23% 0 76% 0);\n" +
    "                }\n" +
    "                30% {\n" +
    "                    clip-path: inset(75% 0 24% 0);\n" +
    "                }\n" +
    "                35% {\n" +
    "                    clip-path: inset(6% 0 23% 0);\n" +
    "                }\n" +
    "                40% {\n" +
    "                    clip-path: inset(91% 0 1% 0);\n" +
    "                }\n" +
    "                45% {\n" +
    "                    clip-path: inset(93% 0 2% 0);\n" +
    "                }\n" +
    "                50% {\n" +
    "                    clip-path: inset(69% 0 21% 0);\n" +
    "                }\n" +
    "                55% {\n" +
    "                    clip-path: inset(91% 0 7% 0);\n" +
    "                }\n" +
    "                60% {\n" +
    "                    clip-path: inset(82% 0 14% 0);\n" +
    "                }\n" +
    "                65% {\n" +
    "                    clip-path: inset(58% 0 30% 0);\n" +
    "                }\n" +
    "                70% {\n" +
    "                    clip-path: inset(80% 0 21% 0);\n" +
    "                }\n" +
    "                75% {\n" +
    "                    clip-path: inset(15% 0 74% 0);\n" +
    "                }\n" +
    "                80% {\n" +
    "                    clip-path: inset(13% 0 26% 0);\n" +
    "                }\n" +
    "                85% {\n" +
    "                    clip-path: inset(15% 0 12% 0);\n" +
    "                }\n" +
    "                90% {\n" +
    "                    clip-path: inset(39% 0 42% 0);\n" +
    "                }\n" +
    "                95% {\n" +
    "                    clip-path: inset(82% 0 18% 0);\n" +
    "                }\n" +
    "                100% {\n" +
    "                    clip-path: inset(38% 0 26% 0);\n" +
    "                }\n" +
    "            }\n" +
    "            #google::after {\n" +
    '                content: url("../images/glitch.png");\n' +
    "                position: absolute;\n" +
    "                left: 2px;\n" +
    "                text-shadow: -1px 0 red;\n" +
    "                top: 0;\n" +
    "                color: white;\n" +
    "                overflow: hidden;\n" +
    "                animation: noise-anim 2s infinite linear alternate-reverse;\n" +
    "            }\n" +
    "            @keyframes noise-anim-2 {\n" +
    "                0% {\n" +
    "                    clip-path: inset(51% 0 9% 0);\n" +
    "                }\n" +
    "                5% {\n" +
    "                    clip-path: inset(22% 0 60% 0);\n" +
    "                }\n" +
    "                10% {\n" +
    "                    clip-path: inset(97% 0 2% 0);\n" +
    "                }\n" +
    "                15% {\n" +
    "                    clip-path: inset(17% 0 60% 0);\n" +
    "                }\n" +
    "                20% {\n" +
    "                    clip-path: inset(15% 0 40% 0);\n" +
    "                }\n" +
    "                25% {\n" +
    "                    clip-path: inset(56% 0 10% 0);\n" +
    "                }\n" +
    "                30% {\n" +
    "                    clip-path: inset(17% 0 82% 0);\n" +
    "                }\n" +
    "                35% {\n" +
    "                    clip-path: inset(39% 0 50% 0);\n" +
    "                }\n" +
    "                40% {\n" +
    "                    clip-path: inset(52% 0 39% 0);\n" +
    "                }\n" +
    "                45% {\n" +
    "                    clip-path: inset(3% 0 25% 0);\n" +
    "                }\n" +
    "                50% {\n" +
    "                    clip-path: inset(87% 0 11% 0);\n" +
    "                }\n" +
    "                55% {\n" +
    "                    clip-path: inset(92% 0 2% 0);\n" +
    "                }\n" +
    "                60% {\n" +
    "                    clip-path: inset(3% 0 36% 0);\n" +
    "                }\n" +
    "                65% {\n" +
    "                    clip-path: inset(48% 0 43% 0);\n" +
    "                }\n" +
    "                70% {\n" +
    "                    clip-path: inset(51% 0 33% 0);\n" +
    "                }\n" +
    "                75% {\n" +
    "                    clip-path: inset(24% 0 50% 0);\n" +
    "                }\n" +
    "                80% {\n" +
    "                    clip-path: inset(38% 0 30% 0);\n" +
    "                }\n" +
    "                85% {\n" +
    "                    clip-path: inset(24% 0 45% 0);\n" +
    "                }\n" +
    "                90% {\n" +
    "                    clip-path: inset(24% 0 11% 0);\n" +
    "                }\n" +
    "                95% {\n" +
    "                    clip-path: inset(100% 0 1% 0);\n" +
    "                }\n" +
    "                100% {\n" +
    "                    clip-path: inset(18% 0 77% 0);\n" +
    "                }\n" +
    "            }\n" +
    "            #google::before {\n" +
    '                content: url("../images/glitch.png");\n' +
    "        \n" +
    "                position: absolute;\n" +
    "                left: -2px;\n" +
    "                text-shadow: 1px 0 blue;\n" +
    "                top: 0;\n" +
    "                color: white;\n" +
    "                overflow: hidden;\n" +
    "                animation: noise-anim-2 15s infinite linear alternate-reverse;\n" +
    "            }\n" +
    "            canvas{\n" +
    "                position: fixed;\n" +
    "                /*margin-top: 380px;*/\n" +
    "                margin-top: -345px;\n" +
    "                background-color: #0e0e0e;\n" +
    "            }\n" +
    "        \n" +
    "        \n" +
    "            @keyframes cursor {\n" +
    "                0% {\n" +
    "                    opacity: 0;\n" +
    "                }\n" +
    "                40% {\n" +
    "                    opacity: 0;\n" +
    "                }\n" +
    "                50% {\n" +
    "                    opacity: 1;\n" +
    "                }\n" +
    "                90% {\n" +
    "                    opacity: 1;\n" +
    "                }\n" +
    "                100% {\n" +
    "                    opacity: 0;\n" +
    "                }\n" +
    "            }\n" +
    "        \n" +
    "            #img_google img {\n" +
    "                display: block;\n" +
    "                position: relative;\n" +
    "                margin-top: 10px;\n" +
    "                user-select: none;\n" +
    "                -webkit-user-drag: none;\n" +
    "                margin-left: auto;\n" +
    "                margin-right: auto;\n" +
    "                top: -180px;\n" +
    "            }\n" +
    "        \n" +
    "            *{\n" +
    "                margin: 0;\n" +
    "                padding: 0;\n" +
    "            }\n" +
    "        \n" +
    "        </style>\n";
  color = "#393939";
  img = "../images/glitch.png";
  height = "175px";
  width = "137px";
  email = "../images/gmail_2.png";
  email_link = "https://mail.google.com/mail/u/2/#inbox";
  icon_drawer = "../images/app_drawer_glitch.png";
  profile = "../images/anon.png";
  _top = "-545px";
  _left = "-8px";
  app_top = "-62px";
  mail_top = "-32px";
  l = "8px";
  all_day = "-545px";
  a_d_left = "28px";
  set_tab( icons, color, img, height, width, profile, email, email_link, icon_drawer, _top, _left, app_top, mail_top, l, all_day, a_d_left );
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
  history.replaceState({"user": "anon"},'');
}

function set_tab(
  icons, color, img, height, width, profile, email, email_link, icon_drawer, top, left, app_top, mail_top, l, all_day, all_day_left ) {
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
  document.getElementById("email_link").setAttribute("href", email_link);
  document.getElementById("appDrawer").innerHTML = icons;
  cal_icon();
  document.getElementById("time").style.color = color;
  document.getElementById("month").style.color = color;
  document.getElementById("icons").style.top = top;
  document.getElementById("icons").style.left = left;
  document.getElementById("appDrawer").style.top = app_top;
  document.getElementById("gmail").style.top = mail_top;
  document.getElementById("l").style.marginLeft = l;
  document.getElementById("all_day").style.marginTop = all_day;
  document.getElementById("all_day").style.marginLeft = all_day_left;
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
    var matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
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
      // ctx.fillStyle = "rgba(10,10,10,.06)";
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
      if (c.height < window.innerHeight) {
        c.height = window.innerHeight;
      }
      if (c.width < window.innerWidth) {
        c.width = window.innerWidth;
      }
    }
    s = setInterval(size, 10);
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
    else if(history.state["user"] == "anon"){
      second_tab()
    }
  }
}