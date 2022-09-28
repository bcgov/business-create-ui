export const LastNameRules: Array<(v) => boolean | string> = [
  v => !!v?.trim() || 'Last name is required',
  v => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
]
