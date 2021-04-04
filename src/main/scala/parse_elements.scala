class Elements {
    var nonEmpty: Boolean = false
    var summary: String = null
    var date: String = null
    var all_day: Boolean = false
    var start: String = null
    var end: String = null
    var location: String = null
    var todo: String = null
    var description: String = null

    var ical: String = null

    def toList(): List[String] = {
        return List(summary, date, all_day.toString(), todo, start, end, location, description)
    }

    def split(): Array[String] = {
        date.split("/")
    }

    def copy(date: String): Elements = {
        val copy = new Elements
        copy.nonEmpty = this.nonEmpty
        copy.summary = this.summary
        copy.date = date            // <- change
        copy.all_day = this.all_day
        copy.start = this.start
        copy.end = this.end
        copy.location = this.location
        copy.todo = this.todo
        copy.description = this.description
        copy.ical = date_to_ical(date, this.start)

        copy
    }

    def date_to_ical(date: String, start: String): String = {
        var l = date.split("/")
        var ical:String = l(2)+l(0)+l(1)
        if(start != null){
            ical += "T"+start
        }
        ical
    }

    def time_to_12(time: String): String = {
        var int_time = time.toInt
        var str_time = ""
        var temp: List[String] = List() //List(hour, minute)
        if (int_time >= 1300) {
            int_time -= 1200

            if (int_time >= 1200 && int_time <= 1259) {
                temp = time_split(int_time.toString())
                str_time = temp(0) + ":" + temp(1) + " AM"
                str_time
            }
            else {
                temp = time_split(int_time.toString())
                str_time = temp(0) + ":" + temp(1) + " PM"
                str_time
            }
        }
        else {
            if (int_time >= 1200 && int_time <= 1200) {
                temp = time_split(time)
                str_time = temp(0) + ":" + temp(1) + " PM"
                str_time
            }
            else {
                temp = time_split(time)
                str_time = temp(0) + ":" + temp(1) + " AM"
                str_time
            }
        }
    }

    def time_split(str: String): List[String] = {
        var temp = add_zero_time(str)
        var hour = temp.substring(0, 2)
        var minute = temp.substring(2)
        List(hour, minute)
    }

    def add_zero_time(str:String): String = {
        if(str.length() < 4){
            "0"+str
        } 
        else {
            str
        }
    }

    def print(): Unit = {
        if(this.all_day){
            println(this.summary + ", All Day")
        }
        else{
            println(this.summary + ", " + time_to_12(this.start) + " - " + time_to_12(this.end))
        }
    }

    def print_all(): Unit = {
        println(this.toList())
    }

    def similar(check: Elements): Boolean = {
        if(check.ical == this.ical){
            true
        }
        else if(check.summary == this.summary){
            true
        }
        else if(check.start == this.start && check.end == this.end){
            true
        }
        else if(check.all_day && this.all_day){
            true
        }
        else if(check.summary.contains(this.summary)){
            true
        }
        else{
            false
        }
    }
}
