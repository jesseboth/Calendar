const max_events = 6
let half_width = 0
let event_height = 0
let weather_margin = 0
let desc_clicked = false
function run() {
    half_width = parseInt(window.getComputedStyle(document.getElementsByClassName("day")[0]).getPropertyValue('height')) / 2
    event_height = parseInt(window.getComputedStyle(document.getElementsByClassName("event_container")[0]).getPropertyValue('height'))
    updateTime()
    setInterval(updateTime, 100)
    
}

let offset_check = false
let half = false
let offset = 0
let reload_check = false
let current_month = 0
let year = 0
let month_lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
let clicked_day = false
let current_key = ""
let clicked_key = ""
let event_key = ""
let delay = [-1, -1]
let min = -1
let today = ""
let set_weather_margin = false

let set_year = null
let set_month = null
let set_day = null

function updateTime() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // const datetime = new Date();
    const datetime = getDate(set_year, set_month, set_day)
    const month_num = datetime.getMonth();
    current_month = month_num
    const hour = datetime.getHours();
    const minutes = add_zero(datetime.getMinutes());
    const current_time = get_12_hour(hour, minutes, true);
    const time_24 = hour.toString() + minutes.toString();
    const month = months[month_num];
    let day = datetime.getDate();
    year = datetime.getFullYear();
    const day_of_week = week[datetime.getDay()];
    const date = day_of_week + ", " + month + " " + day;
    
	// go back to current day
	milli = getMillis(datetime.getMilliseconds().toString())
	if (clicked_day && datetime.getSeconds() === delay[0] && milli  == delay[1][0] ) {
		reset()
		clicked_key = current_key
	}

    /*set calendar dates*/
    if (!offset_check) {
        current_key = get_key(month_num + 1, day, year)
        today = current_key
        event_key = current_key
        offset_check = true
        const first = new Date(year, month_num, 1)
        offset = first.getDay()
        set_cal_dates(offset + 1, month_num, year)
        set_weather(current_key)
        show_day(get_key(month_num + 1, day, year), time_24)
        set_current_event(current_key, time_24)
        clicked_key = current_key
        leap_year(year)
    }
    
    set_current_event(clicked_key, time_24)
    if(set_month == null){
        const current_color = "orange"
        set_time(current_time, date, day + offset, current_color)
    }
    else{
        set_time("", date.split(" ")[1], day + offset,"")
    }

    if (min === -1 || min === datetime.getMinutes()) {
        if (min === 59) {
            min = 0
        } else {
            min = datetime.getMinutes() + 1
        }
    }
    if (set_weather_margin && set_year == null) {
        weather_margin = parseInt(window.getComputedStyle(document.getElementById("month")).getPropertyValue('width'))
        document.getElementsByClassName("weather")[0].style.marginLeft = (weather_margin + 32).toString() + "px"
        document.getElementsByClassName("weather")[0].style.visibility = "visible"
    } else {
        set_weather_margin = true
    }
}

function set_time(time, date, day, color) {
    document.getElementById("time").innerHTML = time;
    document.getElementById("time").style.fontFamily = "Orbitron";
    document.getElementById("month").innerHTML = date;
    document.getElementById("month").style.fontFamily = "Orbitron-light";
    document.getElementById((day).toString()).style.borderColor = color
    if(color !== ""){
        document.getElementById((day).toString()).style.color = color
    }
}

function get_12_hour(hour, minutes, check) {
    let new_hour;
    let am_pm;
    if (parseInt(hour) > 12) {
        if (parseInt(hour) === 24) {
            new_hour = parseInt(hour) - 12;
            am_pm = " AM"
        } else {
            new_hour = parseInt(hour) - 12;
            am_pm = " PM"
        }
    } else {
        if (parseInt(hour) === 12) {
            new_hour = parseInt(hour);
            am_pm = " PM"
        } else {
            if (parseInt(hour) === 0) {
                new_hour = 12
                am_pm = " AM"
            } else {
                new_hour = parseInt(hour);
                am_pm = " AM"
            }
        }
    }
    if (check) {
        am_pm = ""
    }
    return new_hour + ":" + minutes + am_pm
}

function get_12_hour_int(time_24){
    var str = add_zero(time_24)
    if(time_24 < 100){
        str = add_zero_24(time_24)
    }
	time =  get_12_hour(str[0]+str[1], str[2]+str[3])
	return time
}


function add_zero(i){
    if(i >= 100){
        return add_zero_24(i)
    }
    else if(i < 10){
        return "0" + i.toString()
    }
    else{
        return i.toString()
    }
}

function add_zero_24(i){
    if(i < 10){
        return "000" + i.toString()
    }
    if(i < 100){
        return "00" + i.toString()
    }
	else if(i < 1000){
        return "0" + i.toString()
    }
    else{
        return i.toString()
    }
}

function get_key(month, day, year) {
    return add_zero(month) + "/" + add_zero(day) + "/" + year.toString();
}

function set_cal_dates(offset, month, year) {

    dict = dictionary()

    const datetime = new Date()
    let k_month = datetime.getMonth()

    let max = 35
    let prev_month = month - 1
    if (prev_month === -1) {
        prev_month = 11
    }
    let prev_len = month_lengths[prev_month]

    let off = offset
    for (let i = offset - 1; i > 0; i--) {
        document.getElementById(i.toString()).innerText = prev_len.toString()
        document.getElementById(i.toString()).style.color = "#323232"
        document.getElementById(i.toString()).style.borderColor = "#0f99e3"
        prev_len--
    }
    for (let i = 1; i <= month_lengths[month]; i++) {
        document.getElementById(off.toString()).innerText = i.toString()
        document.getElementById(off.toString()).style.color = "#0f99e3"
        document.getElementById(off.toString()).style.borderColor = "#0f99e3"
        /*max events = 6*/
        if (off > max) {
            half = true
            long_cal(offset, month_lengths[month], month + 1, year)
        } else {
            restore_cal()
            set_events(month + 1, i, year, off)
        }
        off++
    }
    let end = 1

    for (let i = off; i <= max; i++) {
        document.getElementById(i.toString()).innerText = end.toString()
        set_mini_weather(i, key_id(i))
        document.getElementById(i.toString()).style.color = "#323232"
        document.getElementById(i.toString()).style.borderColor = "#0f99e3"
        end++
    }

    let k = add_zero(datetime.getMonth()+1) + "/" + add_zero(datetime.getDate()) + "/" + datetime.getFullYear()
    if (current_key !== k) {
        document.getElementById(offset).style.color = "purple"
    }
}

function long_cal(offset, month_length, month, year) {
    let start = offset
    let end = offset + month_length
    let day = 1
    let key = ""
    let cur = 1
    const dict = dictionary()

    const w = weather
    while (start <= 7) {
        key = get_key(month, day, year)

        if (dict[key] !== undefined && dict[key].length !== 0) {
            document.getElementById(start.toString()).innerText = day.toString()
            set_mini_weather(start, key)
            adjust_weather_css(start, key)
            document.getElementById(start.toString()).innerHTML += "<div class=\"event _" + start + "_0\">" + dict[key][0]["summary"] + "</div>"

            if (dict[key].length > 1 && half_width >= 58) {
                document.getElementById(start.toString()).innerHTML += "<div class=\"event _" + start + "_0\">" + dict[key][1]["summary"] + "</div>"

                document.getElementsByClassName("_" + start + "_0")[0].style.fontSize = "12px"
                document.getElementsByClassName("_" + start + "_0")[1].style.fontSize = "12px"
                cur++
            }

            let overflow = false
            for (let j = cur; j < dict[key].length; j++) {
                if (!overflow) {
                    overflow = true
                    document.getElementById(start.toString()).innerHTML += "<div class=\"event_extra\" id=\"_" + start + "_" + "\">l</div>"

                } else {
                    document.getElementById("_" + start.toString() + "_").innerHTML += "l"
                }
            }
        } else {
            set_mini_weather(start, key)
            adjust_weather_css(start, key)
        }
        start++
        day++
    }
    start = end - 1
    day = month_length
    cur = 1
    const last = start
    while (start > 35) {
        key = get_key(month, day, year)

        if (dict[key] !== undefined && dict[key].length !== 0) {
            document.getElementById(start.toString()).innerText = day.toString()
            set_mini_weather(start, key)
            adjust_weather_css(start, key)
            document.getElementById(start.toString()).innerHTML += "<div class=\"event _" + start + "_0\">" + dict[key][0]["summary"] + "</div>"

            if (dict[key].length > 1 && half_width >= 58) {
                document.getElementById(start.toString()).innerHTML += "<div class=\"event _" + start + "_0\">" + dict[key][1]["summary"] + "</div>"

                document.getElementsByClassName("_" + start + "_0")[0].style.fontSize = "12px"
                document.getElementsByClassName("_" + start + "_0")[1].style.fontSize = "12px"

                cur++
            }

            let overflow = false
            for (let j = cur; j < dict[key].length; j++) {
                if (!overflow) {
                    overflow = true
                    document.getElementById(start.toString()).innerHTML += "<div class=\"event_extra\" id=\"_" + start + "_" + "\">l</div>"

                } else {
                    document.getElementById("_" + start.toString() + "_").innerHTML += "l"
                }
            }
        } else {
            set_mini_weather(start, key)
            adjust_weather_css(start, key)
        }

        start--
        day--
    }
    day = 1
    for (let j = 0; j < 7; j++) {
        document.getElementsByClassName("extra")[j].style.visibility = "visible"
        document.getElementsByClassName("start")[j].style.height = half_width.toString() + "px"/*half of total*/
        document.getElementsByClassName("extra")[j].style.height = half_width.toString() + "px"/*half of total*/
        if (start >= last) {
            document.getElementsByClassName("extra")[j].innerHTML = day.toString()
            document.getElementsByClassName("extra")[j].style.color = "#323232"
            document.getElementsByClassName("extra")[j].style.borderColor = "#0f99e3"
            set_mini_weather(start + 1, key_id(start + 1))
            day++
        }
        start++
    }
}

function restore_cal(){
    for (let j = 0; j < 7; j++) {
        document.getElementsByClassName("extra")[j].style.visibility = "hidden"
        document.getElementsByClassName("start")[j].style.height = (half_width*2).toString() + "px"/*half of total*/
        document.getElementsByClassName("extra")[j].style.height = (half_width*2).toString() + "px"/*half of total*/
    }
}

function key_id(id) {
    let mon = current_month
    let da = parseInt(id) - parseInt(offset)
    let ye = year
    if (da < 1) {
        mon--
        if (mon < 0) {
            ye = year - 1
            mon = 11
        }
        da = month_lengths[mon] + da
    } else if (da > month_lengths[mon]) {
        let prev_mon = mon
        mon++
        if (mon > 11) {
            ye = year + 1
            mon = 0
        }
        da = da - month_lengths[prev_mon]
    }
    return add_zero((mon + 1).toString()) + "/" + add_zero(da.toString()) + "/" + ye.toString()
}

function adjust_weather_css(off, key) {
    if (dict[key] !== undefined && half_width >= 58 && dict[key].length !== 0) {
        if(document.getElementById("weather_" + off.toString()) !== null){
            document.getElementById("weather_" + off.toString()).style.marginTop = "-16px"
        }
    } else if (dict[key] !== undefined && dict[key].length !== 0) {
        if(document.getElementById("weather_" + off.toString()) !== null){
            document.getElementById("weather_" + off.toString()).style.marginTop = "-20px"
        }
    }

}

function set_events(month, day, year, off) {
    let overflow = false
    let num_events = 3
    if (half_width >= 58) {
        num_events++
    }
    let key = get_key(month, day, year)
    
    set_mini_weather(off, key)

    for (let j = 0; dict[key] !== undefined && j < dict[key].length; j++) {
        if (j > num_events) {
            if (!overflow) {
                overflow = true
                document.getElementById(off.toString()).innerHTML += "<div class=\"event_extra\" id=\"_" + off + "_" + "\">l</div>"
            } else {
                document.getElementById("_" + off.toString() + "_").innerHTML += "l"
            }
        } else {
            document.getElementById(off.toString()).innerHTML += "<div class=\"event\" id=\"_" + off + "_" + j + "\">" + dict[key][j]["summary"] + "</div>"
        }
    }
}

function click_event(id) {
    offset_check = false    
    updateTime()

    let mon = current_month
    let da = parseInt(id) - parseInt(offset)
    let ye = year

    if (da < 1) {
        mon--
        if (mon < 0) {
            ye = year - 1
            mon = 11
        }
        da = month_lengths[mon] + da
    } else if (da > month_lengths[mon]) {
        let prev_mon = mon
        mon++
        if (mon > 11) {
            ye = year + 1
            mon = 0
        }
        da = da - month_lengths[prev_mon]
    }

    clicked_key = get_key(mon + 1, da, ye)

    show_day(clicked_key)

    const datetime = new Date()
    let k = add_zero(datetime.getMonth()+1) + "/" + add_zero(datetime.getDate()) + "/" + datetime.getFullYear()
    if (clicked_key !== current_key) {
        document.getElementById(id).style.color = "purple"
        document.getElementById(offset+1).style.color = "#0f99e3"

    }
    delay = [add_30(datetime.getSeconds()), datetime.getMilliseconds().toString()]
    let time_24 = add_zero(datetime.getHours()) + add_zero(datetime.getMinutes())
    set_current_event(clicked_key, time_24)
}

function add_30(current) {
    let toReturn = -1
    if (current + 30 >= 60) {
        toReturn = current - 30
    } else {
        toReturn = current + 30
    }

    return toReturn
}

function reset() {
	offset_check = false
	clicked_day = false
}

function show_day(key) {
    clicked_day = true
    event_key = key
    let dict = dictionary()
    let summary;
    let location;
    let duration;
    let del = 0
    document.getElementById("today").innerHTML = ""
    for (let i = 0; dict[key] !== undefined && i < dict[key].length; i++) {
        let current = dict[key][i]
        location = "-"
        if (current["all_day"]) {
            duration = find_duration(current["all_day"], current["todo"])
            if(current["location"]=== null){
                location = "-"
            }
            else{
                location = current["location"]
            }
        } else {
            duration = find_duration(current["start"], current["end"])
            if(current["location"] === null){
                location = "-"
            }
            else{
                location = current["location"]
            }
        }

        document.getElementById("today").innerHTML +=
            "    <div class=\"event_container event_" +i+"\"></div>\n"
        
        document.getElementsByClassName("event_container")[i].innerHTML +=
            "    <div class=\"summary\"o></div>\n" +
            "    <div class=\"location\"></div>\n" +
            "    <div class=\"duration\"></div>\n" +
            "    <div class=\"break\"></div>"

        if(dict[key][i]["description"] !== null){
            summary = "<span class='dot' onclick=\"description_clicked_on(); show_description(" + i + ")\"></span>"+ " "+ current["summary"]
        }
        else {
            summary = current["summary"] + "<span class='dot' style='visibility:hidden' onclick=\"description_clicked_on(); show_description(" + i + ")\"></span>"
        }
        document.getElementsByClassName("summary")[i].innerHTML = summary
        document.getElementsByClassName("location")[i].innerHTML = location
        document.getElementsByClassName("duration")[i].innerHTML = duration
        del++
	}
    if (del > max_events) {
		document.getElementById("today").innerHTML += document.getElementById("today").innerHTML.valueOf() + 
		"    <div class=\"event_container event_0\">" + document.getElementsByClassName("event_0")[0].innerHTML.valueOf()+"</div>\n" 
		//had to do ^ to prevent a "skip" in the animation
            
		const shift = -del*event_height
        document.getElementById("today").animate([
            {transform: 'translateY(0px)'},
            {transform: 'translateY(' + shift + 'px)'}
        ], {
            duration: 25 * 1000,
            iterations: Infinity
        })
    } else {
        document.getElementById("today").animate([
            {transform: 'translateY(0px)'},
            {transform: 'translateY(-00px)'}
        ], {

            duration: 10 * 1000,
            iterations: Infinity
        })
    }

    if (del === 0) {
        document.getElementById("today").innerHTML += "<div class=\"none\"></div>"
        document.getElementsByClassName("none")[0].innerHTML = "-No Events Today"
        change_class_color(["none"], 0, "#383838")
    }
}

function find_duration(start, end) {
    if (start === true) {
        if (end === "TODO") {
            return "To Do"
        } 
        else if(end === "WORK"){
            return "Work"
        }
        else if(end === "EXAM"){
            return "Exam"
        }
        return "All Day"
    }else {
        return get_12_hour_int(start) + " - "
            + get_12_hour_int(end)
    }
}

let exam_all_day = ""
let exam_time = ""
let exam_before = ""
let exam_15 = ""
function set_current_event(key, time_24) {
    // const base_color = "#0f99e3"
    const base_color = "#bd0000"
	const all_day_color = "#cfcd6b"
	const todo_color = "#ff9900"
    const upcoming_color = "#4bd6d6"
    const grey = "#383838"
	const finished = "#232323"
    const work_color = "#ffee00"

    const time = parseInt(time_24)
    const dict = dictionary()
    const list = dict[key]

    let cur = []
    let start = 0
    let end = 0

    let d = new Date()
    let k = add_zero(d.getMonth()+1) + "/" + add_zero(d.getDate()) + "/" + d.getFullYear()

    let names = ["summary", "location", "duration", "dot"]
    if (k === key) {
        for (let i = 0; i < list.length; i++) {
            cur = list[i]

            start = cur["start"]
            end = cur["end"]
            let color = base_color
            
            if (cur["all_day"]) {
                if(cur["todo"] === "TODO"){
                    change_class_color(names, i, todo_color, list.length)
                }
                else if(cur["todo"] === "WORK"){
                    change_class_color(names, i, work_color, list.length)
                }
                else if(cur["todo"] === "EXAM"){
                    if(d.getSeconds() % 2 == 0){
                        exam_all_day = base_color
                    }
                    else{
                        exam_all_day = todo_color
                    }
                    change_class_color(names, i, exam_all_day, list.length)
                }
                else{
                    change_class_color(names, i, all_day_color, list.length)
                }
            } else if (time >= start && time <= end) {                
                if(cur["todo"] == "WORK"){color = work_color}
                else if(cur["todo"] == "TODO"){color = todo_color}
                else if(cur["todo"] == "EXAM"){
                    if(d.getSeconds() % 2 == 0){
                        exam_time = base_color
                    }
                    else{
                        exam_time = todo_color
                    }
                    color = exam_time
                }
                else{
                    color = base_color
                }
                
                change_class_color(names, i, color, list.length)
            } else if (minus_fifteen(start) <= time && time < start) {
                if(cur["todo"] == "EXAM"){
                    if(d.getSeconds() % 2 == 0){
                        exam_15 = todo_color
                    }
                    else{
                        exam_15 = upcoming_color
                    }
                    color = exam_15
                }
                else{
                    color = upcoming_color
                }

                change_class_color(names, i, color, list.length)
            } else if (time > end) {
                change_class_color(names, i, finished, list.length)
            } else {
                if(time+100 >= cur["start"] && cur["todo"] == "EXAM"){
                    if(d.getSeconds() % 2 == 0){
                        exam_before = work_color
                    }
                    else{
                        exam_before = grey
                    }
                    color = exam_before
                }
                else{
                    color = grey
                }
                change_class_color(names, i, color, list.length)
            }
        }
    } else {
        for (let i = 0; i < list.length; i++) {
            cur = list[i]

            start = cur["start"]
            end = cur["end"]

            if (cur["all_day"]) {
                if(cur["todo"] === "TODO"){
                    change_class_color(names, i, todo_color, list.length)
                }
                else if(cur["todo"] === "WORK"){
                    change_class_color(names, i, work_color, list.length)
                }
                else if(cur["todo"] === "EXAM"){
                    change_class_color(names, i, base_color, list.length)
                }
                else{
                    change_class_color(names, i, all_day_color, list.length)
                }
            } else {
                change_class_color(names, i, grey, list.length)
            }
        }
    }
}

function change_class_color(names, i, color, length) {
    if(names[0] == "none"){
        document.getElementsByClassName(names[0])[i].style.color = color
        return
    }
    for (let j = 0; j < names.length; j++) {
        if(j < names.length-1){
            document.getElementsByClassName(names[j])[i].style.color = color
        }
        else{
            document.getElementsByClassName(names[j])[i].style.backgroundColor = color
        }
    }

    if(length > max_events){
        for (let j = 0; j < names.length; j++) {
            if(j < names.length-1){
                document.getElementsByClassName(names[j])[i+length].style.color = color

            }
            else{
                document.getElementsByClassName(names[j])[i+length].style.backgroundColor = color
            }

            if(document.getElementsByClassName(names[j])[i+length*2] !== undefined){
                if(j < names.length-1){
                    document.getElementsByClassName(names[j])[i+length*2].style.color = color 
                }
                else{
                    document.getElementsByClassName(names[j])[i+length*2].style.backgroundColor = color
                }
            }
        }
    }
}

function minus_fifteen(input) {
        let toReturn = 0

        const sub = 15
        let string = add_zero(input)
        let hour_string = string[0] + string[1]
		let min_string = string[2] + string[3]
        let hour = parseInt(hour_string)
        let min = parseInt(min_string)

        if (min - sub < 0) {
            hour -= 1
            if (hour < 1) {
                hour = 12
            }
            min += (60 - sub)
            toReturn = add_zero(hour.toString()) + add_zero(min.toString())
        } else {
            min -= sub
            toReturn = hour_string + add_zero(min.toString())
        }
        return toReturn
}

function set_weather(key) {
        let w = weather()
        if (w[key] !== undefined && w[key] !== undefined) {

            document.getElementsByClassName("weather")[0].innerHTML =
                "    <div class=\"weather_icon\">\n" +
                "        <img class=\"weather_icon\" id=\"icon_" + w[key]["icon"] +"\" src=\"../images/" + w[key]["icon"] + ".png\">\n" +
                "    </div>\n" +
                "    <div class=\"weather_temp\">" + w[key]["high"].toString() + "</div>"
        }
}

function set_mini_weather(off, key) {
        const w = weather()
        let id = "weather_" + off.toString()
            // y = yesterday()

        if(set_year === null){
            if (w[key] !== undefined && key !== today && w[key]["low"] != null && document.getElementById(id) === null) {
                document.getElementById(off.toString()).innerHTML +=
                    "<div id=\"weather_" + off + "\" class=\"mini_weather\">\n" +
                    "    <div>\n" +
                    "        <img class=\"mini_weather_icon\" id=\"mini_" + w[key]["icon"] +"\" src=\"../images/" + w[key]["icon"] + ".png" + "\">\n" +
                    "    </div>\n" +
                    "    <div class=\"mini_weather_temp\">\n" +
                    "        <div class=\"mini_weather_temp_sub\">" + w[key]["high"].toString() + "</div>\n" +
                    "        <div class=\"mini_weather_temp_sub\">" + w[key]["low"].toString() + "</div>\n" +
                    "    </div>\n" +
                    "</div>\n"
            }else if(w[key] !== undefined && key === today){
                document.getElementById(off.toString()).innerHTML +=
                "<div id=\"weather_" + off + "\" class=\"mini_weather\">\n" +
                "    <div>\n" +
                "        <img class=\"mini_weather_icon\" id=\"mini_" + w[key]["icon"] +"\" src=\"../images/" + w[key]["icon"] + ".png" + "\">\n" +
                "    </div>\n" +
                "    <div class=\"mini_weather_temp\">\n" +
                "        <div class=\"mini_weather_temp_sub\">" + w[key]["high"].toString() + "</div>\n" +
                "        <div class=\"mini_weather_temp_sub\"></div>\n" +
                "    </div>\n" +
                "</div>\n"
            }
            else if (document.getElementById(id) === null) {
                document.getElementById(off.toString()).innerHTML +=
                    "<div id=\"weather_" + off + "\" class=\"mini_weather\"></div>\n"
            }
    }

}
function getMillis(m){
	millis = m
	if(millis.length < 3){
		milli = "0"
	}
	else{
		milli = millis[0]
	}
	return milli
}

function getDate(year, month, day){
    if(year == null){
        return new Date()
    }
    else{
        return new Date(year, month, day)
    }
}
var up = 3
var down = -1
var cal_pos = 0
function forward_month(){
    date = new Date()

    next_month = 0
    next_year = 0
    next_day = 0

    cal_pos += 1
    if(cal_pos === 0){
        set_year = null
        set_month = null
        set_day = null
        document.getElementsByClassName("weather")[0].style.visibility = "visible"
        document.getElementById("backward").style.filter = "initial"
    }
    else if(cal_pos <= up){
        next_month = date.getMonth()+cal_pos
        next_day = 1
        next_year = date.getFullYear()
        if(next_month === 0){
            next_year += 1
        }

        set_year = next_year
        set_month = next_month
        set_day = next_day
        document.getElementsByClassName("weather")[0].style.visibility = "hidden"
        document.getElementById("backward").style.filter = "initial"
        if(cal_pos == up){
            document.getElementById("forward").style.filter = "grayscale(100%) brightness(50%)"
        }
    }
    else{
        cal_pos -= 1
    }

    offset_check = false
}

function backward_month(){
    date = new Date()

    prev_month = 0
    prev_year = 0
    prev_day = 0

    cal_pos -= 1
    
    if(cal_pos === 0){
        set_year = null
        set_month = null
        set_day = null
        document.getElementsByClassName("weather")[0].style.visibility = "visible"
        document.getElementById("forward").style.filter = "initial"
    }
    else if(cal_pos >= down){
        prev_month = date.getMonth()+cal_pos
        prev_day = 1
        prev_year = date.getFullYear()

        if(prev_month === 12){
            prev_year -= 1
        }

        set_year = prev_year
        set_month = prev_month
        set_day = prev_day
        document.getElementsByClassName("weather")[0].style.visibility = "hidden"
        document.getElementById("forward").style.filter = "initial"
        if(cal_pos == down){
            document.getElementById("backward").style.filter = "grayscale(100%) brightness(50%)"
        }
    }
    else{
        cal_pos += 1
    }

    offset_check = false

}

function backButton(){
    history.go(-1)
}

function leap_year(y){
    if (parseInt(y) % 4 === 0) {
        month_lengths[1] = 29
    }
    else{
        month_lengths[1] = 28
    }
}
function yesterday(){
    today = new Date();
    y = new Date(today);
    y.setDate(y.getDate() - 1);
    return add_zero(y.getMonth()+1) +"/" + add_zero(y.getDate()) +"/" + y.getFullYear()
}
function show_description(i){
    var dict = dictionary()
    var text = "<b>" +dict[event_key][i]["summary"] +"</b>"+ "<br> <br>" + dict[event_key][i]["description"]

    document.getElementById("description").innerHTML = text
    document.getElementById("description_container").style.visibility = "visible"   
    
    let h = parseInt(window.getComputedStyle(document.getElementById("description")).getPropertyValue('height'))
    if(h < 520){
        document.getElementById("description_container").style.height = h+40+"px"
        document.getElementById("desc_con").style.height = h+"px"
        document.getElementById("desc_con").style.overflowY = "hidden"
    }
    else{
        document.getElementById("description_container").style.height = "560px"
        document.getElementById("desc_con").style.height = "520px"
		document.getElementById("desc_con").scrollTo(0,0); 
        document.getElementById("desc_con").style.overflowY = "auto"
    }
}

function displayTextWidth(text, font) {
    let canvas = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    context.font = font;
    let metrics = context.measureText(text);
    return metrics.width;
  }
function description_clicked_on(){
    desc_clicked = true;
}

document.addEventListener("click", back_clicked);
function back_clicked() {
    if(desc_clicked){
        desc_clicked = false
    }
    else if(document.getElementById("description_container") != null){
        document.getElementById("description_container").style.visibility = "hidden"
    }
}