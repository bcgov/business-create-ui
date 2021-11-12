export const LastNameRules: Array<Function> = [
  v => !!v || 'A last name is required',
  v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
  v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
  v => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
]
