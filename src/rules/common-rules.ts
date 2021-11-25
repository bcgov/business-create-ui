// Note: these date rules are a little different from other rule files and do not
// return an array of rules.  This was done to allow more flexibility in mixing
// and matching what date rules to use.
export const CommonRules = {
  ALPHA_NUMERIC_AND_STANDARD_SPECIAL_CHARS: (v: string) => {
    const expectedFormat = /^([\w\s$&+,:;=?@#|'<>.^*()%!-\\"]*)$/g
    return expectedFormat.test(v) || 'Invalid character'
  }
}
