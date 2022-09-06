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

// validation helper method(s)
export const DateRuleHelpers = {
  isBetweenDates (minDate: Date, maxDate: Date, dateStrToValidate: string): boolean {
    if (!dateStrToValidate) { return true }
    const date = new Date(dateStrToValidate) // eg, September 5, 2022
    return (date >= minDate) && (date <= maxDate)
  }
}
