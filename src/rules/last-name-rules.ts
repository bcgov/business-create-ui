import { VuetifyRuleFunction } from '@/types'

export const LastNameRules: Array<VuetifyRuleFunction> = [
  v => !!v?.trim() || 'Last name is required',
  v => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
]
