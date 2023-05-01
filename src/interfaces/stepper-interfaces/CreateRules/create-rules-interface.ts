import { ValidationDetailIF } from '@/interfaces'

export interface CreateRulesIF {
  validationDetail: ValidationDetailIF
  rulesConfirmed: boolean
  rulesFile: File
  docKey: string
}
