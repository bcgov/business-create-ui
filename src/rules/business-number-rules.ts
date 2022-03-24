export const BusinessNumberRules: Array<Function> = [
  (v: string) => {
    const pattern = /^[0-9]{5}[ ]?[0-9]{4}$/
    return (!!v || pattern.test(v)) || 'Invalid business number'
  }
]
