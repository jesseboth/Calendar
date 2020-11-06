
import java.text.SimpleDateFormat

import scala.collection.mutable.ListBuffer
import scala.io.Source
import java.util.Date

object parse_weather {

  var weather_5 = new ListBuffer[List[String]]

  def parse_weather(today: String, week: String): Unit ={
    parseToday(today)
    parse5day(week)
  }
  
  def addZero(num: Int): String ={
    var toReturn = ""
    if(num < 10){
      toReturn = "0" + num.toString
      toReturn
    }
    else{
      toReturn=num.toString
      toReturn
    }
  }

  def parseToday(in: String): Unit ={
    var temp = 7
    var min_temp = 9
    var max_temp = 10
    var condition = 3
    var icon = 5
    val d = new Date()
    val date = addZero(d.getMonth+1) + "/" + addZero(d.getDate) + "/" + new SimpleDateFormat("yyyy").format(d.getTime)

    val list = toString(in)
    var split = list.split(",")

    for(i <- split.indices){
      if(split(i).contains(":{\"temp\":")){
        temp = i
      }
      else if(split(i).contains("\"main\":\"")){
        condition = i
      }
      else if(split(i).contains("\"icon\":")){
        icon = i
      }
    }

    var weather = List(toFarenheit(toValue(split(temp))), toValue(split(condition)), toValue(split(icon)).replace('n', 'd'), date)
    weather_5 += weather


  }

  def parse5day(in: String): Unit ={
    val d = new Date()
    val today = addZero(d.getMonth+1) + "/" + addZero(d.getDate) + "/" + new SimpleDateFormat("yyyy").format(d.getTime)
    var temp = 1
    var condition = 11
    var description = 13
    var date = 20
    val list = toList(toString(in))
    var count = 0

    var toSort: ListBuffer[ListBuffer[List[String]]] = new ListBuffer[ListBuffer[List[String]]]
    var buffer = new ListBuffer[List[String]]
    var index = -1;
    var key = ""
    for(l <- 0 until list.length-1){
      if(list(l)(date).contains("sys")){
        date+=1
      }
      for(i <- list(l).indices){

        if(list(l)(i).contains(":{\"temp\":")){
          temp = i
        }
        else if(list(l)(i).contains("\"main\":\"")){
          condition = i
        }
        else if(list(l)(i).contains("\"icon\":")){
          description = i
        }
        else if(list(l)(i).contains("\"dt_txt\":")){
          date = i
        }
      }
      var weather = List(toFarenheit(toValue(list(l)(temp))), toValue(list(l)(condition)), toValue(list(l)(description)), getDate(list(l)(date)))
      if(weather(3) != today){
        if(key != weather(3)){
          key = weather(3)
          index +=1
          if(buffer.nonEmpty){
            buffer -= buffer.last
            buffer -= buffer(0)
            buffer -= buffer(1)
            toSort+=buffer
            buffer = new ListBuffer[List[String]]
          }
          buffer+=weather
        }
        else{
          buffer+=weather
          if(l == list.length-2){
            buffer -= buffer.last
            toSort+=buffer
          }
        }
      }
      if(date == 21){
        date-=1
      }
      count +=1
    }
    sort(toSort)
  }
  def fileDownloader(url: String): Iterator[String] = {
    val lines = Source.fromURL(url)
    lines.getLines()
  }
  def toString(api: String): String= {
    val lines = fileDownloader(api)
    var s = ""
    for (line <- lines) {
      s += line
    }
    s
  }
  def toList(s: String): ListBuffer[ListBuffer[String]] = {
    var count = 0
    var main_counter = 0
    var day = new ListBuffer[String]
    var days = new ListBuffer[ListBuffer[String]]

    val list = s.split("\"dt\":")
    for (elem <- list){
      val regex = elem.split(",")

      for(sep <- regex){
          day += sep
        if(sep.contains("main")){
          main_counter+=1
        }
        if(sep.contains("city")){
          days += day
          day = new ListBuffer[String]
          count+=1
        }
      }
      if(count != 0) {
        days += day
      }
      count+=1
      day = new ListBuffer[String]
    }
    days
  }
  def toFarenheit(str: String): String={
    var k = str.toDouble
    k-=273.15
    k*=1.8
    k+=32
    math.round(k).toString
  }
  def toValue(str: String): String ={
    var toReturn = ""
    var cur = 0;
    var break = false
    while(!break){

      if(str(cur) == ':'){
        if(str(cur+1).isLetterOrDigit || str(cur+1) == '"'){
          break = true
          cur += 1
          while(cur < str.length){
            toReturn += str(cur)
            cur += 1
          }
        }
      }
      cur += 1
    }
    toReturn = toReturn.replace("}", "")
    toReturn = toReturn.replace("]", "")

    toReturn
  }
  def getDate(string: String): String = {
    var toReturn = ""
    var v = toValue(string)
    val start = 1
    val end = 10
    var c = start
    while(c <= end){
      toReturn+=v(c)
      c+=1
    }
    val temp = toReturn.split('-')
    toReturn = temp(1) + "/" + temp(2) + "/" + temp(0)
    toReturn
  }

  def sort(data: ListBuffer[ListBuffer[List[String]]]): ListBuffer[List[String]]={
    var toReturn = new ListBuffer[List[String]]
    val conditionTypes = List("\"ThunderStorm\"", "\"Snow\"", "\"Rain\"", "\"Drizzle\"", "\"Clouds\"", "\"Mist\"", "\"Smoke\"", "\"Haze\"", "\"Dust\"", "\"Fog\"", "\"Sand\"", "\"Dust\"", "\"Ash\"", "\"Squall\"", "\"Tornado\"", "\"Clear\"", "")

    for(day <- data){
      var max = "0"
      var min = "200"
      var condition = ""
      var description = ""
      var date = ""
      for(hour <- day){
        if(hour(0).toInt > max.toInt){
          max = hour(0)
        }
        if(hour(0).toInt < min.toInt){
          min = hour(0)
        }

        if(conditionTypes.indexOf(hour(1)) < conditionTypes.indexOf(condition)){
          condition = hour(1)
          description = hour(2)
        }
        date = hour(3)
      }
      if(description.contains('n')){
        description = description.replace('n', 'd')
      }
      weather_5 += List(max, min, condition, description, date)
    }
    toReturn
  }

  def convertEpoch(time: Long): String ={
        val df= new SimpleDateFormat()

    df.format(time).toString
  }
}