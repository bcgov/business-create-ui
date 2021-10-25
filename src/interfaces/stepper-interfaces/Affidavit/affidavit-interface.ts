import { DocIF, ValidationDetailIF } from '@/interfaces'

export interface UploadAffidavitIF {
  validationDetail: ValidationDetailIF
  affidavitConfirmed: boolean
  affidavitDoc: DocIF
  docKey: string
}
