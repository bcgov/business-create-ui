import { VuetifyRuleFunction } from '@/types'

export const PhoneRules: Array<VuetifyRuleFunction> = [
  (v: any) => (v.length === 0 || v.length === 14) || 'Phone number is invalid'
]
