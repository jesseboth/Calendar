
object run {
  def main(args: Array[String]): Unit = {
    /*google calendar private link*/
    val myCal = ""
    
    /*open weather api key*/
    val OpenWeatherApiKey = ""
    
    /*city ID*/
    val OpenWeatherCityID = ""
    val OpenWeatherCity = ""


    val week = "http://api.openweathermap.org/data/2.5/forecast?id=" +OpenWeatherCityID+ "&APPID=" + OpenWeatherApiKey
    val today = "http://api.openweathermap.org/data/2.5/weather?q="+OpenWeatherCity+",US,,&appid=" + OpenWeatherApiKey
   
    /*TODO if you don't want weather comment this line*/
    parse_weather.parse_weather(today, week)


    /*Default timezone (get from ical file)*/
    val default_timezone = ""
    val terms = List("EXAM", "TODO", "WORK")

    val out = "src\\main\\js\\agenda.js"
    val cal = "src\\main\\js\\calendar.js"
    parse_cal.parse(myCal, List(cal, out), default_timezone, terms)
  }
}
