import { ResourceIF } from '@/interfaces'

export const resourceModel: ResourceIF = {
  entityType: '',
  displayName: '',
  title: '',
  description: '',
  statement: '',
  nameRequestType: null,
  steps: [],
  filingData: null,
  directors: {
    countMinimum: null
  },
  shareClasses: {
    countMinimum: null
  },
  incorporationAgreement: null,
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: null,
      certifyStatements: [],
      certifyClause: null,
      entityDisplay: null
    }
  }
}
