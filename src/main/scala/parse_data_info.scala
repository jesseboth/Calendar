import java.text.SimpleDateFormat
import org.dmfs.rfc5545.DateTime
import org.dmfs.rfc5545.recur.RecurrenceRule
import org.dmfs.rfc5545.recur.RecurrenceRule.RfcMode
import java.util.Date

class Date_info {
    /*set index 0 for simplification*/
    var month_lengths = Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)
    val months = List("null", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
    var year_length = 365

    /*get current*/
    val d = new Date()
    val current_year: String = new SimpleDateFormat("yyyy").format(d.getTime)
    val current_month: String = new SimpleDateFormat("MM").format(d.getTime)

    /*add a day for a leap year*/
    if (current_year.toInt % 4 == 0) {
        month_lengths(2) = 29
        year_length = 366
    }
}