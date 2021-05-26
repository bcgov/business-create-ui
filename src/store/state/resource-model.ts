import { ResourceIF } from '@/interfaces'

export const resourceModel: ResourceIF = {
  entityType: '',
  displayName: '',
  title: '',
  description: '',
  statement: '',
  nameRequestType: '',
  directors: {
    countMinimum: null
  },
  shareClasses: {
    countMinimum: null
  },
  incorporationAgreement: [],
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: '',
      certifyStatements: [],
      certifyClause: ''
    }
  }
}
