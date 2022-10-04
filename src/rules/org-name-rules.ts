import { VuetifyRuleFunction } from '@/types'

export const OrgNameRules: Array<VuetifyRuleFunction> = [
  v => !!v?.trim() || 'Corporation or firm name is required',
  v => (v?.length <= 150) || 'Cannot exceed 150 characters' // maximum character count
]
