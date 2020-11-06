
import java.nio.file.{Files, Paths}
import java.text.SimpleDateFormat
import java.util.Date

import scala.collection.mutable
import scala.collection.mutable.ListBuffer

object parse_cal {
  //added 0 to match the date format (starting at 1)
  var month_lengths = Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)
  val months: List[String] = List("NULL", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
  var TOT = 365
  /*find current year*/
  val d = new Date()
  val current_year: String = new SimpleDateFormat("yyyy").format(d.getTime)
  val new_years_day = "01/01/" + ((current_year.toInt)+1).toString

  var rrule_wating = new mutable.Queue[String]
  var hash: Array[ListBuffer[List[String]]] = Array.fill[ListBuffer[List[String]]](TOT + 1)(ListBuffer[List[String]]())

  def parse(filename: String, outFiles: List[String]): Unit = {

    var out = new ListBuffer[String]()
    for(i <- outFiles.indices){
          if(!Files.exists(Paths.get(outFiles(i)))){
            println("Path " + outFiles(i) + " does not exist")
            return
          }
          else{
            out += outFiles(i)
          }
    }

    var lines: Iterator[String] = null
    /*check if filename is a link*/
    if (filename.contains("https")) {
      lines = parse_help.fileDownloader(filename)
    }
    /*check if file exists if not a link*/
    else if (!Files.exists(Paths.get(filename))) {
      println("***file not found***")
      return
    }
    /*must be file*/
    else {
      val inputFile = scala.io.Source.fromFile(filename)
      lines = inputFile.getLines()
    }

    /*add a day for a leap year*/
    if (current_year.toInt % 4 == 0) {
      month_lengths(2) = 29
      TOT = 366
      hash = Array.fill[ListBuffer[List[String]]](TOT + 1)(ListBuffer[List[String]]())

    }

    var towrite = new ListBuffer[String]
    var date = ""
    var year = ""
    var hour = ""
    var day_of_year = 0
    var todo = false
    for (line <- lines) {
      /** BEGIN */
      if (line.startsWith("DTSTART")) {
        var i = 0
        while (line(i) != ':') {
          i += 1
        }
        i += 1
        var DATE_start: List[String] = List()

        val cur = line.length - i
        if (cur < 9) {
          DATE_start = parse_help.allDay(i, line)
          date = DATE_start(0)
          towrite += date
          day_of_year = parse_help.find_day_of_year(DATE_start(1), DATE_start(2))
          year = DATE_start(3)
          towrite += "ALL_DAY"
        }
        else {
          DATE_start = parse_help.withTime(i, line)
          hour = DATE_start(1)
          date = DATE_start(0)
          day_of_year = parse_help.find_day_of_year(DATE_start(2), DATE_start(3))
          year = DATE_start(4)
          towrite += date
          towrite += hour
        }
      }
      else if (line.startsWith("DTEND")) {
        var i = 0
        while (line(i) != ':') {
          i += 1
        }
        i += 1
        var DATE_end: List[String] = List()
        var hour_12 = ""

        val cur = line.length - i
        if (cur < 9) {
          /*these should probably be ignored*/
        }
        else {
          DATE_end = parse_help.withTime(i, line)
          hour_12 = DATE_end(1)
          towrite += hour_12
        }
      }
      /*frequency*/
      else if (line.startsWith("RRULE")) {

        parse_help.findRRULE(line, date)
      }
      else if(line.startsWith("DESCRIPTION")){
        var i = 0
        var des = ""
        while (line(i) != ':') {
          i += 1
        }
        i += 1
        while(i < line.length()){
          des += line(i)
          i+=1
        }
        des = des.toUpperCase()
        if(des.startsWith("TODO") || des.startsWith("TO DO")){
          todo = true
        }
        else{
          todo = false
        }
      }
      else if (line.startsWith("LOCATION")) {
        var i = 0
        var location = ""
        while (line(i) != ':') {
          i += 1
        }
        i += 1
        while (i < line.length) {
          location += line(i)
          i += 1
        }
        var rest = lines.next()
        if(!rest.startsWith("SEQUENCE")){
          rest = rest.replace(" ", "")
          location += rest
        }
        if (location != "") {
          towrite += location
        }
      }
      else if (line.startsWith("SUMMARY")) {
        var i = 0
        var summary = ""
        while (line(i) != ':') {
          i += 1
        }
        i += 1
        while (i < line.length) {
          summary += line(i)
          i += 1
        }
        towrite +:= summary
      }
      else if (line.startsWith("END")) {

        if (rrule_wating.isEmpty) {
          if (year == current_year) {
            if(todo){
              if(towrite(2) == "ALL_DAY"){
                towrite(2) = "TODO"
              }
            }
            hash(day_of_year) :+= towrite.toList
          }
          else if(towrite.nonEmpty && new_years_day == towrite(1)){
              if(todo){
                if(towrite(2) == "ALL_DAY"){
                  towrite(2) = "TODO"
              }
            }
            hash(0) :+= towrite.toList
          }
        }
        else {
          parse_help.insert(towrite.toList, todo)
        }
        /*reset towrite*/
        towrite = new ListBuffer[String]
        year = ""
      }
    }
    /*sort the hash-table*/
    parse_help.sort()
    /*print*/
    // parse_help.print_hash()
    /*write to file*/
    for(i <- out.indices){
      parse_help.write(out(i))
    }
    
  }
}
