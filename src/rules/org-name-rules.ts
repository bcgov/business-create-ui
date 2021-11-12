export const OrgNameRules: Array<Function> = [
  v => !!v || 'A firm name is required',
  v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
  v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
  v => (v?.length <= 155) || 'Cannot exceed 155 characters' // maximum character count
]
