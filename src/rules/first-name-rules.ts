import { VuetifyRuleFunction } from '@/types'

export const FirstNameRules: Array<VuetifyRuleFunction> = [
  v => !!v?.trim() || 'First name is required',
  v => (v?.length <= 20) || 'Cannot exceed 20 characters' // maximum character count
]

export const FirstNameRulesFirms: Array<VuetifyRuleFunction> = [
  v => !!v?.trim() || 'First name is required',
  v => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
]
