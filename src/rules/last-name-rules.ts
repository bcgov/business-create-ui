export const LastNameRules: Array<Function> = [
  v => !!v.trim() || 'Last name is required',
  v => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
]
