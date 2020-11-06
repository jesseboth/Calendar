const max_events = 6
let half_width = 0
let event_height = 0
let weather_margin = 0

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
let delay = [-1, -1]
let min = -1
let today = ""
let set_weather_margin = false

function updateTime() {

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const datetime = new Date();
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
        offset_check = true
        const first = new Date(year, month_num, 1)
        offset = first.getDay()
        set_cal_dates(offset + 1, month_num, year)
        set_weather(current_key)
        show_day(get_key(month_num + 1, day, year), time_24)
        set_current_event(current_key, time_24)
        clicked_key = current_key
    }

    set_current_event(clicked_key, time_24)
    const current_color = "orange"
    set_time(current_time, date, day + offset, current_color)

    if (min === -1 || min === datetime.getMinutes()) {
        if (min === 59) {
            min = 0
        } else {
            min = datetime.getMinutes() + 1
        }
    }
    if (set_weather_margin) {
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
    document.getElementById((day).toString()).style.color = color
    document.getElementById((day).toString()).style.borderColor = color
}

function get_12_hour(hour, minutes, check) {
    let new_hour;
    let am_pm;
    if (parseInt(hour) > 12) {
        if (parseInt(hour) === 24) {
            new_hour = parse(hour) - 12;
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

function add_zero(i) {
    if (i < 10) {
        return "0" + i.toString()
    } else {
        return i.toString()
    }
}

function get_key(month, day, year) {
    return add_zero(month) + "/" + add_zero(day) + "/" + year.toString();
}

function set_cal_dates(offset, month, year) {

    dict = dictionary()
    if (parseInt(year) % 4 === 0) {
        month_lengths[1]++
    }
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

        if (dict[key].length !== 0) {
            document.getElementById(start.toString()).innerText = day.toString()
            set_mini_weather(start, key)
            adjust_weather_css(start, key)
            document.getElementById(start.toString()).innerHTML += "<div class=\"event _" + start + "_0\">" + dict[key][0][0] + "</div>"

            if (half_width >= 58) {
                document.getElementById(start.toString()).innerHTML += "<div class=\"event _" + start + "_0\">" + dict[key][1][0] + "</div>"

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

        if (dict[key].length !== 0) {
            document.getElementById(start.toString()).innerText = day.toString()
            set_mini_weather(start, key)
            adjust_weather_css(start, key)
            document.getElementById(start.toString()).innerHTML += "<div class=\"event _" + start + "_0\">" + dict[key][0][0] + "</div>"

            if (half_width >= 58) {
                document.getElementById(start.toString()).innerHTML += "<div class=\"event _" + start + "_0\">" + dict[key][1][0] + "</div>"

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
    if (half_width >= 58 && dict[key].length !== 0) {
        document.getElementById("weather_" + off.toString()).style.marginTop = "-16px"
    } else if (dict[key].length !== 0) {
        document.getElementById("weather_" + off.toString()).style.marginTop = "-20px"

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

    for (let j = 0; j < dict[key].length; j++) {
        if (j > num_events) {
            if (!overflow) {
                overflow = true
                document.getElementById(off.toString()).innerHTML += "<div class=\"event_extra\" id=\"_" + off + "_" + "\">l</div>"
            } else {
                document.getElementById("_" + off.toString() + "_").innerHTML += "l"
            }
        } else {
            document.getElementById(off.toString()).innerHTML += "<div class=\"event\" id=\"_" + off + "_" + j + "\">" + dict[key][j][0] + "</div>"
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
    if (clicked_key !== current_key) {
        document.getElementById(id).style.color = "purple"
    }
    const datetime = new Date()
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

    let dict = dictionary()
    let summary;
    let location;
    let duration;

    let del = 0
    document.getElementById("today").innerHTML = ""
    for (let i = 0; i < dict[key].length; i++) {
        let current = dict[key][i]
        location = "-"

        if (current[2] === "ALL_DAY" || current[2] === "TODO") {
            duration = find_duration(current[2])
            if (current.length > 3) {
                location = current[3]
            }
        } else {
            duration = find_duration(current[2], current[3])
            if (current.length > 4) {
                location = current[4]
            }
        }

        document.getElementById("today").innerHTML +=
            "    <div class=\"event_container event_" +i+"\"></div>\n"

        document.getElementsByClassName("event_container")[i].innerHTML +=
            "    <div class=\"summary\"></div>\n" +
            "    <div class=\"location\"></div>\n" +
            "    <div class=\"duration\"></div>\n" +
            "    <div class=\"break\"></div>"

        //
        // document.getElementById("today").innerHTML +=
        //     "    <div class=\"summary\"></div>\n" +
        //     "    <div class=\"location\"></div>\n" +
        //     "    <div class=\"duration\"></div>\n" +
        //     "    <div class=\"break\"></div>"

        summary = current[0]
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
    if (start === "ALL_DAY") {
        return "All Day"
    } else if (start === "TODO") {
        return "To Do"
    } else {
        return get_12_hour(start[0] + start[1], start[2] + start[3]) + " - "
            + get_12_hour(end[0] + end[1], end[2] + end[3])
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
	
	const test = "#ffee00"
    // const todo_color = "#ffa857"


    const time = parseInt(time_24)
    const dict = dictionary()
    const list = dict[key]

    let cur = []
    let start = 0
    let end = 0

    const names = ["summary", "location", "duration"]

    if (key === current_key) {
        for (let i = 0; i < list.length; i++) {
            cur = list[i]

            start = cur[2]
            end = cur[3]

            if (cur[2] === "ALL_DAY") {
                change_class_color(names, i, all_day_color, list.length)
            } else if (cur[2] === "TODO") {
                change_class_color(names, i, todo_color, list.length)
            } else if (time >= start && time <= end) {
				let color = base_color
				if(cur[4] == "Work"){color = test}
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
		do_it = false
		split_key = key.split("/")
		split_current = current_key.split("/")
		
		if(parseInt(split_key[0]) > parseInt(split_current[0])){
			do_it = true
		}
		else if(parseInt(split_key[1]) > parseInt(split_current[1]) && split_key[0] == split_current[0]){
			do_it = true
		}
		if(do_it){
			for (let i = 0; i < list.length; i++) {
				cur = list[i]
	
				start = cur[2]
				end = cur[3]
	
				if (cur[2] === "TODO") {
					change_class_color(names, i, todo_color, list.length)
				}
	
			}
		}

	}
}

function change_class_color(names, i, color, length) {
        for (let j = 0; j < names.length; j++) {
            document.getElementsByClassName(names[j])[i].style.color = color
        }

        if(length > max_events){
            for (let j = 0; j < names.length; j++) {
				document.getElementsByClassName(names[j])[i+length].style.color = color

				if(document.getElementsByClassName(names[j])[i+length*2] !== undefined){
					document.getElementsByClassName(names[j])[i+length*2].style.color = color
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
        if (w[key] !== undefined) {

            document.getElementsByClassName("weather")[0].innerHTML =
                "    <div class=\"weather_icon\">\n" +
                "        <img class=\"weather_icon\" id=\"icon_" + w[key][2] +"\" src=\"../images/" + w[key][2] + ".png\">\n" +
                "    </div>\n" +
                "    <div class=\"weather_temp\">" + w[key][0].toString() + "</div>"
        }
}

function set_mini_weather(off, key) {
        const w = weather()
        let id = "weather_" + off.toString()

        if (key !== today && w[key] !== undefined && document.getElementById(id) === null) {
            document.getElementById(off.toString()).innerHTML +=
                "<div id=\"weather_" + off + "\" class=\"mini_weather\">\n" +
                "    <div>\n" +
                "        <img class=\"mini_weather_icon\" id=\"mini_" + w[key][3] +"\" src=\"../images/" + w[key][3] + ".png" + "\">\n" +
                "    </div>\n" +
                "    <div class=\"mini_weather_temp\">\n" +
                "        <div class=\"mini_weather_temp_sub\">" + w[key][0].toString() + "</div>\n" +
                "        <div class=\"mini_weather_temp_sub\">" + w[key][1].toString() + "</div>\n" +
                "    </div>\n" +
                "</div>\n"
        } else if (document.getElementById(id) === null) {
            document.getElementById(off.toString()).innerHTML +=
                "<div id=\"weather_" + off + "\" class=\"mini_weather\"></div>\n"
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


function dictionary() {
	return {
		"01/01/2021": [["Pay Rent", "01/01/2021", "ALL_DAY", "<a href=\"https://mycommunity.americancampus.com/s/\" id=\"link\" onclick=\"link()\">Americancampus</a>"],
						["Change board", "01/01/2021", "0900", "0905"]],
		"01/01/2020": [["Charge board", "01/01/2020", "0900", "0905"],
						["Pay Rent", "01/01/2020", "1200", "1300"]],
		"01/02/2020": [["Unplug Board", "01/02/2020", "0900", "0905"]],
		"01/03/2020": [],
		"01/04/2020": [],
		"01/05/2020": [],
		"01/06/2020": [],
		"01/07/2020": [],
		"01/08/2020": [],
		"01/09/2020": [],
		"01/10/2020": [],
		"01/11/2020": [],
		"01/12/2020": [],
		"01/13/2020": [],
		"01/14/2020": [],
		"01/15/2020": [],
		"01/16/2020": [],
		"01/17/2020": [],
		"01/18/2020": [],
		"01/19/2020": [],
		"01/20/2020": [],
		"01/21/2020": [],
		"01/22/2020": [],
		"01/23/2020": [],
		"01/24/2020": [],
		"01/25/2020": [],
		"01/26/2020": [],
		"01/27/2020": [["PHY 107 Recitation", "01/27/2020", "0900", "0950", "219 Fronczak"],
						["PHY 107", "01/27/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "01/27/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "01/27/2020", "1300", "1350", "121 Cooke"]],
		"01/28/2020": [["MTH 306 Recitation", "01/28/2020", "0900", "0950", "214 O'Brian"],
						["MTH 306", "01/28/2020", "1100", "1220", "205 NSC"]],
		"01/29/2020": [["CSE 250 Recitation", "01/29/2020", "0900", "0950", "340 Bell"],
						["PHY 107", "01/29/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "01/29/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "01/29/2020", "1300", "1350", "121 Cooke"]],
		"01/30/2020": [["MTH 306", "01/30/2020", "1100", "1220", "205 NSC"]],
		"01/31/2020": [["PHY 107", "01/31/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "01/31/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "01/31/2020", "1300", "1350", "121 Cooke"],
						["CSE 220 Lab", "01/31/2020", "1400", "1600", "340 Bell"]],
		"02/01/2020": [["Charge board", "02/01/2020", "0900", "0905"],
						["Pay Rent", "02/01/2020", "1200", "1300"]],
		"02/02/2020": [["Unplug Board", "02/02/2020", "0900", "0905"]],
		"02/03/2020": [["PHY 107 Recitation", "02/03/2020", "0900", "0950", "219 Fronczak"],
						["PHY 107", "02/03/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "02/03/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "02/03/2020", "1300", "1350", "121 Cooke"]],
		"02/04/2020": [["MTH 306 Recitation", "02/04/2020", "0900", "0950", "214 O'Brian"],
						["MTH 306", "02/04/2020", "1100", "1220", "205 NSC"]],
		"02/05/2020": [["CSE 250 Recitation", "02/05/2020", "0900", "0950", "340 Bell"],
						["PHY 107", "02/05/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "02/05/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "02/05/2020", "1300", "1350", "121 Cooke"],
						["CS Unix tutorial", "02/05/2020", "1900", "2000", "Cooke 121"]],
		"02/06/2020": [["MTH 306", "02/06/2020", "1100", "1220", "205 NSC"]],
		"02/07/2020": [["PHY 107", "02/07/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "02/07/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "02/07/2020", "1300", "1350", "121 Cooke"],
						["CSE 220 Lab", "02/07/2020", "1400", "1600", "340 Bell"]],
		"02/08/2020": [],
		"02/09/2020": [],
		"02/10/2020": [["PHY 107 Recitation", "02/10/2020", "0900", "0950", "219 Fronczak"],
						["PHY 107", "02/10/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "02/10/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "02/10/2020", "1300", "1350", "121 Cooke"]],
		"02/11/2020": [["MTH 306 Recitation", "02/11/2020", "0900", "0950", "214 O'Brian"],
						["MTH 306", "02/11/2020", "1100", "1220", "205 NSC"]],
		"02/12/2020": [["CSE 250 Recitation", "02/12/2020", "0900", "0950", "340 Bell"],
						["PHY 107", "02/12/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "02/12/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "02/12/2020", "1300", "1350", "121 Cooke"]],
		"02/13/2020": [["MTH 306", "02/13/2020", "1100", "1220", "205 NSC"]],
		"02/14/2020": [["PHY 107", "02/14/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "02/14/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "02/14/2020", "1300", "1350", "121 Cooke"],
						["CSE 220 Lab", "02/14/2020", "1400", "1600", "340 Bell"]],
		"02/15/2020": [],
		"02/16/2020": [],
		"02/17/2020": [["PHY 107 Recitation", "02/17/2020", "0900", "0950", "219 Fronczak"],
						["PHY 107", "02/17/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "02/17/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "02/17/2020", "1300", "1350", "121 Cooke"]],
		"02/18/2020": [["MTH 306 Recitation", "02/18/2020", "0900", "0950", "214 O'Brian"],
						["MTH 306", "02/18/2020", "1100", "1220", "205 NSC"]],
		"02/19/2020": [["CSE 250 Recitation", "02/19/2020", "0900", "0950", "340 Bell"],
						["PHY 107", "02/19/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "02/19/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "02/19/2020", "1300", "1350", "121 Cooke"]],
		"02/20/2020": [["MTH 306", "02/20/2020", "1100", "1220", "205 NSC"]],
		"02/21/2020": [["PHY 107", "02/21/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "02/21/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "02/21/2020", "1300", "1350", "121 Cooke"],
						["CSE 220 Lab", "02/21/2020", "1400", "1600", "340 Bell"]],
		"02/22/2020": [],
		"02/23/2020": [],
		"02/24/2020": [["PHY 107 Recitation", "02/24/2020", "0900", "0950", "219 Fronczak"],
						["PHY 107", "02/24/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "02/24/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "02/24/2020", "1300", "1350", "121 Cooke"]],
		"02/25/2020": [["MTH 306 Recitation", "02/25/2020", "0900", "0950", "214 O'Brian"],
						["MTH 306", "02/25/2020", "1100", "1220", "205 NSC"]],
		"02/26/2020": [["CSE 250 Recitation", "02/26/2020", "0900", "0950", "340 Bell"],
						["PHY 107", "02/26/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "02/26/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "02/26/2020", "1300", "1350", "121 Cooke"]],
		"02/27/2020": [["MTH 306", "02/27/2020", "1100", "1220", "205 NSC"]],
		"02/28/2020": [["PHY 107", "02/28/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "02/28/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "02/28/2020", "1300", "1350", "121 Cooke"],
						["CSE 220 Lab", "02/28/2020", "1400", "1600", "340 Bell"]],
		"02/29/2020": [["Physics Test", "02/29/2020", "1000", "1200"]],
		"03/01/2020": [["Charge board", "03/01/2020", "0900", "0905"],
						["Pay Rent", "03/01/2020", "1200", "1300"]],
		"03/02/2020": [["Unplug Board", "03/02/2020", "0900", "0905"],
						["PHY 107 Recitation", "03/02/2020", "0900", "0950", "219 Fronczak"],
						["PHY 107", "03/02/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "03/02/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "03/02/2020", "1300", "1350", "121 Cooke"]],
		"03/03/2020": [["MTH 306 Recitation", "03/03/2020", "0900", "0950", "214 O'Brian"],
						["MTH 306", "03/03/2020", "1100", "1220", "205 NSC"]],
		"03/04/2020": [["CSE 250 Recitation", "03/04/2020", "0900", "0950", "340 Bell"],
						["PHY 107", "03/04/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "03/04/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "03/04/2020", "1300", "1350", "121 Cooke"]],
		"03/05/2020": [["MTH 306", "03/05/2020", "1100", "1220", "205 NSC"]],
		"03/06/2020": [["PHY 107", "03/06/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "03/06/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "03/06/2020", "1300", "1350", "121 Cooke"],
						["CSE 220 Lab", "03/06/2020", "1400", "1600", "340 Bell"]],
		"03/07/2020": [],
		"03/08/2020": [],
		"03/09/2020": [["PHY 107 Recitation", "03/09/2020", "0900", "0950", "219 Fronczak"],
						["PHY 107", "03/09/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "03/09/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "03/09/2020", "1300", "1350", "121 Cooke"]],
		"03/10/2020": [["MTH 306 Recitation", "03/10/2020", "0900", "0950", "214 O'Brian"],
						["MTH 306", "03/10/2020", "1100", "1220", "205 NSC"]],
		"03/11/2020": [["CSE 250 Recitation", "03/11/2020", "0900", "0950", "340 Bell"],
						["PHY 107", "03/11/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "03/11/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "03/11/2020", "1300", "1350", "121 Cooke"]],
		"03/12/2020": [["MTH 306", "03/12/2020", "1100", "1220", "205 NSC"]],
		"03/13/2020": [["PHY 107", "03/13/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "03/13/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "03/13/2020", "1300", "1350", "121 Cooke"],
						["CSE 220 Lab", "03/13/2020", "1400", "1600", "340 Bell"]],
		"03/14/2020": [],
		"03/15/2020": [],
		"03/16/2020": [["PHY 107 Recitation", "03/16/2020", "0900", "0950", "219 Fronczak"],
						["PHY 107", "03/16/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "03/16/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "03/16/2020", "1300", "1350", "121 Cooke"]],
		"03/17/2020": [["MTH 306 Recitation", "03/17/2020", "0900", "0950", "214 O'Brian"],
						["MTH 306", "03/17/2020", "1100", "1220", "205 NSC"]],
		"03/18/2020": [["CSE 250 Recitation", "03/18/2020", "0900", "0950", "340 Bell"],
						["PHY 107", "03/18/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "03/18/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "03/18/2020", "1300", "1350", "121 Cooke"],
						["PA2 livestream", "03/18/2020", "1300", "1400"]],
		"03/19/2020": [["MTH 306", "03/19/2020", "1100", "1220", "205 NSC"]],
		"03/20/2020": [["PHY 107", "03/20/2020", "1100", "1150", "201 NSC"],
						["CSE 250", "03/20/2020", "1200", "1250", "109 Knox"],
						["CSE 220", "03/20/2020", "1300", "1350", "121 Cooke"],
						["CSE 220 Lab", "03/20/2020", "1400", "1600", "340 Bell"]],
		"03/21/2020": [],
		"03/22/2020": [],
		"03/23/2020": [["PHY 107 Recitation", "03/23/2020", "0900", "0950", "219 Fronczak"],
						["PHY 107 Recitation", "03/23/2020", "0900", "0950", "<a href=\"https://ub.webex.com/ub/j.php?MTID=m081b9d33233fb3ade67613aa39e80e24\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["PHY 107", "03/23/2020", "1100", "1150", "201 NSC"],
						["PHY 107", "03/23/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "03/23/2020", "1200", "1250", "109 Knox"],
						["CSE 250", "03/23/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "03/23/2020", "1300", "1350", "121 Cooke"],
						["CSE 220", "03/23/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"]],
		"03/24/2020": [["MTH 306 Recitation", "03/24/2020", "0900", "0950", "214 O'Brian"],
						["MTH 306", "03/24/2020", "1100", "1220", "205 NSC"],
						["MTH 306 Exam", "03/24/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["LQ 220", "03/24/2020", "1500", "1600"]],
		"03/25/2020": [["CSE 250 Recitation", "03/25/2020", "0900", "0950", "340 Bell"],
						["PHY 107", "03/25/2020", "1100", "1150", "201 NSC"],
						["PHY 107", "03/25/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "03/25/2020", "1200", "1250", "109 Knox"],
						["CSE 250", "03/25/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "03/25/2020", "1300", "1350", "121 Cooke"],
						["CSE 220", "03/25/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"],
						["CSE 220", "03/25/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"]],
		"03/26/2020": [["MTH 306", "03/26/2020", "1100", "1220", "205 NSC"],
						["MTH 306", "03/26/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"03/27/2020": [["PHY 107", "03/27/2020", "1100", "1150", "201 NSC"],
						["PHY 107", "03/27/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "03/27/2020", "1200", "1250", "109 Knox"],
						["CSE 250", "03/27/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "03/27/2020", "1300", "1350", "121 Cooke"],
						["CSE 220", "03/27/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"],
						["CSE 220 Lab", "03/27/2020", "1400", "1600", "340 Bell"],
						["CSE 220 Lab", "03/27/2020", "1400", "1600", "<a href=\"https://buffalo.zoom.us/j/564548275\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"03/28/2020": [],
		"03/29/2020": [],
		"03/30/2020": [["PHY 107 Recitation", "03/30/2020", "0900", "0950", "<a href=\"https://ub.webex.com/ub/j.php?MTID=m081b9d33233fb3ade67613aa39e80e24\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["PHY 107", "03/30/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "03/30/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "03/30/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"]],
		"03/31/2020": [["MTH 306 Recitation", "03/31/2020", "0900", "0950", "214 O'Brian"],
						["MTH 306 Exam", "03/31/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"04/01/2020": [["CSE 250 Recitation", "04/01/2020", "0900", "0950", "340 Bell"],
						["CSE 250 Recitation", "04/01/2020", "0900", "0950", "<a href=\"https://buffalo.zoom.us/j/863933242\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["PHY 107", "04/01/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["Pay Rent", "04/01/2020", "1200", "1300"],
						["CSE 250", "04/01/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "04/01/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"],
						["Pay Rent", "04/01/2020", "1500", "1600", "<a href=\"https://connect.studenthousing.com/Account/LogOn?ReturnUrl=%2fAccount%2fMyAccount\" id=\"link\" onclick=\"link()\">Studenthousing</a>"]],
		"04/02/2020": [["MTH 306", "04/02/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"04/03/2020": [["PHY 107", "04/03/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "04/03/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "04/03/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"],
						["CSE 220 Lab", "04/03/2020", "1400", "1600", "<a href=\"https://buffalo.zoom.us/j/564548275\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"04/04/2020": [],
		"04/05/2020": [],
		"04/06/2020": [["PHY 107 Recitation", "04/06/2020", "0900", "0950", "<a href=\"https://ub.webex.com/ub/j.php?MTID=m081b9d33233fb3ade67613aa39e80e24\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["PHY 107", "04/06/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "04/06/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "04/06/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"]],
		"04/07/2020": [["MTH 306 Recitation", "04/07/2020", "0900", "0950", "214 O'Brian"],
						["MTH 306 Recitation", "04/07/2020", "0900", "0950", "<a href=\"https://buffalo.zoom.us/j/575501933\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 306 Exam", "04/07/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"04/08/2020": [["CSE 250 Recitation", "04/08/2020", "0900", "0950", "<a href=\"https://buffalo.zoom.us/j/863933242\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["PHY 107", "04/08/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "04/08/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "04/08/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"]],
		"04/09/2020": [["MTH 306", "04/09/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"04/10/2020": [["Enroll Appointment", "04/10/2020", "0700", "0800"],
						["PHY 107", "04/10/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "04/10/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "04/10/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"],
						["CSE 220 Lab", "04/10/2020", "1400", "1600", "<a href=\"https://buffalo.zoom.us/j/564548275\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"04/11/2020": [["OH PA4", "04/11/2020", "1700", "1830", "<a href=\"https://buffalo.zoom.us/j/453276833?pwd=UEJ5WnN6ckMvTmowNG9wT0ZlRk1rdz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"04/12/2020": [],
		"04/13/2020": [["PHY 107 Recitation", "04/13/2020", "0900", "0950", "<a href=\"https://ub.webex.com/ub/j.php?MTID=m081b9d33233fb3ade67613aa39e80e24\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["PHY 107", "04/13/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "04/13/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "04/13/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"]],
		"04/14/2020": [["MTH 306 Recitation", "04/14/2020", "0900", "0950", "214 O'Brian"],
						["MTH 306 Exam", "04/14/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"04/15/2020": [["CSE 250 Recitation", "04/15/2020", "0900", "0950", "<a href=\"https://buffalo.zoom.us/j/863933242\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["PHY 107", "04/15/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "04/15/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "04/15/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"]],
		"04/16/2020": [["MTH 306", "04/16/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"04/17/2020": [["PHY 107", "04/17/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "04/17/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "04/17/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"],
						["CSE 220 Lab", "04/17/2020", "1400", "1600", "<a href=\"https://buffalo.zoom.us/j/564548275\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220 Lab Exam", "04/17/2020", "1400", "1600", "<a href=\"https://buffalo.zoom.us/j/144870765?tk=B-oLIYb9aaPp5mSQdiZagaRI2kcBgQo6APBgkZHCrSw.DQEAAAAACKKNbRYtdFZNR0dQQVNTV05rWlhabk5nOERnAA&pwd=WUZTS01\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"04/18/2020": [["Physics Exam", "04/18/2020", "0900", "1100"]],
		"04/19/2020": [],
		"04/20/2020": [["PHY 107 Recitation", "04/20/2020", "0900", "0950", "<a href=\"https://ub.webex.com/ub/j.php?MTID=m081b9d33233fb3ade67613aa39e80e24\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["PHY 107", "04/20/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "04/20/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "04/20/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"]],
		"04/21/2020": [["MTH 306 Recitation", "04/21/2020", "0900", "0950", "214 O'Brian"],
						["MTH 306 Exam", "04/21/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"04/22/2020": [["CSE 250 Recitation", "04/22/2020", "0900", "0950", "<a href=\"https://buffalo.zoom.us/j/863933242\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["PHY 107", "04/22/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "04/22/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "04/22/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"]],
		"04/23/2020": [["MTH 306", "04/23/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"04/24/2020": [["PHY 107", "04/24/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "04/24/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "04/24/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"],
						["CSE 220 Lab", "04/24/2020", "1400", "1600", "<a href=\"https://buffalo.zoom.us/j/564548275\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"04/25/2020": [],
		"04/26/2020": [],
		"04/27/2020": [["PHY 107 Recitation", "04/27/2020", "0900", "0950", "<a href=\"https://ub.webex.com/ub/j.php?MTID=m081b9d33233fb3ade67613aa39e80e24\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["PHY 107", "04/27/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "04/27/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "04/27/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"]],
		"04/28/2020": [["MTH 306 Recitation", "04/28/2020", "0900", "0950", "214 O'Brian"],
						["MTH 306 Exam", "04/28/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 306 Exam", "04/28/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"04/29/2020": [["CSE 250 Recitation", "04/29/2020", "0900", "0950", "<a href=\"https://buffalo.zoom.us/j/863933242\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["PHY 107", "04/29/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "04/29/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "04/29/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"]],
		"04/30/2020": [["MTH 306", "04/30/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"05/01/2020": [["PHY 107", "05/01/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "05/01/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "05/01/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"],
						["CSE 220 Lab", "05/01/2020", "1400", "1600", "<a href=\"https://buffalo.zoom.us/j/564548275\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Pay Rent", "05/01/2020", "1500", "1600", "<a href=\"https://connect.studenthousing.com/Account/LogOn?ReturnUrl=%2fAccount%2fMyAccount\" id=\"link\" onclick=\"link()\">Studenthousing</a>"]],
		"05/02/2020": [],
		"05/03/2020": [],
		"05/04/2020": [["PHY 107 Recitation", "05/04/2020", "0900", "0950", "<a href=\"https://ub.webex.com/ub/j.php?MTID=m081b9d33233fb3ade67613aa39e80e24\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["PHY 107 Recitation", "05/04/2020", "0900", "0950", "<a href=\"https://ub.webex.com/ub/j.php?MTID=m081b9d33233fb3ade67613aa39e80e24\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["PHY 107", "05/04/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["PHY 107", "05/04/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "05/04/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 250", "05/04/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "05/04/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"],
						["CSE 220", "05/04/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"]],
		"05/05/2020": [["MTH 306 Recitation", "05/05/2020", "0900", "0950", "214 O'Brian"],
						["MTH 306 Exam", "05/05/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 306", "05/05/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"05/06/2020": [["CSE 250 Recitation", "05/06/2020", "0900", "0950", "<a href=\"https://buffalo.zoom.us/j/863933242\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 250 Recitation", "05/06/2020", "0900", "0950", "<a href=\"https://buffalo.zoom.us/j/863933242\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["PHY 107", "05/06/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["PHY 107", "05/06/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "05/06/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 250", "05/06/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "05/06/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"],
						["CSE 220", "05/06/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"]],
		"05/07/2020": [["MTH 306", "05/07/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 306", "05/07/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"05/08/2020": [["PHY 107", "05/08/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["PHY 107", "05/08/2020", "1100", "1150", "<a href=\"https://ub.webex.com/ub/j.php?MTID=mb75061425ece7db8e0bc6a85ee92f843\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["CSE 250", "05/08/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 250", "05/08/2020", "1200", "1250", "<a href=\"https://buffalo.zoom.us/j/937462120\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220", "05/08/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"],
						["CSE 220", "05/08/2020", "1300", "1350", "<a href=\"https://www.youtube.com/playlist?list=PLwZsM9NibX3-aYE4xwA22DY6nCq8mNO7V\" id=\"link\" onclick=\"link()\">Youtube</a>"],
						["CSE 220 Lab", "05/08/2020", "1400", "1600", "<a href=\"https://buffalo.zoom.us/j/564548275\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CSE 220 Lab Exam", "05/08/2020", "1400", "1600", "<a href=\"https://buffalo.zoom.us/w/97077700711?tk=yvsLdIOYOjQ33V9LDQLImId34n6Aw5sFDCVUI_Qrnyo.DQIAAAAWmkgoZxZWQzB0d2dKN1FUeVV6M2JMMHFKQ2lnAAAAAAAAAAAA\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"05/09/2020": [],
		"05/10/2020": [],
		"05/11/2020": [],
		"05/12/2020": [["PHY 107 Final", "05/12/2020", "0800", "1100", "Unknown"],
						["MTH 306 Exam", "05/12/2020", "1100", "1220", "<a href=\"https://zoom.us/j/482302189\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 306 Final", "05/12/2020", "1145", "1445", "218 NSC"]],
		"05/13/2020": [["CSE 250 Final", "05/13/2020", "1145", "1445", "20 Knox"],
						["CSE 220 Final", "05/13/2020", "1915", "2215", "Cooke 121"]],
		"05/14/2020": [],
		"05/15/2020": [],
		"05/16/2020": [],
		"05/17/2020": [],
		"05/18/2020": [],
		"05/19/2020": [],
		"05/20/2020": [],
		"05/21/2020": [],
		"05/22/2020": [],
		"05/23/2020": [],
		"05/24/2020": [],
		"05/25/2020": [],
		"05/26/2020": [],
		"05/27/2020": [],
		"05/28/2020": [],
		"05/29/2020": [],
		"05/30/2020": [],
		"05/31/2020": [],
		"06/01/2020": [["Pay Rent", "06/01/2020", "1500", "1600", "<a href=\"https://connect.studenthousing.com/Account/LogOn?ReturnUrl=%2fAccount%2fMyAccount\" id=\"link\" onclick=\"link()\">Studenthousing</a>"]],
		"06/02/2020": [],
		"06/03/2020": [["Appointment ", "06/03/2020", "0900", "1300"]],
		"06/04/2020": [],
		"06/05/2020": [],
		"06/06/2020": [],
		"06/07/2020": [],
		"06/08/2020": [],
		"06/09/2020": [],
		"06/10/2020": [],
		"06/11/2020": [],
		"06/12/2020": [],
		"06/13/2020": [],
		"06/14/2020": [],
		"06/15/2020": [],
		"06/16/2020": [],
		"06/17/2020": [],
		"06/18/2020": [],
		"06/19/2020": [],
		"06/20/2020": [],
		"06/21/2020": [],
		"06/22/2020": [],
		"06/23/2020": [],
		"06/24/2020": [],
		"06/25/2020": [],
		"06/26/2020": [],
		"06/27/2020": [],
		"06/28/2020": [],
		"06/29/2020": [],
		"06/30/2020": [],
		"07/01/2020": [["Pay Rent", "07/01/2020", "1500", "1600", "<a href=\"https://connect.studenthousing.com/Account/LogOn?ReturnUrl=%2fAccount%2fMyAccount\" id=\"link\" onclick=\"link()\">Studenthousing</a>"]],
		"07/02/2020": [],
		"07/03/2020": [],
		"07/04/2020": [],
		"07/05/2020": [],
		"07/06/2020": [],
		"07/07/2020": [],
		"07/08/2020": [],
		"07/09/2020": [],
		"07/10/2020": [],
		"07/11/2020": [],
		"07/12/2020": [],
		"07/13/2020": [],
		"07/14/2020": [],
		"07/15/2020": [],
		"07/16/2020": [],
		"07/17/2020": [],
		"07/18/2020": [],
		"07/19/2020": [],
		"07/20/2020": [],
		"07/21/2020": [["Sauberman ", "07/21/2020", "1330", "1430"]],
		"07/22/2020": [],
		"07/23/2020": [],
		"07/24/2020": [],
		"07/25/2020": [],
		"07/26/2020": [],
		"07/27/2020": [],
		"07/28/2020": [],
		"07/29/2020": [],
		"07/30/2020": [],
		"07/31/2020": [],
		"08/01/2020": [["Pay Rent", "08/01/2020", "ALL_DAY", "<a href=\"https://mycommunity.americancampus.com/s/\" id=\"link\" onclick=\"link()\">Americancampus</a>"],
						["Car Inspection", "08/01/2020", "1700", "1800"]],
		"08/02/2020": [],
		"08/03/2020": [],
		"08/04/2020": [],
		"08/05/2020": [],
		"08/06/2020": [],
		"08/07/2020": [],
		"08/08/2020": [],
		"08/09/2020": [],
		"08/10/2020": [],
		"08/11/2020": [],
		"08/12/2020": [],
		"08/13/2020": [],
		"08/14/2020": [],
		"08/15/2020": [],
		"08/16/2020": [],
		"08/17/2020": [["Car Inspection", "08/17/2020", "ALL_DAY"]],
		"08/18/2020": [],
		"08/19/2020": [["Hair Cut", "08/19/2020", "1300", "1530"]],
		"08/20/2020": [],
		"08/21/2020": [],
		"08/22/2020": [],
		"08/23/2020": [],
		"08/24/2020": [],
		"08/25/2020": [],
		"08/26/2020": [],
		"08/27/2020": [],
		"08/28/2020": [],
		"08/29/2020": [],
		"08/30/2020": [],
		"08/31/2020": [["Physics Recitation", "08/31/2020", "1130", "1220", "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "08/31/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/01/2020": [["Pay Rent", "09/01/2020", "ALL_DAY", "<a href=\"https://mycommunity.americancampus.com/s/\" id=\"link\" onclick=\"link()\">Americancampus</a>"],
						["CSE 341", "09/01/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Phy 108", "09/01/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/02/2020": [["CS Recitation", "09/02/2020", "0910", "1000", "<a href=\"https://buffalo.zoom.us/j/4363954070?pwd=bVZhV1R2WXBVYzNmSDA4RlJXZ21Tdz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "09/02/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Math Recitation", "09/02/2020", "1350", "1440", "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/03/2020": [["CSE 341", "09/03/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Phy 108", "09/03/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/04/2020": [["Physics Lab", "09/04/2020", "0910", "1200", "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["MTH 309", "09/04/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/05/2020": [],
		"09/06/2020": [],
		"09/07/2020": [["Physics Recitation", "09/07/2020", "1130", "1220", "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "09/07/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/08/2020": [["CSE 341", "09/08/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Phy 108", "09/08/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/09/2020": [["CS Recitation", "09/09/2020", "0910", "1000", "<a href=\"https://buffalo.zoom.us/j/4363954070?pwd=bVZhV1R2WXBVYzNmSDA4RlJXZ21Tdz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "09/09/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Math Recitation", "09/09/2020", "1350", "1440", "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/10/2020": [["CSE 341", "09/10/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Phy 108", "09/10/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/11/2020": [["Physics Lab", "09/11/2020", "0910", "1200", "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["MTH 309", "09/11/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/12/2020": [["Physics Quiz", "09/12/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"]],
		"09/13/2020": [],
		"09/14/2020": [["Math Due", "09/14/2020", "TODO", "<a href=\"https://learning.buffalo.edu/courses/course-v1:UBx+MTH309+2020_Fall_Li/course/\" id=\"link\" onclick=\"link()\">Learning</a>"],
						["Physics Recitation", "09/14/2020", "1130", "1220", "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "09/14/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/15/2020": [["Electricity", "09/15/2020", "ALL_DAY", "<a href=\"https://www.nationalgridus.com/Upstate-NY-Home/Billing-Payments/Ways-to-Pay\" id=\"link\" onclick=\"link()\">Nationalgridus</a>"],
						["CSE 341", "09/15/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Phy 108", "09/15/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/16/2020": [["Physics Due", "09/16/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["CS Recitation", "09/16/2020", "0910", "1000", "<a href=\"https://buffalo.zoom.us/j/4363954070?pwd=bVZhV1R2WXBVYzNmSDA4RlJXZ21Tdz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "09/16/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Math Recitation", "09/16/2020", "1350", "1440", "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/17/2020": [["CS Due", "09/17/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"],
						["Lab Due", "09/17/2020", "TODO", "<a href=\"https://mail.google.com/mail/u/1/?view=cm&source=mailto&to=muyehe@buffalo.edu\" id=\"link\" onclick=\"link()\">Mail</a>"],
						["CSE 341", "09/17/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Phy 108", "09/17/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/18/2020": [["Physics Lab", "09/18/2020", "0910", "1200", "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["MTH 309", "09/18/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/19/2020": [["Physics Quiz", "09/19/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"]],
		"09/20/2020": [["Physic Pre-Lecture", "09/20/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["Physics Homework", "09/20/2020", "1000", "1200", "Work"],
						["Physics Notes", "09/20/2020", "1500", "1730", "Work"],
						["Physics Recitation Video", "09/20/2020", "1930", "2100", "Work"]],
		"09/21/2020": [["Math Due", "09/21/2020", "TODO", "<a href=\"https://learning.buffalo.edu/courses/course-v1:UBx+MTH309+2020_Fall_Li/course/\" id=\"link\" onclick=\"link()\">Learning</a>"],
						["Physics Recitation", "09/21/2020", "1130", "1220", "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "09/21/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Finish Math Homework", "09/21/2020", "1900", "2130", "Work"]],
		"09/22/2020": [["Homework", "09/22/2020", "1000", "1130", "Work"],
						["CSE 341", "09/22/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Finish Physics Homework", "09/22/2020", "1830", "2030", "Work"],
						["Phy 108", "09/22/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/23/2020": [["Physics Due", "09/23/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["CS Recitation", "09/23/2020", "0910", "1000", "<a href=\"https://buffalo.zoom.us/j/4363954070?pwd=bVZhV1R2WXBVYzNmSDA4RlJXZ21Tdz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "09/23/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Math Recitation", "09/23/2020", "1350", "1440", "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Physics Homework", "09/23/2020", "1530", "1700", "Work"]],
		"09/24/2020": [["Lab Due", "09/24/2020", "TODO", "<a href=\"https://mail.google.com/mail/u/1/?view=cm&source=mailto&to=muyehe@buffalo.edu\" id=\"link\" onclick=\"link()\">Mail</a>"],
						["Homework", "09/24/2020", "0930", "1130", "Work"],
						["CSE 341", "09/24/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CS Homework", "09/24/2020", "1500", "1730", "Work"],
						["Phy 108", "09/24/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/25/2020": [["Physics Lab", "09/25/2020", "0910", "1200", "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["MTH 309", "09/25/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "09/25/2020", "1430", "1700", "Work"],
						["Math Homework", "09/25/2020", "1900", "2200", "Work"]],
		"09/26/2020": [["Physics Quiz", "09/26/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"],
						["Physics Lab", "09/26/2020", "1000", "1400", "Work"],
						["Math Homework", "09/26/2020", "1900", "2100", "Work"]],
		"09/27/2020": [["Study Physics", "09/27/2020", "TODO"],
						["Physic Pre-Lecture", "09/27/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["Physics Homework", "09/27/2020", "1000", "1200", "Work"],
						["Physics Notes", "09/27/2020", "1500", "1730", "Work"],
						["Physics Recitation Video", "09/27/2020", "1930", "2100", "Work"]],
		"09/28/2020": [["Study Physics", "09/28/2020", "TODO"],
						["Math Due", "09/28/2020", "TODO", "<a href=\"https://learning.buffalo.edu/courses/course-v1:UBx+MTH309+2020_Fall_Li/course/\" id=\"link\" onclick=\"link()\">Learning</a>"],
						["Physics Recitation", "09/28/2020", "1130", "1220", "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "09/28/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CS Homework", "09/28/2020", "1400", "1530", "Work"],
						["CS Club Fair", "09/28/2020", "1800", "1900", "<a href=\"https://www.bit.ly/SABCLUBS.\" id=\"link\" onclick=\"link()\">Bit</a>"],
						["Finish Math Homework", "09/28/2020", "1900", "2130", "Work"]],
		"09/29/2020": [["Study Physics", "09/29/2020", "TODO"],
						["Homework", "09/29/2020", "1000", "1130", "Work"],
						["CSE 341", "09/29/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "09/29/2020", "1500", "1700", "Work"],
						["Finish Physics Homework", "09/29/2020", "1830", "2030", "Work"],
						["Phy 108", "09/29/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"09/30/2020": [["Study Physics", "09/30/2020", "TODO"],
						["Physics Due", "09/30/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["CS Recitation", "09/30/2020", "0910", "1000", "<a href=\"https://buffalo.zoom.us/j/4363954070?pwd=bVZhV1R2WXBVYzNmSDA4RlJXZ21Tdz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "09/30/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Math Recitation", "09/30/2020", "1350", "1440", "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Physics Homework", "09/30/2020", "1530", "1700", "Work"]],
		"10/01/2020": [["CS Due", "10/01/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"],
						["Study Physics", "10/01/2020", "TODO"],
						["Lab Due", "10/01/2020", "TODO", "<a href=\"https://mail.google.com/mail/u/1/?view=cm&source=mailto&to=muyehe@buffalo.edu\" id=\"link\" onclick=\"link()\">Mail</a>"],
						["Pay Rent", "10/01/2020", "ALL_DAY", "<a href=\"https://mycommunity.americancampus.com/s/\" id=\"link\" onclick=\"link()\">Americancampus</a>"],
						["Homework", "10/01/2020", "0930", "1130", "Work"],
						["CSE 341", "10/01/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CS Homework", "10/01/2020", "1500", "1730", "Work"],
						["Phy 108", "10/01/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"10/02/2020": [["Study Physics", "10/02/2020", "TODO"],
						["Physics Lab", "10/02/2020", "0910", "1200", "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["MTH 309", "10/02/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "10/02/2020", "1430", "1700", "Work"],
						["Math Homework", "10/02/2020", "1900", "2200", "Work"]],
		"10/03/2020": [["Physics Quiz", "10/03/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"],
						["Physics Exam", "10/03/2020", "ALL_DAY", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"],
						["Physics Lab", "10/03/2020", "1000", "1400", "Work"],
						["Physics Exam", "10/03/2020", "1430", "1730", "<a href=\"https://buffalo.zoom.us/meeting/register/tJIuceiprDwtGNEegXXyshOJMKbPDW1BMant\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Math Homework", "10/03/2020", "1900", "2100", "Work"]],
		"10/04/2020": [["Physics Recitation Quiz", "10/04/2020", "TODO"],
						["Physic Pre-Lecture", "10/04/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["Physics Homework", "10/04/2020", "1000", "1200", "Work"],
						["Physics Notes", "10/04/2020", "1500", "1730", "Work"],
						["Physics Recitation Video", "10/04/2020", "1930", "2100", "Work"]],
		"10/05/2020": [["Math Due", "10/05/2020", "TODO", "<a href=\"https://learning.buffalo.edu/courses/course-v1:UBx+MTH309+2020_Fall_Li/course/\" id=\"link\" onclick=\"link()\">Learning</a>"],
						["Physics Recitation", "10/05/2020", "1130", "1220", "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "10/05/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Finish Math Homework", "10/05/2020", "1900", "2130", "Work"]],
		"10/06/2020": [["Zybooks Chapter 2", "10/06/2020", "TODO", "<a href=\"https://learn.zybooks.com/zybook/BUFFALOCSE341JinFall2020\" id=\"link\" onclick=\"link()\">Zybooks</a>"],
						["Homework", "10/06/2020", "1000", "1130", "Work"],
						["CSE 341", "10/06/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "10/06/2020", "1500", "1700", "Work"],
						["Finish Physics Homework", "10/06/2020", "1830", "2030", "Work"],
						["Phy 108", "10/06/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"10/07/2020": [["Physics Due", "10/07/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["CS Recitation", "10/07/2020", "0910", "1000", "<a href=\"https://buffalo.zoom.us/j/4363954070?pwd=bVZhV1R2WXBVYzNmSDA4RlJXZ21Tdz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "10/07/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Math Recitation", "10/07/2020", "1350", "1440", "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Physics Homework", "10/07/2020", "1530", "1700", "Work"]],
		"10/08/2020": [["Lab Due", "10/08/2020", "TODO", "<a href=\"https://mail.google.com/mail/u/1/?view=cm&source=mailto&to=muyehe@buffalo.edu\" id=\"link\" onclick=\"link()\">Mail</a>"],
						["Homework", "10/08/2020", "0930", "1130", "Work"],
						["CSE 341", "10/08/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CS Homework", "10/08/2020", "1500", "1730", "Work"],
						["Phy 108", "10/08/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"10/09/2020": [["Math Midterm", "10/09/2020", "ALL_DAY", "<a href=\"https://buffalo.zoom.us/j/97390239994?pwd=SE52VFZhcjJ3Nk52SXFTdHVwYWpCZz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Physics Lab", "10/09/2020", "0910", "1200", "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["MTH 309", "10/09/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "10/09/2020", "1430", "1700", "Work"],
						["Math Homework", "10/09/2020", "1900", "2200", "Work"]],
		"10/10/2020": [["Physics Quiz", "10/10/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"],
						["Physics Lab", "10/10/2020", "1000", "1400", "Work"],
						["Math Homework", "10/10/2020", "1900", "2100", "Work"]],
		"10/11/2020": [["Physic Pre-Lecture", "10/11/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["Physics Homework", "10/11/2020", "1000", "1200", "Work"],
						["Physics Notes", "10/11/2020", "1500", "1730", "Work"],
						["Physics Recitation Video", "10/11/2020", "1930", "2100", "Work"]],
		"10/12/2020": [["Math Due", "10/12/2020", "TODO", "<a href=\"https://learning.buffalo.edu/courses/course-v1:UBx+MTH309+2020_Fall_Li/course/\" id=\"link\" onclick=\"link()\">Learning</a>"],
						["Physics Recitation", "10/12/2020", "1130", "1220", "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "10/12/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Finish Math Homework", "10/12/2020", "1900", "2130", "Work"]],
		"10/13/2020": [["Homework", "10/13/2020", "1000", "1130", "Work"],
						["CSE 341", "10/13/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "10/13/2020", "1500", "1700", "Work"],
						["Finish Physics Homework", "10/13/2020", "1830", "2030", "Work"],
						["Phy 108", "10/13/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"10/14/2020": [["Physics Due", "10/14/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["CS Recitation", "10/14/2020", "0910", "1000", "<a href=\"https://buffalo.zoom.us/j/4363954070?pwd=bVZhV1R2WXBVYzNmSDA4RlJXZ21Tdz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "10/14/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Math Recitation", "10/14/2020", "1350", "1440", "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Physics Homework", "10/14/2020", "1530", "1700", "Work"]],
		"10/15/2020": [["CS Due", "10/15/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"],
						["Lab Due", "10/15/2020", "TODO", "<a href=\"https://mail.google.com/mail/u/1/?view=cm&source=mailto&to=muyehe@buffalo.edu\" id=\"link\" onclick=\"link()\">Mail</a>"],
						["Electricity", "10/15/2020", "ALL_DAY", "<a href=\"https://www.nationalgridus.com/Upstate-NY-Home/Billing-Payments/Ways-to-Pay\" id=\"link\" onclick=\"link()\">Nationalgridus</a>"],
						["Homework", "10/15/2020", "0930", "1130", "Work"],
						["Physics Homework", "10/15/2020", "1000", "1130", "Work"],
						["CSE 341", "10/15/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CS Homework", "10/15/2020", "1500", "1730", "Work"],
						["Phy 108", "10/15/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"10/16/2020": [["Physics Lab", "10/16/2020", "0910", "1200", "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["MTH 309", "10/16/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "10/16/2020", "1430", "1700", "Work"],
						["Math Homework", "10/16/2020", "1900", "2200", "Work"]],
		"10/17/2020": [["Physics Quiz", "10/17/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"],
						["Physics Lab", "10/17/2020", "1000", "1400", "Work"],
						["Math Homework", "10/17/2020", "1900", "2100", "Work"]],
		"10/18/2020": [["Physic Pre-Lecture", "10/18/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["Physics Homework", "10/18/2020", "1000", "1200", "Work"],
						["Physics Notes", "10/18/2020", "1500", "1730", "Work"],
						["Physics Recitation Video", "10/18/2020", "1930", "2100", "Work"]],
		"10/19/2020": [["Math Due", "10/19/2020", "TODO", "<a href=\"https://learning.buffalo.edu/courses/course-v1:UBx+MTH309+2020_Fall_Li/course/\" id=\"link\" onclick=\"link()\">Learning</a>"],
						["Physics Recitation", "10/19/2020", "1130", "1220", "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "10/19/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Finish Math Homework", "10/19/2020", "1900", "2130", "Work"]],
		"10/20/2020": [["Homework", "10/20/2020", "1000", "1130", "Work"],
						["CSE 341", "10/20/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "10/20/2020", "1500", "1700", "Work"],
						["Finish Physics Homework", "10/20/2020", "1830", "2030", "Work"],
						["Phy 108", "10/20/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"10/21/2020": [["Physics Due", "10/21/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["CS Recitation", "10/21/2020", "0910", "1000", "<a href=\"https://buffalo.zoom.us/j/4363954070?pwd=bVZhV1R2WXBVYzNmSDA4RlJXZ21Tdz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "10/21/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Math Recitation", "10/21/2020", "1350", "1440", "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Physics Homework", "10/21/2020", "1530", "1700", "Work"]],
		"10/22/2020": [["Lab Due", "10/22/2020", "TODO", "<a href=\"https://mail.google.com/mail/u/1/?view=cm&source=mailto&to=muyehe@buffalo.edu\" id=\"link\" onclick=\"link()\">Mail</a>"],
						["CS 341 Midterm", "10/22/2020", "ALL_DAY"],
						["Homework", "10/22/2020", "0930", "1130", "Work"],
						["CSE 341", "10/22/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CS Homework", "10/22/2020", "1500", "1730", "Work"],
						["Phy 108", "10/22/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"10/23/2020": [["Physics Lab", "10/23/2020", "0910", "1200", "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["MTH 309", "10/23/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "10/23/2020", "1430", "1700", "Work"],
						["Math Homework", "10/23/2020", "1900", "2200", "Work"]],
		"10/24/2020": [["Physics Quiz", "10/24/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"],
						["Physics Lab", "10/24/2020", "1000", "1400", "Work"],
						["Math Homework", "10/24/2020", "1900", "2100", "Work"]],
		"10/25/2020": [["Physic Pre-Lecture", "10/25/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["Physics Homework", "10/25/2020", "1000", "1200", "Work"],
						["Physics Notes", "10/25/2020", "1500", "1730", "Work"],
						["Physics Recitation Video", "10/25/2020", "1930", "2100", "Work"]],
		"10/26/2020": [["Math Due", "10/26/2020", "TODO", "<a href=\"https://learning.buffalo.edu/courses/course-v1:UBx+MTH309+2020_Fall_Li/course/\" id=\"link\" onclick=\"link()\">Learning</a>"],
						["Physics Recitation", "10/26/2020", "1130", "1220", "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "10/26/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Finish Math Homework", "10/26/2020", "1900", "2130", "Work"]],
		"10/27/2020": [["Homework", "10/27/2020", "1000", "1130", "Work"],
						["CSE 341", "10/27/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "10/27/2020", "1500", "1700", "Work"],
						["Finish Physics Homework", "10/27/2020", "1830", "2030", "Work"],
						["Phy 108", "10/27/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"10/28/2020": [["Physics Due", "10/28/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["CS Recitation", "10/28/2020", "0910", "1000", "<a href=\"https://buffalo.zoom.us/j/4363954070?pwd=bVZhV1R2WXBVYzNmSDA4RlJXZ21Tdz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "10/28/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Math Recitation", "10/28/2020", "1350", "1440", "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Physics Homework", "10/28/2020", "1530", "1700", "Work"]],
		"10/29/2020": [["Lab Due", "10/29/2020", "TODO", "<a href=\"https://mail.google.com/mail/u/1/?view=cm&source=mailto&to=muyehe@buffalo.edu\" id=\"link\" onclick=\"link()\">Mail</a>"],
						["Homework", "10/29/2020", "0930", "1130", "Work"],
						["CSE 341", "10/29/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CS Homework", "10/29/2020", "1500", "1730", "Work"],
						["Phy 108", "10/29/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"10/30/2020": [["Physics Lab", "10/30/2020", "0910", "1200", "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["MTH 309", "10/30/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "10/30/2020", "1430", "1700", "Work"],
						["Math Homework", "10/30/2020", "1900", "2200", "Work"]],
		"10/31/2020": [["Physics Quiz", "10/31/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"],
						["Physics Lab", "10/31/2020", "1000", "1400", "Work"],
						["Math Homework", "10/31/2020", "1900", "2100", "Work"]],
		"11/01/2020": [["Physic Pre-Lecture", "11/01/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["Pay Rent", "11/01/2020", "ALL_DAY", "<a href=\"https://mycommunity.americancampus.com/s/\" id=\"link\" onclick=\"link()\">Americancampus</a>"],
						["Registration Flow Sheet", "11/01/2020", "ALL_DAY", "<a href=\"https://academics.eng.buffalo.edu/academics/flowsheet/\" id=\"link\" onclick=\"link()\">Eng</a>"],
						["Change board", "11/01/2020", "0900", "0905"],
						["Physics Homework", "11/01/2020", "1000", "1200", "Work"],
						["Physics Notes", "11/01/2020", "1500", "1730", "Work"],
						["Physics Recitation Video", "11/01/2020", "1930", "2100", "Work"]],
		"11/02/2020": [["Math Due", "11/02/2020", "TODO", "<a href=\"https://learning.buffalo.edu/courses/course-v1:UBx+MTH309+2020_Fall_Li/course/\" id=\"link\" onclick=\"link()\">Learning</a>"],
						["Unplug Board", "11/02/2020", "0900", "0905"],
						["Physics Recitation", "11/02/2020", "1130", "1220", "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "11/02/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Finish Math Homework", "11/02/2020", "1900", "2130", "Work"]],
		"11/03/2020": [["Homework", "11/03/2020", "1000", "1130", "Work"],
						["CSE 341", "11/03/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "11/03/2020", "1500", "1700", "Work"],
						["Finish Physics Homework", "11/03/2020", "1830", "2030", "Work"],
						["Phy 108", "11/03/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"11/04/2020": [["Physics Due", "11/04/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["CS Recitation", "11/04/2020", "0910", "1000", "<a href=\"https://buffalo.zoom.us/j/4363954070?pwd=bVZhV1R2WXBVYzNmSDA4RlJXZ21Tdz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "11/04/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Math Recitation", "11/04/2020", "1350", "1440", "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Physics Homework", "11/04/2020", "1530", "1700", "Work"]],
		"11/05/2020": [["Lab Due", "11/05/2020", "TODO", "<a href=\"https://mail.google.com/mail/u/1/?view=cm&source=mailto&to=muyehe@buffalo.edu\" id=\"link\" onclick=\"link()\">Mail</a>"],
						["Homework", "11/05/2020", "0930", "1130", "Work"],
						["CSE 341", "11/05/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CS Homework", "11/05/2020", "1500", "1730", "Work"],
						["Phy 108", "11/05/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"11/06/2020": [["Physics Lab", "11/06/2020", "0910", "1200", "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["MTH 309", "11/06/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "11/06/2020", "1430", "1700", "Work"],
						["Math Homework", "11/06/2020", "1900", "2200", "Work"]],
		"11/07/2020": [["Physics Quiz", "11/07/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"],
						["Physics Lab", "11/07/2020", "1000", "1400", "Work"],
						["Math Homework", "11/07/2020", "1900", "2100", "Work"]],
		"11/08/2020": [["Physic Pre-Lecture", "11/08/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["Physics Homework", "11/08/2020", "1000", "1200", "Work"],
						["Physics Notes", "11/08/2020", "1500", "1730", "Work"],
						["Physics Recitation Video", "11/08/2020", "1930", "2100", "Work"]],
		"11/09/2020": [["Math Due", "11/09/2020", "TODO", "<a href=\"https://learning.buffalo.edu/courses/course-v1:UBx+MTH309+2020_Fall_Li/course/\" id=\"link\" onclick=\"link()\">Learning</a>"],
						["Physics Recitation", "11/09/2020", "1130", "1220", "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "11/09/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Finish Math Homework", "11/09/2020", "1900", "2130", "Work"]],
		"11/10/2020": [["Homework", "11/10/2020", "1000", "1130", "Work"],
						["CSE 341", "11/10/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "11/10/2020", "1500", "1700", "Work"],
						["Finish Physics Homework", "11/10/2020", "1830", "2030", "Work"],
						["Phy 108", "11/10/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"11/11/2020": [["Physics Due", "11/11/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["CS Recitation", "11/11/2020", "0910", "1000", "<a href=\"https://buffalo.zoom.us/j/4363954070?pwd=bVZhV1R2WXBVYzNmSDA4RlJXZ21Tdz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "11/11/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Math Recitation", "11/11/2020", "1350", "1440", "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Physics Homework", "11/11/2020", "1530", "1700", "Work"]],
		"11/12/2020": [["CS Due", "11/12/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"],
						["Lab Due", "11/12/2020", "TODO", "<a href=\"https://mail.google.com/mail/u/1/?view=cm&source=mailto&to=muyehe@buffalo.edu\" id=\"link\" onclick=\"link()\">Mail</a>"],
						["Homework", "11/12/2020", "0930", "1130", "Work"],
						["CSE 341", "11/12/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CS Homework", "11/12/2020", "1500", "1730", "Work"],
						["Phy 108", "11/12/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"11/13/2020": [["Math Midterm", "11/13/2020", "ALL_DAY", "<a href=\"https://buffalo.zoom.us/j/91388664396\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Physics Lab", "11/13/2020", "0910", "1200", "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["MTH 309", "11/13/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "11/13/2020", "1430", "1700", "Work"],
						["Math Homework", "11/13/2020", "1900", "2200", "Work"]],
		"11/14/2020": [["Physics Quiz", "11/14/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"],
						["Physics Lab", "11/14/2020", "1000", "1400", "Work"],
						["Math Homework", "11/14/2020", "1900", "2100", "Work"]],
		"11/15/2020": [["Physic Pre-Lecture", "11/15/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["Electricity", "11/15/2020", "ALL_DAY", "<a href=\"https://www.nationalgridus.com/Upstate-NY-Home/Billing-Payments/Ways-to-Pay\" id=\"link\" onclick=\"link()\">Nationalgridus</a>"],
						["Physics Homework", "11/15/2020", "1000", "1200", "Work"],
						["Physics Notes", "11/15/2020", "1500", "1730", "Work"],
						["Physics Recitation Video", "11/15/2020", "1930", "2100", "Work"]],
		"11/16/2020": [["Math Due", "11/16/2020", "TODO", "<a href=\"https://learning.buffalo.edu/courses/course-v1:UBx+MTH309+2020_Fall_Li/course/\" id=\"link\" onclick=\"link()\">Learning</a>"],
						["Physics Recitation", "11/16/2020", "1130", "1220", "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "11/16/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Finish Math Homework", "11/16/2020", "1900", "2130", "Work"]],
		"11/17/2020": [["Homework", "11/17/2020", "1000", "1130", "Work"],
						["CSE 341", "11/17/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "11/17/2020", "1500", "1700", "Work"],
						["Finish Physics Homework", "11/17/2020", "1830", "2030", "Work"],
						["Phy 108", "11/17/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"11/18/2020": [["Physics Due", "11/18/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["CS Recitation", "11/18/2020", "0910", "1000", "<a href=\"https://buffalo.zoom.us/j/4363954070?pwd=bVZhV1R2WXBVYzNmSDA4RlJXZ21Tdz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "11/18/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Math Recitation", "11/18/2020", "1350", "1440", "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Physics Homework", "11/18/2020", "1530", "1700", "Work"]],
		"11/19/2020": [["Lab Due", "11/19/2020", "TODO", "<a href=\"https://mail.google.com/mail/u/1/?view=cm&source=mailto&to=muyehe@buffalo.edu\" id=\"link\" onclick=\"link()\">Mail</a>"],
						["Homework", "11/19/2020", "0930", "1130", "Work"],
						["CSE 341", "11/19/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["CS Homework", "11/19/2020", "1500", "1730", "Work"],
						["Phy 108", "11/19/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"11/20/2020": [["Physics Lab", "11/20/2020", "0910", "1200", "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["Physics Lab", "11/20/2020", "0910", "1200"],
						["MTH 309", "11/20/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "11/20/2020", "1430", "1700", "Work"],
						["Math Homework", "11/20/2020", "1900", "2200", "Work"]],
		"11/21/2020": [["Physics Quiz", "11/21/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"],
						["Physics Lab", "11/21/2020", "1000", "1400", "Work"],
						["Math Homework", "11/21/2020", "1900", "2100", "Work"]],
		"11/22/2020": [["Physic Pre-Lecture", "11/22/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["Physics Homework", "11/22/2020", "1000", "1200", "Work"],
						["Physics Notes", "11/22/2020", "1500", "1730", "Work"],
						["Physics Recitation Video", "11/22/2020", "1930", "2100", "Work"]],
		"11/23/2020": [["Math Due", "11/23/2020", "TODO", "<a href=\"https://learning.buffalo.edu/courses/course-v1:UBx+MTH309+2020_Fall_Li/course/\" id=\"link\" onclick=\"link()\">Learning</a>"],
						["Physics Recitation", "11/23/2020", "1130", "1220", "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "11/23/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Finish Math Homework", "11/23/2020", "1900", "2130", "Work"]],
		"11/24/2020": [["Homework", "11/24/2020", "1000", "1130", "Work"],
						["CSE 341", "11/24/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Homework", "11/24/2020", "1500", "1700", "Work"],
						["Finish Physics Homework", "11/24/2020", "1830", "2030", "Work"],
						["Phy 108", "11/24/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/j/96361127725?pwd=MmpKT1NuMHk4MlpnV1ZJbFFBbXE3dz09\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"11/25/2020": [["Physics Due", "11/25/2020", "TODO", "<a href=\"https://www.wileyplus.com/WileyCDA/Section/id-WILEYPLUS_LOGIN.html\" id=\"link\" onclick=\"link()\">Wileyplus</a>"],
						["Physics Homework", "11/25/2020", "1530", "1700", "Work"]],
		"11/26/2020": [["CS Homework", "11/26/2020", "1500", "1730", "Work"]],
		"11/27/2020": [["CS Due", "11/27/2020", "TODO", "<a href=\"https://ublearns.buffalo.edu/\" id=\"link\" onclick=\"link()\">Ublearns</a>"]],
		"11/28/2020": [],
		"11/29/2020": [],
		"11/30/2020": [["Physics Recitation", "11/30/2020", "1130", "1220", "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "11/30/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"12/01/2020": [["Pay Rent", "12/01/2020", "ALL_DAY", "<a href=\"https://mycommunity.americancampus.com/s/\" id=\"link\" onclick=\"link()\">Americancampus</a>"],
						["Change board", "12/01/2020", "0900", "0905"],
						["CSE 341", "12/01/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Phy 108", "12/01/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/meeting/register/tJIuceiprDwtGNEegXXyshOJMKbPDW1BMant\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"12/02/2020": [["Unplug Board", "12/02/2020", "0900", "0905"],
						["CS Recitation", "12/02/2020", "0910", "1000"],
						["MTH 309", "12/02/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Math Recitation", "12/02/2020", "1350", "1440", "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"12/03/2020": [["CSE 341", "12/03/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Phy 108", "12/03/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/meeting/register/tJIuceiprDwtGNEegXXyshOJMKbPDW1BMant\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"12/04/2020": [["Physics Lab", "12/04/2020", "0910", "1200", "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["MTH 309", "12/04/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"12/05/2020": [],
		"12/06/2020": [],
		"12/07/2020": [["Physics Recitation", "12/07/2020", "1130", "1220", "<a href=\" https://buffalo.zoom.us/j/6179834541?pwd=aEZXOW4xMUhjQUM4b05YelNwZ09ldz09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["MTH 309", "12/07/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"12/08/2020": [["CSE 341", "12/08/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Phy 108", "12/08/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/meeting/register/tJIuceiprDwtGNEegXXyshOJMKbPDW1BMant\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"12/09/2020": [["CS Recitation", "12/09/2020", "0910", "1000"],
						["MTH 309", "12/09/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Math Recitation", "12/09/2020", "1350", "1440", "<a href=\"https://buffalo.zoom.us/j/97202514665?pwd=818165\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"12/10/2020": [["Enrollment Tomorrow", "12/10/2020", "ALL_DAY"],
						["CSE 341", "12/10/2020", "1245", "1400", "<a href=\"https://buffalo.zoom.us/j/8494375567?pwd=Z2dkSGZZTlBoUWRKekozYnlKSFR0UT09\" id=\"link\" onclick=\"link()\">Zoom</a>"],
						["Phy 108", "12/10/2020", "2040", "2155", "<a href=\"https://buffalo.zoom.us/meeting/register/tJIuceiprDwtGNEegXXyshOJMKbPDW1BMant\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"12/11/2020": [["Physics Lab", "12/11/2020", "0910", "1200", "<a href=\"https://ub.webex.com/meet/muyehe\" id=\"link\" onclick=\"link()\">Webex</a>"],
						["MTH 309", "12/11/2020", "1240", "1330", "<a href=\"https://buffalo.zoom.us/j/98856692754?pwd=4o892q\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"12/12/2020": [],
		"12/13/2020": [],
		"12/14/2020": [],
		"12/15/2020": [["Electricity", "12/15/2020", "ALL_DAY", "<a href=\"https://www.nationalgridus.com/Upstate-NY-Home/Billing-Payments/Ways-to-Pay\" id=\"link\" onclick=\"link()\">Nationalgridus</a>"]],
		"12/16/2020": [["Math FINAL", "12/16/2020", "ALL_DAY", "<a href=\"https://buffalo.zoom.us/j/91388664396\" id=\"link\" onclick=\"link()\">Zoom</a>"]],
		"12/17/2020": [],
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
		"12/31/2020": []
	}
}
function weather() {
	return {
		"11/05/2020": [60,"Clouds","04d","11/05/2020"],
		"11/06/2020": [59,52,"Clouds","04d","11/06/2020"],
		"11/07/2020": [61,52,"Clouds","04d","11/07/2020"],
		"11/08/2020": [63,50,"Clouds","03d","11/08/2020"],
		"11/09/2020": [65,52,"Clouds","04d","11/09/2020"],
		"11/10/2020": [70,58,"Clouds","03d","11/10/2020"]
	}
}
