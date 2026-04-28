import { VuetifyRuleFunction } from '@/types'

export const MiddleNameRules: Array<VuetifyRuleFunction> = [
  v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
  v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
  v => (!v || v.length <= 20) || 'Cannot exceed 20 characters' // maximum character count
]

/** Middle name rules for custodian that sync to COLIN's CORP_PARTY table */
export const MiddleNameRulesCustodian: Array<VuetifyRuleFunction> = [
  v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
  v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
  v => (!v || v.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
]

export const MiddleNameRulesFirms: Array<VuetifyRuleFunction> = [
  v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
  v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
  v => (!v || v.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
]
