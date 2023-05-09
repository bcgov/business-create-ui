import { ValidationDetailIF } from '@/interfaces'

export interface CreateMemorandumIF {
  validationDetail: ValidationDetailIF
  memorandumConfirmed: boolean
  memorandumFile: File
  docKey: string
}
