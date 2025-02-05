export enum DocumentClassEnum {
  CORP = 'CORP',
  COOP = 'COOP',
}

export enum DocumetTypeEnum {
  CNTO = 'CNTO',
  DIRECTOR_AFFIDAVIT = 'DIRECTOR_AFFIDAVIT',
  CORP_AFFIDAVIT = 'CORP_AFFIDAVIT',
  COOP_MEMORANDUM = 'COOP_MEMORANDUM',
  COOP_RULES = 'COOP_RULES'
}

export const DOCUMENT_TYPES = {
  contInAuthorization: {
    class: DocumentClassEnum.CORP,
    type: DocumetTypeEnum.CNTO
  },
  directorAffidavit: {
    class: DocumentClassEnum.CORP,
    type: DocumetTypeEnum.DIRECTOR_AFFIDAVIT
  },
  corpAffidavit: {
    class: DocumentClassEnum.CORP,
    type: DocumetTypeEnum.CORP_AFFIDAVIT
  },
  coopMemorandum: {
    class: DocumentClassEnum.COOP,
    type: DocumetTypeEnum.COOP_MEMORANDUM
  },
  coopRules: {
    class: DocumentClassEnum.COOP,
    type: DocumetTypeEnum.COOP_RULES
  }
}

export const DRS_ID_PATTERN = /^DS\d{10}$/
