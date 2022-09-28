export const FirstNameRules: Array<(v) => boolean | string> = [
  v => !!v?.trim() || 'First name is required',
  v => (v?.length <= 20) || 'Cannot exceed 20 characters' // maximum character count
]
