/** The validation rules for the Business Number. */
export const BusinessNumberRules: Array<Function> = [
  (v: string) => {
    const pattern = /^[0-9]{9}$/
    return (!v || pattern.test(v)) || 'Invalid business number'
  }
]
