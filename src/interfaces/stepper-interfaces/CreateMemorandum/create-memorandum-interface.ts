import { DocIF, ValidationDetailIF } from '@/interfaces'

export interface CreateMemorandumIF {
  validationDetail: ValidationDetailIF
  memorandumConfirmed: boolean
  memorandumDoc: DocIF
  docKey: string
}
