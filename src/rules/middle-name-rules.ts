export const MiddleNameRules: Array<Function> = [
  v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
  v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
  v => (!v || v.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
]
