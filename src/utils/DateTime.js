import moment from 'moment'

export default class DateTime {
  static startOf(date) {
    return moment(date).startOf('day')
  }

  static endOf(date) {
    return moment(date).endOf('day')
  }

  static formatDate(date) {
    return moment(date).format('YYYY MM DD')
  }

  static DisplayDate(date) {
    return moment(date).format('Do MMM YYYY')
  }

  static formatDateTime(date) {
    return moment(date).format('Do MMM YYYY, h:mm a')
  }

  static now() {
    return moment()
  }

  static tomorrow() {
    return moment().add(1, 'days')
  }

  static year() {
    return moment().format('YYYY')
  }

  static getDayTimeTitle(selectedDateValue) {
    let day = DateTime.getDayOfWeek(selectedDateValue)
    let time = DateTime.formatTime(selectedDateValue)
    let title = day
    return title
  }

  static getMomentDayValue(selectedDay) {
    let day = null
    switch (selectedDay) {
      case 'sunday':
        day = 0
        break
      case 'monday':
        day = 1
        break
      case 'tuesday':
        day = 2
        break
      case 'wednesday':
        day = 3
        break
      case 'thursday':
        day = 4
        break
      case 'friday':
        day = 5
        break
      case 'saturday':
        day = 6
        break
    }
    return day
  }

  static getDayLabel(dayValue) {
    day = 0
    switch (dayValue) {
      case 0:
        day = 'Sunday'
        break
      case 1:
        day = 'Monday'
        break
      case 2:
        day = 'Tuesday'
        break
      case 3:
        day = 'Wednesday'
        break
      case 4:
        day = 'Thursday'
        break
      case 5:
        day = 'Friday'
        break
      case 6:
        day = 'Saturday'
        break
    }
    return day
  }

  static getDayOfWeek(selectedDate) {
    let date = moment(selectedDate)
    let dayValue = date.day()
    return DateTime.getDayLabel(dayValue)
  }

  static getDayFromDate(selectedDate) {}

  static getDateFromWeek(weekValue) {
    // if we haven't yet passed the day of the week that I need:
    if (moment().isoWeekday() <= weekValue) {
      // then just give me this week's instance of that day
      return moment().isoWeekday(weekValue)
    } else {
      // otherwise, give me next week's instance of that day
      return moment()
        .add(1, 'weeks')
        .isoWeekday(weekValue)
    }
  }

  static getTime(date) {
    return moment(date).format('hh:mm a')
  }

  static formatTime(time) {
    return moment(time).format('hh:mm a')
  }

  static formatDayMonth(date) {
    return moment(date).format('Do MMM')
  }

  static isSameDay(firstDay, secondDay) {
    return firstDay.isSame(secondDay, 'day')
  }

  static isToday(date) {
    return DateTime.now().isSame(date, 'day')
  }

  static isTomorrow(date) {
    return DateTime.tomorrow().isSame(date, 'day')
  }

  static to24Hour(time) {
    return moment(time, ['h:mm A']).format('HH:mm')
  }

  static getMinutesFromNow(addedMinutes) {
    return DateTime.addMinutes(moment.now(), addedMinutes)
  }

  static addMinutes(date, minutes) {
    return moment(date).add(minutes, 'minutes')
  }

  static roundToQuarterHour(time) {
    var timeToReturn = new Date(time)

    timeToReturn.setMilliseconds(
      Math.round(timeToReturn.getMilliseconds() / 1000) * 1000
    )
    timeToReturn.setSeconds(Math.round(timeToReturn.getSeconds() / 60) * 60)
    timeToReturn.setMinutes(Math.round(timeToReturn.getMinutes() / 15) * 15)
    return timeToReturn
  }

  static quarterIntervals(startDate, endDate) {
    var start = moment.utc(startDate, 'YYYY-MM-DD hh:mm a')
    var end = moment.utc(endDate, 'YYYY-MM-DD hh:mm a')

    // round starting minutes up to nearest 15 (12 --> 15, 17 --> 30)
    // note that 59 will round up to 60, and moment.js handles that correctly
    start.minutes(Math.ceil(start.minutes() / 15) * 15)

    var result = []
    var count = 0
    var current = moment(start)

    while (current <= end) {
      count += 1
      let formattedValue = current.format('hh:mm a')
      result.push({ label: formattedValue, value: formattedValue })
      current.add(15, 'minutes')
    }
    result.splice(0, 3);
    return result
  }
}
