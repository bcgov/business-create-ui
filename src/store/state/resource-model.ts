import { ResourceIF } from '@/interfaces'

export const resourceModel: ResourceIF = {
  entityType: null,
  displayName: '',
  title: '',
  description: '',
  statement: '',
  nameRequestType: null,
  steps: [],
  filingData: null,
  peopleAndRoles: {
    header: null,
    blurb: null,
    helpSection: null,
    addIncorporator: null,
    addOrganization: null,
    rules: []
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
