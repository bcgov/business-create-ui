import { DocIF, ValidationDetailIF } from '@/interfaces'

export interface CreateRulesIF {
  validationDetail: ValidationDetailIF
  rulesConfirmed: boolean
  rulesDoc: DocIF
  docKey: string
}
