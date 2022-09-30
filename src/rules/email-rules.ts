import { VuetifyRuleFunction } from '@/types'

export const EmailRules: Array<VuetifyRuleFunction> = [
  (v: string) => !!v || 'Email address is required',
  (v: string) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(v) || 'Valid email is required'
  }
]
