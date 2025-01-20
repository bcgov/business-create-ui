export enum DocumentClassEnum {
  CORP = 'CORP'
}

export enum DocumetTypeEnum {
  CNTO = 'CNTO',
  DIRECTOR_AFFIDAVIT = 'DIRECTOR_AFFIDAVIT'
}

export const DOCUMENT_TYPES = {
  contInAuthorization: {
    class: DocumentClassEnum.CORP,
    type: DocumetTypeEnum.CNTO
  },
  affidavitDocument: {
    class: DocumentClassEnum.CORP,
    type: DocumetTypeEnum.DIRECTOR_AFFIDAVIT
  }
}
