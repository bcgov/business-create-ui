export const FirstNameRules: Array<Function> = [
  v => !!v || 'First name is required',
  v => /^(?=.*\d)|(?=.*[a-z])|(?=.*[A-Z])/.test(v) || 'A firm name is required', // Contains at least a single character
  v => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
]
