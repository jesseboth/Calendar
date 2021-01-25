import scala.io.Source
import java.io.{BufferedWriter, FileWriter}
import org.dmfs.rfc5545.DateTime
import org.dmfs.rfc5545.recur.RecurrenceRule
import org.dmfs.rfc5545.recur.RecurrenceRule.RfcMode
import scala.collection.mutable.ListBuffer
import parse_weather.weather_5
import parse_cal._

object parse_help {
    var month_lengths = date_info.month_lengths
    val months = date_info.months

    def fileDownloader(url: String): Iterator[String] = {
        val lines = Source.fromURL(url)
        lines.getLines()
    }

    def add_zero(str:String): String = {
        var t = str.toInt
        if(t < 10){
            "0"+t.toString()
        } 
        else {
            str
        }
    }

    def add_zero_time(str:String): String = {
        if(str.length() < 4){
            "0"+str
        } 
        else {
            str
        }
    }

    def get_hashLength(list: List[String]): Int = {
        var tot = 0
        var mon = -1
        for (i <- list){
            mon = i.split("/")(0).toInt
            tot+=month_lengths(mon)
        }
        tot
    }

    def withTime(line: String, timeZone:String): List[String] = {
        var sp = line.split(":")
        var i = sp(0).length()+1

        if(sp.length > 1 && !sp(1).contains("T")){
            return allDay(i, line)
        }
        var store = ""
        var off = 0
        var year = ""
        var date = ""
        var month = ""
        var hour_24 = ""
        var time = 0

        while (i < line.length) {
        store += line(i)
        if (time < 4) {
            year += line(i)
        }
        else if (time < 6) {
            month += line(i)
        }
        else if (time < 8) {
            date += line(i)
        }
        else if (time == 8) {
            /*do nothing*/
        }
        else if (time < 11) {
            if (time == 9) {
                hour_24 += line(i)
            }
            else {
                hour_24 += line(i)
            }
        }
        else if (time < 13) {
            hour_24 += line(i)
        }
        if (time == 10) {
            hour_24 += ":"
        }
        i += 1
        time += 1
        }
        val temp = hour_24.split(":")
        var int_hour = 0

        var hour = hour_24.replace(":", "")

        if(!line.contains("TZID")){
        var st = daylight_time(timeZone)(0)
        var en = daylight_time(timeZone)(1)
        var split_1 = st.split("/")
        var split_2 = en.split("/")
        
        if((month.toInt > split_1(0).toInt) || (month.toInt < split_2(0).toInt)){
            off = daylight_time(timeZone)(2).toInt
        }
        else if((month.toInt == split_2(0).toInt && date.toInt <= split_2(1).toInt)){
            off = daylight_time(timeZone)(2).toInt
        }
        else if((month.toInt == split_1(0).toInt && date.toInt >= split_1(1).toInt)){
            off = daylight_time(timeZone)(2).toInt
        }
        else {
            off = daylight_time(timeZone)(3).toInt
        }
        hour = timezoneAdjust(hour, off)
        }
        else {
        hour = timezoneAdjust(hour, off)
        }
        if (year != "1970" && hour.contains("-")) {
        hour = (2400 + hour.toInt).toString
        val temp = yesterday(date, month, year)
        date = temp(0)
        month = temp(1)
        year = temp(2)
        }
        val put = month + "/" + date + "/" + year
        List(put, hour)
    }

    def timezoneAdjust(hour: String, adjust: Int): String = {
        var toReturn = ""
        val temp = (hour.toInt + adjust).toString
        if (temp.length != 4 && !temp.startsWith("-")) {
            toReturn = temp
        }
        else {
            toReturn = temp
        }
        toReturn
    }

    def yesterday(dat: String, mon: String, ye: String): List[String] = {
        var date = dat
        var month = mon
        var year = ye
        var temp = 0
        temp = date.toInt - 1
        date = temp.toString
        if (date.toInt == 0) {
            temp = month.toInt - 1
            month = temp.toString

            if (month.toInt == 0) {
                temp = year.toInt - 1
                year = temp.toString
                month = "12"
            }
            date = month_lengths(month.toInt).toString
        }

        if (date.length < 2 && date.toInt < 10) {
            date = "0" + date
        }
        if (month.length < 2 && month.toInt < 10) {
            month = "0" + month
        }
        List(date, month, year)
    }

    def allDay(cur: Int, line: String): List[String] = {
        var store = ""

        var year = ""
        var date = ""
        var month = ""
        var time = 0
        var i = cur
        while (i < line.length) {
        store += line(i)
        if (time < 4) {
            year += line(i)
        }
        else if (time < 6) {
            month += line(i)
        }
        else if (time < 8) {
            date += line(i)
        }
        i += 1
        time += 1
        }

        val put = month + "/" + date + "/" + year
        List(put)
    }

    def get_months(current_month: String, current_year: String, before: Int, after: Int): List[String] = {
        val int_cur_month = current_month.toInt
        val int_cur_year = current_year.toInt
        var months: ListBuffer[String] = new ListBuffer()
        var toadd = ""

        var i = 0
        var prev_month = int_cur_month
        var prev_year = int_cur_year
        while(i < before){
            prev_month -=1

            if(prev_month == 0){
                prev_month = 12
                prev_year = int_cur_year -1
            }
            toadd = add_zero(prev_month.toString()) + "/" + prev_year.toString()
            months += toadd
            i+=1
        }
        toadd = add_zero(current_month) + "/" + current_year
        months += toadd

        i=0
        var next_month = int_cur_month
        var next_year = int_cur_year
        while(i < after){
            next_month +=1
            if(next_month == 13){
                next_month = 1
                next_year = int_cur_year + 1
            }
            toadd = add_zero(next_month.toString()) + "/" + next_year.toString()
            months += toadd
            i+=1
        }
        months.toList
    }

    def toData(line: String): String = {
        var temp = ""
        if(line.contains(":")){
            var l = line.split(":")
            if(l.length > 2){
                var i = 1
                while(i < l.length){
                    if(i < l.length -1){
                        temp+=l(i)+":"
                    }
                    else{
                        temp+=l(i)
                    }
                    i+=1
                }
                temp
            }
            else if(l.length == 2){
                l(1)
            }
            else{
                ""
            }
        }
        else{
            line
        }

    }

      def daylight_date(line:String): String = {
        var i = 0
        var l = line.split(":")(1).split("")
        var year = ""
        var mon = ""
        var day = ""
        
        year =l(0)+l(1)+l(2)+l(3)
        mon = l(4)+l(5)
        day = l(6)+l(7)
        mon + "/" + day
        
    }

    def decode_ical(data: String): List[String] = {
        var l: Array[String] = Array()
        var date = ""
        var time = ""
        if(data.contains(":")){
            l = data.split(":")
            if(l.length > 1){
                date = l(1)
            }
            else{
                return List("", "")
            }
        }
        else{
            date = data
        }
        var d: Array[String] = Array()
        if(date.contains("T")){
            l = date.split("T")
            d = l(0).split("")
            var i = 0
            while(i < 4){
                time += l(1)(i)
                i += 1
            }
        }
        else{
            d = date.split("")
        }
        var year =d(0)+d(1)+d(2)+d(3)
        var mon = d(4)+d(5)
        var day = d(6)+d(7)
        date = mon + "/" + day + "/" + year
        List(date, time)
    }

    def find_RRULE(line: String, start: String): Unit = {
        var recur: String = ""
        var i = 0
        var stop = false
        var until = ""
        var stop_at_until = false

        while (!stop) {
            if (line(i) == ':') {stop = true}
            i += 1
        }
        while (i < line.length) {
            recur += line(i)
            i += 1
        }

        if (line.contains("UNTIL=")) {
            var temp = ""
            var new_until = ""
            var t_count = 0
            val regex = recur.split(";")
            until = get_Until(line)
            for (j <- 0 until regex.length) {
                if (regex(j).contains("UNTIL=")) {
                    var k = 0
                    var break = false
                    while (!break) {
                        if (k < regex(j).length && regex(j)(k) == 'T') {
                            t_count += 1
                        }
                        if (k == regex(j).length || t_count == 2) {
                            break = true
                        }
                        else {
                        new_until += regex(j)(k)
                        }
                        k += 1
                    }
                    temp += (new_until + ";")
                }
                else {
                    temp += (regex(j) + ";")
                }
            }
            recur = temp
            if(t_count > 1){
                stop_at_until = true
            }
        }


        var year = 0
        var month = 0
        var day = 0
        val date = start.split("/")
        year = date(2).toInt
        month = date(0).toInt - 1 /*0 based*/
        day = date(1).toInt

        val rule = new RecurrenceRule(recur, RfcMode.RFC2445_LAX)
        val begin = new DateTime(year, month, day)

        val iter = rule.iterator(begin)
        var temp = ""
        while (iter.hasNext && !rule.isInfinite) {
            temp = iter.nextDateTime().toString
            if(!stop_at_until || temp != until){
                rrule_wating.enqueue(temp)
            }

        }
    }

    def get_Until(line:String):String ={
        var l = line.split(";")
        var s = ""
        for(i <- l){
            if(i.contains("UNTIL")){
                var ll = i.split("=")
                s = ll(1).split("T")(0)
                return s
            }
        }
        s
    }

    def find_ical_date(line: String): String = {
        var l: Array[String] = Array()
        var d = ""
        if(line.contains(":")){
            l = line.split(":")
            d = l(1)
        }
        else{
            d = line
        }
        l = d.split("T")
        d = l(0)
        d
    }

        def find_ical_date_with_time(line: String): String = {
        var l: Array[String] = Array()
        var d = ""
        if(line.contains(":")){
            l = line.split(":")
            d = l(1)
        }
        else{
            d = line
        }
        var t = ""
        l = d.split("T")
        d = l(0)
        var i = 0
        if(l.length > 1){
            while(i < 4){
                t+=l(1)(i)
                i+=1
            }
            d+="T"+t
        }
        d
    }

    def monthYear(str: String): String = {
        val l = str.split("/")
        val month = l(0)
        val year = l(2)

        val toReturn = month + "/" + year
        toReturn
    }

    def find_place_in_list(month:String, day:String): Int = {
        val list = eligible_insert
        var pos = 0
        var i = 0
        var mon = ""
        var break = false
        var toReturn = 0
        while(!break){
            mon = list(i).split("/")(0)
            if(mon == month){
                toReturn += day.toInt
                break = true
            }
            else{
                toReturn += month_lengths(mon.toInt)
            }
            i+=1
        }
        toReturn
    }

    def insert(towrite: Elements, exdate: List[String]): Unit = {
        var ical = ""
        var decoded = ""
        var recur_id = ""

        /*to add to hash*/
        var array: Array[String] = null
        var year = ""
        var month = ""
        var element: Elements = null
        while (rrule_wating.nonEmpty) {
            ical = rrule_wating.dequeue()
            recur_id = encode_recurrence_id(ical, towrite.start)
            if(!exdate.contains(ical) && !recurrenceID.contains(recur_id)){
                decoded = decode_ical(ical)(0)
                array = decoded.split("/")
                year = array(2)
                month = array(0)
                
                if (eligible_insert.contains(monthYear(decoded))) {
                    element = towrite.copy(decoded)
                    hash(find_place_in_list(array(0), array(1))) +:= element
                }
            }
            else if(recurrenceID.contains(recur_id)){
                recurrenceID -= recur_id
            }
        }
        
    }

    def encode_recurrence_id(ical: String, start: String): String = {
        if (start != null) {
            ical+"T"+start
        }
        else {
            ical
        }
    }

    def date_to_ical(date: String, start: String): String = {
        var l = date.split("/")
        var ical:String = l(2)+l(0)+l(1)
        if(start != null){
            ical += "T"+start
        }
        ical
    }

    def sort(key_words: List[String]): Unit = {
        var least: Elements = null
        var new_day: ListBuffer[Elements] = new ListBuffer[Elements]

        // var todo: ListBuffer[List[String]] = new ListBuffer[List[String]]/
        var key_word_hash: Array[ListBuffer[Elements]] = Array.fill[ListBuffer[Elements]](key_words.length)(ListBuffer[Elements]())
        var event: Elements = null
        var index = 0
        for (day <- hash.indices) {
            while (hash(day).nonEmpty) {
                val events = hash(day).iterator
                while (events.hasNext) {
                    event = events.next()
                    
                    if (event.all_day) {
                        if(key_words.contains(event.todo)){
                            index = key_words.indexOf((event.todo))
                            key_word_hash(index)+= event
                            hash(day).remove(hash(day).indexOf(event))
                        }
                        else{
                            new_day += add_remove(event, day)
                        }
                    }
                    else if ((least == null || event.start.toInt < least.start.toInt)) {
                        least = event
                    }
                }
                if(least != null && least.nonEmpty){
                    new_day += add_remove(least, day)
                }
                least = null
            }
            if(key_word_hash.nonEmpty){
                for(day <- key_word_hash.reverse){
                    for(event <- day){
                        new_day +:= event
                    }
                }

            }
            hash(day) = new_day
            new_day = new ListBuffer[Elements]
            key_word_hash = Array.fill[ListBuffer[Elements]](key_words.length)(ListBuffer[Elements]()) 
        }

    }

    def add_remove(least: Elements, day: Int): Elements = {
        if (hash(day).nonEmpty) {
            hash(day).remove(hash(day).indexOf(least))
        }
        least
    }

    def print_hash(): Unit = {
        /*helpful print*/
        var find: List[String] = List()
        println()
        for (i <- hash.indices) {
            if(i != 0){
                find = find_date(i)
                println("******" + find(0) + "/" + find(1) + "******")
                println()
                for (j <- hash(i)) {
                    j.print()
                }
                println()
            }
        }
    }

    def find_date(day_of_year: Int): List[String] = {
        var cur = day_of_year
        var mon = 1
        var day = 1
        var year = 0
        var sub = 0
        var day_str = "" 
        var mon_str = ""
        var year_str = ""
        
        var break = false
        var list = eligible_insert
        var i = 0
        while(!break){
            mon = list(i).split("/")(0).toInt
            sub = cur - month_lengths(mon)
            if(sub <= 0){
                mon_str = add_zero(mon.toString())
                day_str = add_zero(cur.toString())
                year_str = list(i).split("/")(1)
                break = true
            }
            else{
                cur -= month_lengths(mon).toInt
            }

            i+=1
        }
        List(mon_str, day_str, year_str)
    }

    def write(out: String): Unit = {
    val inputFile = scala.io.Source.fromFile(out)

    var list = new ListBuffer[String]
    val lines = inputFile.getLines()
    var line = ""
    var delete = false
    while (lines.hasNext && !delete) {
      line = lines.next()
      if (line.contains("function dictionary() {")) {
        delete = true

        /*stop lines from iterating*/
      }
      if (!delete) {
        list += line
      }
    }
    inputFile.close()
    var find: List[String] = null
    var key = ""
    val outputFile = new BufferedWriter(new FileWriter(out))

    /*write pre-existing to file*/
    for (i <- list.indices) {
      outputFile.write(list(i) + "\n")
    }
    outputFile.write("function dictionary() {")
    outputFile.write("\n\treturn {")

    /*loop hash table*/
    for (i <- Range(1, hash.length)) {
      /*find date string*/
      
      find = find_date(i)
      key = find(0) + "/" + find(1) + "/" + find(2)

      /*value is a list of lists*/
      outputFile.write("\n\t\t\"" + key + "\": [")

      /*loop through days events*/
      for (event <- hash(i)) {
        outputFile.write("{")

        outputFile.write("\"summary\": " + add_quotes(event.summary) + ", ")
        outputFile.write("\"all_day\": " + event.all_day + ", ")   
        outputFile.write("\"todo\": " + add_quotes(event.todo) + ", ")
        outputFile.write("\"start\": " + event.start + ", ")
        outputFile.write("\"end\": " + event.end + ", ")
        if(event.location != null && (event.location.contains("https://") || event.location.contains("www.") || event.location.contains("http://"))){
          outputFile.write("\"location\": "  + hyper_link(event.location) + ", ")
        }
        else if(event.location != null) {
            outputFile.write("\"location\": " + add_quotes(event.location) + ", ")
        }
        else{
            outputFile.write("\"location\": " + event.location + ", ")
        }
        outputFile.write("\"description\": " + add_quotes(event.description))

        if (event != hash(i).last) {
          outputFile.write("},\n\t\t\t\t\t\t")
        }
        else {
          outputFile.write("}")
        }
      }
      if (i < hash.length - 1) {
        outputFile.write("],")
      }
      else {
        outputFile.write("]")
      }
    }
    outputFile.write("\n\t}")
    outputFile.write("\n}\n")



    outputFile.write("function weather() {")
    outputFile.write("\n\treturn {")

    key = ""
    var count = 0

    for(weather <- weather_5){
      count+=1
      key = weather.last
      outputFile.write("\n\t\t\"" + key + "\": {")
      if(count == 1){
        for(elem <- weather.indices){
          if(weather(elem) != key){
            if(elem == 0){
              outputFile.write("\"high\": " + weather(elem) + ", ")
              outputFile.write("\"low\": null, ")
            }
            else if(elem == 1){
              outputFile.write("\"forecast\": "+  weather(elem) + ", ")
            }
            else if(elem == 2){
              outputFile.write("\"icon\": " + weather(elem))
            }
          }
        }
      }
      else{
        for(elem <- weather.indices){
          if(weather(elem) != key){
            if(elem == 0){
              outputFile.write("\"high\": " + weather(elem) + ", ")
            }
            else if(elem == 1){
              outputFile.write("\"low\": " + weather(elem) + ", ")
            }
            else if(elem == 2){
              outputFile.write("\"forecast\": " + weather(elem) + ", ")
            }
            else if(elem == 3){
              outputFile.write("\"icon\": " + weather(elem))
            }
          }
        }
      }
      if(weather != weather_5.last){
        outputFile.write("},")
      }
      else{
        outputFile.write("}")
      }
    }

    outputFile.write("\n\t}")
    outputFile.write("\n}\n")
    outputFile.close()
  }

    def hyper_link(hyperlink: String): String = {
        var link = hyperlink
        if(!hyperlink.contains("https")){
            link = "https://" + hyperlink
        }
        var html = "\"<a href=\\\"" + link + "\\\" id=\\\"link\\\" onclick=\\\"link()\\\">"

        /*skip https:\\*/
        var i = 8
        val sep = link.split('.')
        var temp = ""
        var list = sep
        var stop = false
        if (sep.length != 2) {
            temp = sep(1)
        if(temp.toLowerCase() == "google" || temp.toLowerCase() == "buffalo"){
            temp = sep(0)
            var new_sep = temp.split('/')
            temp = new_sep.last
        }
        html += temp.capitalize
        }
        /*find name*/
        else {
        while (!stop) {
            if (link(i) != '.') {
                temp += link(i)
            }
            else {
                stop = true
            }

            i += 1
        }
        html += temp.capitalize
        }

        html += "</a>\""
        html
    }

    def add_quotes(str: String): String = {
        if(str == null){
            return "null"
        }
        else{
            return "\"" + str + "\""
        }
    }
}