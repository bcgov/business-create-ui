export const firstNameRules: Array<Function> = [
  v => !!v || 'A first name is required',
  v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
  v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
  v => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
]

export const middleNameRules: Array<Function> = [
  v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
  v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
  v => (!v || v.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
]

export const lastNameRules: Array<Function> = [
  v => !!v || 'A last name is required',
  v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
  v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
  v => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
]

export const orgNameRules: Array<Function> = [
  v => !!v || 'A firm name is required',
  v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
  v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
  v => (v?.length <= 155) || 'Cannot exceed 155 characters' // maximum character count
]
