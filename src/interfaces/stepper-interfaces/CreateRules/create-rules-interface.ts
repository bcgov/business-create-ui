import { DocIF } from '@/interfaces'

export interface CreateRulesIF {
  valid: boolean
  rulesConfirmed: boolean
  rulesDoc: DocIF
  docKey: string
}
