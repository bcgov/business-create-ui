import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { isDate } from 'lodash'
import { CommonMixin } from '@/mixins'

//
// FUTURE: move some of these methods to BCRS Shared Components
//

/**
 * Mixin that provides some useful date utilities.
 */
@Component({})
export default class DateMixin extends Mixins(CommonMixin) {
  readonly MS_IN_A_DAY = (1000 * 60 * 60 * 24)

  @Getter getCurrentJsDate!: Date

  /**
   * Fetches and returns the web server's current date (in UTC).
   * Used to bypass the user's local clock/timezone.
   * Ref: https://www.npmjs.com/package/serverdate
   * @returns a promise to return a Date object
   */
  async getServerDate (): Promise<Date> {
    const input = `${window.location.origin}/${process.env.VUE_APP_PATH}/`
    const init: RequestInit = { cache: 'no-store', method: 'HEAD' }

    try {
      const { headers, ok, statusText } = await fetch(input, init)
      if (!ok) throw new Error(statusText)
      return new Date(headers.get('Date'))
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Unable to get server date - using browser date instead')
      // fall back to local date
      // NB: new filings may contain invalid date/time
      return new Date()
    }
  }

  /**
   * Creates and returns a new Date object in UTC, given parameters in Pacific timezone.
   * (This works regardless of user's local clock/timezone.)
   * @example "2021, 0, 1, 0, 0" -> "2021-01-01T08:00:00.000Z"
   * @example "2021, 6, 1, 0, 0" -> "2021-07-01T07:00:00.000Z"
   */
  createUtcDate (year: number, month: number, day: number, hours: number = 0, minutes: number = 0): Date {
    // use date from server to create a new date in Pacific timezone
    // (this sets the correct tz offset in the new date)
    const date = new Date(this.getCurrentJsDate.toLocaleString('en-US', { timeZone: 'America/Vancouver' }))

    // update all date and time fields
    date.setFullYear(year, month, day)
    date.setHours(hours, minutes, 0, 0) // zero out seconds and milliseconds

    return date
  }

  /**
   * Converts a Date object to a date string (YYYY-MM-DD) in Pacific timezone.
   * @example "2021-01-01 07:00:00 GMT" -> "2020-12-31"
   * @example "2021-01-01 08:00:00 GMT" -> "2021-01-01"
   */
  dateToYyyyMmDd (date: Date): string {
    // safety check
    if (!isDate(date) || isNaN(date.getTime())) return null

    let dateStr = date.toLocaleDateString('en-CA', {
      timeZone: 'America/Vancouver',
      month: 'numeric', // 12
      day: 'numeric', // 31
      year: 'numeric' // 2020
    })

    return dateStr
  }

  /**
   * Converts a Date object to a date string (Month Day, Year) in Pacific timezone.
   * @example "2021-01-01 07:00:00 GMT" -> "Dec 31, 2020"
   * @example "2021-01-01 08:00:00 GMT" -> "Jan 1, 2021"
   */
  dateToPacificDate (date: Date, long = false): string {
    // safety check
    if (!isDate(date) || isNaN(date.getTime())) return null

    let dateStr

    if (long) {
      dateStr = date.toLocaleDateString('en-CA', {
        timeZone: 'America/Vancouver',
        weekday: 'long', // Thursday
        month: 'long', // December
        day: 'numeric', // 31
        year: 'numeric' // 2020
      })
    } else {
      dateStr = date.toLocaleDateString('en-CA', {
        timeZone: 'America/Vancouver',
        month: 'short', // Dec.
        day: 'numeric', // 31
        year: 'numeric' // 2020
      })

      // remove period after month
      dateStr = dateStr.replace('.', '')
    }

    return dateStr
  }

  /**
   * Converts a Date object to a time string (HH:MM am/pm) in Pacific timezone.
   * @example "2021-01-01 07:00:00 GMT" -> "11:00 pm"
   * @example "2021-01-01 08:00:00 GMT" -> "12:00 am"
   */
  dateToPacificTime (date: Date): string {
    // safety check
    if (!isDate(date) || isNaN(date.getTime())) return null

    let timeStr = date.toLocaleTimeString('en-CA', {
      timeZone: 'America/Vancouver',
      hour: 'numeric', // 11
      minute: '2-digit', // 00
      hour12: true // a.m./p.m.
    })

    // replace a.m. with am and p.m. with pm
    timeStr = timeStr.replace('a.m.', 'am').replace('p.m.', 'pm')

    return timeStr
  }

  /**
   * Converts a Date object to a date and time string (Month Day, Year at HH:MM am/pm
   * Pacific time).
   * @example "2021-01-01 07:00:00 GMT" -> "Dec 31, 2020 at 11:00 pm Pacific time"
   * @example "2021-01-01 08:00:00 GMT" -> "Jan 1, 2021 at 12:00 pm Pacific time"
   */
  dateToPacificDateTime (date: Date, long = false): string {
    if (!isDate(date) || isNaN(date.getTime())) return null

    const dateStr = this.dateToPacificDate(date, long)
    const timeStr = this.dateToPacificTime(date)

    return `${dateStr} at ${timeStr} Pacific time`
  }

  /**
   * Compares simple date strings (YYYY-MM-DD).
   * @param date1 The first date to compare.
   * @param date2 The second date to compare.
   * @param operator The operator to use for comparison.
   * @returns The result of the comparison (true or false).
   */
  compareDates (date1: string, date2: string, operator: string): boolean {
    if (!date1 || !date2 || !operator) return true

    // convert dates to numbers YYYYMMDD
    date1 = date1.split('-').join('')
    date2 = date2.split('-').join('')

    return eval(date1 + operator + date2) // eslint-disable-line no-eval
  }

  /**
   * Converts a date string (YYYY-MM-DD) to a formatted date string (Month Day, Year).
   * @example "2020-01-01" -> "Jan 1, 2020"
   */
  formatDateString (dateStr: string): string {
    // safety checks
    if (!dateStr) return null
    if (dateStr.length !== 10) return null

    // create a Date object
    // then split into its components (in "absolute" time)
    // eg, "2020-01-01" -> "Wed, 01 Jan 2020 00:00:00 GMT"
    const date = new Date(dateStr)
    const [weekday, day, month, year, time, tz] = date.toUTCString().split(' ')

    // convert day to number so that "01" -> "1"
    return `${month} ${+day}, ${year}`
  }

  /**
   * The number of days that 'date' is from today.
   * @returns -1 for yesterday
   * @returns 0 for today
   * @returns +1 for tomorrow
   * @returns NaN in case of error
   */
  daysFromToday (date: string): number {
    if (!date) return NaN
    // calculate difference between start of "today" and start of "date" (in local time)
    const todayLocalMs = new Date().setHours(0, 0, 0, 0)
    const dateLocalMs = new Date(date).setHours(0, 0, 0, 0)
    return Math.round((dateLocalMs - todayLocalMs) / this.MS_IN_A_DAY)
  }

  /** Validate the DateTime is within the allowed range */
  isValidDateTime (dateToValidate: Date, ignoreTime: boolean = false): boolean {
    if (dateToValidate) {
      const startDate = new Date()

      // Condition (if the Date input is the same day as today) to return when we want to skip hour/minute validations,
      // to prevent showing Date Validators before Time is selected.
      if (ignoreTime && dateToValidate.getDate() === startDate.getDate()) return true

      // Calculate time diff
      const timeDiff = dateToValidate.getTime() - Date.now()
      const timeDiffInMinutes = Math.floor(timeDiff / 1000 / 60)

      // Time set must be more than 2 minutes and less than 10 days
      return timeDiffInMinutes >= 2 && timeDiffInMinutes <= 14400
    }
    return false
  }

  /**
   * Converts a Date object to an API datetime string.
   * @example 2021-08-05T16:56:50Z -> 2021-08-05T16:56:50+00:00
   */
  dateToApi (date: Date): string {
    if (!date) return null
    // replace "Zulu" timezone abbreviation with UTC offset
    return date.toISOString().replace('Z', '+00:00')
  }

  /**
   * Converts an API datetime string (in UTC) to a Date object.
   * @example 2021-08-05T16:56:50.783101+00:00 -> 2021-08-05T16:56:50Z
   */
  apiToDate (dateTimeString: string): Date {
    if (!dateTimeString) return null
    // chop off the milliseconds and UTC offset and append "Zulu" timezone abbreviation
    dateTimeString = dateTimeString.slice(0, 19) + 'Z'
    return new Date(dateTimeString)
  }
}
