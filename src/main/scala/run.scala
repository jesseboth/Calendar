import scala.collection.mutable.ListBuffer
object run {
  def main(args: Array[String]): Unit = {
    /*google calendar private link*/
    val myCal = ""
    
    /*open weather api key*/
    val OpenWeatherApiKey = "8533b8668f13ad68d228a597e4e788d8"
    
    /*city ID*/
    val OpenWeatherCityID = "5110629"
    val OpenWeatherCity = "Buffalo"


    val week = "http://api.openweathermap.org/data/2.5/forecast?id=" +OpenWeatherCityID+ "&APPID=" + OpenWeatherApiKey
    val today = "http://api.openweathermap.org/data/2.5/weather?q="+OpenWeatherCity+",US,,&appid=" + OpenWeatherApiKey
   
    /*TODO if you don't want weather comment this line*/
    parse_weather.parse_weather(today, week)

    val out = "src\\main\\js\\events.js"
    val pi = "/home/pi/New_Tab/src/main/js/events.js"

    val default_timezone = "America/New_York"
    val terms = List("EXAM", "TODO", "WORK")

    parse_cal.parse(myCal, List(out, pi), default_timezone, terms)
  }
}