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
    } catch {
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
   * Converts a date string (YYYY-MM-DD) to a Date object at 12:00:00 am Pacific time.
   * @example 2021-11-22 -> 2021-11-22T08:00:00.00Z
   */
  yyyyMmDdToDate (dateStr: string): Date {
    // safety checks
    if (!dateStr) return null
    if (dateStr.length !== 10) return null

    const split = dateStr.split('-')
    const year = +split[0]
    const month = +split[1]
    const day = +split[2]

    return this.createUtcDate(year, (month - 1), day)
  }

  /**
   * Converts a Date object to a date string (YYYY-MM-DD) in Pacific timezone.
   * @example "2021-01-01 07:00:00 GMT" -> "2020-12-31"
   * @example "2021-01-01 08:00:00 GMT" -> "2021-01-01"
   */
  dateToYyyyMmDd (date: Date): string {
    // safety check
    if (!isDate(date) || isNaN(date.getTime())) return null

    // NB: some versions of Node have only en-US locale
    // so use that and convert results accordingly
    const dateStr = date.toLocaleDateString('en-US', {
      timeZone: 'America/Vancouver',
      month: 'numeric', // 12
      day: 'numeric', // 31
      year: 'numeric' // 2020
    })

    // convert mm/dd/yyyy to yyyy-mm-dd
    // and make sure month and day are 2 digits (eg, 03)
    const [ mm, dd, yyyy ] = dateStr.split('/')
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
  }

  /**
   * Converts a Date object to a date string (Month Day, Year) in Pacific timezone.
   * @param longMonth whether to show long month name (eg, December vs Dec)
   * @param showWeekday whether to show the weekday name (eg, Thursday)
   * @example "2021-01-01 07:00:00 GMT" -> "Dec 31, 2020"
   * @example "2021-01-01 08:00:00 GMT" -> "Jan 1, 2021"
   */
  dateToPacificDate (date: Date, longMonth = false, showWeekday = false): string {
    // safety check
    if (!isDate(date) || isNaN(date.getTime())) return null

    // NB: some versions of Node have only en-US locale
    // so use that and convert results accordingly
    let dateStr = date.toLocaleDateString('en-US', {
      timeZone: 'America/Vancouver',
      weekday: showWeekday ? 'long' : undefined, // Thursday or nothing
      month: longMonth ? 'long' : 'short', // December or Dec.
      day: 'numeric', // 31
      year: 'numeric' // 2020
    })

    // remove period after month
    dateStr = dateStr.replace('.', '')

    return dateStr
  }

  /**
   * Converts a date string (YYYY-MM-DD) to a date string (Month Day, Year) in Pacific timezone.
   * @param longMonth whether to show long month name (eg, December vs Dec)
   * @param showWeekday whether to show the weekday name (eg, Thursday)
   * @example "2021-01-01" -> "Thursday, December 31, 2020"
   */
  yyyyMmDdToPacificDate (dateStr: string, longMonth = false, showWeekday = false): string {
    return this.dateToPacificDate(this.yyyyMmDdToDate(dateStr), longMonth, showWeekday)
  }

  /**
   * Converts a Date object to a time string (HH:MM am/pm) in Pacific timezone.
   * @example "2021-01-01 07:00:00 GMT" -> "11:00 pm"
   * @example "2021-01-01 08:00:00 GMT" -> "12:00 am"
   */
  dateToPacificTime (date: Date): string {
    // safety check
    if (!isDate(date) || isNaN(date.getTime())) return null

    // NB: some versions of Node have only en-US locale
    // so use that and convert results accordingly
    let timeStr = date.toLocaleTimeString('en-US', {
      timeZone: 'America/Vancouver',
      hour: 'numeric', // 11
      minute: '2-digit', // 00
      hour12: true // a.m./p.m.
    })

    // replace AM with am and PM with pm
    timeStr = timeStr.replace('AM', 'am').replace('PM', 'pm')

    return timeStr
  }

  /**
   * Converts a Date object to a date and time string (Month Day, Year at HH:MM am/pm
   * Pacific time).
   * @example "2021-01-01 07:00:00 GMT" -> "December 31, 2020 at 11:00 pm Pacific time"
   * @example "2021-01-01 08:00:00 GMT" -> "January 1, 2021 at 12:00 pm Pacific time"
   */
  dateToPacificDateTime (date: Date, showWeekday = false): string {
    if (!isDate(date) || isNaN(date.getTime())) return null

    const dateStr = this.dateToPacificDate(date, true, showWeekday)
    const timeStr = this.dateToPacificTime(date)

    return `${dateStr} at ${timeStr} Pacific time`
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
    // safety check
    if (!isDate(date) || isNaN(date.getTime())) return null

    // replace "Zulu" timezone abbreviation with UTC offset
    return date.toISOString().replace('Z', '+00:00')
  }

  /**
   * Converts an API datetime string (in UTC) to a Date object.
   * @example 2021-08-05T16:56:50.783101+00:00 -> 2021-08-05T16:56:50Z
   */
  apiToDate (dateTimeString: string): Date {
    if (!dateTimeString) return null // safety check

    // chop off the milliseconds and UTC offset and append "Zulu" timezone abbreviation
    dateTimeString = dateTimeString.slice(0, 19) + 'Z'

    return new Date(dateTimeString)
  }

  /**
   * Converts an API datetime string (in UTC) to a date and time string (Month Day, Year at HH:MM am/pm
   * Pacific time).
   * @example "2021-01-01T00:00:00.000000+00:00" -> "Dec 31, 2020 at 04:00 pm Pacific time" (PST example)
   * @example "2021-07-01T00:00:00.000000+00:00" -> "Jun 30, 2021 at 05:00 pm Pacific time" (PDT example)
   */
  apiToPacificDateTime (dateTimeString: string): string {
    if (!dateTimeString) return null // safety check

    const date = this.apiToDate(dateTimeString)
    const dateStr = this.dateToPacificDate(date)
    const timeStr = this.dateToPacificTime(date)

    return `${dateStr} at ${timeStr} Pacific time`
  }
}
