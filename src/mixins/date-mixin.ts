import { Component, Vue } from 'vue-property-decorator'

/**
 * Mixin that provides some useful date utilities.
 */
@Component({})
export default class DateMixin extends Vue {
  readonly MS_IN_A_DAY = (1000 * 60 * 60 * 24)

  /**
   * Converts a JavaScript date object to a simple date string.
   * @param date The date to convert.
   * @returns A simple date string formatted as YYYY-MM-DD.
   */
  dateToUsableString (date: Date): string | null{
    if (!date || date.toString() === 'Invalid Date') return null

    const yyyy = date.getFullYear().toString()
    const mm = (date.getMonth() + 1).toString().padStart(2, '0')
    const dd = date.getDate().toString().padStart(2, '0')

    return `${yyyy}-${mm}-${dd}`
  }

  /**
   * Converts a number (YYYYMMDD) to a simple date string.
   * @param n The number to convert.
   * @returns A simple date string formatted as YYYY-MM-DD.
   */
  numToUsableString (val: number | string): string | null {
    if (!val || val.toString().length !== 8) return null

    val = val.toString()

    const yyyy = val.substr(0, 4)
    const mm = val.substr(4, 2)
    const dd = val.substr(6, 2)
    return `${yyyy}-${mm}-${dd}`
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
   * Formats a simple date string (YYYY-MM-DD) to (Month Day, Year) for readability.
   *
   * @param date The date string to format.
   * @returns The re-formatted date string without the day name.
   */
  toReadableDate (date: string): string {
    // Cast to a workable dateString
    // Split into an array.
    let formatDate = (new Date(date).toDateString()).split(' ')

    // Remove the 'weekday' from the array
    // Join the array
    // Add a comma to the date output.
    const regex = / (?!.* )/
    return formatDate.slice(1).join(' ').replace(regex, ', ')
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
}
