export const OrgNameRules: Array<Function> = [
  v => !!v.trim() || 'Corporation or firm name is required',
  v => (v?.length <= 155) || 'Cannot exceed 155 characters' // maximum character count
]
