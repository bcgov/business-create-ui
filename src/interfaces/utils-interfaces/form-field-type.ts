import { FormIF } from './form-type'

export interface FormFieldType extends FormIF {
  valid: boolean
  hasError: boolean
}
