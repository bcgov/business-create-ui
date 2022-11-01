import { VuetifyRuleFunction } from '@/types'

export const MiddleNameRules: Array<VuetifyRuleFunction> = [
  v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
  v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
  v => (!v || v.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
]
