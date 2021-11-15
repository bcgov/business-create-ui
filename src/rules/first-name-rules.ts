export const FirstNameRules: Array<Function> = [
  v => !!v?.trim() || 'First name is required',
  v => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
]
