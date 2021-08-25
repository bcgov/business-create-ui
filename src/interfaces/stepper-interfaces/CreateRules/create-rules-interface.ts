import { RulesDocIF } from '@/interfaces'

export interface CreateRulesIF {
  valid: boolean,
  rulesConfirmed: boolean,
  rulesDoc: RulesDocIF
  docKey: string
}
