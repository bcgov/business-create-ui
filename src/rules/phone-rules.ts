export const PhoneRules: Array<(v) => boolean | string> = [
  (v: any) => (v.length === 0 || v.length === 14) || 'Phone number is invalid'
]
