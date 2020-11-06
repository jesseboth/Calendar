
import java.io.{BufferedWriter, FileWriter}

import scala.io.Source
import org.dmfs.rfc5545.DateTime
import org.dmfs.rfc5545.recur.RecurrenceRule
import org.dmfs.rfc5545.recur.RecurrenceRule.RfcMode
import parse_cal.hash
import parse_weather.weather_5

import scala.collection.mutable
import scala.collection.mutable.ListBuffer

/*helper functions for parse_cal*/
object parse_help {
  var month_lengths: Array[Int] = parse_cal.month_lengths
  val months: List[String] = parse_cal.months

  def fileDownloader(url: String): Iterator[String] = {
    val lines = Source.fromURL(url)
    lines.getLines()
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
    List(put, month, date, year)
  }

  def withTime(cur: Int, line: String): List[String] = {
    var store = ""

    var year = ""
    var date = ""
    var month = ""
    var hour_24 = ""
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

    var hour = ""
    hour += hour_24(0)
    hour += hour_24(1)
    hour += hour_24(3)
    hour += hour_24(4)


    if (line.contains("America")) {
      if (line.contains("New_York") || line.contains("Detroit")) {
      }
      else {
        println("NEW CONDITION", line)
      }
    }
    else {
      hour = timezoneAdjust(hour)
    }
    if (year != "1970" && hour.contains("-")) {
      hour = (2400 + hour.toInt).toString
      val temp = yesterday(date, month, year)
      date = temp(0)
      month = temp(1)
      year = temp(2)
    }
    if (hour.toInt < 100) {
      hour = (hour.toInt + 2400).toString
    }
    val put = month + "/" + date + "/" + year
    List(put, hour, month, date, year)
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
      date = parse_cal.month_lengths(month.toInt).toString
    }

    if (date.length < 2 && date.toInt < 10) {
      date = "0" + date
    }
    if (month.length < 2 && month.toInt < 10) {
      month = "0" + month
    }
    List(date, month, year)
  }

  def timezoneAdjust(hour: String): String = {
    var toReturn = ""
    val temp = (hour.toInt - 400).toString
    if (temp.length != 4 && !temp.startsWith("-")) {
      toReturn = "0" + temp
    }
    else {
      toReturn = temp
    }

    toReturn
  }

  def decode_date(date: String): String = {
    var year = ""
    var month = ""
    var day = ""
    year = date(0).toString + date(1) + date(2) + date(3)
    month = date(4).toString + date(5)
    day = date(6).toString + date(7)

    month + "/" + day + "/" + year
  }

  def findRRULE(line: String, start: String): Unit = {

    var recur: String = ""
    var i = 0
    var stop = false

    while (!stop) {
      if (line(i) == ':') {
        stop = true
      }
      i += 1
    }
    while (i < line.length) {
      recur += line(i)
      i += 1
    }

    if (line.contains("UNTIL=")) {
      var temp = ""
      var new_until = ""
      var T_count = 0
      val regex = recur.split(";")
      for (j <- 0 until regex.length) {
        if (regex(j).contains("UNTIL=")) {
          var k = 0
          var break = false
          while (!break) {
            if (k < regex(j).length && regex(j)(k) == 'T') {
              T_count += 1
            }
            if (k == regex(j).length || T_count == 2) {
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
      
      parse_cal.rrule_wating.enqueue(temp)
    }
  }

  def find_day_of_year(month: String, day: String): Int = {
    var toReturn = 0
    /*jan 1 = 1*/
    val mon = month.toInt
    val d = day.toInt
    for (i <- 1 until mon) {
      toReturn += month_lengths(i)
    }
    toReturn += d
    toReturn
  }

  def find_date(day_of_year: Int): List[String] = {
    var stop = false
    var cur = day_of_year
    var mon = 1
    var day = 1
    var mon_string = ""
    var day_string = ""

    while (!stop) {
      if (cur <= month_lengths(mon)) {
        day = cur
        stop = true
      }
      else {
        cur -= month_lengths(mon)
        mon += 1
      }
    }
    if (mon < 10) {
      mon_string = "0" + mon.toString
    }
    else {
      mon_string = mon.toString
    }
    if (day < 10) {
      day_string = "0" + day.toString
    }
    else {
      day_string = day.toString
    }

    if (day == 0) {
      List("null", "null")
    }
    else {
      List(mon_string, day_string)
    }
  }

  def time_to_12(hour_24: String): String = {
    var temp = hour_24.split(":")
    if (temp.length == 1) {
      temp = Array(hour_24(0).toString + hour_24(1).toString, hour_24(2).toString + hour_24(3).toString)
    }
    var int_hour = 0
    var hour_12 = ""
    if (temp(0).toInt > 12) {
      int_hour = temp(0).toInt - 12
      if (int_hour == 12) {
        hour_12 = int_hour.toString + ":" + temp(1) + " AM"
        hour_12
      }
      else {
        hour_12 = int_hour.toString + ":" + temp(1) + " PM"
        hour_12
      }
    }
    else {
      if (temp(0) == "12") {
        hour_12 = temp(0) + ":" + temp(1) + " PM"
        hour_12
      }
      else {
        hour_12 = temp(0).toInt.toString + ":" + temp(1) + " AM"
        hour_12
      }
    }
  }

  def insert(towrite: List[String], todo: Boolean): Unit = {
    var summary = ""
    var start_time = ""
    var end_time = ""
    var location = ""
    var date = ""

    /*to add to hash*/
    var array: Array[String] = null
    var year = ""
    var t: List[String] = null
    if (towrite.length == 4) {
      summary = towrite(0)
      start_time = towrite(2)
      end_time = towrite(3)
      if(todo){
        if(start_time == "ALL_DAY"){
          start_time = "TODO"
        }
      }
      while (parse_cal.rrule_wating.nonEmpty) {
        date = parse_help.decode_date(parse_cal.rrule_wating.dequeue())
        array = date.split("/")
        year = array(2)
        if (year == parse_cal.current_year) {
          t = List(summary, date, start_time, end_time)
          parse_cal.hash(parse_help.find_day_of_year(array(0), array(1))) +:= t
          t = List()
        }
        else if (date == parse_cal.new_years_day) {
          t = List(summary, date, start_time, end_time)
          parse_cal.hash(0) +:= t
          t = List()
        }
      }
    }
    else if (towrite.length == 5) {
      summary = towrite(0)
      start_time = towrite(2)
      end_time = towrite(3)
      location = towrite(4)

      while (parse_cal.rrule_wating.nonEmpty) {
        date = parse_help.decode_date(parse_cal.rrule_wating.dequeue())
        array = date.split("/")
        year = array(2)
        if (year == parse_cal.current_year) {
          t = List(summary, date, start_time, end_time, location)
          parse_cal.hash(parse_help.find_day_of_year(array(0), array(1))) +:= t
          t = List()
        }
        else if (date == parse_cal.new_years_day) {
          t = List(summary, date, start_time, end_time, location)
          parse_cal.hash(0) +:= t
          t = List()
        }
      }
    }
    else if (towrite.length == 3) {
      summary = towrite(0)
      start_time = towrite(2)
      if(todo){
        start_time = "TODO"
      }
      while (parse_cal.rrule_wating.nonEmpty) {
        date = parse_help.decode_date(parse_cal.rrule_wating.dequeue())
        array = date.split("/")
        year = array(2)
        if (year == parse_cal.current_year) {
          t = List(summary, date, start_time)
          parse_cal.hash(parse_help.find_day_of_year(array(0), array(1))) +:= t
          t = List()
        }
        else if (date == parse_cal.new_years_day) {
          t = List(summary, date, start_time)
          parse_cal.hash(0) +:= t
          t = List()
        }

      }
    }
    else {
      println("I Don't Know")
    }

  }

  def print_hash(): Unit = {
    /*helpful print*/
    var find: List[String] = List()
    for (i <- hash.indices) {
      find = parse_help.find_date(i)
      println("******" + find(0) + "/" + find(1) + "******")
      println("\n")
      for (j <- hash(i)) {
        if (j(2) != "ALL_DAY" || j(2) != "TODO") {
          println("(" + j(0) + ", " + parse_help.time_to_12(j(2)) + ", " + parse_help.time_to_12(j(3)) + ")")
        }
        else {
          println("(" + j(0) + ", " + j(2) + ")")
        }
      }
      println("\n\n")
    }
  }

  def sort(): Unit = {
    val start = 2
    val end = 3
    val all = 2

    var least: List[String] = List()
    var new_day: ListBuffer[List[String]] = new ListBuffer[List[String]]

    var todo: ListBuffer[List[String]] = new ListBuffer[List[String]]
    val hash = parse_cal.hash
    var event: List[String] = null
    for (day <- hash.indices) {
      while (hash(day).nonEmpty) {
        val events = hash(day).iterator
        while (events.hasNext) {
          event = events.next()
          if (event(start) == "ALL_DAY" || event(start) == "TODO") {
            if(event(start) == "TODO"){
              todo += event
              hash(day).remove(hash(day).indexOf(event))
            }
            else{
              new_day += add_remove(event, day)
            }
          }
          else if (least.isEmpty || event(start).toInt < least(start).toInt) {
            least = event
          }
        }
	      if(least.nonEmpty){
        	new_day += add_remove(least, day)
	      }
        least = List()
      }
      if(todo.nonEmpty){
        for(event <- todo){
          new_day +:= event
        }
      }
      hash(day) = new_day
      new_day = new ListBuffer[List[String]]
      todo = new ListBuffer[List[String]]
    }

  }

  def add_remove(least: List[String], day: Int): List[String] = {
    if (hash(day).nonEmpty) {
      hash(day).remove(hash(day).indexOf(least))
    }
    least
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
    var find: List[String] = List()
    var key = ""
    val start = 2
    val end = 3
    var not_all = false
    val outputFile = new BufferedWriter(new FileWriter(out))

    /*write pre-existing to file*/
    for (i <- list.indices) {
      outputFile.write(list(i) + "\n")
    }
    outputFile.write("function dictionary() {")
    outputFile.write("\n\treturn {")

    /*loop hash table*/
    for (i <- hash.indices) {
      /*find date string*/
      if (i != 0) {
        find = find_date(i)
        key = find(0) + "/" + find(1) + "/" + parse_cal.current_year
      }
      else {
        key = parse_cal.new_years_day
      }
      /*value is a list of lists*/
      outputFile.write("\n\t\t\"" + key + "\": [")

      /*loop through days events*/
      for (j <- hash(i).indices) {
        outputFile.write("[")

        not_all = false

        /*loop through event elements*/
        for (k <- hash(i)(j).indices) {

          /*convert to hyperlink*/
          if (hash(i)(j)(k).contains("https") || hash(i)(j)(k).contains("www.")) {
            outputFile.write(hyper_link(hash(i)(j)(k)))
          }
          /*write as plain text*/
          else {
            outputFile.write("\"" + hash(i)(j)(k) + "\"")
          }

          /*add comma*/
          if (k < hash(i)(j).length - 1) {
            outputFile.write(", ")
          }
        }
        if (j < hash(i).length - 1) {
          outputFile.write("],\n\t\t\t\t\t\t")
        }
        else {
          outputFile.write("]")
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
      outputFile.write("\n\t\t\"" + key + "\": [")
      for(elem <- weather){
        if(elem != key){
          outputFile.write(elem + ",")
        }
        else{
          outputFile.write("\"" + elem + "\"")
        }
      }
      if(weather != weather_5.last){
        outputFile.write("],")
      }
      else{
        outputFile.write("]")
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

}
