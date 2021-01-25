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

            if (half_width >= 58) {
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
        return "All Day"
    }else {
        return get_12_hour_int(start) + " - "
            + get_12_hour_int(end)
    }
}

function set_current_event(key, time_24) {
    // const base_color = "#0f99e3"
    const base_color = "#bd0000"
	const all_day_color = "#cfcd6b"
	const todo_color = "#ff9900"
    const upcoming_color = "#4bd6d6"
    const grey = "#383838"
	const finished = "#232323"
	
	const work_color = "#ffee00"
    // const todo_color = "#ffa857"


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
            
            if (cur["all_day"]) {
                if(cur["todo"] === "TODO"){
                    change_class_color(names, i, todo_color, list.length)
                }
                else if(cur["todo"] === "WORK"){
                    change_class_color(names, i, work_color, list.length)
                }
                else{
                    change_class_color(names, i, all_day_color, list.length)
                }
            } else if (time >= start && time <= end) {
				let color = base_color
				if(cur["todo"] == "WORK"){color = work_color}
                change_class_color(names, i, color, list.length)
            } else if (minus_fifteen(start) <= time && time < start) {
                change_class_color(names, i, upcoming_color, list.length)
            } else if (time > end) {
                change_class_color(names, i, finished, list.length)
            } else {
                change_class_color(names, i, grey, list.length)
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
        let string = input.toString()
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
    }
    else{
        cal_pos += 1
    }

    offset_check = false

}

function backButton(){
    url = "../tab/custom_tab.html"
    window.location.replace(url)
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
    else{
        document.getElementById("description_container").style.visibility = "hidden"
    }
}

function dictionary() {
	return {
		"12/01/2020": [{"summary": "Pay Rent", "all_day": true, "todo": null, "start": null, "end": null, "location": "<a href=\"https://mycommunity.americancampus.com/s/\" id=\"link\" onclick=\"link()\">Americancampus</a>", "description": null},
						{"summary": "Change board", "all_day": false, "todo": null, "start": 0900, "end": 0905, "location": null, "description": null},
						{"summary": "CSE 341", "all_day": false, "todo": null, "start": 1245, "end": 1400, "location": "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": null},
						{"summary": "Shot", "all_day": false, "todo": null, "start": 1800, "end": 1900, "location": null, "description": null},
						{"summary": "Phy 108", "all_day": false, "todo": null, "start": 2040, "end": 2155, "location": "<a href=\"https://buffalo.zoom.us/meeting/register/tJIuceiprDwtGNEegXXyshOJMKbPDW1BMant\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": null}],
		"12/02/2020": [{"summary": "Unplug Board", "all_day": false, "todo": null, "start": 0900, "end": 0905, "location": null, "description": null},
						{"summary": "CS Recitation", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "MTH 309", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": "4o892q    "},
						{"summary": "Math Recitation", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": null},
						{"summary": "Fusion 360 Workshop", "all_day": false, "todo": null, "start": 1700, "end": 1900, "location": "<a href=\"https://buffalo.zoom.us/j/95139165391\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": null}],
		"12/03/2020": [{"summary": "CSE 341", "all_day": false, "todo": null, "start": 1245, "end": 1400, "location": "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": null},
						{"summary": "Phy 108", "all_day": false, "todo": null, "start": 2040, "end": 2155, "location": "<a href=\"https://buffalo.zoom.us/meeting/register/tJIuceiprDwtGNEegXXyshOJMKbPDW1BMant\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": null}],
		"12/04/2020": [{"summary": "Physics Lab", "all_day": false, "todo": null, "start": 0910, "end": 1200, "location": "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>", "description": null},
						{"summary": "MTH 309", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": "4o892q    "}],
		"12/05/2020": [],
		"12/06/2020": [],
		"12/07/2020": [{"summary": "Linear Algebra Review", "all_day": false, "todo": null, "start": 1030, "end": 1130, "location": "<a href=\"https://www.youtube.com/watch?v=AnMaXo6mux0&ab_channel=Ludus\" id=\"link\" onclick=\"link()\">Youtube</a>", "description": null},
						{"summary": "Physics Recitation", "all_day": false, "todo": null, "start": 1130, "end": 1220, "location": "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": null},
						{"summary": "MTH 309", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": "4o892q    "}],
		"12/08/2020": [{"summary": "CSE 341", "all_day": false, "todo": null, "start": 1245, "end": 1400, "location": "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": null},
						{"summary": "Linear Algebra Review", "all_day": false, "todo": null, "start": 1530, "end": 1700, "location": "<a href=\"https://www.youtube.com/watch?v=FmN2c0yQ6Bk&ab_channel=Ludus\" id=\"link\" onclick=\"link()\">Youtube</a>", "description": null},
						{"summary": "Phy 108", "all_day": false, "todo": null, "start": 2040, "end": 2155, "location": "<a href=\"https://buffalo.zoom.us/meeting/register/tJIuceiprDwtGNEegXXyshOJMKbPDW1BMant\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": null}],
		"12/09/2020": [{"summary": "CS Recitation", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "MTH 309", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": "4o892q    "},
						{"summary": "Math Recitation", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": null}],
		"12/10/2020": [{"summary": "CSE 341", "all_day": false, "todo": null, "start": 1245, "end": 1400, "location": "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": null},
						{"summary": "Phy 108", "all_day": false, "todo": null, "start": 2040, "end": 2155, "location": "<a href=\"https://buffalo.zoom.us/meeting/register/tJIuceiprDwtGNEegXXyshOJMKbPDW1BMant\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": null}],
		"12/11/2020": [{"summary": "Physics Lab", "all_day": false, "todo": null, "start": 0910, "end": 1200, "location": "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>", "description": null},
						{"summary": "MTH 309", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": "4o892q    "}],
		"12/12/2020": [],
		"12/13/2020": [],
		"12/14/2020": [{"summary": "CS FINAL", "all_day": false, "todo": null, "start": 1300, "end": 1730, "location": null, "description": null}],
		"12/15/2020": [{"summary": "Electricity", "all_day": true, "todo": null, "start": null, "end": null, "location": "<a href=\"https://www.nationalgridus.com/Upstate-NY-Home/Billing-Payments/Ways-to-Pay\" id=\"link\" onclick=\"link()\">Nationalgridus</a>", "description": null}],
		"12/16/2020": [{"summary": "Physics FINAL", "all_day": false, "todo": null, "start": 0800, "end": 1130, "location": "<a href=\"https://buffalo.zoom.us/j/2637418004?pwd=M1FSMFpMWWtIUEtsanh0S3hyMll1Zz09\" id=\"link\" onclick=\"link()\">Zoom</a>", "description": null},
						{"summary": "Math FINAL", "all_day": false, "todo": null, "start": 1145, "end": 1545, "location": "<a href=\"https://exams.math.buffalo.edu/zoom/?pin=mwqv\" id=\"link\" onclick=\"link()\">Math</a>", "description": "<p>https://buffalo.zoom.us/j/92364356158?pwd=Z0xublgyeWFwc1R5b2EvaXR3dHUrdz09</p>"}],
		"12/17/2020": [{"summary": "Phyiscs Lab FINAL", "all_day": false, "todo": null, "start": 1145, "end": 1315, "location": null, "description": null}],
		"12/18/2020": [],
		"12/19/2020": [],
		"12/20/2020": [],
		"12/21/2020": [],
		"12/22/2020": [],
		"12/23/2020": [],
		"12/24/2020": [],
		"12/25/2020": [],
		"12/26/2020": [],
		"12/27/2020": [],
		"12/28/2020": [],
		"12/29/2020": [],
		"12/30/2020": [],
		"12/31/2020": [],
		"01/01/2021": [{"summary": "Pay Rent", "all_day": true, "todo": null, "start": null, "end": null, "location": "<a href=\"https://mycommunity.americancampus.com/s/\" id=\"link\" onclick=\"link()\">Americancampus</a>", "description": null},
						{"summary": "Change board", "all_day": false, "todo": null, "start": 0900, "end": 0905, "location": null, "description": null}],
		"01/02/2021": [{"summary": "Unplug Board", "all_day": false, "todo": null, "start": 0900, "end": 0905, "location": null, "description": null}],
		"01/03/2021": [],
		"01/04/2021": [],
		"01/05/2021": [{"summary": "Example", "all_day": false, "todo": null, "start": 2000, "end": 2100, "location": null, "description": "This is a test to see if links work here<br><br><a href='http://www.google.com'>GOOGLE</a><br><br>what about this?<br><br><a href='https://piazza.com/class/keacvhkkr9447s'>Piazza</a><br><br><b>BOLD text</b>?<br><br><i>Italic?</i><br><i><br></i><br>Attachment\;" + 
 							"<div class='attachment'><a class='no_underline' href='https://drive.google.com/file/d/1LIKQhW5skikIOs_yYFTAfrHL36K0Ck3C/view?usp=drive_web'><div class='attach_image'><img src='../images/png.png' style='height: 12px; width: 12px;'></div><div class='attach_name'>black_blue.png</div></div>"}],
		"01/06/2021": [],
		"01/07/2021": [],
		"01/08/2021": [],
		"01/09/2021": [],
		"01/10/2021": [],
		"01/11/2021": [],
		"01/12/2021": [],
		"01/13/2021": [{"summary": "Dentist", "all_day": true, "todo": null, "start": null, "end": null, "location": null, "description": null}],
		"01/14/2021": [{"summary": "Hair Cut", "all_day": false, "todo": null, "start": 1400, "end": 1500, "location": null, "description": null}],
		"01/15/2021": [{"summary": "Electricity", "all_day": true, "todo": null, "start": null, "end": null, "location": "<a href=\"https://www.nationalgridus.com/Upstate-NY-Home/Billing-Payments/Ways-to-Pay\" id=\"link\" onclick=\"link()\">Nationalgridus</a>", "description": null},
						{"summary": "Remove Bank Account from Auto Pay", "all_day": true, "todo": null, "start": null, "end": null, "location": "<a href=\"https://mycommunity.americancampus.com/s/\" id=\"link\" onclick=\"link()\">Americancampus</a>", "description": "Will probably have to contact bank or American Campus"}],
		"01/16/2021": [],
		"01/17/2021": [],
		"01/18/2021": [],
		"01/19/2021": [],
		"01/20/2021": [],
		"01/21/2021": [],
		"01/22/2021": [],
		"01/23/2021": [],
		"01/24/2021": [],
		"01/25/2021": [{"summary": "Network Defense", "all_day": false, "todo": null, "start": 1900, "end": 2100, "location": "<a href=\"https://www.reddit.com/r/UBreddit/comments/l0am1r/ub_network_defense_info_session_125_at_700_pm/?utm_medium=android_app&utm_source=share\" id=\"link\" onclick=\"link()\">Reddit</a>", "description": null}],
		"01/26/2021": [],
		"01/27/2021": [],
		"01/28/2021": [],
		"01/29/2021": [],
		"01/30/2021": [],
		"01/31/2021": [],
		"02/01/2021": [{"summary": "Change board", "all_day": false, "todo": null, "start": 0900, "end": 0905, "location": null, "description": null},
						{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241", "all_day": false, "todo": null, "start": 1020, "end": 1110, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"02/02/2021": [{"summary": "EAS 305 Recitation", "all_day": false, "todo": null, "start": 0800, "end": 0850, "location": null, "description": null},
						{"summary": "Unplug Board", "all_day": false, "todo": null, "start": 0900, "end": 0905, "location": null, "description": null},
						{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"02/03/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"02/04/2021": [{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"02/05/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241 Lab", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"02/06/2021": [],
		"02/07/2021": [],
		"02/08/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241", "all_day": false, "todo": null, "start": 1020, "end": 1110, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"02/09/2021": [{"summary": "EAS 305 Recitation", "all_day": false, "todo": null, "start": 0800, "end": 0850, "location": null, "description": null},
						{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"02/10/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"02/11/2021": [{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"02/12/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241 Lab", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"02/13/2021": [],
		"02/14/2021": [],
		"02/15/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241", "all_day": false, "todo": null, "start": 1020, "end": 1110, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"02/16/2021": [{"summary": "EAS 305 Recitation", "all_day": false, "todo": null, "start": 0800, "end": 0850, "location": null, "description": null},
						{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"02/17/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"02/18/2021": [{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"02/19/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241 Lab", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"02/20/2021": [],
		"02/21/2021": [],
		"02/22/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241", "all_day": false, "todo": null, "start": 1020, "end": 1110, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"02/23/2021": [{"summary": "EAS 305 Recitation", "all_day": false, "todo": null, "start": 0800, "end": 0850, "location": null, "description": null},
						{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"02/24/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"02/25/2021": [{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"02/26/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241 Lab", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"02/27/2021": [],
		"02/28/2021": [],
		"03/01/2021": [{"summary": "Change board", "all_day": false, "todo": null, "start": 0900, "end": 0905, "location": null, "description": null},
						{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241", "all_day": false, "todo": null, "start": 1020, "end": 1110, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"03/02/2021": [{"summary": "EAS 305 Recitation", "all_day": false, "todo": null, "start": 0800, "end": 0850, "location": null, "description": null},
						{"summary": "Unplug Board", "all_day": false, "todo": null, "start": 0900, "end": 0905, "location": null, "description": null},
						{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"03/03/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"03/04/2021": [{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"03/05/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241 Lab", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"03/06/2021": [],
		"03/07/2021": [],
		"03/08/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241", "all_day": false, "todo": null, "start": 1020, "end": 1110, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"03/09/2021": [{"summary": "EAS 305 Recitation", "all_day": false, "todo": null, "start": 0800, "end": 0850, "location": null, "description": null},
						{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"03/10/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"03/11/2021": [{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"03/12/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241 Lab", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"03/13/2021": [],
		"03/14/2021": [],
		"03/15/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241", "all_day": false, "todo": null, "start": 1020, "end": 1110, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"03/16/2021": [{"summary": "EAS 305 Recitation", "all_day": false, "todo": null, "start": 0800, "end": 0850, "location": null, "description": null},
						{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"03/17/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"03/18/2021": [{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"03/19/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241 Lab", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"03/20/2021": [],
		"03/21/2021": [],
		"03/22/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241", "all_day": false, "todo": null, "start": 1020, "end": 1110, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"03/23/2021": [{"summary": "EAS 305 Recitation", "all_day": false, "todo": null, "start": 0800, "end": 0850, "location": null, "description": null},
						{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"03/24/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"03/25/2021": [{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"03/26/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241 Lab", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"03/27/2021": [],
		"03/28/2021": [],
		"03/29/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241", "all_day": false, "todo": null, "start": 1020, "end": 1110, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"03/30/2021": [{"summary": "EAS 305 Recitation", "all_day": false, "todo": null, "start": 0800, "end": 0850, "location": null, "description": null},
						{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"03/31/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"04/01/2021": [{"summary": "Registration Flow Sheet", "all_day": true, "todo": null, "start": null, "end": null, "location": "<a href=\"https://academics.eng.buffalo.edu/academics/flowsheet/\" id=\"link\" onclick=\"link()\">Eng</a>", "description": "-" + 
 							"<div class='attachment'><a class='no_underline' href='https://drive.google.com/file/d/1je8RmCRTZHM6AnhR7BKDU8BJcrJAChnY/view?usp=drive_web'><div class='attach_image'><img src='../images/png.png' style='height: 12px; width: 12px;'></div><div class='attach_name'>flow.png</div></div>"},
						{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"04/02/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241 Lab", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"04/03/2021": [],
		"04/04/2021": [],
		"04/05/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241", "all_day": false, "todo": null, "start": 1020, "end": 1110, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"04/06/2021": [{"summary": "EAS 305 Recitation", "all_day": false, "todo": null, "start": 0800, "end": 0850, "location": null, "description": null},
						{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"04/07/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"04/08/2021": [{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"04/09/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241 Lab", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"04/10/2021": [],
		"04/11/2021": [],
		"04/12/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241", "all_day": false, "todo": null, "start": 1020, "end": 1110, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"04/13/2021": [{"summary": "EAS 305 Recitation", "all_day": false, "todo": null, "start": 0800, "end": 0850, "location": null, "description": null},
						{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"04/14/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"04/15/2021": [{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"04/16/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241 Lab", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"04/17/2021": [],
		"04/18/2021": [],
		"04/19/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241", "all_day": false, "todo": null, "start": 1020, "end": 1110, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"04/20/2021": [{"summary": "EAS 305 Recitation", "all_day": false, "todo": null, "start": 0800, "end": 0850, "location": null, "description": null},
						{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"04/21/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"04/22/2021": [{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"04/23/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241 Lab", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"04/24/2021": [],
		"04/25/2021": [],
		"04/26/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241", "all_day": false, "todo": null, "start": 1020, "end": 1110, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"04/27/2021": [{"summary": "EAS 305 Recitation", "all_day": false, "todo": null, "start": 0800, "end": 0850, "location": null, "description": null},
						{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"04/28/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 379 Lab", "all_day": false, "todo": null, "start": 1130, "end": 1250, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}],
		"04/29/2021": [{"summary": "EAS 360", "all_day": false, "todo": null, "start": 0935, "end": 1050, "location": null, "description": null}],
		"04/30/2021": [{"summary": "CSE 379", "all_day": false, "todo": null, "start": 0910, "end": 1000, "location": null, "description": null},
						{"summary": "CSE 241 Lab", "all_day": false, "todo": null, "start": 1240, "end": 1330, "location": null, "description": null},
						{"summary": "EAS 305", "all_day": false, "todo": null, "start": 1350, "end": 1440, "location": null, "description": null}]
	}
}
function weather() {
	return {
		"01/25/2021": {"high": 35, "low": null, "forecast": "Clouds", "icon": "04d"},
		"01/26/2021": {"high": 28, "low": 27, "forecast": "Snow", "icon": "13d"},
		"01/27/2021": {"high": 28, "low": 24, "forecast": "Snow", "icon": "13d"},
		"01/28/2021": {"high": 24, "low": 14, "forecast": "Clouds", "icon": "04d"},
		"01/29/2021": {"high": 15, "low": 10, "forecast": "Snow", "icon": "13d"},
		"01/30/2021": {"high": 19, "low": 12, "forecast": "Snow", "icon": "13d"}
	}
}
