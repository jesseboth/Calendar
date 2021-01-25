import java.nio.file.{Files, Paths}
import scala.collection.mutable.{Queue, ListBuffer}
import parse_help._

object parse_cal {

    val date_info = new Date_info
    val eligible_insert = get_months(date_info.current_month, date_info.current_year, 1, 3)
    val len = get_hashLength(eligible_insert)+1

    /*tools for recurrence*/
    var rrule_wating = new Queue[String]
    var exdate = new ListBuffer[String]
    var recurrenceID = new ListBuffer[String]

    var hash: Array[ListBuffer[Elements]] = Array.fill[ListBuffer[Elements]](len)(ListBuffer[Elements]())

    var daylight_time = Map[String, List[String]]()
    val types = List("docs", "png","jpeg", "mp4", "py", "pdf", "pptx")
    var recur_id = false
    def parse(filename:String, outFiles:List[String], timeZone:String, key_words: List[String]): Unit = {
        var out = new ListBuffer[String]()
        for(i <- outFiles.indices){
          if(Files.exists(Paths.get(outFiles(i)))){
            out += outFiles(i)
          }
          else{
            println("Path " + outFiles(i) + " does not exist")
          }
        }

        var lines: Iterator[String] = null
        /*check if filename is a link*/
        if (filename.contains("https")) {
            lines = fileDownloader(filename)
        }
        /*check if file exists if not a link*/
        else if (Files.exists(Paths.get(filename))) {
            val inputFile = scala.io.Source.fromFile(filename)
            lines = inputFile.getLines()
        }
        /*must be file*/
        else {
            println("***file not found***")
            return
        }


        var towrite = new Elements
        var index = 0
        var todo = false
        var todo_word = ""
        var i = 0

        var line = ""
        var to_next = true

        while (lines.hasNext){
            if(line.startsWith("BEGIN:VTIMEZONE")){
            var name = ""
            var _daylight = "0"
            var standard = "0"
            var start_stan = "0"
            var end_stan = "null"
            while(!line.startsWith("END:VTIMEZONE")){
                if(line.startsWith("TZID:")){
                name = toData(line)
                }
                else if(line.startsWith("BEGIN:STANDARD")){
                while(!line.startsWith("END:STANDARD")){
                    if(line.startsWith("TZOFFSETTO:")){
                        standard = toData(line)
                    }
                    else if(line.startsWith("DTSTART")){
                        // return mon + "/" + day
                        start_stan = daylight_date(line)
                    }
                    line = lines.next()
                }
                }
                else if(line.startsWith("BEGIN:DAYLIGHT")){
                while(!line.startsWith("END:DAYLIGHT")){
                    if(line.startsWith("TZOFFSETTO:")){
                        _daylight = toData(line)
                    }
                    else if(line.startsWith("DTSTART")){
                        // return mon + "/" + day
                        end_stan = daylight_date(line)
                    }
                    line = lines.next()
                }
                }
            line = lines.next()
            }
            line = lines.next()
            daylight_time += (name -> List(start_stan, end_stan, standard, _daylight))
            }
            else if(line.startsWith("BEGIN:VALARM")){
                while(!line.startsWith("END:VALARM")){
                    line = lines.next()
                }
                line = lines.next()
            }
            else if(line.startsWith("DTSTART")){
                towrite.nonEmpty = true

                //List(put) ->all day
                //List(put, hour) -> time
                var date_start = withTime(line, timeZone)
                
                towrite.date = date_start(0)
                if(date_start.length > 1){
                    towrite.start = add_zero_time(date_start(1))
                }
                else{
                    towrite.all_day = true
                }
                towrite.ical = date_to_ical(towrite.date, towrite.start)
                line = lines.next()
            }
            else if(line.startsWith("DTEND")){

                //List(put) ->all day
                //List(put, hour) -> time
                var date_end = withTime(line, timeZone)
                if(date_end.length > 1){
                    towrite.end = add_zero_time(date_end(1))
                }

                line = lines.next()
            }
            else if(line.startsWith("RRULE")){
                find_RRULE(line, towrite.date)
                line = lines.next()
            }
            else if(line.startsWith("EXDATE")){
                // List(ical_date, time)
                exdate += find_ical_date(line)
                line = lines.next()
            }
            else if(line.startsWith("RECURRENCE-ID")){
                recurrenceID += find_ical_date_with_time(line)
                recur_id = true
                line = lines.next()
            }
            else if(line.startsWith("DESCRIPTION")){
                var i = 0
                var des = ""
                var text = ""
                var description_split = line.split(":")
                todo_word = ""
                if(description_split.length > 1){
                    des = description_split(1).toUpperCase()
                    if(key_words.contains(des)){
                        todo = true
                        todo_word = des
                        towrite.todo = todo_word
                        if(description_split.length > 2){
                            text += description_split(2)
                            line = lines.next()
                        }
                    }
                    else{
                        todo = false
                        if(description_split.length > 1){
                            for(k <- 1 until description_split.length){
                            if(k < description_split.length-1){
                                text += description_split(k) +":"
                            }
                            else{
                                text += description_split(k) 
                            }
                            }
                        }
                        else{
                            text += description_split(1)
                        }
                        line = lines.next()
                    }
                    while(!line.contains("LAST-MODIFIED")){
                        if(line.startsWith(" ") && !line.startsWith("DESCRIPTION")){
                            var sb: StringBuilder = new StringBuilder(line)
                            line = sb.deleteCharAt(0).toString()
                        }
                        text += line
                        line = lines.next()
                    }
                    towrite.description = text.replaceAll("\"", "'")
                    text = ""
                }
                else{
                    line = lines.next()
                }
            }
            else if(line.startsWith("LOCATION")){
                var location = toData(line)
                line = lines.next()
                while(!line.startsWith("SEQUENCE")){
                    var sb: StringBuilder = new StringBuilder(line)
                    line = sb.deleteCharAt(0).toString()
                    location += line
                    line = lines.next()
                }

                if (location != "") {
                    towrite.location = location
                }
            }
            else if(line.startsWith("SUMMARY")){
                towrite.summary = toData(line)
                line = lines.next()
                while(!line.startsWith("TRANSP")){
                    var sb: StringBuilder = new StringBuilder(line)
                    line = sb.deleteCharAt(0).toString()
                    towrite.summary += line
                    line = lines.next()
                }
            }
            else if(line.startsWith("ATTACH")){        
                var filename = ""
                var file_type = ""
                var href = ""
                var punc: Char = '-'
                var b = 16
                var under = false
                var comp_attach = ""
                while(line(b) != '.' && line(b) != ';'){
                    filename += line(b)
                    if(b == line.length() -1){
                        line = lines.next()
                        b = 0
                        under = true
                    }
                    b+=1
                }


                punc = line(b)
                b+=1
                if(b == line.length() -1){
                    line = lines.next()
                    b = 0 /*skip leading space*/
                    under = true
                }


                if(punc == '.'){
                while(line(b) != ';'){
                    file_type += line(b)
                    if(b == line.length() -1){
                    line = lines.next()
                    b = 0 /*skip leading space*/
                    under = true
                    }
                    b+=1
                }
                }

                if(!types.contains(file_type)){
                if(file_type != ""){
                    filename+="."+file_type
                }
                file_type = "misc"
                }
                else{
                filename+="."+file_type
                }

                while(line(b) != ':'){
                    if(b == line.length() -1){
                        line = lines.next()
                        b = 0 /*skip leading space*/
                        under = true
                    }
                b+=1
                }

                b+=1
                if(b == line.length() -1){
                    line = lines.next()
                    b = 0 /*skip leading space*/
                    under = true
                }
                while((under && !line.startsWith("ATTACH") && !line.startsWith("END:VEVENT")) || !under){
                    href+=line(b)
                    if(b == line.length() -1){
                    line = lines.next()
                    b = 0 /*skip leading space*/
                    under = true
                    }
                b+=1
                }
                if(href.contains("docs")){
                file_type = "docs"
                }
                comp_attach = "<div class='attachment'>" +
                                "<a class='no_underline' href='" +href+"'>" +
                                "<div class='attach_image'>" +
                                    "<img src='../images/" + file_type + ".png' style='height: 12px; width: 12px;'>" +
                                "</div>" +
                                "<div class='attach_name'>" + filename + "</div>" +
                            "</div>"
                if(towrite.description == null){
                towrite.description = "-"
                }
                towrite.description += "\" + \n \t\t\t\t\t\t\t\"" +comp_attach
                to_next = false
            }
            else{
                line = lines.next()
            }

            if(line.startsWith("END:VEVENT")){
                if (rrule_wating.isEmpty) {
                    if (towrite.nonEmpty && eligible_insert.contains(monthYear(towrite.date))) {
                        var split_date = towrite.split()
                        var month = split_date(0)
                        var day = split_date(1)
                        index = find_place_in_list(month, day)
                        if(!recur_id){
                            hash(index) :+= towrite
                        }
                        else{
                            for(i <- hash(index)){
                                if(i.similar(towrite)){
                                    add_remove(i, index)
                                }
                            }
                            hash(index) :+= towrite
                            recur_id = false
                        }
                    }

                }
                else {
                    insert(towrite, exdate.toList)
                    if(exdate.nonEmpty){
                        exdate = new ListBuffer[String]
                    }
                }
                /*reset towrite*/
                towrite = new Elements
            }
    
        }

        /*sort the hash-table*/
        sort(key_words)
        /*print*/
        // print_hash()

        /*write to file*/
        for(i <- out.indices){
            write(out(i))
        }
    }
}