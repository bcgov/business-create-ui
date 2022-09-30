import { VuetifyRuleFunction } from '@/types'

export const FolioNumberRules: Array<VuetifyRuleFunction> = [
  v => (!v || v.trim().length <= 50) || 'Cannot exceed 50 characters' // maximum character count
]
