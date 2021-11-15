export const OrgNameRules: Array<Function> = [
  v => !!v || 'Corporation or firm name is required',
  v => /^(?=.*\d)|(?=.*[a-z])|(?=.*[A-Z])/.test(v) || 'Corporation or firm name is required', // Contains at least a single character
  v => (v?.length <= 155) || 'Cannot exceed 155 characters' // maximum character count
]
