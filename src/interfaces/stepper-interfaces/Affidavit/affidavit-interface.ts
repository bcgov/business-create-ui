import { ValidationDetailIF } from '@/interfaces'

export interface UploadAffidavitIF {
  validationDetail: ValidationDetailIF
  affidavitConfirmed: boolean
  affidavitFile: File
  docKey: string
}
