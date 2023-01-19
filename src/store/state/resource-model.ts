import { DissolutionResourceIF, IncorporationResourceIF } from '@/interfaces'

const incorporationResourceModel: IncorporationResourceIF = {
  entityType: null,
  displayName: '',
  steps: [],
  filingData: null,
  peopleAndRoles: {
    header: null,
    blurb: null,
    helpSection: null,
    blurb2: null,
    addIncorporator: null,
    addOrganization: null,
    addBusiness: null,
    rules: []
  },
  shareClasses: {
    countMinimum: null
  },
  incorporationArticles: {
    articles: null,
    articlesTooltip: null,
    provisions: null,
    provisionTooltip: null
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

const registrationResourceModel: any = {
  entityType: null,
  displayName: '',
  statement: '',
  steps: [],
  filingData: null,
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: null,
      certifyStatements: [],
      certifyClause: null,
      entityDisplay: null
    }
  }
}

const dissolutionResourceModel: DissolutionResourceIF = {
  entityType: null,
  displayName: '',
  steps: [],
  filingData: null,
  detailsTitle: '',
  affidavit: null,
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: null,
      certifyStatements: [],
      certifyClause: null,
      entityDisplay: null
    }
  },
  custodialRecords: null
}

export const resourceModel: any = {
  ...incorporationResourceModel,
  ...dissolutionResourceModel,
  ...registrationResourceModel
}
