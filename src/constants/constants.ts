import { DocumentClasses } from '@/enums'

export const ADDRESSCHANGED = 'addressChanged'
export const ISFUTUREEFFECTIVE = 'isFutureEffective'
export const ISIMMEDIATE = 'isImmediate'
export const DOCUMENT_TYPES = {
  contInAuthorization: {
    class: DocumentClasses.CORP,
    type: 'CNTO'
  },
  affidavitDocument: {
    class: DocumentClasses.CORP,
    type: 'DIRECTOR_AFFIDAVIT'
  }
}
