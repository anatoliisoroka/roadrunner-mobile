import DateTime from "./DateTime"
import moment from 'moment'

export default class OpeningHour {

    static getDate(openingHour){
      console.log("openingHour",openingHour);
      let day = openingHour.day
      let time = "12:00 pm"
      let momentDayValue = DateTime.getMomentDayValue(openingHour.day)
      let dateForDay = DateTime.getDateFromWeek(momentDayValue)
      let dayString = moment(dateForDay).format('YYYY MM DD')
      let date =  moment(dayString+ ' ' + time, "YYYY MM DD hh:mm")
      return date
    }
}
