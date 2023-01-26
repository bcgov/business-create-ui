import { VuetifyRuleFunction } from '@/types'

export const CustomMonthRule: Array<VuetifyRuleFunction> = [
  v => !!v || 'Please enter the number of months',
  v => (v > 0 && v <= 24) || 'Please enter a month between 1 and 24', // Keep month between 1 and 24
  v => (v % 1 === 0) || 'Please enter an Integer' // Check if month is an integer
]
