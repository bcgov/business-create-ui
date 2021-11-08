// Officer Rules
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

export const emailRules: Array<Function> = [
  (v: string) => !!v || 'Email address is required',
  (v: string) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(v) || 'Valid email is required'
  }
]
