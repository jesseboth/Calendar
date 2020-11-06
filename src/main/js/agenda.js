key = ""; /*key for dictionary*/
current = null; /*list for current event*/
next = null; /*list for next event*/
to_next = false; /*true if next false if current*/

all_day = 0 /*index for all day events*/
rand = false /*to find random for allday*/
all_day_current = -1 /*place holder index*/
to_tomorrow = false /*true if all events are over for the day*/
current_tomorrow = 0 /*index for tomorrows events*/

link_clicked = false;
function link(){
    link_clicked = true;
}

sec = null /*for delay*/

function run(){
	updateTime()
	set_all_day()
	setInterval(updateTime, 100)
}
function updateTime() {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
    key = add_zero(month_num+1) + "/" + add_zero(day) + "/" + year.toString();
    var seconds = datetime.getSeconds()

    /*gives a 10 second delay*/
	if(sec === null){
		sec = seconds
	}
	else{
		if(sec+10 >= 60 && seconds < 10){
			sec -= 60
		}
		if(sec + 10 <= seconds){
			sec = seconds
			rotate()
		}
	}


    document.getElementById("time").innerHTML = current_time;
    document.getElementById("time").style.fontFamily = "Orbitron";
    document.getElementById("month").innerHTML = date;
	document.getElementById("month").style.fontFamily = "Orbitron-light";

	get_events(key, time_24)
}

function get_12_hour(hour, minutes, check) {
    var new_hour = 0;
    var am_pm = "";
    if(parseInt(hour) > 12){
        if(parseInt(hour) === 24){
            new_hour = parse(hour) - 12;
            am_pm = " AM"
        }
        else {
            new_hour = parseInt(hour) - 12;
            am_pm = " PM"
        }
    }
    else{
        if(parseInt(hour) === 12){
            new_hour = parseInt(hour);
            am_pm = " PM"
        }
        else {
        	if(parseInt(hour) === 0){
        		new_hour = 12
				am_pm = " AM"
			}
        	else {
				new_hour = parseInt(hour);
				am_pm = " AM"
			}
        }
    }
    if(check){am_pm = ""}
    return new_hour + ":" + minutes + am_pm
}
function add_zero(i){
    if(i < 10){
        return "0" + i.toString()
    }
    else{
        return i.toString()
    }
}
function get_events(key, time){
    var dict = dictionary();
	var i = 0;

	var time_int = parseInt(time);
	if(current === null || time_int > current[3]){
		while(true){
			if(dict[key].length > 0 && dict[key].length > i && dict[key][i][2] === "ALL_DAY"){
				i++
			}
			else if(dict[key].length > 0 && dict[key].length > i && dict[key][i][2] === "TODO"){
				i++
			}
			else{
				all_day = i
				if(!rand){
					rand = true
					all_day_current = getRandomInt(all_day)
				}
				//set_all_day()
				if(all_day > 1){
					to_pointer()
				}
				break
			}
		}	
		while(true){
			if(i < dict[key].length && parseInt(dict[key][i][2]) < parseInt(dict[key][i][3]) && time_int > parseInt(dict[key][i][3])){
				i++
			}
			else{
				break
			}
		}
		if(i < dict[key].length){
			current = dict[key][i];
	
			if(i+1 < dict[key].length){
				next = dict[key][i+1]
				document.getElementById("calendar").style.cursor = "pointer";
			}
			else{
				next = null
				document.getElementById("calendar").style.cursor = "default";
			}
			format_events()
		}
		else{
			current = null
			to_tomorrow = true
			set_tomorrow(tomorrow_key())
		}
	}
}
function format_events() {
    var name = "";
    var start = "";
    var end = "";
    var location = "";

    if(!to_next && current != null){
        /*/w location*/
        if(current.length == 5){
            name = current[0];
            start = current[2];
            end = current[3];
            location = current[4];
        }
        /*w/o location*/
        else{
            name = current[0];
            start = current[2];
            end = current[3];
        }
        set_event(name, start, end, location)
    }
    else if(next != null){
        /*/w location*/
        if(next.length == 5){
            name = next[0];
            start = next[2];
            end = next[3];
            location = next[4];
        }
        /*w/o location*/
        else{
            name = next[0];
            start = next[2];
            end = next[3];
        }
        set_event(name, start, end, location)
    }
}
function set_event(name, start, end, location) {
	if(start != "ALL_DAY" && start != "TODO") {
		var duration = get_12_hour(start[0] + start[1], start[2] + start[3]) + " - " + get_12_hour(end[0] + end[1], end[2] + end[3]);
	}
	else{
		if(start == "ALL_DAY"){
			duration = "All Day"

		}
		else if(start == "TODO"){
			duration = "To Do"
		}
	}
    if(location === ""){
        document.getElementById("cal_name").innerHTML = "place_holder"
        document.getElementById("cal_location").innerHTML = name; /*shift down*/
        document.getElementById("start_end").innerHTML = duration;
        document.getElementById("cal_location").style.fontFamily = "Orbitron-bold";
    }
    else{
        document.getElementById("cal_name").innerHTML = name;
        document.getElementById("cal_location").innerHTML = location; /*shift down*/
        document.getElementById("start_end").innerHTML = duration
        document.getElementById("cal_location").style.fontFamily = "Orbitron-light";
    }

    if(!to_next){
        document.getElementById("cal_name").style.color = "#303030";
        document.getElementById("cal_location").style.color = "#303030";
        document.getElementById("start_end").style.color = "#303030";
    }
    else{
        document.getElementById("cal_name").style.color = "#262626";
        document.getElementById("cal_location").style.color = "#262626";
        document.getElementById("start_end").style.color = "#262626";
    }
    if(location === ""){
        document.getElementById("cal_name").style.color = "#0e0e0e";
	}
}
function toggleCal(){
	if(!to_tomorrow && !link_clicked) {
		if (to_next) {
			to_next = false
            format_events()
		} else {
			to_next = true
            format_events()
		}
	}
	else{
		link_clicked = false
	}
}

function tomorrow_key(){
    today = new Date();
    tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    tomorrow_month = add_zero((tomorrow.getMonth()+1).toString());
    tomorrow_day = add_zero(tomorrow.getDate().toString());
    tomorrow_year = tomorrow.getFullYear().toString();
    return tomorrow_month + "/" +tomorrow_day + "/" + tomorrow_year
}
function tomorrow_toggle(){
	if(to_tomorrow){
		if(current_tomorrow +1 < dict[tomorrow_key()].length){
			current_tomorrow += 1
		}
		else {
			current_tomorrow = 0
		}
	}
}
function set_tomorrow(key){
    var dict = dictionary()
    if(dict[key].length > 0){
		document.getElementById("cal_name").style.color = "#303030";
		document.getElementById("cal_location").style.color = "#303030";
		document.getElementById("start_end").style.color = "#303030";

    	if(dict[key][current_tomorrow][2] != "ALL_DAY" && dict[key][current_tomorrow][2] != "TODO") {
			var name = dict[key][current_tomorrow][0]
			var start = dict[key][current_tomorrow][2].toString();
			var end = dict[key][current_tomorrow][3].toString()
			var location = "Tomorrow"
			set_event(name, start, end, location)
		}
    	else{
			var name = dict[key][current_tomorrow][0]
			var start = dict[key][current_tomorrow][2]
			var end = ""
			var location = "Tomorrow"
			set_event(name, start, end, location)
		}
    	if(dict[key].length > 1){
			document.getElementById("calendar").style.cursor = "pointer";

		}
    	else{
			document.getElementById("calendar").style.cursor = "default";
		}

    }
    else{
		document.getElementById("cal_name").innerHTML = "place_holder";
		document.getElementById("cal_name").style.color = "#0e0e0e";
		document.getElementById("cal_location").innerHTML = "place_holder";
		document.getElementById("cal_location").style.color = "#0e0e0e";
		document.getElementById("start_end").style.color = "#0e0e0e";

	}
}
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}
function set_all_day() {
	dict = dictionary()
    if(all_day !== 0){
		document.getElementById("summary").innerHTML = dict[key][all_day_current][0]

		if(dict[key][all_day_current][2] == "TODO"){
			document.getElementById("summary").style.color = "#ff9900"
		}
		else{
			document.getElementById("summary").style.color = "#303030"
		}
		if(dict[key][all_day_current].length === 4){
			document.getElementById("loc").innerHTML = dict[key][all_day_current][3]
			if(dict[key][all_day_current][2] == "TODO"){
				document.getElementById("loc").style.color = "#ff9900"
			}
			else{
				document.getElementById("loc").style.color = "#303030"
			}
		}
		else{
			document.getElementById("loc").innerHTML = ""
			document.getElementById("loc").style.color = "#0e0e0e";
		}
	}
	else{
		document.getElementById("summary").style.color = "#0e0e0e";
	}
}
function rotate(){
	if(all_day_current+1 < all_day){
		all_day_current += 1
	}
	else {
		all_day_current = 0
	}
	set_all_day()
}
function rotate_click() {
    if(!link_clicked){
        sec = null
        rotate()
        set_all_day()
    }
}
function to_pointer(){
	document.getElementById("all_day").style.cursor = "pointer";
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
