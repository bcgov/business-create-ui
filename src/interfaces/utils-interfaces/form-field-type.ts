import { FormIF } from '@/interfaces'

export interface FormFieldType extends FormIF {
  valid: boolean
  hasError: boolean
}
