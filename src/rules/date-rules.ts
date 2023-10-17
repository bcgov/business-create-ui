// Note: these date rules are a little different from other rule files and do not
// return an array of rules.  This was done to allow more flexibility in mixing
// and matching what date rules to use.
export const DateRules = {
  REQUIRED: (v: string) => !!v || 'Select date',
  EXPECTED_DATE_FORMAT: (v: string) => {
    const expectedDateFormat = /^(19|20)\d\d[-.](0[1-9]|1[012])[-.](0[1-9]|[12][0-9]|3[01])$/
    return expectedDateFormat.test(v) || 'Date format should be YYYY-MM-DD'
  }
}

// validation helper methods
export const DateRuleHelpers = {
  /** Whether date string to validate is between min date and max date. */
  isBetweenDates (minDate: Date, maxDate: Date, dateStrToValidate: string): boolean {
    if (!dateStrToValidate) return true
    const date = new Date(dateStrToValidate) // eg, September 5, 2022
    minDate.setHours(0, 0, 0) // Removing the hour to properly compare in case selected date was same as minimum.
    maxDate.setHours(23, 59, 59)
    return (date >= minDate) && (date <= maxDate)
  },
  /** Whether date string to validate is not before min date. */
  isNotBeforeDate (minDate: Date, dateStrToValidate: string): boolean {
    if (!dateStrToValidate) return true
    const date = new Date(dateStrToValidate) // eg, September 5, 2022
    minDate.setHours(0, 0, 0)
    return (date >= minDate)
  },
  /** Whether date string to validate is not after max date. */
  isNotAfterDate (maxDate: Date, dateStrToValidate: string): boolean {
    if (!dateStrToValidate) return true
    const date = new Date(dateStrToValidate) // eg, September 5, 2022
    maxDate.setHours(0, 0, 0)
    return (date <= maxDate)
  }
}
