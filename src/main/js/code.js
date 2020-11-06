/*calendar*/
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

function clickyClick() {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == 13) {
        if (document.getElementById("comment").value !== "") {
            url = 'https://www.google.com/search?safe=strict&sxsrf=ACYBGNQ9UTc6_PXeWmlQViOZQJNEoej3YA%3A1583100305049&source=hp&ei=kDFcXu2ePM6tytMPjMyumAw&q= ' + document.getElementById("comment").value + "&gs_l=psy-ab.3..35i39l3j0i67j0j0i67j0j0i67l3.2999.3538..4267...3.0..0.88.484.6......0....1..gws-wiz.....10..35i362i39j0i131.ZeZf32_6MhQ&ved=0ahUKEwjtpsqapPrnAhXOlnIEHQymC8MQ4dUDCAg&uact=5"
            window.open(url, "_self");
        }
    }
}

function search() {
    if (document.getElementById("comment").value !== "") {
        url = 'https://www.google.com/search?safe=strict&sxsrf=ACYBGNQ9UTc6_PXeWmlQViOZQJNEoej3YA%3A1583100305049&source=hp&ei=kDFcXu2ePM6tytMPjMyumAw&q= ' + document.getElementById("comment").value + "&gs_l=psy-ab.3..35i39l3j0i67j0j0i67j0j0i67l3.2999.3538..4267...3.0..0.88.484.6......0....1..gws-wiz.....10..35i362i39j0i131.ZeZf32_6MhQ&ved=0ahUKEwjtpsqapPrnAhXOlnIEHQymC8MQ4dUDCAg&uact=5"
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
        user_clicked = true
        document.getElementById('pic').style.height = "34.5px";
        document.getElementById('pic').style.width = "34.5px";

        sleep(50).then(() => {
            x.style.visibility = "visible";
            document.getElementById('pic').style.height = "36px";
            document.getElementById('pic').style.width = "36px";
        });
    } else {
        document.getElementById('pic').style.height = "34.5px";
        document.getElementById('pic').style.width = "34.5px";
        sleep(50).then(() => {
            x.style.visibility = "hidden";
            document.getElementById('pic').style.height = "36px";
            document.getElementById('pic').style.width = "36px";
        });
        user = false;
    }
}
function user_clicked_on(){
    user_clicked = true;
}

function undo_userToggle() {
    var x = document.getElementById("logins");
    if (x.style.visibility === 'visible') {
        x.style.visibility = 'hidden';
        app = false
    }
}

var app = false;
var app_clicked;

function appToggle() {
    var x = document.getElementById("Mydiv");
    if (x.style.display === "none") {
        x.style.display = "block";
        if (user === true) {
            undo_userToggle();
        }
        app = true;
        app_clicked;
        document.getElementById('apps').style.height = "30.5px";
        document.getElementById('apps').style.width = "30.5px";

        sleep(50).then(() => {
            x.style.display = "block";
            document.getElementById('apps').style.height = "33px";
            document.getElementById('apps').style.width = "33px";
        });
    } else {
        document.getElementById("apps").style.height = "30.5px";
        document.getElementById('apps').style.width = "30.5px";
        sleep(50).then(() => {
            x.style.display = "none";
            document.getElementById('apps').style.height = "33px";
            document.getElementById('apps').style.width = "33px";
        });
        app = false;
    }
}

function undo_appToggle() {
    var x = document.getElementById("Mydiv");
    if (x.style.display === 'block') {
        x.style.display = 'none';
        user = false
    }
}
function app_clicked_on(){
    app_clicked = true;
}
document.addEventListener("click", back_clicked);
function back_clicked() {
    if (user_clicked) {
        user_clicked = false;
    } else {
        undo_userToggle()
    }
    if (app_clicked) {
        app_clicked = false;
    } else {
        undo_appToggle()
    }
}

function wind() {
    if (window.innerHeight <= 584 && window.innerWidth <= 1080) {
        document.getElementById("l").style.visibility = "hidden"
    } else {
        if (window.innerHeight <= 455) {
            document.getElementById("l").style.visibility = "hidden"

        } else {
            document.getElementById("l").style.visibility = "visible"
        }
    }
    sleep(1).then(() => { //update every 5 seconds
        wind();
    });
}


function cal_icon() {
    let date = new Date().getDate();
    if (date < 10) {
        string_date = "0" + date.toString()
    } else {
        string_date = date.toString();
    }

    document.getElementsByClassName("calendarimg")[0].src = "https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_" + date.toString() + "_2x.png"
    if(document.getElementsByClassName("calendarimg")[1] !== undefined) {
        document.getElementsByClassName("calendarimg")[0].src = "https://ssl.gstatic.com/calendar/images/dynamiclogo/2x/cal_" + string_date + "_v1.png"
        document.getElementsByClassName("calendarimg")[1].src = "https://ssl.gstatic.com/calendar/images/dynamiclogo/lUkwQcfJg4wWmQhhAFLWO0z3HjG6yOs9/calendar_" + date.toString() + "_2x.png"
    }
}
color = "#0f99e3"
function ub_color() {
    color = "#015bbc"
}
function start_color() {
    /*date/time*/
    document.getElementById("time").style.color = color;
    document.getElementById("month").style.color = color;

}
