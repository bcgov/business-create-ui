export const PhoneRules = [
  (v: any) => !v || (v.length === 0 || v.length === 14) || 'Phone number is invalid'
]
